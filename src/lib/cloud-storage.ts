/**
 * Cloud Storage — Supabase 版（带 IndexedDB 降级）
 *
 * 优先使用 Supabase，网络不可用时自动降级到 IndexedDB 本地存储
 */

import { supabase } from './supabase';
import { IS_MOCK_DEMO } from './mockDemoMode';
import type { Script } from '@/types';

export interface ScriptVersion {
  id: string;
  scriptId: string;
  version: string;
  name: string;
  type: 'draft' | 'autosave' | 'archive';
  createdAt: string;
  script: Script;
}

// ===== 状态检测 =====

let supabaseAvailable: boolean | null = null;

async function isSupabaseReady(): Promise<boolean> {
  if (supabaseAvailable !== null) return supabaseAvailable;
  if (IS_MOCK_DEMO) {
    supabaseAvailable = false;
    return false;
  }
  try {
    const { error } = await supabase.from('scripts').select('count', { count: 'exact', head: true });
    supabaseAvailable = !error;
  } catch {
    supabaseAvailable = false;
  }
  if (!supabaseAvailable) {
    console.warn('[Storage] Supabase unavailable, using IndexedDB fallback');
  }
  return supabaseAvailable;
}

// ===== IndexedDB 降级层（保持原实现） =====

const DB_NAME = 'StoryVibe';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('scripts')) {
        db.createObjectStore('scripts', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('versions')) {
        const vStore = db.createObjectStore('versions', { keyPath: 'id' });
        vStore.createIndex('scriptId', 'scriptId', { unique: false });
      }
      if (!db.objectStoreNames.contains('assets')) {
        db.createObjectStore('assets', { keyPath: 'id' });
      }
    };
  });
  return dbPromise;
}

function dbRequest<T>(storeName: string, mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDB();
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const req = fn(store);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
}

// ===== 脚本管理（Supabase 优先） =====

export async function saveScript(script: Script): Promise<void> {
  if (await isSupabaseReady()) {
    const { error } = await supabase.from('scripts').upsert({
      id: script.id,
      title: script.title,
      status: script.status,
      duration: script.duration,
      version: script.version,
      narrative_arc: script.narrativeArc,
      emotional_goal: script.emotionalGoal,
      visual_direction: script.visualDirection,
      rhythm: script.rhythm,
      asset_logic: script.assetLogic,
      shots: script.shots,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) {
      console.error('[Supabase] saveScript error:', error);
      throw error;
    }
  } else {
    // IndexedDB 降级
    await dbRequest('scripts', 'readwrite', (s) => s.put(script));
  }
}

export async function getAllScripts(): Promise<Script[]> {
  if (await isSupabaseReady()) {
    const { data, error } = await supabase.from('scripts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[Supabase] getAllScripts error:', error);
      throw error;
    }
    return (data || []).map(dbToScript);
  } else {
    return dbRequest('scripts', 'readonly', (s) => s.getAll());
  }
}

export async function getScriptById(id: string): Promise<Script | null> {
  if (await isSupabaseReady()) {
    const { data, error } = await supabase.from('scripts').select('*').eq('id', id).single();
    if (error || !data) return null;
    return dbToScript(data);
  } else {
    try {
      return await dbRequest('scripts', 'readonly', (s) => s.get(id));
    } catch {
      return null;
    }
  }
}

export async function deleteScript(id: string): Promise<void> {
  if (await isSupabaseReady()) {
    const { error } = await supabase.from('scripts').delete().eq('id', id);
    if (error) throw error;
  } else {
    await dbRequest('scripts', 'readwrite', (s) => s.delete(id));
  }
}

// ===== 版本管理 =====

