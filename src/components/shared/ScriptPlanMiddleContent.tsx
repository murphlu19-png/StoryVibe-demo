import { useMemo, useState, type ReactNode } from 'react';
import { Film, LayoutTemplate, TrendingUp } from 'lucide-react';

export type ScriptPlanMiddleView = 'summary' | 'structure' | 'video';

export type ScriptPlanSummaryCard = {
  key: string;
  title: string;
  summary: string;
  fullText: string;
};

type ScriptPlanMiddleRow = {
  time: string;
  purpose: string;
  scene: string;
};

function getPurposeLabel(purpose: string, index: number) {
  const fallbackLabels = ['Opening', 'Setup', 'Shift', 'Build', 'Peak', 'Resolve'];
  const normalized = purpose
    .split(/,|·/)
    .map((item) => item.trim())
    .filter(Boolean)[0];

  return normalized || fallbackLabels[index] || `Beat ${index + 1}`;
}

function getEmotionLevel(row: ScriptPlanMiddleRow, index: number, total: number) {
  const purpose = `${row.purpose} ${row.scene}`.toLowerCase();
  const progress = total <= 1 ? 0.6 : index / (total - 1);

  if (/black|cut|resolve|fade|release/.test(purpose)) return 0.42;
  if (/peak|anomaly|escalat|climax|reveal|shock/.test(purpose)) return 0.92;
  if (/build|drift|confusion|shift|tension|uncertain/.test(purpose)) return 0.72;
  if (/establish|opening|setup|intro|calm/.test(purpose)) return 0.36;

  return 0.34 + progress * 0.5;
}

function SummaryCard({
  title,
  summary,
  fullText,
}: {
  title: string;
  summary: string;
  fullText: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const isOpen = isHovered || isPinned;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !isPinned && setIsHovered(false)}
    >
      <button
        type="button"
        onClick={() => {
          setIsPinned((prev) => !prev);
          setIsHovered(true);
        }}
        className="flex min-h-[64px] w-full flex-col rounded-[14px] border border-[rgba(255,255,255,0.04)] bg-[rgba(12,12,13,0.42)] px-3.5 py-2.5 text-left transition-all duration-200 ease-out hover:border-[rgba(255,132,61,0.18)] hover:bg-[#101012]"
      >
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">{title}</div>
        <p className="line-clamp-2 text-[12px] leading-[1.55] text-[#F3F3F5]">{summary}</p>
      </button>

      <div
        className={`absolute left-0 top-[calc(100%+8px)] z-40 w-[320px] max-w-[calc(100vw-48px)] rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(16,16,17,0.92)] p-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-xl transition-all duration-200 ease-out ${
          isOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'
        }`}
      >
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#FFFFFF]">{title}</div>
        <div className="text-[12px] leading-[1.65] text-[#D9D9DE]">{fullText}</div>
      </div>
    </div>
  );
}

