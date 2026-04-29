import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import type {
  GenerateHistoryProjectItem,
  GenerateHistorySingleItem,
} from '@/lib/mockGenerateHistory';

type HistoryGroupKey = 'single' | 'project';

type GenerateHistoryPanelProps = {
  singleItems: GenerateHistorySingleItem[];
  projectItems: GenerateHistoryProjectItem[];
  selectedHistoryId: string | null;
  collapsedGroups: Record<HistoryGroupKey, boolean>;
  onToggleGroup: (group: HistoryGroupKey) => void;
  onSelectHistory: (item: GenerateHistorySingleItem | GenerateHistoryProjectItem) => void;
  onNewScript: () => void;
};

function StatusBadge({ status }: { status: 'Draft' | 'Completed' | 'Generated' }) {
  const palette =
    status === 'Completed'
      ? 'bg-[rgba(76,217,100,0.14)] text-[#B9F6CA] border-[rgba(76,217,100,0.22)]'
      : status === 'Generated'
        ? 'bg-[rgba(255,132,61,0.14)] text-[#FFD0B2] border-[rgba(255,132,61,0.22)]'
        : 'bg-[rgba(255,255,255,0.06)] text-[#E7E7EA] border-[rgba(255,255,255,0.08)]';

  return (
    <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-medium ${palette}`}>
      {status}
    </span>
  );
}

function HistoryItemCard({
  title,
  updatedAt,
  status,
  meta,
  selected,
  onClick,
}: {
  title: string;
  updatedAt: string;
  status: 'Draft' | 'Completed' | 'Generated';
  meta: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-[20px] border px-4 py-3 text-left transition-all ${
        selected
          ? 'border-[rgba(255,132,61,0.45)] bg-[linear-gradient(180deg,rgba(37,25,19,0.9)_0%,rgba(22,18,18,0.92)_100%)] shadow-[0_12px_28px_rgba(0,0,0,0.24)]'
          : 'border-[rgba(255,255,255,0.06)] bg-[rgba(18,18,19,0.78)] hover:border-[rgba(255,132,61,0.22)] hover:bg-[rgba(24,24,25,0.9)]'
      }`}
    >
      <span
        className={`absolute inset-y-3 left-0 w-[3px] rounded-full transition-all ${
          selected ? 'bg-[#FF843D]' : 'bg-transparent group-hover:bg-[rgba(255,132,61,0.3)]'
        }`}
      />
      <div className="flex items-start justify-between gap-3 pl-1">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-medium text-white">{title}</div>
          <div className="mt-1 truncate text-[11px] text-[#7F7F85]">{updatedAt}</div>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="mt-3 flex items-center gap-2 pl-1 text-[10px] uppercase tracking-[0.16em] text-[#8E8E93]">
        <span>{meta}</span>
      </div>
    </button>
  );
}

function HistoryGroup({
  title,
  collapsed,
  onToggle,
  children,
}: {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-full border border-[rgba(255,255,255,0.06)] bg-[rgba(16,16,17,0.88)] px-3 py-2 text-left transition-all hover:border-[rgba(255,132,61,0.24)]"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D4D4D8]">
          {title}
        </span>
        {collapsed ? (
          <ChevronRight size={14} className="text-[#8E8E93]" />
        ) : (
          <ChevronDown size={14} className="text-[#8E8E93]" />
        )}
      </button>
      {!collapsed && <div className="space-y-2.5">{children}</div>}
    </section>
  );
}

export function GenerateHistoryPanel({
  singleItems,
  projectItems,
  selectedHistoryId,
  collapsedGroups,
  onToggleGroup,
  onSelectHistory,
  onNewScript,
}: GenerateHistoryPanelProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(16,16,17,0.82)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
            Generate
          </div>
          <h2 className="mt-2 text-[18px] font-semibold text-white">History</h2>
        </div>
        <button
          type="button"
          onClick={onNewScript}
          className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-3.5 py-2 text-[11px] font-medium text-white transition-all hover:bg-[#FFA465]"
        >
          <Plus size={13} />
          New Script
        </button>
      </div>

      <div className="mt-4 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        <HistoryGroup
          title="Single Scripts"
          collapsed={collapsedGroups.single}
          onToggle={() => onToggleGroup('single')}
        >
          {singleItems.map((item) => (
            <HistoryItemCard
              key={item.id}
              title={item.title}
              updatedAt={item.updatedAt}
              status={item.statusTag}
              meta={`${item.duration} · ${item.version}`}
              selected={selectedHistoryId === item.id}
              onClick={() => onSelectHistory(item)}
            />
          ))}
        </HistoryGroup>

        <HistoryGroup
          title="Project Scripts"
          collapsed={collapsedGroups.project}
          onToggle={() => onToggleGroup('project')}
        >
          {projectItems.map((item) => (
            <HistoryItemCard
              key={item.id}
              title={item.title}
              updatedAt={item.updatedAt}
              status={item.statusTag}
              meta={`${item.sequenceCount} sequences · ${item.duration}`}
              selected={selectedHistoryId === item.id}
              onClick={() => onSelectHistory(item)}
            />
          ))}
        </HistoryGroup>
      </div>
    </aside>
  );
}