export async function createVersion(scriptId: string, type: 'draft' | 'autosave' | 'archive', script: Script, name?: string): Promise<ScriptVersion> {
  if (await isSupabaseReady()) {
    // 获取当前版本号
    const { data: existing } = await supabase.from('scripts_versions')
      .select('id')
      .eq('script_id', scriptId)
      .eq('type', 'autosave');

    // 清理过多的 autosave（保留最近5个）
    if (existing && existing.length > 4) {
      const toDelete = existing.slice(0, existing.length - 4);
      for (const v of toDelete) {
        await supabase.from('scripts_versions').delete().eq('id', v.id);
      }
    }

    const versionNum = (existing?.length || 0) + 1;
    const { data, error } = await supabase.from('scripts_versions')
      .insert([{
        script_id: scriptId,
        version: `v${versionNum}`,
        name: name || (type === 'autosave' ? 'Autosave' : type === 'draft' ? 'Draft' : 'Archive'),
        type,
        script_data: script,
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      scriptId: data.script_id,
      version: data.version,
      name: data.name,
      type: data.type,
      createdAt: data.created_at,
      script: data.script_data,
    };
  } else {
    // IndexedDB 降级
    const versions = await getAllVersions(scriptId);
    const newVersion: ScriptVersion = {
      id: `ver-${Date.now()}`,
      scriptId,
      version: `v${versions.length + 1}.${type === 'autosave' ? '0' : '1'}`,
      name: name || (type === 'autosave' ? 'Autosave' : type === 'draft' ? 'Draft' : 'Archive'),
      type,
      createdAt: new Date().toISOString(),
      script: JSON.parse(JSON.stringify(script)),
    };
    await dbRequest('versions', 'readwrite', (s) => s.put(newVersion));

    const autoSaves = versions.filter(v => v.type === 'autosave');
    if (autoSaves.length > 4) {
      const toDelete = autoSaves.slice(0, autoSaves.length - 4);
      for (const v of toDelete) {
        await dbRequest('versions', 'readwrite', (s) => s.delete(v.id));
      }
    }
    return newVersion;
  }
}

export async function getAllVersions(scriptId: string): Promise<ScriptVersion[]> {
  if (await isSupabaseReady()) {
    const { data, error } = await supabase.from('scripts_versions')
      .select('*')
      .eq('script_id', scriptId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[Supabase] getAllVersions error:', error);
      return [];
    }
    return (data || []).map((v: any) => ({
      id: v.id,
      scriptId: v.script_id,
      version: v.version,
      name: v.name,
      type: v.type,
      createdAt: v.created_at,
      script: v.script_data,
    }));
  } else {
    try {
      const db = await getDB();
      const tx = db.transaction('versions', 'readonly');
      const store = tx.objectStore('versions');
      const index = store.index('scriptId');
      return new Promise((resolve, reject) => {
        const req = index.getAll(scriptId);
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  }
}

export async function restoreVersion(versionId: string): Promise<Script | null> {
  if (await isSupabaseReady()) {
    const { data, error } = await supabase.from('scripts_versions')
      .select('*')
      .eq('id', versionId)
      .single();
    if (error || !data) return null;
    const script = data.script_data as Script;
    await saveScript(script);
    return script;
  } else {
    try {
      const version = await dbRequest('versions', 'readonly', (s) => s.get(versionId));
      if (version) {
        await saveScript(version.script);
        return version.script;
      }
      return null;
    } catch {
      return null;
    }
  }
}

// ===== 一键生成 =====

export async function quickGenerate(script: Script): Promise<Script> {
  await saveScript(script);
  await createVersion(script.id, 'draft', script, 'Quick Generated');
  return script;
}

// ===== 资产存储（Supabase Storage） =====

export async function saveAssetBlob(id: string, blob: Blob, metadata: any): Promise<string> {
  const fileName = `${id}-${metadata.name || 'asset'}`;

  if (await isSupabaseReady()) {
    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(fileName, blob, { upsert: true, contentType: metadata.type || blob.type });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName);

    // 同时存入 assets 表
    await supabase.from('assets').upsert({
      id,
      script_id: metadata.scriptId || id,
      name: metadata.name || fileName,
      type: metadata.assetType || 'image',
      url: publicUrl,
      metadata,
    });

    return publicUrl;
  } else {
    // IndexedDB 降级 — 转 base64 存储
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    const db = await getDB();
    const tx = db.transaction('assets', 'readwrite');
    const store = tx.objectStore('assets');
    await new Promise<void>((resolve, reject) => {
      const req = store.put({ id, blob: base64, metadata, savedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    return base64;
  }
}

export async function getAssetBlob(id: string): Promise<{ blob: Blob; metadata: any; url?: string } | null> {
  if (await isSupabaseReady()) {
    const { data, error } = await supabase.from('assets').select('*').eq('id', id).single();
    if (error || !data) return null;
    return { blob: null as any, metadata: data.metadata, url: data.url };
  } else {
    try {
      const result = await dbRequest('assets', 'readonly', (s) => s.get(id));
      if (!result) return null;
      // base64 转 blob
      const res = await fetch(result.blob);
      const blob = await res.blob();
      return { blob, metadata: result.metadata };
    } catch {
      return null;
    }
  }
}

// ===== 统计信息 =====

export async function getStorageStats(): Promise<{ scripts: number; versions: number; assets: number }> {
  if (await isSupabaseReady()) {
    const [{ count: scripts }, { count: versions }, { count: assetCount }] = await Promise.all([
      supabase.from('scripts').select('*', { count: 'exact', head: true }),
      supabase.from('scripts_versions').select('*', { count: 'exact', head: true }),
      supabase.from('assets').select('*', { count: 'exact', head: true }),
    ]);
    return { scripts: scripts || 0, versions: versions || 0, assets: assetCount || 0 };
  } else {
    const scripts = (await dbRequest('scripts', 'readonly', (s) => s.getAll())).length;
    const versions = (await dbRequest('versions', 'readonly', (s) => s.getAll())).length;
    const assets = (await dbRequest('assets', 'readonly', (s) => s.getAll())).length;
    return { scripts, versions, assets };
  }
}

// ===== 清空（调试用） =====

export async function clearAll(): Promise<void> {
  if (await isSupabaseReady()) {
    await supabase.from('scripts_versions').delete().neq('id', 'placeholder');
    await supabase.from('assets').delete().neq('id', 'placeholder');
    await supabase.from('scripts').delete().neq('id', 'placeholder');
  } else {
    const db = await getDB();
    for (const name of ['scripts', 'versions', 'assets']) {
      db.transaction(name, 'readwrite').objectStore(name).clear();
    }
  }
}

// ===== 数据转换工具 =====

function dbToScript(row: any): Script {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    duration: row.duration,
    version: row.version,
    narrativeArc: row.narrative_arc || '',
    emotionalGoal: row.emotional_goal || '',
    visualDirection: row.visual_direction || '',
    rhythm: row.rhythm || '',
    assetLogic: row.asset_logic || '',
    shots: row.shots || [],
  };
}

// ===== 向后兼容 =====

export class CloudStorageCompat {
  static async saveScript(script: Script): Promise<void> {
    await saveScript(script);
  }
  static async getAllScripts(): Promise<Script[]> {
    return getAllScripts();
  }
}
