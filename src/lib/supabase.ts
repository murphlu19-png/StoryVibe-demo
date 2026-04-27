/**
 * Supabase Client — StoryVibe 后端存储
 *
 * Project: dfwajsonugemyngiunbi
 * URL: https://dfwajsonugemyngiunbi.supabase.co
 */

import { createClient } from '@supabase/supabase-js';
import { IS_MOCK_DEMO } from './mockDemoMode';

const SUPABASE_URL = 'https://dfwajsonugemyngiunbi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmd2Fqc29udWdlbXluZ2l1bmJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MTM3MzMsImV4cCI6MjA5MjQ4OTczM30.N4WXTcLZ6fK9RDlSVEyMy4DHvpIal5wdfCbv6Pg57cM';

function createMockSupabaseClient() {
  const buildResponse = <T = null>(data?: T) => Promise.resolve({ data: (data ?? null) as T | null, error: null, count: 0 });

  const createQueryBuilder = () => ({
    select: () => createQueryBuilder(),
    order: () => createQueryBuilder(),
    eq: () => createQueryBuilder(),
    neq: () => createQueryBuilder(),
    insert: () => createQueryBuilder(),
    upsert: () => createQueryBuilder(),
    delete: () => createQueryBuilder(),
    update: () => createQueryBuilder(),
    single: () => buildResponse(null),
    maybeSingle: () => buildResponse(null),
    then: (onFulfilled: (value: { data: unknown; error: null; count: number }) => unknown, onRejected?: (reason: unknown) => unknown) =>
      buildResponse(null).then(onFulfilled, onRejected),
  });

  return {
    from: () => createQueryBuilder(),
    auth: {
      getSession: () => buildResponse({ session: null }),
      getUser: () => buildResponse({ user: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } },
      }),
      signOut: () => buildResponse(),
    },
    storage: {
      from: () => ({
        upload: () => buildResponse(),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        download: () => buildResponse(null),
        remove: () => buildResponse(),
        list: () => buildResponse([]),
      }),
      listBuckets: () => buildResponse([]),
    },
    channel: () => ({
      on: () => ({
        subscribe: () => ({ unsubscribe() {} }),
      }),
      subscribe: () => ({ unsubscribe() {} }),
    }),
    removeChannel: () => {},
  };
}

export const supabase: any = IS_MOCK_DEMO
  ? createMockSupabaseClient()
  : createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

// 测试连接
export async function testSupabaseConnection(): Promise<boolean> {
  if (IS_MOCK_DEMO) {
    console.info('[Supabase] Mock demo mode enabled, skipping live connection test');
    return false;
  }

  try {
    const { error } = await supabase.from('scripts').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('[Supabase] Connection test failed:', error.message);
      return false;
    }
    console.log('[Supabase] Connected successfully');
    return true;
  } catch (e) {
    console.error('[Supabase] Connection error:', e);
    return false;
  }
}
