import { useState, useEffect } from 'react';
import { useApiKeyStore } from '@/stores/useApiKeyStore';
import {
  Key, Eye, EyeOff, Copy, Check, RotateCcw, Save,
  ExternalLink, AlertTriangle, Lock, Unlock, Info,
  Activity, Loader2, CheckCircle, AlertCircle, Zap
} from 'lucide-react';

const DEV_PASSWORD = 'canvas2026';
const STORAGE_KEY = 'canvas_dev_auth';

function checkAuth(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'verified';
  } catch { return false; }
}

function setAuth(verified: boolean) {
  try {
    if (verified) localStorage.setItem(STORAGE_KEY, 'verified');
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

/* ─── OMNI API Debug Panel ─── */
function OmniDebugPanel() {
  const { qwenKey } = useApiKeyStore();
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
    latency?: number;
    detail?: string;
  }>({ status: 'idle', message: '' });

  const testOmniConnection = async () => {
    setTestResult({ status: 'testing', message: 'Testing Qwen-OMNI connection...' });
    const startTime = performance.now();

    try {
      const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${qwenKey || 'sk-16708778b6774db68345c9b00d22e8cf'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen-omni-turbo',
          input: {
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: 'Say "OK" only. This is a connectivity test.' }
                ]
              }
            ]
          },
          parameters: {
            sample_steps: 1,
            seed: 42,
          }
        }),
      });

      const latency = Math.round(performance.now() - startTime);

      if (response.ok) {
        const data = await response.json();
        setTestResult({
          status: 'success',
          message: 'Qwen-OMNI is responding normally',
          latency,
          detail: `Model: ${data.output?.model || 'qwen-omni-turbo'} | Response time: ${latency}ms`,
        });
      } else {
        const errText = await response.text();
        setTestResult({
          status: 'error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          latency,
          detail: errText.substring(0, 200),
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: err.message || 'Network error — check CORS or connection',
        detail: 'The browser cannot reach dashscope.aliyuncs.com. This may be due to CORS restrictions in the browser environment.',
      });
    }
  };

  return (
    <div className="bg-[#141415] rounded-2xl border border-[#2A2A2C] p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[16px] font-semibold text-[#FFFFFF] mb-1">OMNI Model Diagnostics</h3>
          <p className="text-[12px] text-[#6B6B6F]">Test Qwen-OMNI API connectivity and response latency</p>
        </div>
        <button
          onClick={testOmniConnection}
          disabled={testResult.status === 'testing'}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF843D] text-white text-[13px] font-medium rounded-full hover:bg-[#FFA465] disabled:opacity-50 transition-all"
        >
          {testResult.status === 'testing' ? (
            <><Loader2 size={14} className="animate-spin" /> Testing...</>
          ) : (
            <><Activity size={14} /> Test Connection</>
          )}
        </button>
      </div>

      {testResult.status !== 'idle' && (
        <div className={`p-4 rounded-xl mb-4 ${
          testResult.status === 'success' ? 'bg-[rgba(34,197,94,0.15)] border border-green-200' :
          testResult.status === 'error' ? 'bg-[rgba(239,68,68,0.15)] border border-red-200' :
          'bg-[#141415]'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {testResult.status === 'success' && <CheckCircle size={16} className="text-[#22C55E]" />}
            {testResult.status === 'error' && <AlertCircle size={16} className="text-[#EF4444]" />}
            {testResult.status === 'testing' && <Loader2 size={16} className="text-[#9A9A9E] animate-spin" />}
            <span className={`text-[13px] font-medium ${
              testResult.status === 'success' ? 'text-[#22C55E]' :
              testResult.status === 'error' ? 'text-[#EF4444]' :
              'text-[#9A9A9E]'
            }`}>
              {testResult.message}
            </span>
            {testResult.latency && (
              <span className="text-[11px] text-[#6B6B6F] ml-2">({testResult.latency}ms)</span>
            )}
          </div>
          {testResult.detail && (
            <p className="text-[11px] text-[#9A9A9E] mt-1 font-mono leading-relaxed">{testResult.detail}</p>
          )}
        </div>
      )}

      <div className="bg-[#FF843D] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={12} className="text-white/40" />
          <span className="text-[11px] text-white/40 uppercase tracking-wider">Diagnostic Notes</span>
        </div>
        <ul className="space-y-1.5 text-[11px] text-white/60 leading-relaxed">
          <li>• If latency &gt; 3000ms: OMNI model queue is congested — this causes "stuck" feeling during Generate</li>
          <li>• If CORS error: Browser blocks direct API calls — needs backend proxy</li>
          <li>• If 401 Unauthorized: API key expired or invalid — check DashScope console</li>
          <li>• If 429 Too Many Requests: Rate limit hit — wait 60s and retry</li>
        </ul>
      </div>
    </div>
  );
}

export default function UserPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  const handleLogin = () => {
    if (password === DEV_PASSWORD) {
      setAuth(true);
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setAuth(false);
    setIsAuthenticated(false);
    setPassword('');
  };

  // Password gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-[420px] mx-auto pt-16 pb-24">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#FF843D] flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-white" />
          </div>
          <h2 className="text-[22px] font-bold text-[#FFFFFF] mb-2">Developer Access</h2>
          <p className="text-[13px] text-[#9A9A9E]">
            This area contains sensitive API keys and configuration. Enter the developer password to continue.
          </p>
        </div>

        <div className="bg-[#141415] rounded-2xl border border-[#2A2A2C] p-6">
          <label className="text-[13px] font-medium text-[#FFFFFF] block mb-2">Password</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setAuthError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter developer password"
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#2A2A2C] bg-[#0A0A0B] text-[13px] text-[#FFFFFF] placeholder:text-[#6B6B6F] outline-none focus:border-[#FF843D] focus:ring-2 focus:ring-[#FF843D]/20 transition-all"
            />
            <button
              onClick={handleLogin}
              className="px-5 py-2.5 bg-[#FF843D] text-white text-[13px] font-medium rounded-xl hover:bg-[#FFA465] transition-all flex items-center gap-2"
            >
              <Unlock size={14} /> Unlock
            </button>
          </div>
          {authError && (
            <p className="text-[12px] text-[#EF4444] mt-2">{authError}</p>
          )}
          <p className="text-[11px] text-[#6B6B6F] mt-3">
            Hint: canvas + current year
          </p>
        </div>
      </div>
    );
  }

  const {
    qwenKey, setQwenKey,
    jimengAccessKeyId, setJimengAccessKeyId,
    jimengSecretAccessKey, setJimengSecretAccessKey,
    supabaseUrl, setSupabaseUrl,
    supabaseAnonKey, setSupabaseAnonKey,
  } = useApiKeyStore();

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  const toggleShow = (field: string) => {
    setShowKeys(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = () => {
    setSaveMessage('API Keys saved to local session');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all API keys to defaults?')) {
      setQwenKey('sk-16708778b6774db68345c9b00d22e8cf');
      setJimengAccessKeyId('AKLTODJiZDhlMjVhM2ZlNDAyYmIyYmVlOTM4MTlkZmFlNzg');
      setJimengSecretAccessKey('TUdaaFlUSTJORGt3T1RNeU5HRmxOamxrTkRrNVkyTmtNemcyTVdSbVlUZw==');
      setSupabaseUrl('https://dfwajsonugemyngiunbi.supabase.co');
      setSupabaseAnonKey('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmd2Fqc29udWdlbXluZ2l1bmJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MTM3MzMsImV4cCI6MjA5MjQ4OTczM30.N4WXTcLZ6fK9RDlSVEyMy4DHvpIal5wdfCbv6Pg57cM');
      setSaveMessage('Reset to defaults');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const InputRow = ({
    label, field, value, onChange, placeholder, isPassword = true,
    helpUrl, helpText
  }: {
    label: string; field: string; value: string; onChange: (v: string) => void;
    placeholder: string; isPassword?: boolean; helpUrl?: string; helpText?: string;
  }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[13px] font-semibold text-[#FFFFFF] flex items-center gap-2">
          <Key size={14} className="text-[#9A9A9E]" />
          {label}
        </label>
        {helpUrl && (
          <a href={helpUrl} target="_blank" rel="noopener noreferrer"
            className="text-[11px] text-[#9A9A9E] hover:text-[#FFFFFF] flex items-center gap-1 transition-colors">
            <ExternalLink size={10} /> Get Key
          </a>
        )}
      </div>
      {helpText && (
        <p className="text-[11px] text-[#6B6B6F] mb-2">{helpText}</p>
      )}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type={isPassword && !showKeys[field] ? 'password' : 'text'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2.5 pr-20 rounded-xl border border-[#2A2A2C] text-[13px] text-[#FFFFFF] outline-none focus:border-[#FF843D] transition-all bg-[#141415] font-mono"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              onClick={() => toggleShow(field)}
              className="w-7 h-7 rounded-lg hover:bg-[#141415] flex items-center justify-center text-[#6B6B6F]"
            >
              {showKeys[field] ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
            <button
              onClick={() => handleCopy(value, field)}
              className="w-7 h-7 rounded-lg hover:bg-[#141415] flex items-center justify-center text-[#6B6B6F]"
            >
              {copiedField === field ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[700px] mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[24px] font-bold text-[#FFFFFF]">Developer Settings</h2>
        <p className="text-[13px] text-[#9A9A9E] mt-1">
          Configure your API keys for different services. Keys are stored locally in this session.
        </p>
      </div>

      {/* Warning Banner */}
      <div className="mb-6 p-3 bg-[rgba(245,158,11,0.15)] border border-amber-200 rounded-xl flex items-start gap-2">
        <AlertTriangle size={16} className="text-[#FF843D] shrink-0 mt-0.5" />
        <p className="text-[12px] text-[#FF843D] leading-relaxed">
          <strong>Security Notice:</strong> API keys are stored in browser memory only and will be lost on page refresh.
          For production use, configure keys via environment variables or a secure backend proxy.
        </p>
      </div>

      {/* OMNI Diagnostics */}
      <OmniDebugPanel />

      {/* API Keys Form */}
      <div className="bg-[#141415] rounded-2xl border border-[#2A2A2C] p-6 mb-6">
        <h3 className="text-[16px] font-semibold text-[#FFFFFF] mb-1">AI Model Keys</h3>
        <p className="text-[12px] text-[#6B6B6F] mb-6">Keys for AI generation services</p>

        <InputRow
          label="Qwen-OMNI API Key"
          field="qwen"
          value={qwenKey}
          onChange={setQwenKey}
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
          helpUrl="https://dashscope.console.aliyun.com/apiKey"
          helpText="Used for multimodal text+image analysis and script generation. Get from DashScope console."
        />

        <div className="border-t border-[#2A2A2C] my-6" />

        <h3 className="text-[16px] font-semibold text-[#FFFFFF] mb-1">Video Generation Keys</h3>
        <p className="text-[12px] text-[#6B6B6F] mb-6">Keys for Jimeng/Dreamina video generation</p>

        <InputRow
          label="Jimeng Access Key ID"
          field="jimeng-access"
          value={jimengAccessKeyId}
          onChange={setJimengAccessKeyId}
          placeholder="AKLTxxxxxxxxxxxxxxxx"
          helpUrl="https://console.volcengine.com/iam/keymanage/"
          helpText="Volcengine IAM Access Key ID for video generation API signing."
        />

        <InputRow
          label="Jimeng Secret Access Key"
          field="jimeng-secret"
          value={jimengSecretAccessKey}
          onChange={setJimengSecretAccessKey}
          placeholder="TUxxxxxxxxxxxxxxxx"
          helpText="Volcengine IAM Secret Access Key. Keep this secure."
        />

        <div className="border-t border-[#2A2A2C] my-6" />

        <h3 className="text-[16px] font-semibold text-[#FFFFFF] mb-1">Cloud Storage</h3>
        <p className="text-[12px] text-[#6B6B6F] mb-6">Supabase configuration for cloud persistence</p>

        <InputRow
          label="Supabase Project URL"
          field="supabase-url"
          value={supabaseUrl}
          onChange={setSupabaseUrl}
          placeholder="https://xxxx.supabase.co"
          isPassword={false}
          helpUrl="https://supabase.com/dashboard"
          helpText="Your Supabase project URL. Found in Project Settings > API."
        />

        <InputRow
          label="Supabase Anon Key"
          field="supabase-anon"
          value={supabaseAnonKey}
          onChange={setSupabaseAnonKey}
          placeholder="eyJxxxxxxxx"
          helpText="Supabase anon/public key. Found in Project Settings > API."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FF843D] text-white text-[13px] font-medium rounded-full hover:bg-[#FFA465] transition-all"
          >
            <Save size={14} /> Save Keys
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#2A2A2C] text-[13px] text-[#9A9A9E] rounded-full hover:bg-[#141415] transition-all"
          >
            <RotateCcw size={14} /> Reset to Defaults
          </button>
        </div>
        {saveMessage && (
          <span className="text-[12px] text-[#22C55E] flex items-center gap-1">
            <Check size={12} /> {saveMessage}
          </span>
        )}
      </div>

      {/* Logout */}
      <div className="mt-6 pt-4 border-t border-[#2A2A2C]">
        <button
          onClick={handleLogout}
          className="text-[12px] text-[#6B6B6F] hover:text-[#FFFFFF] transition-colors flex items-center gap-1.5"
        >
          <Lock size={12} /> Lock Developer Settings
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-[#0A0A0B] rounded-xl flex items-start gap-3">
        <Info size={16} className="text-[#6B6B6F] shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] text-[#9A9A9E] leading-relaxed">
            <strong>Current active keys:</strong>
          </p>
          <ul className="text-[11px] text-[#6B6B6F] mt-1 space-y-0.5">
            <li>Qwen: {qwenKey ? `${qwenKey.slice(0, 12)}...` : 'Not set'}</li>
            <li>Jimeng Access: {jimengAccessKeyId ? `${jimengAccessKeyId.slice(0, 12)}...` : 'Not set'}</li>
            <li>Jimeng Secret: {jimengSecretAccessKey ? `${jimengSecretAccessKey.slice(0, 12)}...` : 'Not set'}</li>
            <li>Supabase: {supabaseUrl ? 'Configured' : 'Not set'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
