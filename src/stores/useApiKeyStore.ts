import { create } from 'zustand';

interface ApiKeyState {
  qwenKey: string;
  jimengAccessKeyId: string;
  jimengSecretAccessKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  
  setQwenKey: (key: string) => void;
  setJimengAccessKeyId: (key: string) => void;
  setJimengSecretAccessKey: (key: string) => void;
  setSupabaseUrl: (url: string) => void;
  setSupabaseAnonKey: (key: string) => void;
  
  getActiveQwenKey: () => string;
  getActiveJimengAccessKeyId: () => string;
  getActiveJimengSecretAccessKey: () => string;
  getActiveSupabaseUrl: () => string;
  getActiveSupabaseAnonKey: () => string;
}

const DEFAULT_QWEN_KEY = 'sk-16708778b6774db68345c9b00d22e8cf';
const DEFAULT_JIMENG_ACCESS = 'AKLTODJiZDhlMjVhM2ZlNDAyYmIyYmVlOTM4MTlkZmFlNzg';
const DEFAULT_JIMENG_SECRET = 'TUdaaFlUSTJORGt3T1RNeU5HRmxOamxrTkRrNVkyTmtNemcyTVdSbVlUZw==';
const DEFAULT_SUPABASE_URL = 'https://dfwajsonugemyngiunbi.supabase.co';
const DEFAULT_SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmd2Fqc29udWdlbXluZ2l1bmJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MTM3MzMsImV4cCI6MjA5MjQ4OTczM30.N4WXTcLZ6fK9RDlSVEyMy4DHvpIal5wdfCbv6Pg57cM';

export const useApiKeyStore = create<ApiKeyState>((set, get) => ({
  qwenKey: DEFAULT_QWEN_KEY,
  jimengAccessKeyId: DEFAULT_JIMENG_ACCESS,
  jimengSecretAccessKey: DEFAULT_JIMENG_SECRET,
  supabaseUrl: DEFAULT_SUPABASE_URL,
  supabaseAnonKey: DEFAULT_SUPABASE_ANON,
  
  setQwenKey: (key) => set({ qwenKey: key }),
  setJimengAccessKeyId: (key) => set({ jimengAccessKeyId: key }),
  setJimengSecretAccessKey: (key) => set({ jimengSecretAccessKey: key }),
  setSupabaseUrl: (url) => set({ supabaseUrl: url }),
  setSupabaseAnonKey: (key) => set({ supabaseAnonKey: key }),
  
  getActiveQwenKey: () => get().qwenKey || DEFAULT_QWEN_KEY,
  getActiveJimengAccessKeyId: () => get().jimengAccessKeyId || DEFAULT_JIMENG_ACCESS,
  getActiveJimengSecretAccessKey: () => get().jimengSecretAccessKey || DEFAULT_JIMENG_SECRET,
  getActiveSupabaseUrl: () => get().supabaseUrl || DEFAULT_SUPABASE_URL,
  getActiveSupabaseAnonKey: () => get().supabaseAnonKey || DEFAULT_SUPABASE_ANON,
}));
