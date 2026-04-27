import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  BadgeCheck, Sparkles, Film, Aperture, Gauge, Users, Clock, Image, AlertTriangle
} from 'lucide-react';

interface AIAnalysisCardProps {
  analysis: {
    genre: string;
    mood: string;
    visualStyle: string;
    keyThemes: string[];
    targetAudience: string;
    estimatedDuration: string;
    confidence: number;
  };
  inputState: string;
  userAssets?: { id: string; url: string; type: string; name: string }[];
}

export function AIAnalysisCard({ analysis, inputState, userAssets }: AIAnalysisCardProps) {
  const stateColors: Record<string, string> = {
    'vague': 'bg-[rgba(245,158,11,0.15)] text-[#FF843D] border-amber-200',
    'semi-clear': 'bg-blue-50 text-blue-700 border-blue-200',
    'clear': 'bg-[rgba(34,197,94,0.15)] text-[#22C55E] border-green-200',
    'asset-driven': 'bg-purple-50 text-purple-700 border-purple-200',
    'reference-driven': 'bg-pink-50 text-pink-700 border-pink-200',
  };

  const stateLabels: Record<string, string> = {
    'vague': '模糊需求 · 需引导澄清',
    'semi-clear': '方向初定 · 进一步细化',
    'clear': '需求明确 · 快速确认',
    'asset-driven': '素材驱动 · 围绕素材构建',
    'reference-driven': '参考驱动 · 参考改编',
  };

  return (
    <div className="bg-[#141415] rounded-2xl border border-[#2A2A2C] overflow-hidden shadow-sm mb-4">
      {/* Header with state badge */}
      <div className="px-5 py-4 border-b border-[#F5F5F5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#FFFFFF]" />
          <span className="text-[14px] font-semibold text-[#FFFFFF]">AI 意图分析</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-[11px] font-medium border ${stateColors[inputState] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
          {stateLabels[inputState] || inputState}
        </span>
      </div>

      {/* Radar Tags */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-[#0A0A0B] rounded-xl">
            <div className="flex items-center gap-1.5 mb-1">
              <Film size={12} className="text-[#6B6B6F]" />
              <span className="text-[10px] uppercase tracking-wider text-[#6B6B6F] font-medium">Genre</span>
            </div>
            <p className="text-[13px] font-semibold text-[#FFFFFF]">{analysis.genre}</p>
          </div>
          <div className="p-3 bg-[#0A0A0B] rounded-xl">
            <div className="flex items-center gap-1.5 mb-1">
              <Gauge size={12} className="text-[#6B6B6F]" />
              <span className="text-[10px] uppercase tracking-wider text-[#6B6B6F] font-medium">Mood</span>
            </div>
            <p className="text-[13px] font-semibold text-[#FFFFFF]">{analysis.mood}</p>
          </div>
          <div className="p-3 bg-[#0A0A0B] rounded-xl">
            <div className="flex items-center gap-1.5 mb-1">
              <Aperture size={12} className="text-[#6B6B6F]" />
              <span className="text-[10px] uppercase tracking-wider text-[#6B6B6F] font-medium">Visual</span>
            </div>
            <p className="text-[13px] font-semibold text-[#FFFFFF]">{analysis.visualStyle}</p>
          </div>
          <div className="p-3 bg-[#0A0A0B] rounded-xl">
            <div className="flex items-center gap-1.5 mb-1">
              <Users size={12} className="text-[#6B6B6F]" />
              <span className="text-[10px] uppercase tracking-wider text-[#6B6B6F] font-medium">Audience</span>
            </div>
            <p className="text-[13px] font-semibold text-[#FFFFFF]">{analysis.targetAudience}</p>
          </div>
        </div>

        {/* Themes */}
        <div className="mb-3">
          <span className="text-[10px] uppercase tracking-wider text-[#6B6B6F] font-medium mb-2 block">Key Themes</span>
          <div className="flex gap-1.5 flex-wrap">
            {analysis.keyThemes.map((theme, i) => (
              <span key={i} className="px-2.5 py-1 bg-[#FF843D] text-white rounded-full text-[11px] font-medium">
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Duration + Confidence */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F5F5F5]">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#6B6B6F]" />
            <span className="text-[12px] text-[#9A9A9E]">Est. {analysis.estimatedDuration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BadgeCheck size={12} className={analysis.confidence > 0.7 ? 'text-green-500' : analysis.confidence > 0.4 ? 'text-amber-500' : 'text-red-400'} />
            <span className={`text-[12px] font-medium ${analysis.confidence > 0.7 ? 'text-[#22C55E]' : analysis.confidence > 0.4 ? 'text-[#FF843D]' : 'text-[#EF4444]'}`}>
              {Math.round(analysis.confidence * 100)}% Confidence
            </span>
          </div>
        </div>

        {/* P1-18: 不确定性表达 — 低置信度时显示 */}
        {analysis.confidence < 0.6 && (
          <div className="mt-3 p-2.5 bg-[rgba(245,158,11,0.15)] border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle size={12} className="text-[#FF843D] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#FF843D] leading-relaxed">
                I'm not fully confident about your intent yet. The more questions you answer, the more precise your script will be. Feel free to clarify or adjust anytime.
              </p>
            </div>
          </div>
        )}

        {/* User Uploaded Assets */}
        {userAssets && userAssets.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#F5F5F5]">
            <div className="flex items-center gap-1.5 mb-2">
              <Image size={12} className="text-[#6B6B6F]" />
              <span className="text-[10px] uppercase tracking-wider text-[#6B6B6F] font-medium">Your Materials ({userAssets.length})</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {userAssets.map((asset) => (
                <div key={asset.id} className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-[#141415] border border-[#2A2A2C]">
                  {asset.type === 'image' && asset.url ? (
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film size={16} className="text-[#3A3A3C]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MarkdownMessageProps {
  content: string;
  role: 'user' | 'ai';
}

export function MarkdownMessage({ content, role }: MarkdownMessageProps) {
  return (
    <div className={`max-w-[90%] ${role === 'user' ? 'ml-auto' : ''}`}>
      <div className={`rounded-2xl px-4 py-3 ${
        role === 'user' 
          ? 'bg-[#FF843D] text-white rounded-tr-md' 
          : 'bg-[#141415] text-[#FFFFFF] rounded-tl-md'
      }`}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="text-[15px] font-bold mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-[14px] font-semibold mb-1.5 mt-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-[13px] font-medium mb-1 mt-2">{children}</h3>,
            p: ({ children }) => <p className="text-[13px] leading-relaxed mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="text-[13px] list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
            ol: ({ children }) => <ol className="text-[13px] list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            strong: ({ children }) => <strong className={`font-semibold ${role === 'user' ? 'text-white' : 'text-[#FFFFFF]'}`}>{children}</strong>,
            em: ({ children }) => <em className="italic opacity-80">{children}</em>,
            blockquote: ({ children }) => (
              <blockquote className={`border-l-2 pl-3 my-2 italic ${role === 'user' ? 'border-white/30' : 'border-[#D4D4D4]'}`}>
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className={`px-1 py-0.5 rounded text-[11px] font-mono ${role === 'user' ? 'bg-[#141415]/20' : 'bg-[#2A2A2C]'}`}>
                {children}
              </code>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
