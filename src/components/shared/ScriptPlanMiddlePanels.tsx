import { useRef, useState } from 'react';
import type { EditableMockRow } from '@/components/shared/ScriptPlanViews';
import { LayoutTemplate, TrendingUp } from 'lucide-react';

export type MiddleContentView = 'summary' | 'emotion' | 'video';

function reorderRows(rows: EditableMockRow[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) return rows;
  const next = [...rows];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function getStructureLabels(scenarioId: string) {
  if (scenarioId === 'dream_video_with_assets') {
    return ['Arrival', 'Reveal', 'Drift', 'Longing', 'Dissolve'];
  }

  if (scenarioId === 'fragrance_ad_script_with_assets') {
    return ['Hero Frame', 'Presence', 'Texture', 'Memory', 'Reveal'];
  }

  return ['Opening', 'Space Drift', 'Anomaly', 'Escalation', 'Blackout'];
}

function getEmotionLevels(scenarioId: string, count: number) {
  const presets: Record<string, number[]> = {
    backrooms_vlog_fuzzy_no_asset: [28, 42, 64, 84, 96],
    dream_video_with_assets: [22, 34, 52, 70, 58],
    fragrance_ad_script_with_assets: [34, 48, 62, 76, 88],
  };

  const base = presets[scenarioId] ?? presets.backrooms_vlog_fuzzy_no_asset;
  return Array.from({ length: count }, (_, index) => base[index] ?? base[base.length - 1]);
}

export function MiddleContentTabs({
  activeView,
  onChange,
}: {
  activeView: MiddleContentView;
  onChange: (view: MiddleContentView) => void;
}) {
  const items: Array<{ key: MiddleContentView; label: string }> = [
    { key: 'summary', label: 'Script Summary' },
    { key: 'emotion', label: 'Rhythm' },
    { key: 'video', label: 'Video' },
  ];

  return (
    <div className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-1">
      {items.map((item) => {
        const active = item.key === activeView;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-all ${
              active ? 'bg-[#101011] text-white shadow-[0_1px_2px_rgba(0,0,0,0.24)]' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function EmotionStructurePanel({
  scenarioId,
  rows,
  activeShotIndex,
  activePlanView,
  onSelectShot,
  onReorderRows,
}: {
  scenarioId: string;
  rows: EditableMockRow[];
  activeShotIndex: number;
  activePlanView: 'table' | 'storyboard';
  onSelectShot: (index: number) => void;
  onReorderRows: (rows: EditableMockRow[], nextActiveIndex: number) => void;
}) {
  const structureLabels = getStructureLabels(scenarioId);
  const emotionLevels = getEmotionLevels(scenarioId, rows.length);
  const [dragReadyIndex, setDragReadyIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragHoldTimerRef = useRef<number | null>(null);

  const clearDragHold = () => {
    if (dragHoldTimerRef.current !== null) {
      window.clearTimeout(dragHoldTimerRef.current);
      dragHoldTimerRef.current = null;
    }
  };

  const handleStructureMouseDown = (index: number) => {
    clearDragHold();
    dragHoldTimerRef.current = window.setTimeout(() => {
      setDragReadyIndex(index);
    }, 170);
  };

  const handleStructureMouseUp = () => {
    clearDragHold();
    if (draggingIndex === null) {
      setDragReadyIndex(null);
    }
  };

  return (
    <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm md:px-5 md:py-4">
      <div className="space-y-4">
        <div className="rounded-[18px] border border-[rgba(255,255,255,0.04)] bg-[#0C0C0D] p-3.5">
          <div className="flex items-center gap-2">
            <LayoutTemplate size={14} className="text-[#8E8E93]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Story Structure</span>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-5">
            {rows.map((row, index) => (
              <button
                key={`${row._localId ?? row.time}-${index}`}
                type="button"
                draggable={dragReadyIndex === index}
                onMouseDown={() => handleStructureMouseDown(index)}
                onMouseUp={handleStructureMouseUp}
                onMouseLeave={handleStructureMouseUp}
                onClick={() => {
                  if (draggingIndex === null) onSelectShot(index);
                }}
                onDragStart={(event) => {
                  setDraggingIndex(index);
                  setDragOverIndex(index);
                  event.dataTransfer.effectAllowed = 'move';
                  event.dataTransfer.setData('text/plain', String(index));
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (dragOverIndex !== index) setDragOverIndex(index);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const fromIndex = Number(event.dataTransfer.getData('text/plain'));
                  if (Number.isNaN(fromIndex)) return;
                  const nextRows = reorderRows(rows, fromIndex, index);
                  onReorderRows(nextRows, index);
                  setDragReadyIndex(null);
                  setDraggingIndex(null);
                  setDragOverIndex(null);
                }}
                onDragEnd={() => {
                  setDragReadyIndex(null);
                  setDraggingIndex(null);
                  setDragOverIndex(null);
                }}
                className={`rounded-[16px] border px-3 py-3 text-left transition-all ${
                  activeShotIndex === index
                    ? 'border-[rgba(255,132,61,0.30)] bg-[rgba(255,132,61,0.08)] shadow-[0_0_0_1px_rgba(255,132,61,0.08)]'
                    : 'border-[rgba(255,255,255,0.05)] bg-[rgba(16,16,17,0.92)] hover:border-[rgba(255,132,61,0.22)] hover:bg-[rgba(22,22,24,0.96)]'
                } ${draggingIndex === index ? 'scale-[1.02] border-[rgba(255,132,61,0.34)] shadow-[0_16px_34px_rgba(0,0,0,0.26)]' : ''} ${dragReadyIndex === index && draggingIndex === null ? 'ring-1 ring-[rgba(255,132,61,0.22)]' : ''} ${dragOverIndex === index && draggingIndex !== index ? 'border-[rgba(255,132,61,0.28)] bg-[rgba(255,132,61,0.06)]' : ''}`}
              >
                <div className="text-[10px] text-[#8E8E93]">{row.time}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">{`Shot ${index + 1}`}</span>
                  <span className="h-1 w-1 rounded-full bg-[rgba(255,255,255,0.14)]" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#F3F3F5]">
                    {structureLabels[index] ?? truncateText(row.purpose || 'Beat', 18)}
                  </span>
                </div>
                <div className="mt-2 line-clamp-1 text-[10px] leading-4 text-[#7C7C82]">
                  {truncateText(row.scene || 'Pending visual beat', 44)}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-[rgba(255,255,255,0.04)] bg-[#0C0C0D] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-[#8E8E93]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Emotion Curve</span>
            </div>
            <span className="text-[10px] text-[#6F6F77]">
              {`Points adjust ${activePlanView === 'table' ? 'table rows' : 'storyboard cards'}`}
            </span>
          </div>

          <div className="mt-4 flex h-[150px] items-end gap-2">
            {rows.map((row, index) => {
              const level = emotionLevels[index] ?? 48;
              return (
                <button
                  key={`${row._localId ?? row.time}-emotion-${index}`}
                  type="button"
                  onClick={() => onSelectShot(index)}
                  className="flex flex-1 flex-col items-center gap-2 text-center"
                >
                  <div className={`relative flex h-[108px] w-full items-end rounded-[16px] border px-1.5 pb-1.5 transition-all ${
                    activeShotIndex === index
                      ? 'border-[rgba(255,132,61,0.30)] bg-[rgba(255,132,61,0.08)] shadow-[0_0_0_1px_rgba(255,132,61,0.08)]'
                      : 'border-[rgba(255,255,255,0.05)] bg-[rgba(16,16,17,0.92)] hover:border-[rgba(255,132,61,0.22)]'
                  }`}>
                    <div
                      className={`w-full rounded-[12px] transition-all ${
                        activeShotIndex === index
                          ? 'bg-[linear-gradient(180deg,rgba(255,132,61,0.38)_0%,rgba(255,132,61,0.96)_100%)]'
                          : 'bg-[linear-gradient(180deg,rgba(255,132,61,0.22)_0%,rgba(255,132,61,0.72)_100%)] hover:brightness-110'
                      }`}
                      style={{ height: `${Math.max(level, 18)}%` }}
                    />
                    <div className="absolute inset-x-2 top-2 flex items-center justify-between text-[9px] text-[#8E8E93]">
                      <span>{`S${index + 1}`}</span>
                      <span>{`${level}%`}</span>
                    </div>
                  </div>
                  <div className={`text-[10px] transition-colors ${activeShotIndex === index ? 'text-[#F3F3F5]' : 'text-[#8E8E93]'}`}>{row.time}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
