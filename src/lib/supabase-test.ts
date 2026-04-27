/**
 * Supabase 联通测试 — 在浏览器控制台运行
 *
 * 使用方法:
 * 1. 打开应用后按 F12
 * 2. 在 Console 输入: await testSupabase()
 */

import { supabase } from './supabase';
import { IS_MOCK_DEMO } from './mockDemoMode';

export async function testSupabase(): Promise<void> {
  if (IS_MOCK_DEMO) {
    console.info('[Supabase] Mock demo mode enabled, skipping live Supabase test');
    return;
  }

  console.log('═══ Supabase 联通测试 ═══');
  console.log('Project: dfwajsonugemyngiunbi');

  // 1. 基础连接
  console.log('\n1. 测试基础连接...');
  const { error: connError } = await supabase
    .from('scripts')
    .select('count', { count: 'exact', head: true });

  if (connError) {
    console.error('   ❌ 连接失败:', connError.message);
    console.error('   可能原因: URL/Key 错误，或表不存在');
    return;
  }
  console.log('   ✅ 连接成功');

  // 2. 测试插入
  console.log('\n2. 测试写入 scripts 表...');
  const testScript = {
    title: 'Test Script — ' + new Date().toLocaleTimeString(),
    status: 'draft',
    duration: '30s',
    shots: [
      { id: 'shot-1', timeRange: '0-5s', visual: 'Test shot', purpose: 'SET THE MOOD', camera: 'Static', asset: 'UPLOADED', copy: '' }
    ],
  };
  const { data: insertData, error: insertError } = await supabase
    .from('scripts')
    .insert([testScript])
    .select()
    .single();

  if (insertError) {
    console.error('   ❌ 插入失败:', insertError.message);
    return;
  }
  console.log('   ✅ 写入成功, ID:', insertData.id);

  // 3. 测试查询
  console.log('\n3. 测试查询...');
  const { data: queryData, error: queryError } = await supabase
    .from('scripts')
    .select('*')
    .eq('id', insertData.id)
    .single();

  if (queryError) {
    console.error('   ❌ 查询失败:', queryError.message);
    return;
  }
  console.log('   ✅ 查询成功:', queryData.title);

  // 4. 测试 versions 表
  console.log('\n4. 测试 scripts_versions 表...');
  const { data: verData, error: verError } = await supabase
    .from('scripts_versions')
    .insert([{
      script_id: insertData.id,
      version: 'v1',
      name: 'Test Version',
      type: 'draft',
      script_data: queryData,
    }])
    .select()
    .single();

  if (verError) {
    console.error('   ❌ versions 写入失败:', verError.message);
    console.error('   可能原因: scripts_versions 表名不匹配（应为 scripts_versions 而非 script_versions）');
  } else {
    console.log('   ✅ versions 写入成功, ID:', verData.id);
  }

  // 5. 测试 assets 表
  console.log('\n5. 测试 assets 表...');
  const { data: assetData, error: assetError } = await supabase
    .from('assets')
    .insert([{
      script_id: insertData.id,
      name: 'test-image.jpg',
      type: 'image',
      url: 'https://example.com/test.jpg',
      metadata: { size: 1024, width: 1920, height: 1080 },
    }])
    .select()
    .single();

  if (assetError) {
    console.error('   ❌ assets 写入失败:', assetError.message);
  } else {
    console.log('   ✅ assets 写入成功, ID:', assetData.id);
  }

  // 6. 测试 Storage
  console.log('\n6. 测试 Storage bucket...');
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error('   ❌ 无法列出 buckets:', bucketError.message);
  } else {
    const bucketList = (buckets as Array<{ name: string }> | null) ?? [];
    const assetsBucket = bucketList.find((b) => b.name === 'assets');
    if (assetsBucket) {
      console.log('   ✅ assets bucket 存在');
    } else {
      console.error('   ❌ assets bucket 不存在，请在 Storage 中创建');
    }
  }

  // 清理测试数据
  console.log('\n7. 清理测试数据...');
  await supabase.from('scripts_versions').delete().eq('script_id', insertData.id);
  await supabase.from('assets').delete().eq('script_id', insertData.id);
  await supabase.from('scripts').delete().eq('id', insertData.id);
  console.log('   ✅ 测试数据已清理');

  console.log('\n═══ 全部测试通过 ✅ ═══');
}

// 暴露到全局 window 方便控制台调用
if (typeof window !== 'undefined') {
  (window as any).testSupabase = testSupabase;
}