function StoryStructurePanel({ rows }: { rows: ScriptPlanMiddleRow[] }) {
  return (
    <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm md:px-5 md:py-4">
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[18px] border border-[rgba(255,255,255,0.04)] bg-[rgba(12,12,13,0.42)] px-3.5 py-3">
          <div className="mb-3 flex items-center gap-2">
            <LayoutTemplate size={14} className="text-[#8E8E93]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Story Structure</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {rows.map((row, index) => (
              <div key={`${row.time}-${index}`} className="min-w-[96px] flex-1 rounded-[14px] border border-[rgba(255,255,255,0.05)] bg-[#101011] px-3 py-2.5">
                <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7C7C82]">{`Shot ${index + 1}`}</div>
                <div className="mt-1 text-[10px] text-[#8E8E93]">{row.time}</div>
                <div className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#F3F3F5]">
                  {getPurposeLabel(row.purpose, index)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-[rgba(255,255,255,0.04)] bg-[rgba(12,12,13,0.42)] px-3.5 py-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-[#8E8E93]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Emotion Curve</span>
            </div>
            <span className="text-[10px] text-[#7C7C82]">Aligned to shot order</span>
          </div>
          <div className="rounded-[14px] border border-[rgba(255,255,255,0.05)] bg-[#101011] px-3 py-3">
            <div className="flex h-[112px] items-end gap-2">
              {rows.map((row, index) => {
                const height = `${Math.round(getEmotionLevel(row, index, rows.length) * 72) + 20}px`;
                return (
                  <div key={`emotion-${row.time}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                    <div className="relative w-full overflow-hidden rounded-[12px] bg-[rgba(255,255,255,0.06)]" style={{ height }}>
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,132,61,0.92)_0%,rgba(255,132,61,0.18)_100%)]" />
                    </div>
                    <span className="text-[9px] text-[#7C7C82]">{row.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoPlaceholder({
  title,
  description,
  onGenerateVideo,
}: {
  title: string;
  description: string;
  onGenerateVideo?: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm md:px-5 md:py-4">
      <div className="rounded-[18px] border border-[rgba(255,255,255,0.04)] bg-[rgba(12,12,13,0.42)] px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Film size={14} className="text-[#8E8E93]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Video</span>
            </div>
            <div className="text-[13px] font-medium text-white">{title}</div>
            <div className="mt-1 text-[11px] leading-5 text-[#8E8E93]">{description}</div>
          </div>
          {onGenerateVideo && (
            <button
              type="button"
              onClick={onGenerateVideo}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-4 py-2 text-[12px] font-medium text-white transition-all hover:bg-[#FFA465]"
            >
              <Film size={14} />
              Generate Video
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ScriptPlanMiddleContent({
  activeView,
  onChangeView,
  summaryCards,
  rows,
  videoContent,
  onGenerateVideo,
  videoTitle = 'Video Preview',
  videoDescription = 'Switch here to review or generate the current mock video pass.',
}: {
  activeView: ScriptPlanMiddleView;
  onChangeView: (view: ScriptPlanMiddleView) => void;
  summaryCards: ScriptPlanSummaryCard[];
  rows: ScriptPlanMiddleRow[];
  videoContent?: ReactNode;
  onGenerateVideo?: () => void;
  videoTitle?: string;
  videoDescription?: string;
}) {
  const cardsByKey = useMemo(
    () => Object.fromEntries(summaryCards.map((item) => [item.key, item])) as Record<string, ScriptPlanSummaryCard>,
    [summaryCards],
  );

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-1">
        {[
          { key: 'summary' as const, label: 'Script Summary' },
          { key: 'structure' as const, label: 'Emotion Curve + Story Structure' },
          { key: 'video' as const, label: 'Video' },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onChangeView(item.key)}
            className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-all ${
              activeView === item.key ? 'bg-[#101011] text-white shadow-[0_1px_2px_rgba(0,0,0,0.24)]' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {activeView === 'summary' && (
        <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm md:px-5 md:py-4">
          <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="grid gap-4">
              {cardsByKey.narrative && <SummaryCard {...cardsByKey.narrative} />}
              {cardsByKey.emotion && <SummaryCard {...cardsByKey.emotion} />}
            </div>
            <div className="grid gap-4">
              {cardsByKey.visual && <SummaryCard {...cardsByKey.visual} />}
              <div className="grid gap-4 md:grid-cols-2">
                {cardsByKey.rhythm && <SummaryCard {...cardsByKey.rhythm} />}
                {cardsByKey.asset && <SummaryCard {...cardsByKey.asset} />}
              </div>
            </div>
          </div>
          {cardsByKey.output && (
            <div className="mt-4 border-t border-[rgba(255,255,255,0.08)] pt-4">
              <div className="grid gap-3 md:grid-cols-[140px_minmax(0,1fr)] md:items-start">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8E8E93]">Output Spec</div>
                <SummaryCard {...cardsByKey.output} />
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === 'structure' && <StoryStructurePanel rows={rows} />}

      {activeView === 'video' &&
        (videoContent ?? (
          <VideoPlaceholder title={videoTitle} description={videoDescription} onGenerateVideo={onGenerateVideo} />
        ))}
    </div>
  );
}
