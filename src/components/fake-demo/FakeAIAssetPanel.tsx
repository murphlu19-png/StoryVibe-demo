import React, { useState, useRef, useEffect } from 'react';
import { Image, Search, FolderPlus, Wand2, Sparkles, Send, X, Eye } from 'lucide-react';

/**
 * Fake AI Asset Panel — Demo Mode
 * Simulates AI asset management: search, organize, describe, generate ideas
 */

const FAKE_ASSETS = [
  { id: 'a1', name: 'Tokyo Street Night.jpg', type: 'image', size: '2.4 MB', tags: ['urban', 'night', 'neon', 'city'] },
  { id: 'a2', name: 'Coffee Pour Slow.mp4', type: 'video', size: '15.8 MB', tags: ['coffee', 'warm', 'slow-motion', 'food'] },
  { id: 'a3', name: 'Golden Hour Beach.jpg', type: 'image', size: '3.1 MB', tags: ['nature', 'sunset', 'warm', 'beach'] },
  { id: 'a4', name: 'Portrait Close-up.jpg', type: 'image', size: '1.8 MB', tags: ['portrait', 'people', 'intimate', 'face'] },
  { id: 'a5', name: 'Rainy Window.mp4', type: 'video', size: '8.2 MB', tags: ['moody', 'rain', 'indoor', 'atmospheric'] },
  { id: 'a6', name: 'City Skyline Dawn.jpg', type: 'image', size: '4.5 MB', tags: ['urban', 'dawn', 'skyline', 'city'] },
];

