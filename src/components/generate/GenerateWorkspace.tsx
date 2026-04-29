import { useEffect, useMemo, useState } from 'react';
import {
  ChevronRight,
  Clapperboard,
  FileText,
  Film,
  FolderKanban,
  Layers3,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import type {
  GenerateHistoryProjectItem,
  GenerateHistorySingleItem,
} from '@/lib/mockGenerateHistory';

type DetailTab = 'description' | 'video' | 'scriptPlan';

type GenerateWorkspaceProps = {
  selectedItem: GenerateHistorySingleItem | GenerateHistoryProjectItem | null;
  activeDetailTab: DetailTab;
  onDetailTabChange: (tab: DetailTab) => void;
  onOpenPlan: (item: GenerateHistorySingleItem) => void;
  onOpenProject: (item: GenerateHistoryProjectItem) => void;
  onOpenSequence: (project: GenerateHistoryProjectItem, sequenceId: string) => void;
};

function SummaryPill({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[18px] border px-3 py-2 ${
        accent
          ? 'border-[rgba(255,132,61,0.28)] bg-[rgba(255,132,61,0.08)]'
          : 'border-[rgba(255,255,255,0.06)] bg-[rgba(17,17,18,0.78)]'
      }`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7B7B82]">
        {label}
      </div>
      <div className="mt-1 text-[12px] font-medium text-white">{value}</div>
    </div>
  );
}

function DetailTabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-[12px] font-medium transition-all ${
        active
          ? 'bg-[#FF843D] text-white'
          : 'border border-[rgba(255,255,255,0.06)] bg-[rgba(17,17,18,0.78)] text-[#B6B6BC] hover:border-[rgba(255,132,61,0.2)] hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function EmptyConversationState() {
  const entryCards = [
    {
      title: 'Create from Prompt',
      description: 'Start with an idea and generate a script plan.',
      icon: Sparkles,
    },
    {
      title: 'Continue from History',
      description: 'Select a previous generation from the left panel.',
      icon: Layers3,
    },
    {
      title: 'Use References',
      description: 'Attach images or assets to guide the result.',
      icon: Film,
    },
  ];

  return (
    <div className="flex h-full min-h-[420px] items-center justify-center">
      <div className="w-full max-w-[820px] rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(20,20,22,0.92)_0%,rgba(14,14,15,0.96)_100%)] p-8 shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
        <div className="mx-auto max-w-[620px] text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] border border-[rgba(255,132,61,0.24)] bg-[rgba(255,132,61,0.1)] text-[#FF843D]">
            <Sparkles size={22} />
          </div>
          <h2 className="mt-5 text-[28px] font-semibold text-white">Start a new generation</h2>
          <p className="mx-auto mt-3 max-w-[620px] text-[14px] leading-7 text-[#A2A2A9]">
            Describe a video idea, attach references, or continue from a previous script. Your generated plan will appear here.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {entryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[rgba(16,16,17,0.84)] p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[#111113] text-[#FF843D]">
                  <Icon size={18} />
                </div>
                <div className="mt-4 text-[15px] font-medium text-white">{card.title}</div>
                <p className="mt-2 text-[12px] leading-6 text-[#8E8E93]">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SingleScriptDetail({
  item,
  activeDetailTab,
  onDetailTabChange,
  onOpenPlan,
}: {
  item: GenerateHistorySingleItem;
  activeDetailTab: DetailTab;
  onDetailTabChange: (tab: DetailTab) => void;
  onOpenPlan: (item: GenerateHistorySingleItem) => void;
}) {
  const [planPreviewMode, setPlanPreviewMode] = useState<'table' | 'storyboard'>('table');

  useEffect(() => {
    setPlanPreviewMode('table');
  }, [item.id]);

  const videoSource = item.script.videoAsset || null;

  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(20,20,22,0.92)_0%,rgba(14,14,15,0.96)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
              Single Script
            </div>
            <h2 className="mt-2 text-[28px] font-semibold text-white">{item.title}</h2>
            <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-[#A4A4AA]">{item.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onOpenPlan(item)}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-4 py-2.5 text-[12px] font-medium text-white transition-all hover:bg-[#FFA465]"
            >
              Open Plan <ChevronRight size={14} />
            </button>
            <button
              type="button"
              className="rounded-full border border-[rgba(255,255,255,0.08)] px-4 py-2.5 text-[12px] text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.24)] hover:text-white"
            >
              Revise
            </button>
            <button
              type="button"
              className="rounded-full border border-[rgba(255,255,255,0.08)] px-4 py-2.5 text-[12px] text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.24)] hover:text-white"
            >
              {item.statusTag === 'Draft' ? 'Generate Video' : 'Regenerate'}
            </button>
            {(item.statusTag === 'Completed' || item.statusTag === 'Generated') && (
              <button
                type="button"
                className="rounded-full border border-[rgba(255,255,255,0.08)] px-4 py-2.5 text-[12px] text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.24)] hover:text-white"
              >
                Download
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-5">
          <SummaryPill label="Status" value={item.statusTag} accent />
          <SummaryPill label="Duration" value={item.duration} />
          <SummaryPill label="Version" value={item.version} />
          <SummaryPill label="Output Spec" value={item.videoMeta.format} />
          <SummaryPill label="Resolution" value={item.videoMeta.resolution} />
        </div>
      </div>

      <div className="rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,19,0.9)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
        <div className="flex flex-wrap items-center gap-2">
          <DetailTabButton
            label="Description"
            active={activeDetailTab === 'description'}
            onClick={() => onDetailTabChange('description')}
          />
          <DetailTabButton
            label="Video"
            active={activeDetailTab === 'video'}
            onClick={() => onDetailTabChange('video')}
          />
          <DetailTabButton
            label="Script Plan"
            active={activeDetailTab === 'scriptPlan'}
            onClick={() => onDetailTabChange('scriptPlan')}
          />
        </div>

        {activeDetailTab === 'description' && (
          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div className="rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#111113] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                Narrative Summary
              </div>
              <p className="mt-3 text-[14px] leading-7 text-[#E7E7EA]">{item.summary}</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#111113] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                  Asset Logic
                </div>
                <p className="mt-3 text-[13px] leading-6 text-[#CFCFD4]">{item.assetLogic}</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#111113] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                  Output Spec
                </div>
                <p className="mt-3 text-[13px] leading-6 text-[#CFCFD4]">{item.outputSpec}</p>
              </div>
            </div>
          </div>
        )}

        {activeDetailTab === 'video' && (
          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.06)] bg-[#111113]">
              {videoSource ? (
                <video
                  src={videoSource}
                  controls
                  className="aspect-video h-full w-full bg-black object-cover"
                />
              ) : (
                <div className="relative aspect-video bg-[#0F0F10]">
                  <img
                    src={item.script.coverImage || item.script.shots[0]?.preview}
                    alt={item.videoMeta.title}
                    className="h-full w-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(12,12,13,0.72)] text-white">
                      <PlayCircle size={26} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#111113] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                  Video Meta
                </div>
                <div className="mt-4 space-y-3 text-[13px] text-[#D4D4D8]">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#6E6E74]">Title</div>
                    <div className="mt-1">{item.videoMeta.title}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#6E6E74]">Created</div>
                    <div className="mt-1">{item.videoMeta.createdAt}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#6E6E74]">Duration</div>
                    <div className="mt-1">{item.duration}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#6E6E74]">Resolution</div>
                    <div className="mt-1">{item.videoMeta.resolution}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#111113] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                  Render Note
                </div>
                <p className="mt-3 text-[13px] leading-6 text-[#CFCFD4]">{item.videoMeta.subtitle}</p>
              </div>
            </div>
          </div>
        )}

        {activeDetailTab === 'scriptPlan' && (
          <div className="mt-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[13px] text-[#9A9A9E]">
                Preview-only history mode. Open the full plan to edit all shots.
              </div>
              <div className="inline-flex rounded-full border border-[rgba(255,255,255,0.06)] bg-[#111113] p-1">
                {[
                  { key: 'table', label: 'Table View' },
                  { key: 'storyboard', label: 'Storyboard View' },
                ].map((mode) => (
                  <button
                    key={mode.key}
                    type="button"
                    onClick={() => setPlanPreviewMode(mode.key as 'table' | 'storyboard')}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                      planPreviewMode === mode.key ? 'bg-[#FF843D] text-white' : 'text-[#B0B0B6] hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {planPreviewMode === 'table' ? (
              <div className="overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#111113]">
                <div className="grid grid-cols-[84px_92px_minmax(0,1.1fr)_140px_140px_150px] gap-3 border-b border-[rgba(255,255,255,0.06)] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7B7B82]">
                  <div>Time</div>
                  <div>Preview</div>
                  <div>Visual</div>
                  <div>Purpose</div>
                  <div>Camera</div>
                  <div>Copy</div>
                </div>
                <div className="divide-y divide-[rgba(255,255,255,0.06)]">
                  {item.script.shots.map((shot) => (
                    <div
                      key={shot.id}
                      className="grid grid-cols-[84px_92px_minmax(0,1.1fr)_140px_140px_150px] gap-3 px-4 py-3 text-[12px] text-[#D4D4D8]"
                    >
                      <div className="text-[#8E8E93]">{shot.timeRange}</div>
                      <img
                        src={shot.preview || item.script.coverImage}
                        alt={shot.purpose}
                        className="h-14 w-full rounded-[14px] border border-[rgba(255,255,255,0.06)] object-cover"
                      />
                      <div className="line-clamp-2 leading-6">{shot.visual}</div>
                      <div>
                        <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#F1F1F3]">
                          {shot.purpose}
                        </span>
                      </div>
                      <div className="line-clamp-2 leading-6 text-[#B5B5BB]">{shot.camera}</div>
                      <div className="line-clamp-2 leading-6 text-[#B5B5BB]">{shot.copy}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {item.script.shots.map((shot, index) => (
                  <div
                    key={shot.id}
                    className="overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#111113]"
                  >
                    <img
                      src={shot.preview || item.script.coverImage}
                      alt={shot.purpose}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div className="space-y-3 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">
                          Shot {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="text-[11px] text-[#B8B8BE]">{shot.timeRange}</div>
                      </div>
                      <div className="text-[14px] font-medium text-white">{shot.visual}</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#F1F1F3]">
                          {shot.purpose}
                        </span>
                        <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[10px] font-medium text-[#D4D4D8]">
                          {shot.camera}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectScriptDetail({
  item,
  onOpenProject,
  onOpenSequence,
}: {
  item: GenerateHistoryProjectItem;
  onOpenProject: (item: GenerateHistoryProjectItem) => void;
  onOpenSequence: (project: GenerateHistoryProjectItem, sequenceId: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(20,20,22,0.92)_0%,rgba(14,14,15,0.96)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
              Project Script
            </div>
            <h2 className="mt-2 text-[28px] font-semibold text-white">{item.title}</h2>
            <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-[#A4A4AA]">{item.narrativeDirection}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onOpenProject(item)}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-4 py-2.5 text-[12px] font-medium text-white transition-all hover:bg-[#FFA465]"
            >
              Open Project <ChevronRight size={14} />
            </button>
            <button
              type="button"
              className="rounded-full border border-[rgba(255,255,255,0.08)] px-4 py-2.5 text-[12px] text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.24)] hover:text-white"
            >
              Add Sequence
            </button>
            <button
              type="button"
              className="rounded-full border border-[rgba(255,255,255,0.08)] px-4 py-2.5 text-[12px] text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.24)] hover:text-white"
            >
              Generate Video
            </button>
            <button
              type="button"
              className="rounded-full border border-[rgba(255,255,255,0.08)] px-4 py-2.5 text-[12px] text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.24)] hover:text-white"
            >
              Save Draft
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <SummaryPill label="Status" value={item.statusTag} accent />
          <SummaryPill label="Duration" value={item.duration} />
          <SummaryPill label="Sequences" value={`${item.sequenceCount}`} />
          <SummaryPill label="Updated" value={item.updatedAt} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,19,0.9)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-2 text-white">
            <Layers3 size={16} />
            <h3 className="text-[15px] font-semibold">Project Sequences</h3>
          </div>

          <div className="mt-4 space-y-3">
            {item.sequences.map((sequence, index) => (
              <button
                key={sequence.id}
                type="button"
                onClick={() => onOpenSequence(item, sequence.id)}
                className="grid w-full gap-4 rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#111113] p-4 text-left transition-all hover:border-[rgba(255,132,61,0.22)] hover:bg-[rgba(22,22,23,0.96)] md:grid-cols-[96px_minmax(0,1fr)_auto]"
              >
                <img
                  src={sequence.thumbnail}
                  alt={sequence.title}
                  className="h-24 w-full rounded-[18px] border border-[rgba(255,255,255,0.06)] object-cover"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                      Sequence {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[10px] font-medium text-[#E7E7EA]">
                      {sequence.duration}
                    </span>
                  </div>
                  <div className="mt-2 text-[15px] font-medium text-white">{sequence.title}</div>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-6 text-[#A4A4AA]">{sequence.summary}</p>
                </div>
                <div className="flex items-center justify-end">
                  <span className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#D4D4D8]">
                    {sequence.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,19,0.9)] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
            <img src={item.cover} alt={item.title} className="aspect-[16/10] w-full object-cover" />
            <div className="p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                Narrative Direction
              </div>
              <p className="mt-3 text-[13px] leading-7 text-[#D4D4D8]">{item.narrativeDirection}</p>
            </div>
          </div>

          <div className="rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,19,0.9)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-2 text-white">
              <FolderKanban size={16} />
              <h3 className="text-[15px] font-semibold">Project Settings</h3>
            </div>
            <div className="mt-4 grid gap-3">
              <SummaryPill label="Aspect Ratio" value={item.aspectRatio} />
              <SummaryPill label="Frame Rate" value={item.frameRate} />
              <SummaryPill label="Render Style" value={item.renderMode} />
              <SummaryPill label="Collaboration Mode" value={item.collaborationMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GenerateWorkspace({
  selectedItem,
  activeDetailTab,
  onDetailTabChange,
  onOpenPlan,
  onOpenProject,
  onOpenSequence,
}: GenerateWorkspaceProps) {
  const selectedSingle = selectedItem?.type === 'single' ? selectedItem : null;
  const selectedProject = selectedItem?.type === 'project' ? selectedItem : null;

  const workspaceHeader = useMemo(() => {
    if (!selectedItem) {
      return {
        eyebrow: 'Generate Workspace',
        title: 'History, previews, and new generation in one place',
        description:
          'Browse previous scripts on the left, inspect the selected project here, and keep creating from the dedicated Generate composer below.',
        icon: Clapperboard,
      };
    }

    if (selectedItem.type === 'single') {
      return {
        eyebrow: 'Selected History',
        title: selectedItem.title,
        description: `${selectedItem.duration} · ${selectedItem.version} · ${selectedItem.statusTag}`,
        icon: FileText,
      };
    }

    return {
      eyebrow: 'Selected Project',
      title: selectedItem.title,
      description: `${selectedItem.sequenceCount} sequences · ${selectedItem.duration} · ${selectedItem.statusTag}`,
      icon: FolderKanban,
    };
  }, [selectedItem]);

  const HeaderIcon = workspaceHeader.icon;

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
            {workspaceHeader.eyebrow}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[rgba(16,16,17,0.8)] text-[#FF843D]">
              <HeaderIcon size={18} />
            </div>
            <div>
              <h1 className="text-[24px] font-semibold text-white">{workspaceHeader.title}</h1>
              <p className="mt-1 text-[13px] leading-6 text-[#8E8E93]">{workspaceHeader.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {!selectedItem && <EmptyConversationState />}
        {selectedSingle && (
          <SingleScriptDetail
            item={selectedSingle}
            activeDetailTab={activeDetailTab}
            onDetailTabChange={onDetailTabChange}
            onOpenPlan={onOpenPlan}
          />
        )}
        {selectedProject && (
          <ProjectScriptDetail
            item={selectedProject}
            onOpenProject={onOpenProject}
            onOpenSequence={onOpenSequence}
          />
        )}
      </div>
    </section>
  );
}
