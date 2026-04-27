import { useState } from 'react';
import { useScriptStore } from '@/stores/useScriptStore';
import { useEditorStore } from '@/stores/useEditorStore';
import { useAppStore } from '@/stores/useAppStore';
import { useMockDemoStore } from '@/stores/useMockDemoStore';
import { getMockDemoScenarioById } from '@/lib/mockDemoScenarios';
import {
  Table2, LayoutGrid, Image, X, BookOpen, Search, Plus,
  TrendingUp, LayoutTemplate, GripVertical, Trash2, Save,
  Film, ArrowLeft, Upload, FileText, FileSpreadsheet, Send,
  Sparkles, Loader2
} from 'lucide-react';
import { PRESET_TEMPLATES } from '@/lib/constants';
import { AmbientGlow } from '@/components/AmbientGlow';
import { FakeAIScriptPanel } from '@/components/fake-demo/FakeAIScriptPanel';
import type { Script } from '@/types';

/* ─── Preset Template Card ─── */
function PresetTemplateCard({ template, onSelect }: { template: any; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="bg-[#141415] rounded-xl border border-dashed border-[#3A3A3C] overflow-hidden cursor-pointer hover:border-[#FF843D] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all group"
    >
      <div className="aspect-video relative overflow-hidden bg-[#FF843D]">
        <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <span className="px-2 py-1 bg-[#141415]/90 rounded text-[10px] font-medium text-[#FFFFFF]">{template.duration}</span>
          <span className="ml-2 px-2 py-1 bg-[#FF843D]/50 rounded text-[10px] font-medium text-white">{template.shots} shots</span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-[#FF6B00] rounded text-[10px] font-medium text-white">TEMPLATE</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-[16px] font-semibold text-[#FFFFFF] mb-1">{template.title}</h3>
        <p className="text-[12px] text-[#9A9A9E] line-clamp-2 mb-2">{template.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#6B6B6F]">{template.genre}</span>
          <span className="px-3 py-1.5 bg-[#FF843D] text-white text-[11px] font-medium rounded-full ml-auto">Use Template</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Upload Document Modal ─── */
function UploadDocumentModal({ onClose, onScriptCreated }: { onClose: () => void; onScriptCreated: (script: any) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length > 1) {
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const row: Record<string, string> = {};
          headers.forEach((h, i) => { row[h] = values[i] || ''; });
          return row;
        });
        setParsedData({ headers, rows, fileName: file.name });
      } else {
        const paragraphs = text.split('\n\n').filter(p => p.trim());
        setParsedData({ type: 'text', paragraphs, fileName: file.name });
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleConvertToScript = () => {
    if (!parsedData) return;
    const shots = parsedData.rows
      ? parsedData.rows.slice(0, 10).map((row: any, i: number) => ({
          id: `import-${i + 1}`,
          timeRange: row['Time'] || row['time'] || `${i * 5}-${(i + 1) * 5}s`,
          preview: '',
          visual: row['Visual'] || row['visual'] || row['Description'] || row['description'] || `Scene ${i + 1}`,
          purpose: row['Purpose'] || row['purpose'] || 'SET THE MOOD',
          camera: row['Camera'] || row['camera'] || 'Static shot',
          asset: row['Asset'] || row['asset'] || 'GENERATED',
          copy: row['Copy'] || row['copy'] || row['Dialogue'] || row['dialogue'] || '',
        }))
      : parsedData.paragraphs
        ? parsedData.paragraphs.slice(0, 8).map((p: string, i: number) => ({
            id: `import-${i + 1}`,
            timeRange: `${i * 5}-${(i + 1) * 5}s`,
            preview: '',
            visual: p.substring(0, 100),
            purpose: 'SET THE MOOD',
            camera: 'Static shot',
            asset: 'GENERATED',
            copy: '',
          }))
        : [];

    const newScript = {
      id: `import-${Date.now()}`,
      title: parsedData.fileName.replace(/\.[^/.]+$/, '') + ' (Imported)',
      status: 'draft' as const,
      duration: `${shots.length * 5}s`,
      version: 'v1',
      narrativeArc: 'Auto-generated from uploaded document',
      emotionalGoal: 'Explore the narrative within the imported content',
      visualDirection: 'Based on document content analysis',
      rhythm: 'Even pacing across imported scenes',
      assetLogic: 'Assets to be assigned based on scene descriptions',
      shots,
    };
    onScriptCreated(newScript);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#FF843D]/40 p-4" onClick={onClose}>
      <div className="bg-[#141415] rounded-2xl w-full max-w-[520px] max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-[#2A2A2C] flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#FFFFFF]">Import Document as Script</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#141415] flex items-center justify-center">
            <X size={16} className="text-[#9A9A9E]" />
          </button>
        </div>
        <div className="p-5">
          {!parsedData ? (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-[#FF843D] bg-[#141415]' : 'border-[#2A2A2C]'}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#141415] flex items-center justify-center mx-auto mb-3">
                  <Upload size={20} className="text-[#9A9A9E]" />
                </div>
                <p className="text-[14px] font-medium text-[#FFFFFF] mb-1">Drop your file here</p>
                <p className="text-[12px] text-[#6B6B6F] mb-3">Or click to browse</p>
                <input type="file" accept=".csv,.txt,.md,.doc,.docx" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" id="script-upload" />
                <label htmlFor="script-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF843D] text-white text-[13px] font-medium rounded-full cursor-pointer hover:bg-[#FFA465]">
                  <FileText size={14} /> Choose File
                </label>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-[11px] text-[#6B6B6F] uppercase tracking-wider font-medium">Supported formats</p>
                <div className="flex gap-2 flex-wrap">
                  {['CSV (table)', 'TXT (text)', 'Markdown', 'Word Doc'].map(fmt => (
                    <span key={fmt} className="px-2 py-1 bg-[#141415] rounded text-[11px] text-[#9A9A9E]">{fmt}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4 p-3 bg-[#0A0A0B] rounded-xl">
                <p className="text-[11px] text-[#6B6B6F] leading-relaxed">
                  <strong className="text-[#9A9A9E]">CSV format example:</strong><br/>
                  Time,Visual,Purpose,Camera,Copy<br/>
                  0-5s,Wide shot of city skyline,SET THE MOOD,Static wide,Opening narration...
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4 p-3 bg-[rgba(34,197,94,0.15)] rounded-xl">
                <FileSpreadsheet size={16} className="text-[#22C55E]" />
                <span className="text-[13px] text-[#22C55E] font-medium">{parsedData.fileName} — {parsedData.rows?.length || parsedData.paragraphs?.length || 0} scenes detected</span>
              </div>
              {parsedData.rows && (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-[11px]">
                    <thead><tr className="bg-[#141415]">{parsedData.headers.map((h: string) => <th key={h} className="px-2 py-1.5 text-left text-[#9A9A9E] font-medium">{h}</th>)}</tr></thead>
                    <tbody>
                      {parsedData.rows.slice(0, 5).map((row: any, i: number) => (
                        <tr key={i} className="border-b border-[#F5F5F5]">
                          {parsedData.headers.map((h: string) => <td key={h} className="px-2 py-1.5 text-[#D4D4D8] truncate max-w-[120px]">{row[h]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedData.rows.length > 5 && <p className="text-[11px] text-[#6B6B6F] mt-1">...and {parsedData.rows.length - 5} more rows</p>}
                </div>
              )}
              {parsedData.paragraphs && (
                <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
                  {parsedData.paragraphs.slice(0, 5).map((p: string, i: number) => (
                    <p key={i} className="text-[12px] text-[#D4D4D8] p-2 bg-[#141415] rounded">{p.substring(0, 100)}{p.length > 100 ? '...' : ''}</p>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setParsedData(null)} className="flex-1 px-4 py-2.5 border border-[#2A2A2C] rounded-full text-[13px] font-medium text-[#9A9A9E] hover:border-[#FF843D]">Choose Another File</button>
                <button onClick={handleConvertToScript} className="flex-1 px-4 py-2.5 bg-[#FF843D] text-white rounded-full text-[13px] font-medium hover:bg-[#FFA465]">Convert to Script</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Story Structure Visualizer ─── */
function StoryStructureMap({ shots }: { shots: any[] }) {
  return (
    <div className="bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-5 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <LayoutTemplate size={16} className="text-[#9A9A9E]" />
        <span className="text-[11px] uppercase tracking-wider text-[#9A9A9E] font-medium">Story Structure</span>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {shots.map((shot, _i) => (
          <div key={shot.id} className="flex-shrink-0 px-3 py-2 bg-[#141415] rounded-lg text-center min-w-[80px]">
            <div className="text-[10px] text-[#9A9A9E] mb-1">{shot.timeRange}</div>
            <div className="text-[10px] font-medium text-[#FFFFFF] uppercase">{shot.purpose.substring(0, 8)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Emotion Curve Visualizer ─── */
function EmotionCurve({ shots }: { shots: any[] }) {
  return (
    <div className="bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-[#9A9A9E]" />
          <span className="text-[11px] uppercase tracking-wider text-[#9A9A9E] font-medium">Emotion Curve</span>
        </div>
        <span className="text-[10px] text-[#6B6B6F]">Drag points to adjust intensity</span>
      </div>
      <div className="flex items-end gap-1 h-[60px]">
        {shots.map((_, i) => {
          const heights = [30, 45, 60, 80, 55, 40, 65, 35];
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-gradient-to-t from-[#111111] to-[#666666] rounded-t transition-all hover:opacity-80 cursor-pointer"
                style={{ height: `${heights[i % heights.length]}px` }}
              />
              <span className="text-[9px] text-[#6B6B6F]">{_.timeRange}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Storyboard Shot Card ─── */
function DraggableShotCard({ shot, index, isSelected, onSelect }: {
  shot: any; index: number; isSelected: boolean; onSelect: () => void;
}) {
  return (
    <div 
      onClick={onSelect}
      className={`bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] overflow-hidden cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-[#111111]' : 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#F5F5F5]">
        <span className="text-[10px] font-medium text-[#9A9A9E]">SHOT {index + 1}</span>
        <GripVertical size={12} className="text-[#3A3A3C]" />
      </div>
      <div className="aspect-video relative overflow-hidden bg-[#2A2A2C]">
        {shot.preview ? (
          <img src={shot.preview} alt={shot.visual} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image size={24} className="text-[#3A3A3C]" />
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span className="px-1.5 py-0.5 bg-[#FF843D]/50 rounded text-[9px] text-white">{shot.timeRange}</span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-[11px] text-[#FFFFFF] line-clamp-2 mb-1">{shot.visual}</p>
        <p className="text-[10px] text-[#6B6B6F] italic line-clamp-1">{shot.copy || 'No copy'}</p>
      </div>
    </div>
  );
}

/* ─── Bottom AI Chat Input ─── */
function ScriptEditorChat({ script, onUpdate }: { script: any; onUpdate: (updated: any) => void }) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<{role: string; content: string}[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessing(true);

    // Simulate AI processing
    await new Promise(r => setTimeout(r, 1500));

    // Simple rule-based modification for demo
    let aiResponse = '';
    let updatedScript = { ...script };

    if (userMsg.toLowerCase().includes('shorter') || userMsg.toLowerCase().includes('shorten')) {
      aiResponse = `I've shortened the copy for all shots. Total script reduced from ${script.duration} to a tighter pace.`;
      updatedScript.shots = script.shots.map((s: any) => ({
        ...s,
        copy: s.copy ? s.copy.split('.')[0] + '.' : s.copy,
        visual: s.visual.length > 60 ? s.visual.substring(0, 60) + '...' : s.visual,
      }));
    } else if (userMsg.toLowerCase().includes('dramatic') || userMsg.toLowerCase().includes('intense')) {
      aiResponse = 'Enhanced dramatic tension: added stronger visual language and heightened emotional copy.';
      updatedScript.shots = script.shots.map((s: any, i: number) => ({
        ...s,
        copy: s.copy ? s.copy.replace(/\./g, '!') : s.copy,
        visual: i % 2 === 0 ? 'Dramatic ' + s.visual : s.visual,
      }));
      updatedScript.emotionalGoal = 'Heightened drama and emotional intensity throughout';
    } else if (userMsg.toLowerCase().includes('replace') && userMsg.toLowerCase().includes('shot')) {
      aiResponse = 'Regenerated shot descriptions based on your new direction. Updated visual and copy for affected shots.';
      updatedScript.shots = script.shots.map((s: any) => ({
        ...s,
        visual: s.visual + ' [Revised per your request]',
      }));
    } else {
      aiResponse = `Analyzed your request: "${userMsg}". I've updated the script's emotional goal and refined copy to match your intent.`;
      updatedScript.emotionalGoal = userMsg;
      updatedScript.shots = script.shots.map((s: any) => ({
        ...s,
        copy: s.copy ? `[Aligned to: ${userMsg.substring(0, 20)}] ${s.copy}` : s.copy,
      }));
    }

    onUpdate(updatedScript);
    setHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsProcessing(false);
  };

  return (
    <div className="border-t border-[#2A2A2C] bg-[#141415] mt-4">
      {/* Chat history */}
      {history.length > 0 && (
        <div className="max-h-[160px] overflow-y-auto px-4 pt-3 space-y-2">
          {history.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-5 h-5 rounded-full bg-[#FF843D] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={10} className="text-white" />
                </div>
              )}
              <div className={`px-3 py-2 rounded-xl text-[12px] max-w-[80%] ${
                msg.role === 'user' ? 'bg-[#FF843D] text-white' : 'bg-[#141415] text-[#FFFFFF]'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-2 items-center">
              <div className="w-5 h-5 rounded-full bg-[#FF843D] flex items-center justify-center">
                <Loader2 size={10} className="text-white animate-spin" />
              </div>
              <span className="text-[11px] text-[#6B6B6F]">Agent is analyzing your script...</span>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 p-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-[#141415] rounded-full border border-[#2A2A2C] focus-within:border-[#FF843D] transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask AI to modify script: 'Make it more dramatic' / 'Shorten shot 3' / 'Replace all copy with Chinese'..."
            className="flex-1 bg-transparent text-[13px] outline-none text-[#FFFFFF] placeholder:text-[#6B6B6F]"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || isProcessing}
          className="w-9 h-9 rounded-full bg-[#FF843D] text-white flex items-center justify-center hover:bg-[#FFA465] disabled:opacity-30 transition-all shrink-0"
        >
          {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </div>
      <p className="px-4 pb-2 text-[10px] text-[#6B6B6F]">
        AI will analyze your script + assets and apply changes. Each change creates a new version in History.
      </p>
    </div>
  );
}

/* ─── Main ScriptPage ─── */
export default function ScriptPage() {
  const { historyOpen, scripts, activeScript, updateShotInActive, setActiveScript, addScript, deleteScript } = useScriptStore();
  const { setActiveNav } = useAppStore();
  const { pushUndo } = useEditorStore();
  const { activeScenarioId, scriptPlanReady, startVideoGeneration } = useMockDemoStore();
  const [pageMode, setPageMode] = useState<'preview' | 'editor'>('preview');
  const [viewMode, setViewMode] = useState<'table' | 'storyboard'>('table');
  const [editingShot, setEditingShot] = useState<any | null>(null);
  const [selectedShots, setSelectedShots] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scriptToDelete, setScriptToDelete] = useState<string | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  const mockScenario = activeScenarioId ? getMockDemoScenarioById(activeScenarioId) : null;
  const mockScriptPlanActive = Boolean(mockScenario && scriptPlanReady);
  const script = activeScript || null;

  if (mockScriptPlanActive && mockScenario) {
    return (
      <div className="relative pb-24">
        <AmbientGlow variant="subtle" fixed={false} />
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#9A9A9E] mb-2">Script</div>
            <h1 className="text-[24px] md:text-[28px] font-bold text-[#FFFFFF]">{mockScenario.scriptPlan.title}</h1>
            <p className="text-[13px] text-[#9A9A9E] mt-2 max-w-[860px] leading-6">{mockScenario.scriptPlan.globalDirection}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setActiveNav('generate')} className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all">Back to Questions</button>
            <button onClick={() => { startVideoGeneration(); setActiveNav('edit'); }} className="px-5 py-2.5 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465] transition-all flex items-center gap-2">
              <Film size={14} /> Generate Video
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="bg-[#141415] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E] mb-3">Project Summary</h2>
            <div className="space-y-2">
              {mockScenario.scriptPlan.projectSummary.map((item) => (
                <div key={item} className="text-[13px] text-[#FFFFFF]">• {item}</div>
              ))}
            </div>
          </div>
          <div className="bg-[#141415] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E] mb-3">Production Notes</h2>
            <div className="space-y-2">
              {mockScenario.scriptPlan.productionNotes.map((item) => (
                <div key={item} className="text-[13px] text-[#FFFFFF]">• {item}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-[#2A2A2C] flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-[14px] font-semibold text-[#FFFFFF]">Golden-Path Script Plan</h2>
              <p className="text-[12px] text-[#9A9A9E] mt-1">Branching result is intentionally deferred. The current version uses a fixed golden-path script plan per scenario.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr className="border-b border-[#2A2A2C] bg-[#0A0A0B]">
                  {['Time', 'Scene', 'Purpose', 'Visual Direction', 'Camera', 'Asset', 'Audio / Voice', 'Text / Caption'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#9A9A9E]">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockScenario.scriptPlan.rows.map((row, index) => (
                  <tr key={`${row.time}-${index}`} className="border-b border-[#2A2A2C] align-top">
                    <td className="px-4 py-3 text-[12px] font-medium text-[#FFFFFF] whitespace-nowrap">{row.time}</td>
                    <td className="px-4 py-3 text-[12px] text-[#D4D4D8] leading-6">{row.scene}</td>
                    <td className="px-4 py-3 text-[12px] text-[#FFFFFF] leading-6">{row.purpose}</td>
                    <td className="px-4 py-3 text-[12px] text-[#D4D4D8] leading-6">{row.visualDirection}</td>
                    <td className="px-4 py-3 text-[12px] text-[#D4D4D8] leading-6">{row.camera}</td>
                    <td className="px-4 py-3 text-[12px] text-[#D4D4D8] leading-6">{row.assetSource ?? '—'}</td>
                    <td className="px-4 py-3 text-[12px] text-[#D4D4D8] leading-6">{row.audioOrVoice ?? '—'}</td>
                    <td className="px-4 py-3 text-[12px] text-[#D4D4D8] leading-6">{row.textOrCaption ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-[#141415] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E] mb-3">Intent Mapping Summary</h2>
            <div className="space-y-2">
              {mockScenario.scriptPlan.intentMappingSummary.map((item) => (
                <div key={item} className="text-[13px] text-[#FFFFFF]">• {item}</div>
              ))}
            </div>
          </div>
          <div className="bg-[#141415] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E] mb-3">Validation Notes</h2>
            <div className="space-y-2">
              {mockScenario.scriptPlan.validationNotes.map((item) => (
                <div key={item} className="text-[13px] text-[#FFFFFF]">• {item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleUseTemplate = (templateScript: Script) => {
    const newScript = { ...templateScript, id: templateScript.id + '-' + Date.now(), title: templateScript.title + ' (Copy)', version: 'v1' };
    addScript(newScript);
    setActiveScript(newScript);
    setPageMode('editor');
  };

  const handleDeleteClick = (scriptId: string) => {
    setScriptToDelete(scriptId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (scriptToDelete) {
      deleteScript(scriptToDelete);
      setScriptToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleScriptUpdateFromChat = (updatedScript: any) => {
    pushUndo({ type: 'full', data: JSON.parse(JSON.stringify(script)), label: 'AI modification', timestamp: Date.now() });
    setActiveScript(updatedScript);
  };

  // ========== PREVIEW MODE ==========
  if (pageMode === 'preview') {
    return (
      <div className="pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[24px] font-bold text-[#FFFFFF]">My Scripts</h2>
            <p className="text-[13px] text-[#9A9A9E] mt-1">{scripts.length} scripts in your workspace</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#2A2A2C] bg-[#141415]">
              <Search size={14} className="text-[#6B6B6F]" />
              <input type="text" placeholder="Search scripts..." className="text-[13px] outline-none bg-transparent w-[150px] placeholder:text-[#6B6B6F]" />
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2A2A2C] text-[13px] font-medium text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all"
            >
              <Upload size={14} /> Import
            </button>
            <button
              onClick={() => useAppStore.getState().setActiveNav('generate')}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF843D] text-white text-[13px] font-medium rounded-full hover:bg-[#FFA465] transition-all"
            >
              <Plus size={14} /> New Script
            </button>
          </div>
        </div>

        {/* My Scripts */}
        {scripts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9E]">My Scripts</span>
              <div className="flex-1 h-px bg-[#2A2A2C]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scripts.map((s) => (
                <div
                  key={s.id}
                  onClick={() => { setActiveScript(s); setPageMode('editor'); }}
                  className="bg-[#141415] rounded-xl border border-[#2A2A2C] overflow-hidden cursor-pointer hover:border-[#FF843D] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all group"
                >
                  <div className="aspect-video relative overflow-hidden bg-[#FF843D]">
                    <img src={s.shots[0]?.preview || '/assets/story-1.jpg'} alt={s.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="px-2 py-1 bg-[#141415]/90 rounded text-[10px] font-medium text-[#FFFFFF]">{s.duration}</span>
                      <span className="ml-2 px-2 py-1 bg-[#FF843D]/50 rounded text-[10px] font-medium text-white">{s.shots.length} shots</span>
                    </div>
                    {s.id.startsWith('preset-') && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-[#FF6B00] rounded text-[10px] font-medium text-white">TEMPLATE</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-[16px] font-semibold text-[#FFFFFF] mb-1">{s.title}</h3>
                    <p className="text-[12px] text-[#9A9A9E] line-clamp-2 mb-3">{s.narrativeArc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#6B6B6F]">Version {s.version}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(s.id); }}
                          className="px-2 py-1 text-[11px] text-[#6B6B6F] hover:text-[#EF4444] transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveScript(s); setPageMode('editor'); }}
                          className="px-3 py-1.5 bg-[#FF843D] text-white text-[11px] font-medium rounded-full"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Start Templates */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9E]">Quick Start Templates</span>
            <div className="flex-1 h-px bg-[#2A2A2C]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_TEMPLATES.map((template) => (
              <PresetTemplateCard key={template.id} template={template} onSelect={() => handleUseTemplate(template.script)} />
            ))}
            <div
              onClick={() => useAppStore.getState().setActiveNav('generate')}
              className="bg-[#141415] rounded-xl border border-dashed border-[#3A3A3C] overflow-hidden cursor-pointer hover:border-[#FF843D] transition-all flex flex-col items-center justify-center min-h-[240px]"
            >
              <div className="w-12 h-12 rounded-full bg-[#141415] flex items-center justify-center mb-3">
                <Plus size={20} className="text-[#9A9A9E]" />
              </div>
              <span className="text-[14px] font-medium text-[#9A9A9E]">Create New Project</span>
              <span className="text-[11px] text-[#6B6B6F] mt-1">Start from scratch with AI</span>
            </div>
          </div>
        </div>

        {showUploadModal && <UploadDocumentModal onClose={() => setShowUploadModal(false)} onScriptCreated={(s) => { addScript(s); setActiveScript(s); setPageMode('editor'); setShowUploadModal(false); }} />}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#FF843D]/40 p-4" onClick={() => setShowDeleteModal(false)}>
            <div className="bg-[#141415] rounded-2xl w-full max-w-[400px] p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[rgba(239,68,68,0.15)] flex items-center justify-center">
                  <Trash2 size={20} className="text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#FFFFFF]">Delete Script?</h3>
                  <p className="text-[13px] text-[#9A9A9E]">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-[13px] text-[#9A9A9E] leading-relaxed mb-6">是否确认删除，删除后则无法找回脚本工程</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 rounded-full border border-[#2A2A2C] text-[13px] font-medium text-[#9A9A9E] hover:border-[#FF843D] transition-all">Cancel</button>
                <button onClick={handleConfirmDelete} className="flex-1 px-4 py-2.5 rounded-full bg-[rgba(239,68,68,0.15)]0 text-white text-[13px] font-medium hover:bg-red-600 transition-all">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== EDITOR MODE ==========
  if (!script) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-[#141415] flex items-center justify-center mb-4">
          <Image size={28} className="text-[#3A3A3C]" />
        </div>
        <h3 className="text-[18px] font-semibold text-[#FFFFFF] mb-2">No Script Active</h3>
        <p className="text-[13px] text-[#9A9A9E] mb-4">Generate a script first, or create one manually.</p>
      </div>
    );
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedShots);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedShots(next);
  };

  const handleBatchDelete = () => {
    pushUndo({ type: 'full', data: JSON.parse(JSON.stringify(script)), label: 'Batch delete shots', timestamp: Date.now() });
    const newShots = script.shots.filter((s: any) => !selectedShots.has(s.id));
    setActiveScript({ ...script, shots: newShots });
    setSelectedShots(new Set());
  };

  return (
    <div className="relative">
      {/* Ambient Lighting */}
      <AmbientGlow variant="subtle" fixed={false} />
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setPageMode('preview')} className="flex items-center gap-2 text-[13px] text-[#9A9A9E] hover:text-[#FFFFFF] transition-colors">
            <BookOpen size={14} /> Back to Scripts
          </button>
          <span className="text-[#D4D4D8]">|</span>
          <span className="text-[14px] font-semibold text-[#FFFFFF]">{script.title}</span>
          <span className="px-2 py-0.5 bg-[#141415] rounded text-[10px] text-[#9A9A9E]">{script.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-[#2A2A2C] text-[12px] text-[#9A9A9E] hover:bg-[#141415] flex items-center gap-1.5">
            <Film size={12} /> Replace Assets
          </button>
          <button className="px-3 py-1.5 bg-[#FF843D] text-white rounded-lg text-[12px] font-medium hover:bg-[#FFA465] flex items-center gap-1.5">
            <Save size={12} /> Save
          </button>
        </div>
      </div>

      <div className="flex gap-6 pb-24 -mx-4 md:-mx-8 -mt-8 pt-8 px-4 md:px-8 min-h-[calc(100vh-48px)]">
        {/* History Sidebar */}
        <aside className={`${historyOpen ? 'w-[240px]' : 'w-0'} bg-[#141415] border-r border-[#2A2A2C] transition-all overflow-hidden shrink-0 hidden md:block`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6F]">History</span>
            </div>
            <div className="space-y-1">
              <div className="px-3 py-2 bg-[#141415] rounded-lg cursor-pointer">
                <div className="text-[13px] font-medium text-[#FFFFFF]">{script.title} v1</div>
                <div className="text-[11px] text-[#6B6B6F]">Current</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title + Top Actions */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
            <div>
              <h1 className="text-[24px] md:text-[28px] font-bold text-[#FFFFFF]">{script.title}, {script.version}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-[#141415] rounded-full text-[11px] font-medium text-[#9A9A9E] uppercase">{script.status}</span>
                <span className="text-[13px] text-[#9A9A9E]">Duration: {script.duration}</span>
                <span className="text-[13px] text-[#6B6B6F]">{script.version}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => alert('Draft saved to cloud')} className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all">Save Draft</button>
              <button onClick={() => alert('Revise Plan: This would open an AI revision dialog')} className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all">Revise Plan</button>
              <button onClick={() => alert('Video generation queued')} className="px-5 py-2.5 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465] transition-all flex items-center gap-2">
                <Film size={14} /> Generate Video
              </button>
            </div>
          </div>

          {/* Story Structure + Emotion Curve */}
          <StoryStructureMap shots={script.shots} />
          <EmotionCurve shots={script.shots} />

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 bg-[#141415] rounded-full p-1">
              <button onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${viewMode === 'table' ? 'bg-[#141415] text-[#FFFFFF] shadow-sm' : 'text-[#9A9A9E]'}`}>
                <Table2 size={14} /> Table View
              </button>
              <button onClick={() => setViewMode('storyboard')} className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${viewMode === 'storyboard' ? 'bg-[#141415] text-[#FFFFFF] shadow-sm' : 'text-[#9A9A9E]'}`}>
                <LayoutGrid size={14} /> Storyboard View
              </button>
            </div>
            {selectedShots.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#9A9A9E]">{selectedShots.size} selected</span>
                <button onClick={handleBatchDelete} className="flex items-center gap-1 px-3 py-1.5 bg-[rgba(239,68,68,0.15)] text-[#EF4444] rounded-full text-[12px] hover:bg-red-100">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>

          {/* ========== TABLE VIEW ========== */}
          {viewMode === 'table' && (
            <div className="bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] overflow-hidden mb-6">
              <div className="grid grid-cols-[60px_70px_1fr_110px_100px_70px_1fr] gap-2 px-3 py-3 bg-[#141415] border-b border-[#2A2A2C]">
                {['Time', 'Preview', 'Visual', 'Purpose', 'Camera', 'Asset', 'Copy'].map(h => (
                  <span key={h} className="text-[10px] font-medium uppercase tracking-wider text-[#9A9A9E]">{h}</span>
                ))}
              </div>
              {script.shots.map((shot: any) => (
                <div
                  key={shot.id}
                  onClick={() => setEditingShot(shot)}
                  className="grid grid-cols-[60px_70px_1fr_110px_100px_70px_1fr] gap-2 px-3 py-2.5 border-b border-[#F5F5F5] hover:bg-[#0A0A0B] transition-colors items-center cursor-pointer"
                >
                  <span className="text-[12px] text-[#FFFFFF] font-medium">{shot.timeRange}</span>
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-[#2A2A2C]">
                    {shot.preview ? (
                      <img src={shot.preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={14} className="text-[#3A3A3C]" />
                      </div>
                    )}
                  </div>
                  <span className="text-[12px] text-[#FFFFFF] line-clamp-2">{shot.visual}</span>
                  <span className="px-2 py-0.5 bg-[#141415] rounded text-[10px] font-medium text-[#9A9A9E] uppercase text-center">{shot.purpose}</span>
                  <span className="text-[11px] text-[#9A9A9E]">{shot.camera}</span>
                  <span className="px-2 py-0.5 bg-[#1E1E20] rounded text-[10px] font-medium text-[#FFFFFF] text-center">{shot.asset}</span>
                  <span className="text-[11px] text-[#9A9A9E] italic line-clamp-2">{shot.copy || '—'}</span>
                </div>
              ))}
            </div>
          )}

          {/* ========== STORYBOARD VIEW ========== */}
          {viewMode === 'storyboard' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {script.shots.map((shot: any, _idx: number) => (
                <DraggableShotCard key={shot.id} shot={shot} index={_idx} isSelected={selectedShots.has(shot.id)} onSelect={() => toggleSelect(shot.id)} />
              ))}
            </div>
          )}

          {/* Edit Modal */}
          {editingShot && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setEditingShot(null)}>
              <div className="absolute inset-0 bg-[#FF843D]/40" />
              <div className="relative bg-[#141415] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] max-w-[600px] w-full m-4 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[14px] font-semibold">Edit Shot ({editingShot.timeRange})</span>
                  <button onClick={() => setEditingShot(null)} className="w-8 h-8 rounded-full hover:bg-[#141415] flex items-center justify-center"><X size={16} /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#9A9A9E] block mb-1">Visual</label>
                    <textarea defaultValue={editingShot.visual} onBlur={(e) => updateShotInActive(editingShot.id, { visual: e.target.value })} className="w-full p-3 bg-[#141415] rounded-xl text-[13px] outline-none resize-none" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#9A9A9E] block mb-1">Purpose</label>
                      <input defaultValue={editingShot.purpose} onBlur={(e) => updateShotInActive(editingShot.id, { purpose: e.target.value })} className="w-full p-3 bg-[#141415] rounded-xl text-[13px] outline-none" />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#9A9A9E] block mb-1">Camera</label>
                      <input defaultValue={editingShot.camera} onBlur={(e) => updateShotInActive(editingShot.id, { camera: e.target.value })} className="w-full p-3 bg-[#141415] rounded-xl text-[13px] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#9A9A9E] block mb-1">Copy / Dialogue</label>
                    <textarea defaultValue={editingShot.copy} onBlur={(e) => updateShotInActive(editingShot.id, { copy: e.target.value })} className="w-full p-3 bg-[#141415] rounded-xl text-[13px] outline-none resize-none" rows={2} />
                  </div>
                  <button onClick={() => setEditingShot(null)} className="w-full py-2.5 bg-[#FF843D] text-white rounded-full text-[13px]">Done Editing</button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#2A2A2C]">
              <button onClick={() => setActiveNav('generate')} className="flex items-center gap-2 text-[13px] text-[#9A9A9E] hover:text-[#FFFFFF] transition-colors">
              <ArrowLeft size={14} /> Back to Questions
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => alert('Revise Plan: This would open an AI revision dialog')} className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all">Revise Plan</button>
              <button onClick={() => alert('Draft saved to cloud')} className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all">Save Draft</button>
              <button onClick={() => { startVideoGeneration(); setActiveNav('edit'); }} className="px-5 py-2.5 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465] transition-all flex items-center gap-2">
                <Film size={14} /> Generate Video
              </button>
            </div>
          </div>

          {/* AI Chat Input — Modify Script */}
          <ScriptEditorChat script={script} onUpdate={handleScriptUpdateFromChat} />

          {/* ══════ SCRIPT EDITOR AI PANEL ══════ */}
          <FakeAIScriptPanel isOpen={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />

          {/* AI Panel Toggle */}
          {!aiPanelOpen && (
            <button
              onClick={() => setAiPanelOpen(true)}
              className="fixed right-4 bottom-20 md:bottom-24 z-50 w-10 h-10 rounded-full bg-[#FF843D] text-white flex items-center justify-center shadow-lg hover:bg-[#FFA465] transition-all"
              title="Script Editor AI"
            >
              <Sparkles size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
