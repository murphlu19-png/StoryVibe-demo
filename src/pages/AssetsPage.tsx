import { useState, useRef } from 'react';
import { MOCK_PROJECTS } from '@/lib/constants';
import { useAppStore } from '@/stores/useAppStore';
import { useGenerateStore } from '@/stores/useGenerateStore';
import { useScriptStore } from '@/stores/useScriptStore';
import { AgentService } from '@/lib/ai-service';
import { FakeAIAssetPanel } from '@/components/fake-demo/FakeAIAssetPanel';
import {
  Plus, Search, Image, Video, FileText, Music, Tablet,
  Sparkles, X, ArrowRight, Loader2,
  Heart, Trash2, Check, Send, Eye, Columns2,
  Wand2, Lightbulb, FolderSync, Images
} from 'lucide-react';

const typeIcons: Record<string, React.ElementType> = {
  image: Image, video: Video, text: FileText, audio: Music, tablet: Tablet,
};

// ========== 资产详情弹窗 ==========
function AssetDetailModal({ index, onClose }: { index: number; onClose: () => void }) {
  const [isFav, setIsFav] = useState(false);
  const [selected, setSelected] = useState(false);
  const types = ['image', 'video', 'text', 'audio', 'tablet'] as const;
  const type = types[index % 5];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-[#FF843D]/40" />
      <div 
        className="relative bg-[#141415] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] w-full max-w-[480px] m-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-[4/3] relative overflow-hidden">
          <img 
            src={`/assets/asset-${(index % 4) + 1}.jpg`}
            alt={`Asset ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#141415]/80 flex items-center justify-center z-10">
            <X size={14} />
          </button>
          <span className="absolute top-3 left-3 px-2 py-1 bg-[#FF843D]/50 rounded text-white text-[10px] uppercase z-10">{type}</span>
        </div>
        <div className="p-5">
          <h3 className="text-[16px] font-semibold text-[#FFFFFF] mb-1">Asset {index + 1}</h3>
          <p className="text-[12px] text-[#9A9A9E] mb-4">{type} · Added 2 days ago · 2.4 MB</p>
          <div className="flex gap-1.5 mb-4 flex-wrap">
            <span className="px-2 py-0.5 bg-[#141415] rounded text-[10px] text-[#9A9A9E]">Reference</span>
            <span className="px-2 py-0.5 bg-[#141415] rounded text-[10px] text-[#9A9A9E]">{type === 'image' ? 'Scene' : type === 'video' ? 'Footage' : 'Document'}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelected(!selected)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-medium transition-all ${
                selected ? 'bg-[#FF843D] text-white' : 'border border-[#2A2A2C] text-[#9A9A9E] hover:bg-[#141415]'
              }`}
            >
              {selected ? <Check size={14} /> : <Eye size={14} />} {selected ? 'Selected' : 'Select'}
            </button>
            <button 
              onClick={() => setIsFav(!isFav)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-medium transition-all ${
                isFav ? 'bg-[#FFF3E0] text-[#E65100] border border-[#E65100]' : 'border border-[#2A2A2C] text-[#9A9A9E] hover:bg-[#141415]'
              }`}
            >
              <Heart size={14} className={isFav ? 'fill-current' : ''} /> {isFav ? 'Favorited' : 'Favorite'}
            </button>
            <button className="w-10 h-10 rounded-full border border-[#2A2A2C] flex items-center justify-center text-[#9A9A9E] hover:bg-[rgba(239,68,68,0.15)] hover:text-[#EF4444] hover:border-red-200 transition-all">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Asset AI 底部对话框 ==========
interface AssetChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  actions?: { label: string; type: string }[];
}

function AssetAIFooter({ projectName }: { projectName: string }) {
  const [messages, setMessages] = useState<AssetChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filePreviews, setFilePreviews] = useState<{id: string; url: string; name: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 5 个场景快捷操作
  const sceneActions = [
    { icon: Search, label: 'Search related', desc: '搜索相关图像', type: 'search' },
    { icon: Images, label: 'Find similar', desc: '查找相似图像', type: 'similar' },
    { icon: FolderSync, label: 'Migrate', desc: '从其他文件夹迁移', type: 'migrate' },
    { icon: Lightbulb, label: 'New ideas', desc: '根据几张图想新主意', type: 'ideas' },
    { icon: Wand2, label: 'Generate', desc: '根据素材库生成新idea', type: 'generate' },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => [...prev, { id: `f-${Date.now()}-${Math.random()}`, url: reader.result as string, name: file.name }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeFile = (id: string) => {
    setFilePreviews(prev => prev.filter(f => f.id !== id));
  };

  const handleSceneAction = async (type: string) => {
    setShowSuggestions(false);
    const userMsg: AssetChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: `[${type}] Requesting asset ${type} in "${projectName}"...`,
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // 模拟AI响应
    await new Promise(r => setTimeout(r, 1200));

    const responses: Record<string, AssetChatMessage> = {
      search: {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: `Found 5 images related to your search in "${projectName}":\n\n1. Golden Hour Landscape (image)\n2. Urban Night Lights (image)\n3. Misty Forest Path (image)\n4. Ocean Waves at Dawn (image)\n5. Desert Dunes Sunset (image)\n\nWould you like me to add these to your current collection?`,
        actions: [
          { label: 'Add all', type: 'add_all' },
          { label: 'Preview first', type: 'preview' },
          { label: 'Refine search', type: 'refine' },
        ],
      },
      similar: {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: `Analyzed the selected image and found 3 visually similar assets in "${projectName}":\n\n• Similar color palette (warm tones)\n• Matching composition style (rule of thirds)\n• Comparable lighting conditions (soft ambient)\n\nThese assets work well together for a cohesive visual narrative.`,
        actions: [
          { label: 'Select similar', type: 'select' },
          { label: 'Create collection', type: 'collection' },
        ],
      },
      migrate: {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: `Scanned other folders and found 4 related images that could enhance "${projectName}":\n\nFrom "Nature Collection": 2 images (forest, waterfall)\nFrom "Urban Archive": 1 image (street scene)\nFrom "Abstract Set": 1 image (texture study)\n\nShall I migrate these into your current project?`,
        actions: [
          { label: 'Migrate all', type: 'migrate_all' },
          { label: 'Review first', type: 'review' },
        ],
      },
      ideas: {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: `Based on the images you shared, here are 3 fresh creative directions:\n\n1. **"Temporal Shift"** — Contrast day/night versions of the same scene to show time passing\n2. **"Hidden Geometry"** — Find and highlight geometric patterns across seemingly unrelated shots\n3. **"Color Memory"** — Extract the dominant palette and suggest complementary scenes to film\n\nWhich direction resonates with you?`,
        actions: [
          { label: 'Direction 1', type: 'idea_1' },
          { label: 'Direction 2', type: 'idea_2' },
          { label: 'Direction 3', type: 'idea_3' },
          { label: 'Combine all', type: 'combine' },
        ],
      },
      generate: {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: `Analyzed your entire "${projectName}" library (${Math.floor(Math.random()*50+20)} assets) and generated 3 new creative concepts:\n\n• **Short Film Concept**: "Echoes" — Using your ambient sound recordings and twilight imagery\n• **Visual Poem**: "Fragmented" — Non-linear sequence from your abstract texture collection\n• **Social Series**: "30-Seconds" — Fast-paced clips from your urban motion footage\n\nI can generate a complete script for any of these.`,
        actions: [
          { label: 'Echoes script', type: 'script_1' },
          { label: 'Fragmented script', type: 'script_2' },
          { label: '30s series script', type: 'script_3' },
        ],
      },
    };

    const response = responses[type] || {
      id: `a-${Date.now()}`,
      role: 'ai',
      content: `I can help you with assets in "${projectName}". Try:\n• Search for related images\n• Find visually similar assets\n• Migrate from other folders\n• Generate new ideas from selected images\n• Create concepts from your entire library`,
    };

    setMessages(prev => [...prev, response]);
    setIsLoading(false);
    setTimeout(scrollToBottom, 100);
  };

  const handleSend = async () => {
    if (!input.trim() && filePreviews.length === 0) return;
    const text = input.trim();
    setInput('');
    setShowSuggestions(false);

    const userMsg: AssetChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text || 'Uploaded images for analysis',
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // 真实AI调用
    try {
      const context = `Asset library: "${projectName}". User uploaded ${filePreviews.length} images. Help with asset management, search, or creative ideation.`;
      const response = await AgentService.chatFreeform(text || 'Analyze these images', context);
      
      const aiMsg: AssetChatMessage = {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: response,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      // fallback
      const fallback: AssetChatMessage = {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: `I understand you're working with assets in "${projectName}". I can help you:\n\n1. Search for specific visuals\n2. Find similar images\n3. Migrate assets between folders\n4. Generate creative ideas from your images\n5. Create complete scripts from your library`,
        actions: [
          { label: 'Search', type: 'search' },
          { label: 'Find similar', type: 'similar' },
          { label: 'New ideas', type: 'ideas' },
        ],
      };
      setMessages(prev => [...prev, fallback]);
    }
    
    setFilePreviews([]);
    setIsLoading(false);
    setTimeout(scrollToBottom, 100);
  };

  const handleActionClick = (type: string) => {
    if (['search', 'similar', 'migrate', 'ideas', 'generate'].includes(type)) {
      handleSceneAction(type);
    } else {
      // 子操作，模拟响应
      const response: AssetChatMessage = {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: `Action "${type}" triggered. Processing your request for "${projectName}"...\n\n✓ Assets selected\n✓ Preview generated\n✓ Ready for next step`,
        actions: [{ label: 'Undo', type: 'undo' }, { label: 'Continue', type: 'continue' }],
      };
      setMessages(prev => [...prev, response]);
    }
  };

  return (
    <div className="mt-6 border-t border-[#2A2A2C] pt-4">
      {/* 消息区域 */}
      {messages.length > 0 && (
        <div className="mb-4 max-h-[300px] overflow-y-auto space-y-3 pr-1">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] ${
                msg.role === 'user' 
                  ? 'bg-[#FF843D] text-white rounded-2xl rounded-tr-md' 
                  : 'bg-[#141415] text-[#FFFFFF] rounded-2xl rounded-tl-md'
              } px-4 py-3`}>
                <p className="text-[13px] whitespace-pre-line leading-relaxed">{msg.content}</p>
                {msg.actions && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.actions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleActionClick(action.type)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                          msg.role === 'user'
                            ? 'bg-[#141415]/20 text-white/90 hover:bg-[#141415]/30'
                            : 'bg-[#141415] text-[#FFFFFF] hover:bg-[#1E1E20]'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-[#6B6B6F]">
              <Loader2 size={14} className="animate-spin" />
              <span className="text-[12px]">AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* 快捷场景按钮 */}
      {showSuggestions && messages.length === 0 && (
        <div className="mb-4">
          <p className="text-[12px] text-[#6B6B6F] mb-2">What would you like to do with your assets?</p>
          <div className="flex gap-2 flex-wrap">
            {sceneActions.map((scene) => {
              const Icon = scene.icon;
              return (
                <button
                  key={scene.type}
                  onClick={() => handleSceneAction(scene.type)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#2A2A2C] bg-[#141415] text-[12px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all"
                >
                  <Icon size={14} />
                  <span className="font-medium">{scene.label}</span>
                  <span className="text-[10px] text-[#6B6B6F] hidden sm:inline">· {scene.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 输入卡片 */}
      <div className="bg-[#141415] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-4">
        {/* 附件预览 */}
        {filePreviews.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {filePreviews.map((preview) => (
              <div key={preview.id} className="relative group">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#141415]">
                  <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={() => removeFile(preview.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF843D] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-xl border-2 border-dashed border-[#D4D4D4] flex items-center justify-center text-[#6B6B6F] hover:border-[#FF843D] hover:text-[#FFFFFF] shrink-0 transition-all"
          >
            <Plus size={18} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            placeholder="Describe what you need — search, find similar, migrate, or generate ideas..."
            className="flex-1 min-h-[44px] max-h-[120px] resize-none text-[14px] text-[#FFFFFF] placeholder:text-[#6B6B6F] outline-none bg-transparent leading-relaxed py-2"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && filePreviews.length === 0)}
            className="w-10 h-10 rounded-xl bg-[#FF843D] flex items-center justify-center text-white hover:bg-[#FFA465] shrink-0 disabled:bg-[#2A2A2C] disabled:text-[#6B6B6F] transition-all"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== 主页面 ==========
export default function AssetsPage() {
  const [activeProject] = useState(MOCK_PROJECTS[0].id);
  const [dreamMode, setDreamMode] = useState(false);
  const [, setDreamLoading] = useState(false);
  const [dreamScript, setDreamScript] = useState<any>(null);
  const [selectedRandomAssets, setSelectedRandomAssets] = useState<number[]>([]);
  const [detailAsset, setDetailAsset] = useState<number | null>(null);
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const { setActiveNav, setSplitView } = useAppStore();
  const { setGeneratedScript } = useGenerateStore();
  const { setPendingScript, acceptPendingScript } = useScriptStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  const activeProjectData = projects.find((p) => p.id === activeProject);
  const filters = ['ALL', 'Video', 'Picture', 'Audio', 'Others'];

  // Find Your New Dream
  const handleFindDream = async () => {
    setDreamMode(true);
    setDreamLoading(true);
    const count = 3 + Math.floor(Math.random() * 3);
    const indices: number[] = [];
    while (indices.length < count) {
      const r = Math.floor(Math.random() * 20);
      if (!indices.includes(r)) indices.push(r);
    }
    setSelectedRandomAssets(indices);
    await new Promise((r) => setTimeout(r, 2000));

    const mockAnalysis = {
      primaryIntent: `Create from random assets`,
      genre: ['Experimental Short', 'Visual Poem', 'Abstract Narrative'][Math.floor(Math.random() * 3)],
      mood: ['Dreamlike / Surreal', 'Nostalgic', 'Mysterious'][Math.floor(Math.random() * 3)],
      visualStyle: 'Mixed textures from selected references',
      targetAudience: 'General audience',
      estimatedDuration: '30-45 seconds',
      keyThemes: ['Visual Collage', 'Chance Encounter'],
      narrativeArc: 'A serendipitous collection suggesting an unexpected story.',
      technicalNotes: `${count} random assets`,
      confidence: 0.75,
    };
    const script = await AgentService.generateScript(mockAnalysis, {
      focus: 'image', story: 'fragments', visuals: 'texture', expression: 'visual-only', technical: 'cinematic', additional: 'none',
    });
    setDreamScript(script);
    setDreamLoading(false);
  };

  const handleUseDreamScript = () => {
    if (!dreamScript) return;
    setGeneratedScript(dreamScript);
    setPendingScript(dreamScript);
    acceptPendingScript();
    setActiveNav('script');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProject ? { ...p, assetCount: p.assetCount + files.length } : p
        )
      );
    }
  };

  return (
    <div className="pb-24 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-bold text-[#FFFFFF] tracking-wide">ASSETS</h2>
          <span className="text-[#D4D4D8]">|</span>
          <span className="text-[13px] text-[#9A9A9E]">My Assets</span>
          <span className="text-[13px] text-[#6B6B6F]">Shared Assets</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSplitView(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#2A2A2C] text-[12px] text-[#9A9A9E] hover:bg-[#141415] transition-all"
            title="Open Split View with Generate"
          >
            <Columns2 size={14} /> Split
          </button>
          <button className="w-8 h-8 rounded-lg border border-[#2A2A2C] flex items-center justify-center text-[#9A9A9E]">
            <Search size={14} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all ${
              activeFilter === f ? 'bg-[#141415] text-[#FFFFFF]' : 'text-[#6B6B6F] hover:text-[#9A9A9E]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-6">
        {Array.from({ length: 20 }).map((_, i) => {
          const types = ['image', 'video', 'text', 'audio', 'tablet'] as const;
          const type = types[i % 5];
          const TypeIcon = typeIcons[type];
          const isSelected = selectedRandomAssets.includes(i);
          return (
            <div
              key={i}
              onClick={() => setDetailAsset(i)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', `asset:/assets/asset-${(i % 4) + 1}.jpg`);
                e.dataTransfer.effectAllowed = 'copy';
              }}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center group transition-all cursor-pointer relative overflow-hidden ${
                isSelected ? 'bg-[#FF843D] text-white ring-2 ring-black ring-offset-2' : ''
              }`}
            >
              <img 
                src={`/assets/asset-${(i % 4) + 1}.jpg`}
                alt={`Asset ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all ${isSelected ? 'opacity-40' : 'opacity-80 group-hover:opacity-100 group-hover:scale-105'}`}
                loading="lazy"
              />
              <div className={`absolute inset-0 ${isSelected ? 'bg-[#FF843D]/20' : 'bg-transparent group-hover:bg-black/20'} transition-all`} />
              <TypeIcon size={24} className={`relative z-10 transition-colors mb-1 ${isSelected ? 'text-white' : 'text-white/80'}`} />
              <span className={`relative z-10 text-[10px] uppercase tracking-wider ${isSelected ? 'text-white/70' : 'text-white/70'}`}>{type}</span>
              {isSelected && (
                <div className="absolute top-2 left-2 w-5 h-5 bg-[#141415] rounded-full flex items-center justify-center">
                  <Sparkles size={10} className="text-white" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); }} className="w-6 h-6 rounded-full bg-[#141415]/90 flex items-center justify-center">
                  <Heart size={10} className="text-[#6B6B6F]" />
                </button>
              </div>
            </div>
          );
        })}
        {/* Upload New */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-xl border-2 border-dashed border-[#D4D4D4] flex flex-col items-center justify-center text-[#6B6B6F] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all"
        >
          <Plus size={24} />
          <span className="text-[10px] mt-1">Upload New</span>
        </button>
      </div>

      <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,.txt,.md,.csv,.xlsx,.pdf" onChange={handleFileSelect} className="hidden" />

      {/* Dream Mode */}
      {dreamMode && selectedRandomAssets.length > 0 && (
        <div className="mb-4 p-3 bg-[#141415] rounded-xl flex items-center gap-3">
          <Sparkles size={16} className="text-[#FFFFFF]" />
          <span className="text-[13px] text-[#FFFFFF]">
            Randomly selected <strong>{selectedRandomAssets.length}</strong> assets from <strong>{activeProjectData?.name}</strong>
          </span>
          <button onClick={() => { setDreamMode(false); setDreamScript(null); setSelectedRandomAssets([]); }} className="ml-auto">
            <X size={14} className="text-[#9A9A9E]" />
          </button>
        </div>
      )}

      {dreamMode && dreamScript && (
        <div className="mb-6 bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="p-5 border-b border-[#F5F5F5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FF843D] flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#FFFFFF]">Recommended: {dreamScript.title}</h3>
                  <p className="text-[12px] text-[#9A9A9E]">{dreamScript.duration} · {dreamScript.shots.length} shots · From {selectedRandomAssets.length} assets</p>
                </div>
              </div>
              <button onClick={() => { setDreamMode(false); setDreamScript(null); }} className="w-8 h-8 rounded-full hover:bg-[#141415] flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="p-5">
            <p className="text-[13px] text-[#9A9A9E] mb-4">{dreamScript.narrativeArc}</p>
            <div className="space-y-2 mb-5">
              {dreamScript.shots.slice(0, 3).map((shot: any) => (
                <div key={shot.id} className="flex gap-3 p-3 bg-[#0A0A0B] rounded-lg">
                  <span className="text-[11px] font-medium text-[#6B6B6F] w-16 shrink-0">{shot.timeRange}</span>
                  <p className="text-[12px] text-[#FFFFFF] line-clamp-1 flex-1">{shot.visual}</p>
                  <span className="text-[10px] px-2 py-0.5 bg-[#1E1E20] rounded text-[#9A9A9E] uppercase">{shot.purpose}</span>
                </div>
              ))}
              {dreamScript.shots.length > 3 && (
                <p className="text-[11px] text-[#6B6B6F] pl-3">+ {dreamScript.shots.length - 3} more shots...</p>
              )}
            </div>
            <div className="flex gap-3 flex-wrap">
              <button onClick={handleUseDreamScript} className="flex items-center gap-2 px-5 py-2.5 bg-[#FF843D] text-white text-[13px] font-medium rounded-full hover:bg-[#FFA465]">
                Use This Script <ArrowRight size={14} />
              </button>
              <button onClick={handleFindDream} className="flex items-center gap-2 px-4 py-2.5 border border-[#2A2A2C] text-[13px] text-[#9A9A9E] rounded-full hover:bg-[#141415]">
                <Sparkles size={14} /> Try Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Detail Modal */}
      {detailAsset !== null && (
        <AssetDetailModal index={detailAsset} onClose={() => setDetailAsset(null)} />
      )}

      {/* Bottom AI Dialog */}
      <AssetAIFooter projectName={activeProjectData?.name || 'Project'} />

      {/* ══════ AI ASSET PANEL ══════ */}
      <FakeAIAssetPanel isOpen={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />

      {/* AI Panel Toggle */}
      {!aiPanelOpen && (
        <button
          onClick={() => setAiPanelOpen(true)}
          className="fixed right-4 bottom-20 md:bottom-24 z-50 w-10 h-10 rounded-full bg-[#FF843D] text-white flex items-center justify-center shadow-lg hover:bg-[#FFA465] transition-all"
          title="Asset AI"
        >
          <Sparkles size={18} />
        </button>
      )}
    </div>
  );
}
