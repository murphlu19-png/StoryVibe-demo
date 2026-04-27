import React, { useState, useRef, useEffect } from 'react';
import { FileText, Edit3, Image, ArrowUpDown, Send, X, Lightbulb, Type, Zap, Check } from 'lucide-react';

/**
 * Fake AI Script Panel — Demo Mode
 * Simulates AI script editing: global edits, shot-level edits, image generation, reordering
 */

const DEMO_SCRIPT = {
  title: 'Urban Morning Ritual',
  shots: [
    { id: 's1', time: '0-5s', visual: 'Wide city skyline at dawn, golden light', copy: 'The city wakes before you do.', purpose: 'ESTABLISH', camera: 'Static wide' },
    { id: 's2', time: '5-10s', visual: 'Medium shot: person walking through quiet street', copy: 'Every corner holds a story.', purpose: 'BUILD', camera: 'Tracking' },
    { id: 's3', time: '10-15s', visual: 'Close-up hands holding coffee cup', copy: 'This moment is yours.', purpose: 'CLIMAX', camera: 'Slow push-in' },
    { id: 's4', time: '15-20s', visual: 'Overhead: steam rising from cup, city below', copy: 'Find stillness in the chaos.', purpose: 'RESOLVE', camera: 'Crane up' },
  ],
};