export const FakeAIAssetPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<any>>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'user', content: input }]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const text = input.toLowerCase();
      let response: any;

      if (text.includes('search') || text.includes('find') || text.includes('show')) {
        // Extract keywords
        const keywords = text.split(' ').filter(w => !['search', 'find', 'show', 'for', 'me', 'the', 'a', 'with'].includes(w));
        const matched = FAKE_ASSETS.filter(a => keywords.some(k => a.tags.some(t => t.includes(k)) || a.name.toLowerCase().includes(k)));
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant',
          content: matched.length > 0 ? `Found ${matched.length} assets matching your search:` : 'No exact matches, but here are similar assets:',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'search_results', data: matched.length > 0 ? matched : FAKE_ASSETS.slice(0, 3) }],
        };
      } else if (text.includes('organize') || text.includes('sort') || text.includes('folder')) {
        const categories = [
          { name: 'Urban Scenes', assets: FAKE_ASSETS.filter(a => a.tags.includes('urban')), icon: '🏙️' },
          { name: 'Warm Tones', assets: FAKE_ASSETS.filter(a => a.tags.includes('warm')), icon: '🌅' },
          { name: 'Mood & Atmosphere', assets: FAKE_ASSETS.filter(a => a.tags.includes('moody') || a.tags.includes('atmospheric')), icon: '🌧️' },
        ];
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant',
          content: 'I\'ve analyzed your assets and suggest organizing them into these smart folders:',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'organized_folders', data: categories }],
        };
      } else if (text.includes('describe') || text.includes('what') || text.includes('analyze')) {
        const asset = FAKE_ASSETS[0];
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant',
          content: `Here's a detailed analysis of **${asset.name}**:`,
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'description', data: {
            subject: 'Urban nightscape with neon signage and wet pavement reflections',
            style: 'Cinematic, high contrast, cool color grading with warm accent highlights',
            lighting: 'Mixed artificial light (neon + street lamps), low-key lighting',
            composition: 'Leading lines from street perspective, rule of thirds with signage',
            mood: 'Nostalgic, slightly melancholic, energetic undercurrent',
            colors: ['#1A1A2E', '#FF6B6B', '#4ECDC4', '#FFE66D'],
            suggestedPrompt: 'Cinematic night street photography, neon signs reflecting on wet pavement, Tokyo aesthetic, shot on Sony A7III with 35mm f/1.4, moody atmosphere, high contrast',
          }}],
        };
      } else if (text.includes('idea') || text.includes('dream') || text.includes('inspire') || text.includes('random')) {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant',
          content: '✨ **Find Your New Dreams** — Here are creative combinations from your library:',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'dream_ideas', data: [
            { title: 'Neon Noir Coffee Shop', combo: 'Tokyo Street Night + Coffee Pour', desc: 'A cyberpunk-inspired coffee ritual — steam meets neon glow' },
            { title: 'Golden Hour Commuter', combo: 'Golden Hour Beach + City Skyline Dawn', desc: 'Parallel narratives of morning routines across city and shore' },
            { title: 'Rainy Portrait Session', combo: 'Portrait Close-up + Rainy Window', desc: 'Intimate indoor portraits with rain as emotional backdrop' },
          ]}],
        };
      } else if (text.includes('prompt') || text.includes('generate') || text.includes('write')) {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant',
          content: 'I\'ve analyzed the visual elements and generated a prompt you can use with Jimeng or Runway:',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'generated_prompt', data: {
            prompt: 'Cinematic wide-angle establishing shot, urban alleyway at blue hour, warm lantern light contrasting cool shadows, wet cobblestone reflections, shot on Arri Alexa with anamorphic lens, film grain, moody atmospheric perspective, shallow depth of field',
            negativePrompt: 'blurry, low quality, oversaturated, cartoon, anime',
            settings: { aspectRatio: '16:9', style: 'Cinematic', duration: '5s' },
          }}],
        };
      } else {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant',
          content: 'I can help you search, organize, describe, or generate prompts for your assets. What would you like to do?',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'help_menu', data: [
            { cmd: 'Search assets', example: '"Show me warm-toned outdoor shots"' },
            { cmd: 'Organize album', example: '"Organize my assets by color"' },
            { cmd: 'Describe content', example: '"Analyze the Tokyo street photo"' },
            { cmd: 'Generate prompt', example: '"Write a prompt for Image 1"' },
            { cmd: 'Find new ideas', example: '"Surprise me with creative combos"' },
          ]}],
        };
      }

      setMessages(prev => [...prev, response]);
      setIsThinking(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 w-full md:w-[340px] md:relative md:inset-auto border-l border-[#2A2A2C] bg-[#0A0A0B] flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2C]">
        <div className="flex items-center gap-2">
          <Image size={16} className="text-[#FF843D]" />
          <span className="text-[13px] font-semibold text-[#FFFFFF]">Asset AI</span>
        </div>
        <button onClick={onClose} className="text-[#6B6B6F] hover:text-[#FFFFFF] transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="text-[12px] text-[#6B6B6F] text-center mb-4">Search, organize, describe, or create from assets</div>
            {[
              { icon: <Search size={14} />, text: 'Search warm-toned outdoor shots' },
              { icon: <FolderPlus size={14} />, text: 'Organize assets by color theme' },
              { icon: <Eye size={14} />, text: 'Describe the Tokyo street photo' },
              { icon: <Wand2 size={14} />, text: 'Generate a prompt for Image 1' },
              { icon: <Sparkles size={14} />, text: 'Surprise me with creative combos' },
            ].map((s, i) => (
              <button key={i} onClick={() => setInput(s.text)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#141415] border border-[#2A2A2C] text-[12px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all text-left">
                <span className="text-[#FF843D]">{s.icon}</span> {s.text}
              </button>
            ))}
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id}>
            <div className={`max-w-[90%] rounded-xl px-3 py-2 text-[12px] mb-2 ${
              msg.role === 'user' ? 'bg-[#FF843D] text-white ml-auto rounded-br-sm' : 'bg-[#141415] border border-[#2A2A2C] text-[#D4D4D8]'
            }`}>{msg.content}</div>

            {msg.actions?.map((action: any) => (
              <div key={action.id} className="space-y-2">
                {action.type === 'search_results' && action.data.map((asset: any) => (
                  <div key={asset.id} className="p-2.5 rounded-lg bg-[#141415] border border-[#2A2A2C] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1E1E20] flex items-center justify-center text-[#6B6B6F]">
                      {asset.type === 'video' ? <Image size={16} /> : <Image size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-[#FFFFFF] truncate">{asset.name}</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {asset.tags.map((t: string) => <span key={t} className="px-1.5 py-0.5 bg-[#2A2A2C] text-[#9A9A9E] text-[9px] rounded">{t}</span>)}
                      </div>
                    </div>
                    <span className="text-[10px] text-[#6B6B6F]">{asset.size}</span>
                  </div>
                ))}

                {action.type === 'organized_folders' && action.data.map((folder: any, i: number) => (
                  <button key={i} className="w-full text-left p-3 rounded-lg bg-[#141415] border border-[#2A2A2C] hover:border-[#FF843D] transition-all">
                    <div className="text-[13px] font-medium text-[#FFFFFF]">{folder.icon} {folder.name}</div>
                    <div className="text-[11px] text-[#6B6B6F] mt-1">{folder.assets.length} assets</div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {folder.assets.slice(0, 3).map((a: any) => <span key={a.id} className="text-[9px] px-1.5 py-0.5 bg-[#2A2A2C] text-[#9A9A9E] rounded">{a.name.split('.')[0]}</span>)}
                    </div>
                    <button className="mt-2 text-[11px] text-[#FF843D] hover:underline">Create folder</button>
                  </button>
                ))}

                {action.type === 'description' && (
                  <div className="p-3 rounded-lg bg-[#141415] border border-[#2A2A2C] space-y-2">
                    {Object.entries(action.data).filter(([k]) => k !== 'colors' && k !== 'suggestedPrompt').map(([key, val]) => (
                      <div key={key}><span className="text-[10px] uppercase text-[#6B6B6F] tracking-wider">{key}</span><p className="text-[11px] text-[#D4D4D8]">{val as string}</p></div>
                    ))}
                    <div className="flex gap-1">
                      {action.data.colors.map((c: string) => <div key={c} className="w-5 h-5 rounded-sm" style={{ background: c }} />)}
                    </div>
                    <div className="p-2 bg-[#0A0A0B] rounded border border-[#2A2A2C]">
                      <span className="text-[10px] text-[#6B6B6F]">Suggested prompt:</span>
                      <p className="text-[11px] text-[#9A9A9E] mt-1 italic">{action.data.suggestedPrompt}</p>
                    </div>
                  </div>
                )}

                {action.type === 'dream_ideas' && action.data.map((idea: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-[#141415] border border-[#2A2A2C] hover:border-[#FF843D] transition-all cursor-pointer">
                    <div className="text-[13px] font-medium text-[#FFFFFF]">{idea.title}</div>
                    <div className="text-[10px] text-[#FF843D] mt-1">{idea.combo}</div>
                    <div className="text-[11px] text-[#9A9A9E] mt-1">{idea.desc}</div>
                    <button className="mt-2 text-[11px] bg-[#FF843D] text-white px-3 py-1 rounded-full hover:bg-[#FFA465] transition-colors">Try this combo</button>
                  </div>
                ))}

                {action.type === 'generated_prompt' && (
                  <div className="p-3 rounded-lg bg-[#141415] border border-[#2A2A2C]">
                    <div className="p-2 bg-[#0A0A0B] rounded border border-[#2A2A2C] mb-2">
                      <p className="text-[11px] text-[#D4D4D8] leading-relaxed">{action.data.prompt}</p>
                    </div>
                    <div className="flex gap-2 text-[10px] text-[#6B6B6F]">
                      <span>{action.data.settings.aspectRatio}</span>
                      <span>{action.data.settings.style}</span>
                      <span>{action.data.settings.duration}</span>
                    </div>
                    <button className="mt-2 text-[11px] text-[#FF843D] hover:underline">Copy to Generate</button>
                  </div>
                )}

                {action.type === 'help_menu' && action.data.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]">
                    <span className="text-[#FF843D] font-medium shrink-0">{item.cmd}</span>
                    <span className="text-[#6B6B6F]">{item.example}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        {isThinking && <div className="flex items-center gap-2 text-[#6B6B6F]"><div className="w-4 h-4 border-2 border-[#FF843D] border-t-transparent rounded-full animate-spin" /><span className="text-[11px]">Analyzing assets...</span></div>}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-[#2A2A2C]">
        <div className="flex items-center gap-2 bg-[#141415] border border-[#2A2A2C] rounded-xl px-3 py-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask about your assets..." className="flex-1 bg-transparent text-[12px] text-[#D4D4D8] placeholder:text-[#6B6B6F] outline-none" />
          <button onClick={handleSend} disabled={!input.trim() || isThinking} className="w-7 h-7 rounded-full bg-[#FF843D] flex items-center justify-center disabled:opacity-30 transition-opacity">
            <Send size={12} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FakeAIAssetPanel;
