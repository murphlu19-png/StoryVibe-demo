import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Image, Lightbulb, MessageSquare, Send, X, ChevronRight, Camera, FileText, Zap } from 'lucide-react';

/**
 * Fake AI Generate Panel — Demo Mode
 * Simulates AI co-pilot interactions for GeneratePage
 * When user sends a message, the ENTIRE interface updates (not just text output)
 */

interface FakeAIAction {
  id: string;
  type: 'script_card' | 'mood_palette' | 'shot_preview' | 'suggestion' | 'brainstorm' | 'progress';
  content: string;
  data?: any;
}

const MOOD_PALETTES = [
  { name: 'Warm Golden', colors: ['#D4A574', '#E8C9A0', '#F5E6D3', '#8B6914'], desc: 'Soft sunset tones, nostalgic warmth' },
  { name: 'Urban Cool', colors: ['#2C3E50', '#3498DB', '#95A5A6', '#ECF0F1'], desc: 'City night vibes, neon reflections' },
  { name: 'Natural Fresh', colors: ['#27AE60', '#2ECC71', '#A8E6CF', '#1E8449'], desc: 'Forest greens, morning dew' },
  { name: 'Dramatic Dark', colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560'], desc: 'Film noir, high contrast shadows' },
];

const BRAINSTORM_IDEAS = [
  { icon: '✨', title: 'Time-lapse City Journey', desc: 'From dawn to dusk, capturing city rhythm' },
  { icon: '🎬', title: 'Character Monologue Series', desc: 'Intimate close-ups with voiceover narrative' },
  { icon: '🌊', title: 'Nature vs Urban Contrast', desc: 'Split-screen parallel storytelling' },
  { icon: '🎵', title: 'Music-Driven Visual Poem', desc: 'Abstract visuals synced to audio beats' },
];

export const FakeAIGeneratePanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{id: string; role: 'user'|'assistant'; content: string; actions?: FakeAIAction[]}>>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Fake AI response based on input keywords
    setTimeout(() => {
      const text = input.toLowerCase();
      let response: any;

      if (text.includes('mood') || text.includes('color') || text.includes('tone')) {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant' as const,
          content: 'Based on your brief, here are mood palettes that could work. Click one to apply it to your script direction.',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'mood_palette', content: 'Mood Palettes', data: MOOD_PALETTES }],
        };
      } else if (text.includes('idea') || text.includes('brainstorm') || text.includes('inspire')) {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant' as const,
          content: 'Here are some creative directions inspired by your input. Let me know which one resonates!',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'brainstorm', content: 'Creative Ideas', data: BRAINSTORM_IDEAS }],
        };
      } else if (text.includes('shot') || text.includes('scene') || text.includes('preview')) {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant' as const,
          content: 'Generating shot previews based on your description...',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'shot_preview', content: 'Shot Previews', data: [
            { id: '1', visual: 'Opening wide establishing shot — golden hour city skyline', time: '0-5s', purpose: 'SET THE MOOD' },
            { id: '2', visual: 'Medium shot protagonist walking through bustling street', time: '5-10s', purpose: 'INTRODUCE' },
            { id: '3', visual: 'Close-up hands holding coffee cup, steam rising', time: '10-15s', purpose: 'BUILD' },
          ]}],
        };
      } else if (text.includes('script') || text.includes('generate') || text.includes('create')) {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant' as const,
          content: 'I\'ve crafted a script based on your brief. Here\'s a preview — you can refine it further.',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'script_card', content: 'Generated Script', data: {
            title: 'Urban Morning Ritual',
            duration: '30s',
            shots: 5,
            arc: 'A quiet morning journey through the city, finding beauty in everyday moments.',
          }}],
        };
      } else {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant' as const,
          content: 'Interesting direction! Here are some suggestions to develop it further.',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'suggestion', content: 'Suggestions', data: [
            'Add a time-lapse element for pacing variety',
            'Consider a split-screen contrast between quiet and busy scenes',
            'Use ambient city sounds as a narrative anchor',
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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2C]">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#FF843D]" />
          <span className="text-[13px] font-semibold text-[#FFFFFF]">AI Co-Pilot</span>
        </div>
        <button onClick={onClose} className="text-[#6B6B6F] hover:text-[#FFFFFF] transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="text-[12px] text-[#6B6B6F] text-center mb-4">Try asking about scripts, moods, shots, or ideas</div>
            {[
              { icon: <MessageSquare size={14} />, text: 'Generate a 5-shot intro script' },
              { icon: <Image size={14} />, text: 'What mood fits a coffee brand video?' },
              { icon: <Lightbulb size={14} />, text: 'Brainstorm ideas for city life content' },
              { icon: <Camera size={14} />, text: 'Preview shots for golden hour theme' },
            ].map((suggestion, i) => (
              <button
                key={i}
                onClick={() => { setInput(suggestion.text); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#141415] border border-[#2A2A2C] text-[12px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all text-left"
              >
                <span className="text-[#FF843D]">{suggestion.icon}</span>
                {suggestion.text}
              </button>
            ))}
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={msg.role === 'user' ? 'flex justify-end' : ''}>
            <div className={`max-w-[90%] rounded-xl px-3 py-2 text-[12px] leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#FF843D] text-white rounded-br-sm'
                : 'bg-[#141415] border border-[#2A2A2C] text-[#D4D4D8]'
            }`}>
              {msg.content}
            </div>

            {/* A2UI Actions — these change the interface, not just text */}
            {msg.actions?.map(action => (
              <div key={action.id} className="mt-2">
                {action.type === 'mood_palette' && (
                  <div className="space-y-2">
                    {action.data.map((palette: any, i: number) => (
                      <button key={i} className="w-full text-left p-3 rounded-lg bg-[#141415] border border-[#2A2A2C] hover:border-[#FF843D] transition-all group">
                        <div className="flex gap-1 mb-2">
                          {palette.colors.map((c: string, j: number) => (
                            <div key={j} className="w-6 h-6 rounded-sm" style={{ background: c }} />
                          ))}
                        </div>
                        <div className="text-[12px] font-medium text-[#FFFFFF]">{palette.name}</div>
                        <div className="text-[11px] text-[#6B6B6F]">{palette.desc}</div>
                      </button>
                    ))}
                  </div>
                )}

                {action.type === 'brainstorm' && (
                  <div className="space-y-2">
                    {action.data.map((idea: any, i: number) => (
                      <button key={i} className="w-full text-left p-3 rounded-lg bg-[#141415] border border-[#2A2A2C] hover:border-[#FF843D] hover:bg-[rgba(255,132,61,0.05)] transition-all">
                        <div className="text-[14px] mb-1">{idea.icon} <span className="font-medium text-[#FFFFFF]">{idea.title}</span></div>
                        <div className="text-[11px] text-[#6B6B6F]">{idea.desc}</div>
                        <ChevronRight size={12} className="text-[#6B6B6F] mt-2" />
                      </button>
                    ))}
                  </div>
                )}

                {action.type === 'shot_preview' && (
                  <div className="space-y-2">
                    {action.data.map((shot: any) => (
                      <div key={shot.id} className="p-3 rounded-lg bg-[#141415] border border-[#2A2A2C]">
                        <div className="flex items-center gap-2 mb-1">
                          <Camera size={12} className="text-[#FF843D]" />
                          <span className="text-[11px] font-medium text-[#FFFFFF]">Shot {shot.id}</span>
                          <span className="text-[10px] text-[#6B6B6F] ml-auto">{shot.time}</span>
                        </div>
                        <div className="text-[11px] text-[#9A9A9E]">{shot.visual}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#FF843D]/10 text-[#FF843D] text-[10px] rounded">{shot.purpose}</span>
                      </div>
                    ))}
                  </div>
                )}

                {action.type === 'script_card' && (
                  <div className="p-3 rounded-lg bg-[#141415] border border-[#2A2A2C] hover:border-[#FF843D] transition-all cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={14} className="text-[#FF843D]" />
                      <span className="text-[13px] font-semibold text-[#FFFFFF]">{action.data.title}</span>
                    </div>
                    <div className="flex gap-3 text-[11px] text-[#6B6B6F] mb-2">
                      <span>{action.data.shots} shots</span>
                      <span>{action.data.duration}</span>
                    </div>
                    <p className="text-[11px] text-[#9A9A9E] italic">{action.data.arc}</p>
                    <button className="mt-2 w-full py-1.5 bg-[#FF843D] text-white text-[11px] font-medium rounded-lg hover:bg-[#FFA465] transition-colors">
                      Open in Script Editor
                    </button>
                  </div>
                )}

                {action.type === 'suggestion' && (
                  <div className="space-y-1.5">
                    {action.data.map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#141415]/50">
                        <Zap size={12} className="text-[#FF843D] mt-0.5 shrink-0" />
                        <span className="text-[11px] text-[#9A9A9E]">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-[#6B6B6F]">
            <div className="w-4 h-4 border-2 border-[#FF843D] border-t-transparent rounded-full animate-spin" />
            <span className="text-[11px]">Thinking...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#2A2A2C]">
        <div className="flex items-center gap-2 bg-[#141415] border border-[#2A2A2C] rounded-xl px-3 py-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI about your script..."
            className="flex-1 bg-transparent text-[12px] text-[#D4D4D8] placeholder:text-[#6B6B6F] outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="w-7 h-7 rounded-full bg-[#FF843D] flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            <Send size={12} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FakeAIGeneratePanel;