export const FakeAIScriptPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<any>>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [script, setScript] = useState(DEMO_SCRIPT);
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

      if (text.includes('reorder') || text.includes('rearrange') || text.includes('move') || text.includes('switch')) {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant',
          content: 'I\'ve analyzed the pacing and suggest this reorder for better narrative flow:',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'reorder_suggestion', data: {
            current: ['s1', 's2', 's3', 's4'],
            proposed: ['s1', 's3', 's2', 's4'],
            reason: 'Moving the close-up (shot 3) earlier creates intimacy before the wide walking shot, improving emotional arc.',
          }}],
        };
      } else if (text.includes('image') || text.includes('picture') || text.includes('preview') || text.includes('generate')) {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant',
          content: 'Generating visual previews for your shots...',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'generated_images', data: [
            { shotId: 's1', status: 'done', desc: 'Golden hour city skyline — warm tones, cinematic grading' },
            { shotId: 's2', status: 'done', desc: 'Quiet street with morning mist, tracking shot perspective' },
            { shotId: 's3', status: 'done', desc: 'Coffee cup close-up, steam detail, shallow depth of field' },
            { shotId: 's4', status: 'generating', desc: 'Overhead crane shot — composing...' },
          ]}],
        };
      } else if (text.includes('tone') || text.includes('style') || text.includes('mood') || text.includes('rewrite')) {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant',
          content: 'Here\'s the script rewritten with a more poetic, introspective tone:',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'rewrite_diff', data: {
            scope: 'global',
            changes: [
              { shot: 's1', before: 'The city wakes before you do.', after: 'While the world still slumbers, steel and glass begin to breathe.' },
              { shot: 's2', before: 'Every corner holds a story.', after: 'Footsteps echo against walls that have witnessed a thousand dawns.' },
              { shot: 's3', before: 'This moment is yours.', after: 'In the curl of steam, time suspends — this warmth, yours alone.' },
            ],
          }}],
        };
      } else if (text.includes('edit') || text.includes('change') || text.includes('fix') || text.includes('shot')) {
        // Shot-level edit
        const shotMatch = text.match(/shot\s*(\d)/i);
        const shotNum = shotMatch ? shotMatch[1] : '2';
        const shot = script.shots[parseInt(shotNum) - 1];
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant',
          content: `Editing **Shot ${shotNum}** — what would you like to change?`,
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'shot_editor', data: {
            shot,
            options: ['Visual description', 'Copy/narration', 'Camera movement', 'Purpose tag', 'Timing'],
          }}],
        };
      } else if (text.includes('suggest') || text.includes('improve') || text.includes('better')) {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant',
          content: 'After analyzing your script, here are my suggestions:',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'smart_suggestions', data: [
            { type: 'pacing', issue: 'Gap between shot 2 and 3 feels abrupt', fix: 'Add a 2-second transition shot of street details' },
            { type: 'copy', issue: 'Shot 4 narration is passive', fix: 'Change to imperative: "Rise above the noise"' },
            { type: 'visual', issue: 'No B-roll variety in middle section', fix: 'Consider inserting a detail shot (hands, feet, objects)' },
            { type: 'asset', issue: '2 portrait assets unused', fix: 'Could enhance shot 2 with character close-up' },
          ]}],
        };
      } else {
        response = {
          id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant',
          content: 'I can help you edit this script. Try asking me to:',
          actions: [{ id: "msg-" + Math.random().toString(36).substring(2, 10), type: 'help_menu', data: [
            { icon: <Edit3 size={12} />, text: 'Rewrite in a different tone', example: 'Make it more dramatic' },
            { icon: <ArrowUpDown size={12} />, text: 'Reorder shots', example: 'Move shot 3 before shot 1' },
            { icon: <Image size={12} />, text: 'Generate preview images', example: 'Create images for all shots' },
            { icon: <Type size={12} />, text: 'Edit specific shot', example: 'Change shot 2 copy' },
            { icon: <Zap size={12} />, text: 'Get improvement suggestions', example: 'How can I improve this?' },
          ]}],
        };
      }

      setMessages(prev => [...prev, response]);
      setIsThinking(false);
    }, 1200);
  };

  const applyEdit = (edit: any) => {
    if (edit.scope === 'global') {
      const newShots = script.shots.map(s => {
        const change = edit.changes.find((c: any) => c.shot === s.id);
        return change ? { ...s, copy: change.after } : s;
      });
      setScript({ ...script, shots: newShots });
    }
    setMessages(prev => [...prev, { id: "msg-" + Math.random().toString(36).substring(2, 10), role: 'assistant', content: '✅ Changes applied successfully.' }]);
  };

  if (!isOpen) return null;

  return (
    <div className="w-full md:w-[360px] border-l border-[#2A2A2C] bg-[#0A0A0B] flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2C]">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#FF843D]" />
          <span className="text-[13px] font-semibold text-[#FFFFFF]">Script Editor AI</span>
        </div>
        <button onClick={onClose} className="text-[#6B6B6F] hover:text-[#FFFFFF] transition-colors"><X size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="text-[12px] text-[#6B6B6F] text-center mb-4">Edit your script with AI — global, chapter, or shot-level</div>
            {[
              { icon: <Edit3 size={14} />, text: 'Make the tone more poetic and introspective' },
              { icon: <ArrowUpDown size={14} />, text: 'Reorder shots for better pacing' },
              { icon: <Image size={14} />, text: 'Generate preview images for all shots' },
              { icon: <Type size={14} />, text: 'Edit shot 2 copy and camera direction' },
              { icon: <Zap size={14} />, text: 'Suggest improvements for this script' },
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
                {action.type === 'reorder_suggestion' && (
                  <div className="p-3 rounded-lg bg-[#141415] border border-[#2A2A2C]">
                    <div className="flex items-center gap-2 mb-2">
                      {action.data.current.map((id: string, i: number) => (
                        <React.Fragment key={id}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-medium ${
                            action.data.proposed[i] === id ? 'bg-[#2A2A2C] text-[#FFFFFF]' : 'bg-[#FF843D]/20 text-[#FF843D]'
                          }`}>{id.replace('s', '')}</div>
                          {i < action.data.current.length - 1 && <ArrowUpDown size={12} className="text-[#6B6B6F]" />}
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#9A9A9E] mb-2">{action.data.reason}</p>
                    <button onClick={() => applyEdit(action.data)} className="text-[11px] bg-[#FF843D] text-white px-4 py-1.5 rounded-lg hover:bg-[#FFA465] transition-colors">Apply Reorder</button>
                  </div>
                )}

                {action.type === 'generated_images' && (
                  <div className="space-y-2">
                    {action.data.map((img: any) => (
                      <div key={img.shotId} className="p-2.5 rounded-lg bg-[#141415] border border-[#2A2A2C] flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${img.status === 'done' ? 'bg-[#22C55E]/10' : 'bg-[#FF843D]/10'}`}>
                          {img.status === 'done' ? <Check size={16} className="text-[#22C55E]" /> : <div className="w-4 h-4 border-2 border-[#FF843D] border-t-transparent rounded-full animate-spin" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-[11px] font-medium text-[#FFFFFF]">Shot {img.shotId.replace('s', '')}</div>
                          <div className="text-[10px] text-[#6B6B6F]">{img.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {action.type === 'rewrite_diff' && (
                  <div className="p-3 rounded-lg bg-[#141415] border border-[#2A2A2C]">
                    <div className="text-[10px] uppercase text-[#6B6B6F] tracking-wider mb-2">Changes ({action.data.scope})</div>
                    {action.data.changes.map((change: any, i: number) => (
                      <div key={i} className="mb-2 pb-2 border-b border-[#2A2A2C] last:border-0">
                        <div className="text-[10px] text-[#6B6B6F]">Shot {change.shot.replace('s', '')}</div>
                        <div className="text-[11px] text-[#6B6B6F] line-through">{change.before}</div>
                        <div className="text-[11px] text-[#22C55E]">{change.after}</div>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => applyEdit(action.data)} className="text-[11px] bg-[#FF843D] text-white px-4 py-1.5 rounded-lg hover:bg-[#FFA465] transition-colors">Apply</button>
                      <button onClick={() => {}} className="text-[11px] text-[#6B6B6F] hover:text-[#FFFFFF] transition-colors">Discard</button>
                    </div>
                  </div>
                )}

                {action.type === 'shot_editor' && (
                  <div className="p-3 rounded-lg bg-[#141415] border border-[#2A2A2C]">
                    <div className="text-[11px] text-[#9A9A9E] mb-2 italic">"{action.data.shot.visual}"</div>
                    <div className="space-y-1.5">
                      {action.data.options.map((opt: string, i: number) => (
                        <button key={i} className="w-full text-left px-3 py-2 rounded-lg bg-[#0A0A0B] border border-[#2A2A2C] text-[11px] text-[#D4D4D8] hover:border-[#FF843D] transition-all">
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {action.type === 'smart_suggestions' && (
                  <div className="space-y-2">
                    {action.data.map((s: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-[#141415] border border-[#2A2A2C]">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb size={12} className="text-[#FF843D]" />
                          <span className="text-[11px] font-medium text-[#FFFFFF] capitalize">{s.type}</span>
                        </div>
                        <div className="text-[10px] text-[#6B6B6F] mb-1">Issue: {s.issue}</div>
                        <div className="text-[11px] text-[#22C55E]">Fix: {s.fix}</div>
                        <button className="mt-2 text-[10px] text-[#FF843D] hover:underline">Apply fix</button>
                      </div>
                    ))}
                  </div>
                )}

                {action.type === 'help_menu' && action.data.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] py-1">
                    <span className="text-[#FF843D] mt-0.5">{item.icon}</span>
                    <div>
                      <span className="text-[#D4D4D8]">{item.text}</span>
                      <span className="text-[#6B6B6F] ml-2">{item.example}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        {isThinking && <div className="flex items-center gap-2 text-[#6B6B6F]"><div className="w-4 h-4 border-2 border-[#FF843D] border-t-transparent rounded-full animate-spin" /><span className="text-[11px]">Analyzing script...</span></div>}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-[#2A2A2C]">
        <div className="flex items-center gap-2 bg-[#141415] border border-[#2A2A2C] rounded-xl px-3 py-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Edit your script..." className="flex-1 bg-transparent text-[12px] text-[#D4D4D8] placeholder:text-[#6B6B6F] outline-none" />
          <button onClick={handleSend} disabled={!input.trim() || isThinking} className="w-7 h-7 rounded-full bg-[#FF843D] flex items-center justify-center disabled:opacity-30 transition-opacity">
            <Send size={12} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FakeAIScriptPanel;
