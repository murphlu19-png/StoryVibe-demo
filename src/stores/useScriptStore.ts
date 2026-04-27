import { create } from 'zustand';
import type { Script } from '@/types';
import { PRESET_BACKROOMS_SCRIPT, PRESET_CITYWALK_SCRIPT } from '@/lib/constants';

interface ScriptState {
  scripts: Script[];
  activeScript: Script | null;
  historyOpen: boolean;
  selectedVersion: string;
  pendingScript: Script | null; // 从Generate页面跳转过来的脚本

  setActiveScript: (script: Script | null) => void;
  setPendingScript: (script: Script | null) => void;
  acceptPendingScript: () => void;
  selectVersion: (versionId: string) => void;
  toggleHistory: () => void;
  updateShotInActive: (shotId: string, updates: Partial<any>) => void;
  addScript: (script: Script) => void;
  deleteScript: (scriptId: string) => void;
}

export const useScriptStore = create<ScriptState>((set, get) => ({
  scripts: [PRESET_BACKROOMS_SCRIPT, PRESET_CITYWALK_SCRIPT],
  activeScript: null,
  historyOpen: true,
  selectedVersion: 'v1',
  pendingScript: null,

  setActiveScript: (script) => set({ activeScript: script }),
  
  setPendingScript: (script) => set({ pendingScript: script }),
  
  acceptPendingScript: () => {
    const { pendingScript } = get();
    if (pendingScript) {
      set((s) => ({
        activeScript: pendingScript,
        scripts: [pendingScript, ...s.scripts],
        pendingScript: null,
      }));
    }
  },
  
  addScript: (script) => set((s) => ({ scripts: [script, ...s.scripts] })),
  
  deleteScript: (scriptId) => set((s) => ({
    scripts: s.scripts.filter(sc => sc.id !== scriptId),
    activeScript: s.activeScript?.id === scriptId ? null : s.activeScript,
  })),
  
  selectVersion: (versionId) => set({ selectedVersion: versionId }),
  toggleHistory: () => set((s) => ({ historyOpen: !s.historyOpen })),
  
  updateShotInActive: (shotId, updates) =>
    set((s) => ({
      activeScript: s.activeScript
        ? {
            ...s.activeScript,
            shots: s.activeScript.shots.map((sh) =>
              sh.id === shotId ? { ...sh, ...updates } : sh
            ),
          }
        : null,
    })),
}));
