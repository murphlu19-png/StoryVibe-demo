import { assetPath } from '@/lib/assetPath';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Download,
  FlipHorizontal,
  Gauge,
  LoaderCircle,
  Maximize2,
  Play,
  Plus,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ScriptPlanComposerShell } from '@/components/shared/ScriptPlanComposerShell';
import { FlowChatboxDock } from '@/components/shared/FlowChatboxDock';
import { EmotionStructurePanel, MiddleContentTabs, type MiddleContentView } from '@/components/shared/ScriptPlanMiddlePanels';
import { ScriptPlanViews } from '@/components/shared/ScriptPlanViews';
import { getMockDemoScenarioById } from '@/lib/mockDemoScenarios';
import { useAppStore } from '@/stores/useAppStore';
import { useMockDemoStore } from '@/stores/useMockDemoStore';
import { useScriptStore } from '@/stores/useScriptStore';
import type { Script } from '@/types';

type ProgressStep = {
  progress: number;
  title: string;
  description: string;
};

type ScriptPlanRow = {
  previewImage?: string;
  time: string;
  scene: string;
  purpose: string;
  visualDirection: string;
  camera: string;
  assetSource?: string;
  audioOrVoice?: string;
  textOrCaption?: string;
};

type PlanViewMode = 'table' | 'storyboard';

function getFallbackProgressSteps(): ProgressStep[] {
  return [
    { progress: 18, title: 'Interpreting script plan', description: 'Converting the approved script plan into a mock render sequence.' },
    { progress: 36, title: 'Building shot sequence', description: 'Mapping timing, transitions, and coverage order for the preview.' },
    { progress: 58, title: 'Matching visual direction', description: 'Applying scene tone, motion language, and scenario style cues.' },
    { progress: 78, title: 'Rendering preview motion', description: 'Simulating motion, cadence, and continuity between story beats.' },
    { progress: 100, title: 'Finalizing mock video', description: 'Preparing the generated mock preview and result summary.' },
  ];
}

function getPreviewTheme(scenarioId: string) {
  if (scenarioId === 'dream_video_with_assets') {
    return {
      background: 'linear-gradient(135deg, rgba(77,85,156,0.92) 0%, rgba(156,120,191,0.72) 42%, rgba(20,20,32,1) 100%)',
      glow: 'rgba(178,145,255,0.32)',
      previewLabel: 'DREAM MEMORY RENDER',
      previewDetail: 'Soft interior drift · dream-space mood · emotional flow preview',
    };
  }

  if (scenarioId === 'fragrance_ad_script_with_assets') {
    return {
      background: 'linear-gradient(135deg, rgba(18,40,76,0.98) 0%, rgba(60,93,152,0.78) 45%, rgba(10,11,20,1) 100%)',
      glow: 'rgba(110,158,255,0.28)',
      previewLabel: 'Product Film Render',
      previewDetail: 'Cool city light · premium reflections · sensory contrast',
    };
  }

  return {
    background: 'linear-gradient(135deg, rgba(126,104,38,0.96) 0%, rgba(78,69,31,0.84) 44%, rgba(15,14,10,1) 100%)',
    glow: 'rgba(255,184,77,0.24)',
    previewLabel: 'Backrooms POV Render',
    previewDetail: 'Fluorescent corridor · handheld drift · found-footage tension',
  };
}

function getDurationLabel(outputSpec: string, fallback = '15s') {
  const match = outputSpec.match(/(\d+\s*:\s*\d+)|(\d+\s*s)|(\d+\s*seconds)|(around\s+\d+\s*seconds)/i);
  if (!match) return fallback;
  return match[0].replace(/seconds/i, 's').replace(/\s+/g, ' ').trim();
}

function formatPlaybackTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function getScriptThemeId(script: Script) {
  const id = `${script.id} ${script.title} ${script.category ?? ''}`.toLowerCase();
  if (id.includes('backrooms')) return 'backrooms_vlog_fuzzy_no_asset';
  if (id.includes('cyberpunk')) return 'fragrance_ad_script_with_assets';
  if (id.includes('shenzhen') || id.includes('city walk')) return 'fragrance_ad_script_with_assets';
  return 'dream_video_with_assets';
}

function mapScriptToPlanRows(script: Script): ScriptPlanRow[] {
  return script.shots.map((shot) => ({
    previewImage: shot.preview,
    time: shot.timeRange,
    scene: shot.visual,
    purpose: shot.purpose,
    visualDirection: script.visualDirection,
    camera: shot.camera,
    assetSource: shot.asset,
    textOrCaption: shot.copy,
  }));
}

function mapPlanRowsToScriptShots(rows: ScriptPlanRow[], script: Script) {
  return rows.map((row, index) => ({
    ...script.shots[index],
    id: script.shots[index]?.id ?? `${script.id}-shot-${index + 1}`,
    timeRange: row.time,
    visual: row.scene,
    purpose: row.purpose,
    camera: row.camera,
    asset: row.assetSource ?? 'ADD ASSET',
    copy: row.textOrCaption ?? row.audioOrVoice ?? '',
    preview: row.previewImage ?? script.shots[index]?.preview ?? script.coverImage ?? assetPath('/assets/story-1.jpg'),
  }));
}

function getScriptProgressSteps(script: Script): ProgressStep[] {
  const tone = (script.category || script.title).toLowerCase();
  const styleLabel = tone.includes('cyberpunk')
    ? 'Matching neon action language'
    : tone.includes('backrooms')
      ? 'Matching liminal handheld tension'
      : tone.includes('city')
        ? 'Matching lifestyle city rhythm'
        : 'Matching visual direction';
  return [
    { progress: 18, title: 'Interpreting script plan', description: `Building a mock render setup for ${script.title}.` },
    { progress: 38, title: 'Sequencing shots', description: `Aligning ${script.shots.length} shots into one continuous video draft.` },
    { progress: 60, title: styleLabel, description: script.visualDirection },
    { progress: 82, title: 'Rendering preview motion', description: 'Simulating timing, motion continuity, and pacing between shots.' },
    { progress: 100, title: 'Finalizing mock video', description: `Preparing ${script.title} for completed preview output.` },
  ];
}

function getScriptMentionAssets(script: Script) {
  const assetNames = Array.from(new Set(script.shots.map((shot) => shot.asset).filter(Boolean))).slice(0, 3);
  return (assetNames.length ? assetNames : ['Scene Reference', 'Style Reference', 'Mood Reference']).map((name, index) => ({
    id: `${script.id}-asset-${index + 1}`,
    name: `${name}${name.includes('Reference') ? '' : ` · Reference ${index + 1}`}`,
    role: index === 0 ? 'Primary visual anchor' : index === 1 ? 'Supporting camera and lighting cue' : 'Mood and finishing reference',
  }));
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function getNarrativeArcText(mockScenario: ReturnType<typeof getMockDemoScenarioById>) {
  return mockScenario.intentSummary.mainCopy || mockScenario.scriptPlan.projectSummary[0] || mockScenario.scriptPlan.globalDirection;
}

function getEmotionalGoalText(mockScenario: ReturnType<typeof getMockDemoScenarioById>) {
  const emotionalLine = mockScenario.intentSummary.confirmedDirection.find((item) =>
    /feel|mood|emotion|calm|tense|quiet|suspense|dream|luxury|memory|atmosphere/i.test(item),
  );

  return emotionalLine || mockScenario.scriptPlan.productionNotes[0] || mockScenario.intentSummary.confirmedDirection[0] || mockScenario.scriptPlan.globalDirection;
}

function getRhythmText(mockScenario: ReturnType<typeof getMockDemoScenarioById>, rows: ScriptPlanRow[]) {
  const rhythmNote = mockScenario.scriptPlan.productionNotes.find((item) =>
    /pace|rhythm|slow|steady|beat|flow|escalat|release|build/i.test(item),
  );

  if (rhythmNote) {
    return rhythmNote;
  }

  const firstBeat = rows[0]?.purpose ?? 'opening beat';
  const lastBeat = rows[rows.length - 1]?.purpose ?? 'final beat';
  return `${rows.length} beats moving from ${firstBeat.toLowerCase()} to ${lastBeat.toLowerCase()}.`;
}

function getAssetLogicText(mockScenario: ReturnType<typeof getMockDemoScenarioById>) {
  if (!mockScenario.mockAssets.length) {
    return 'No external assets · generated from prompt only';
  }

  return mockScenario.mockAssets
    .slice(0, 2)
    .map((asset) => `${asset.name.split(' · ')[0]} -> ${asset.role}`)
    .join(' · ');
}

function getAspectFrame(outputSpec: string) {
  const ratioMatch = outputSpec.match(/(\d+)\s*:\s*(\d+)/);
  const width = ratioMatch ? Number(ratioMatch[1]) : 9;
  const height = ratioMatch ? Number(ratioMatch[2]) : 16;
  const ratio = `${width} / ${height}`;

  if (width === 9 && height === 16) {
    return {
      aspectRatio: ratio,
      wrapperClassName: 'mx-auto w-full max-w-[320px] md:max-w-[360px]',
    };
  }

  if (width === 1 && height === 1) {
    return {
      aspectRatio: ratio,
      wrapperClassName: 'mx-auto w-full max-w-[480px]',
    };
  }

  return {
    aspectRatio: ratio,
    wrapperClassName: 'w-full max-w-[960px]',
  };
}

function SummaryBar({
  title,
  durationLabel,
  status,
  onDownload,
  onAddToAssets,
}: {
  title: string;
  durationLabel: string;
  status: 'generating' | 'generated';
  onDownload: () => void;
  onAddToAssets: () => void;
}) {
  return (
    <div className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-[24px] font-semibold text-white">{title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-[#8E8E93]">
            <span className="rounded-full border border-[#2A2A2C] bg-[#101011] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E7E7EA]">
              Draft
            </span>
            <span>{`Duration: ${durationLabel}`}</span>
            <span>v1</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {status === 'generating' ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,132,61,0.20)] bg-[rgba(255,132,61,0.10)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFD2B4]">
              <LoaderCircle size={12} className="animate-spin" />
              Generating
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(76,217,100,0.20)] bg-[rgba(76,217,100,0.10)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C8F7D4]">
              <span className="h-2 w-2 rounded-full bg-[#4CD964]" />
              Completed
            </div>
          )}
          <button
            type="button"
            onClick={onAddToAssets}
            disabled={status !== 'generated'}
            className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-4 py-2 text-[12px] font-medium text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Plus size={14} />
            Add to Assets
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={status !== 'generated'}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-4 py-2 text-[12px] font-medium text-white transition-all hover:bg-[#FFA465] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Download size={14} />
            Download Video
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryInfoCard({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <div className="relative">
      <div className="flex min-h-[70px] w-full flex-col rounded-[14px] border border-[rgba(255,255,255,0.04)] bg-[#0C0C0D] px-3.5 py-2.5 text-left">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">{title}</div>
        <p className="line-clamp-2 text-[12px] leading-[1.55] text-[#F3F3F5]">{summary}</p>
      </div>
    </div>
  );
}

function VideoSurface({
  scenarioId,
  title,
  outputSpec,
  status,
  videoAsset,
  activeStep,
  videoRef,
  onTogglePlay,
  isMuted,
  onToggleMute,
  playbackSpeed,
  onCyclePlaybackSpeed,
  onReplay,
  isMirrored,
  onToggleMirror,
  onToggleFullscreen,
  currentTimeLabel,
  totalTimeLabel,
  progressPercent,
}: {
  scenarioId: string;
  title: string;
  outputSpec: string;
  status: 'generating' | 'generated';
  videoAsset?: string;
  activeStep: ProgressStep;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onTogglePlay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  playbackSpeed: number;
  onCyclePlaybackSpeed: () => void;
  onReplay: () => void;
  isMirrored: boolean;
  onToggleMirror: () => void;
  onToggleFullscreen: () => void;
  currentTimeLabel: string;
  totalTimeLabel: string;
  progressPercent: number;
}) {
  const theme = getPreviewTheme(scenarioId);
  const frame = getAspectFrame(outputSpec);
  const shouldRenderVideo = status === 'generated' && Boolean(videoAsset);

  return (
    <div className="rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)] md:p-6">
      <div className="relative overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[#09090A] shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.12)_100%)]" />
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-5">
          <div className="max-w-[60%]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.78)]">{theme.previewLabel}</div>
            <div className="mt-2 text-[16px] font-medium text-white">{title}</div>
            <div className="mt-1 text-[12px] text-[rgba(255,255,255,0.56)]">{theme.previewDetail}</div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 text-[11px] text-[rgba(255,255,255,0.56)]">
            <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1">{outputSpec}</span>
            <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1">v1</span>
          </div>
        </div>

        <div className="relative min-h-[420px] bg-black px-5 pb-[86px] pt-[86px]">
          <div className="absolute inset-x-0 top-[86px] bottom-[86px] flex items-center justify-center">
            <div className={`${frame.wrapperClassName} relative overflow-hidden rounded-[24px] bg-black`} style={{ aspectRatio: frame.aspectRatio }}>
              {shouldRenderVideo ? (
                <video
                  ref={videoRef}
                  src={videoAsset}
                  playsInline
                  preload="metadata"
                  muted={isMuted}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 ${isMirrored ? 'scale-x-[-1]' : ''}`}
                />
              ) : (
                <>
                  <div
                    className={`absolute inset-0 transition-transform duration-300 ${isMirrored ? 'scale-x-[-1]' : ''}`}
                    style={{ background: theme.background }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.18)_100%)]" />
                  <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: theme.glow }} />
                </>
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.22)_100%)]" />

              {status === 'generating' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(12,12,13,0.28)]">
                    <LoaderCircle size={24} className="animate-spin text-[#DADAE0]" />
                  </div>
                  <div className="mt-5 text-[15px] text-[#D9D9DE]">Your playable draft will appear here shortly.</div>
                  <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[rgba(255,255,255,0.32)]">
                    {activeStep.title}
                  </div>
                  <div className="mt-2 max-w-[360px] px-6 text-[12px] leading-6 text-[rgba(255,255,255,0.42)]">
                    {activeStep.description}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onTogglePlay}
                  className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.14)] text-white transition-all hover:bg-[rgba(255,255,255,0.22)]"
                >
                  <Play size={22} className="translate-x-[2px]" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(8,8,9,0.12)_0%,rgba(8,8,9,0.86)_42%,rgba(8,8,9,0.96)_100%)] px-5 py-4 backdrop-blur-md">
          <div className="mb-3 flex items-center gap-3 text-[11px] text-[rgba(255,255,255,0.76)]">
            <button
              type="button"
              onClick={onTogglePlay}
              disabled={status !== 'generated'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] text-white transition-all hover:border-[rgba(255,132,61,0.4)] hover:text-[#FFD2B4] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Play size={15} className="translate-x-[1px]" />
            </button>
            <span>{currentTimeLabel}</span>
            <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.14)]">
              <div className="h-full rounded-full bg-[#FF843D] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
            <span>{totalTimeLabel}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onToggleMute}
                disabled={status !== 'generated'}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[11px] text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.35)] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                {isMuted ? 'Muted' : 'Volume'}
              </button>
              <button
                type="button"
                onClick={onCyclePlaybackSpeed}
                disabled={status !== 'generated'}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[11px] text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.35)] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Gauge size={14} />
                {`${playbackSpeed}x`}
              </button>
              <button
                type="button"
                onClick={onReplay}
                disabled={status !== 'generated'}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[11px] text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.35)] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                <RotateCcw size={14} />
                Replay
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onToggleMirror}
                disabled={status !== 'generated'}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[11px] text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.35)] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                <FlipHorizontal size={14} />
                Mirror
              </button>
              <button
                type="button"
                onClick={onToggleFullscreen}
                disabled={status !== 'generated'}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[11px] text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.35)] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Maximize2 size={14} />
                Fullscreen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DescriptionPanel({
  mockScenario,
  script,
  rows,
}: {
  mockScenario?: ReturnType<typeof getMockDemoScenarioById> | null;
  script?: Script | null;
  rows: ScriptPlanRow[];
}) {
  const narrativeArc = truncateText(script ? script.narrativeArc : getNarrativeArcText(mockScenario!), 132);
  const emotionalGoal = truncateText(script ? script.emotionalGoal : getEmotionalGoalText(mockScenario!), 92);
  const visualDirection = truncateText(script ? script.visualDirection : mockScenario!.scriptPlan.globalDirection, 112);
  const rhythmText = truncateText(script ? script.rhythm : getRhythmText(mockScenario!, rows), 92);
  const assetLogicText = truncateText(script ? script.assetLogic : getAssetLogicText(mockScenario!), 92);
  const outputSpecText = truncateText(script ? script.outputSpec || `${script.duration} · ${script.category || 'script draft'}` : mockScenario!.outputSpec, 92);

  return (
    <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm md:px-5 md:py-4">
      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="grid gap-4">
          <SummaryInfoCard title="Narrative Arc" summary={narrativeArc} />
          <SummaryInfoCard title="Emotional Goal" summary={emotionalGoal} />
        </div>

        <div className="grid gap-4">
          <SummaryInfoCard title="Visual Direction" summary={visualDirection} />
          <div className="grid gap-4 md:grid-cols-2">
            <SummaryInfoCard title="Rhythm" summary={rhythmText} />
            <SummaryInfoCard title="Asset Logic" summary={assetLogicText} />
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-[rgba(255,255,255,0.08)] pt-4">
        <div className="grid gap-3 md:grid-cols-[140px_minmax(0,1fr)] md:items-start">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8E8E93]">Output Spec</div>
          <div className="flex min-h-0 w-full flex-col rounded-[14px] border border-[rgba(255,255,255,0.04)] bg-[#0C0C0D] px-3.5 py-2.5 text-left">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Output Spec</div>
            <p className="line-clamp-2 text-[12px] leading-[1.55] text-[#F3F3F5]">{outputSpecText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomActions({
  status,
  onGenerate,
}: {
  status: 'generating' | 'generated';
  onGenerate: () => void;
}) {
  return (
    <div className="flex justify-end">
      <div className="flex flex-wrap items-center gap-2">
        <button className="rounded-full border border-[#2A2A2C] bg-[rgba(20,20,21,0.92)] px-4 py-2 text-[12px] text-[#8E8E93] transition-all hover:border-[#FF843D] hover:text-white">
          Revise Plan
        </button>
        <button className="rounded-full border border-[#2A2A2C] bg-[rgba(20,20,21,0.92)] px-4 py-2 text-[12px] text-[#8E8E93] transition-all hover:border-[#FF843D] hover:text-white">
          Save Draft
        </button>
        {status === 'generating' ? (
          <button className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.08)] px-4 py-2 text-[12px] font-medium text-[#E4E4E7] opacity-80" disabled>
            Rendering...
          </button>
        ) : (
          <button
            type="button"
            onClick={onGenerate}
            className="rounded-full bg-[#FF843D] px-4 py-2 text-[12px] font-medium text-white transition-all hover:bg-[#FFA465]"
          >
            Generate Video
          </button>
        )}
      </div>
    </div>
  );
}

function PageTopBackStrip({
  label,
  onBack,
}: {
  label: string;
  onBack: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1.5 text-[11px] font-medium text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-white"
    >
      <ArrowLeft size={14} />
      {label}
    </button>
  );
}

function VideoGenerationShell({
  scenarioId,
  title,
  videoTitle,
  durationLabel,
  outputSpec,
  status,
  videoAsset,
  activeTab,
  onChangeTab,
  summaryScenario,
  summaryScript,
  progressSteps,
  activeIndex,
  rows,
  onRowsChange,
  mentionAssets,
  onTogglePlay,
  videoRef,
  isMuted,
  onToggleMute,
  playbackSpeed,
  onCyclePlaybackSpeed,
  onReplay,
  isMirrored,
  onToggleMirror,
  onToggleFullscreen,
  currentTimeLabel,
  totalTimeLabel,
  progressPercent,
  onGenerate,
  onDownload,
  onAddToAssets,
  activePlanView,
  onPlanViewChange,
  focusedShotIndex,
  onFocusedShotChange,
  onRhythmReorderRows,
}: {
  scenarioId: string;
  title: string;
  videoTitle: string;
  durationLabel: string;
  outputSpec: string;
  status: 'generating' | 'generated';
  videoAsset?: string;
  activeTab: MiddleContentView;
  onChangeTab: (tab: MiddleContentView) => void;
  summaryScenario?: ReturnType<typeof getMockDemoScenarioById> | null;
  summaryScript?: Script | null;
  progressSteps: ProgressStep[];
  activeIndex: number;
  rows: ScriptPlanRow[];
  onRowsChange: (rows: ScriptPlanRow[]) => void;
  mentionAssets: Array<{ id: string; name: string; role: string }>;
  onTogglePlay: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isMuted: boolean;
  onToggleMute: () => void;
  playbackSpeed: number;
  onCyclePlaybackSpeed: () => void;
  onReplay: () => void;
  isMirrored: boolean;
  onToggleMirror: () => void;
  onToggleFullscreen: () => void;
  currentTimeLabel: string;
  totalTimeLabel: string;
  progressPercent: number;
  onGenerate: () => void;
  onDownload: () => void;
  onAddToAssets: () => void;
  activePlanView: PlanViewMode;
  onPlanViewChange: (mode: PlanViewMode) => void;
  focusedShotIndex: number;
  onFocusedShotChange: (index: number) => void;
  onRhythmReorderRows: (rows: ScriptPlanRow[], nextActiveIndex: number) => void;
}) {
  const activeStep = progressSteps[Math.min(activeIndex, progressSteps.length - 1)] ?? progressSteps[0];

  return (
    <div className="space-y-5">
      <SummaryBar
        title={title}
        durationLabel={durationLabel}
        status={status}
        onDownload={onDownload}
        onAddToAssets={onAddToAssets}
      />

      <MiddleContentTabs activeView={activeTab} onChange={onChangeTab} />

      {activeTab === 'video' ? (
        <VideoSurface
          scenarioId={scenarioId}
          title={videoTitle}
          outputSpec={outputSpec}
          status={status}
          videoAsset={videoAsset}
          activeStep={activeStep}
          videoRef={videoRef}
          onTogglePlay={onTogglePlay}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          playbackSpeed={playbackSpeed}
          onCyclePlaybackSpeed={onCyclePlaybackSpeed}
          onReplay={onReplay}
          isMirrored={isMirrored}
          onToggleMirror={onToggleMirror}
          onToggleFullscreen={onToggleFullscreen}
          currentTimeLabel={currentTimeLabel}
          totalTimeLabel={totalTimeLabel}
          progressPercent={progressPercent}
        />
      ) : activeTab === 'emotion' ? (
        <EmotionStructurePanel
          scenarioId={scenarioId}
          rows={rows}
          activeShotIndex={focusedShotIndex}
          activePlanView={activePlanView}
          onSelectShot={onFocusedShotChange}
          onReorderRows={onRhythmReorderRows}
        />
      ) : (
        <DescriptionPanel mockScenario={summaryScenario} script={summaryScript} rows={rows} />
      )}

      <ScriptPlanViews
        scenarioId={scenarioId}
        rows={rows}
        onRowsChange={onRowsChange}
        mentionAssets={mentionAssets}
        focusedShotIndex={focusedShotIndex}
        onFocusedShotChange={onFocusedShotChange}
        onPlanViewChange={onPlanViewChange}
      />

      <BottomActions status={status} onGenerate={onGenerate} />
    </div>
  );
}

export default function EditPage() {
  const { setActiveNav, setPageTitleOverride } = useAppStore();
  const { activeScript, scripts, setActiveScript, videoScriptId } = useScriptStore();
  const {
    activeScenarioId,
    currentStage,
    videoProgressIndex,
    startVideoGeneration,
    completeVideoGeneration,
  } = useMockDemoStore();
  const [activeTab, setActiveTab] = useState<MiddleContentView>('video');
  const [activePlanView, setActivePlanView] = useState<PlanViewMode>('table');
  const [focusedShotIndex, setFocusedShotIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMirrored, setIsMirrored] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [videoDurationSeconds, setVideoDurationSeconds] = useState(0);
  const [videoCurrentSeconds, setVideoCurrentSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const navigateBackOr = (fallbackNav: string) => {
    if (window.history.length > 1 && document.referrer.includes(window.location.origin)) {
      window.history.back();
      return;
    }
    setActiveNav(fallbackNav);
  };

  useEffect(() => {
    setPageTitleOverride('Video / Generated');
    return () => setPageTitleOverride(null);
  }, [setPageTitleOverride]);
  const [planRows, setPlanRows] = useState<ScriptPlanRow[]>([]);
  const [scriptVideoProgressIndex, setScriptVideoProgressIndex] = useState(0);

  const videoScript = useMemo(() => {
    if (!videoScriptId) return null;
    return (activeScript?.id === videoScriptId ? activeScript : null) ?? scripts.find((item) => item.id === videoScriptId) ?? null;
  }, [activeScript, scripts, videoScriptId]);
  const isScriptVideoSession = Boolean(videoScript);
  const scenario = !isScriptVideoSession && activeScenarioId ? getMockDemoScenarioById(activeScenarioId) : null;
  const progressSteps = useMemo(() => {
    if (videoScript) return getScriptProgressSteps(videoScript);
    return scenario?.generation.progressSteps.length ? scenario.generation.progressSteps : getFallbackProgressSteps();
  }, [scenario, videoScript]);
  const activeProgressIndex = isScriptVideoSession
    ? Math.min(scriptVideoProgressIndex, Math.max(progressSteps.length - 1, 0))
    : Math.min(videoProgressIndex, Math.max(progressSteps.length - 1, 0));

  useEffect(() => {
    if (!scenario && !videoScript) return;
    if (currentStage !== 'video_generating' && currentStage !== 'video_result') {
      startVideoGeneration();
    }
  }, [scenario, videoScript, currentStage, startVideoGeneration]);

  useEffect(() => {
    if (currentStage !== 'video_generating' || progressSteps.length === 0) return;

    const lastProgressIndex = Math.max(progressSteps.length - 1, 0);
    const timer = window.setTimeout(() => {
      if (isScriptVideoSession) {
        if (scriptVideoProgressIndex >= lastProgressIndex) {
          completeVideoGeneration();
          return;
        }
        setScriptVideoProgressIndex((prev) => Math.min(prev + 1, lastProgressIndex));
        return;
      }

      if (videoProgressIndex >= lastProgressIndex) {
        completeVideoGeneration();
        return;
      }

      useMockDemoStore.getState().nextVideoProgress();
    }, 850);

    return () => window.clearTimeout(timer);
  }, [currentStage, videoProgressIndex, scriptVideoProgressIndex, progressSteps, completeVideoGeneration, isScriptVideoSession]);

  useEffect(() => {
    if (videoScript) {
      setPlanRows(mapScriptToPlanRows(videoScript));
      setFocusedShotIndex(0);
      setActiveTab('video');
      setScriptVideoProgressIndex(0);
      return;
    }
    if (!scenario) {
      setPlanRows([]);
      return;
    }
    setPlanRows(scenario.scriptPlan.rows.map((row) => ({ ...row })));
    setFocusedShotIndex(0);
  }, [scenario?.id, videoScript?.id]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      setVideoDurationSeconds(0);
      setVideoCurrentSeconds(0);
      return;
    }

    const syncMetadata = () => {
      setVideoDurationSeconds(videoElement.duration || 0);
      setVideoCurrentSeconds(videoElement.currentTime || 0);
    };
    const syncTime = () => setVideoCurrentSeconds(videoElement.currentTime || 0);
    const handleEnded = () => setIsPlaying(false);

    syncMetadata();
    videoElement.addEventListener('loadedmetadata', syncMetadata);
    videoElement.addEventListener('durationchange', syncMetadata);
    videoElement.addEventListener('timeupdate', syncTime);
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('loadedmetadata', syncMetadata);
      videoElement.removeEventListener('durationchange', syncMetadata);
      videoElement.removeEventListener('timeupdate', syncTime);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [currentStage, videoScript?.id, scenario?.id]);

  const videoAsset = videoScript?.videoAsset || scenario?.videoAsset;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoAsset || !videoElement || currentStage !== 'video_result') {
      return;
    }

    videoElement.muted = isMuted;
  }, [currentStage, isMuted, videoAsset]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoAsset || !videoElement || currentStage !== 'video_result') {
      return;
    }

    videoElement.playbackRate = playbackSpeed;
  }, [currentStage, playbackSpeed, videoAsset]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoAsset || !videoElement || currentStage !== 'video_result') {
      return;
    }

    if (isPlaying) {
      videoElement.play().catch(() => {
        setIsPlaying(false);
      });
      return;
    }

    videoElement.pause();
  }, [currentStage, isPlaying, videoAsset]);

  const handleRegenerate = () => {
    setIsPlaying(false);
    setIsMuted(true);
    setPlaybackSpeed(1);
    setIsMirrored(false);
    setActiveTab('video');
    setActionMessage('');
    setScriptVideoProgressIndex(0);
    startVideoGeneration();
  };

  if (!scenario && !videoScript) {
    return (
      <div className="flex min-h-[calc(100vh-160px)] items-center justify-center pb-24">
        <div className="max-w-[520px] px-6 text-center">
          <h2 className="mb-3 text-[22px] font-semibold text-[#FFFFFF]">No Mock Video Session</h2>
          <p className="mb-6 text-[14px] leading-7 text-[#9A9A9E]">
            Start from Home and complete the mock demo flow through Generate and Script before opening Edit.
          </p>
          <button
            onClick={() => setActiveNav('home')}
            className="rounded-full bg-[#FF843D] px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465]"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const pageTitle = `Generated Script Plan · ${videoScript?.title || scenario?.label || 'Generated Script Plan'}`;
  const videoTitle = videoScript?.title || scenario?.scriptPlan.title || scenario?.label || 'Generated Video Preview';
  const outputSpec = videoScript?.outputSpec || scenario?.outputSpec || '9:16 · 15s · 1080p';
  const durationLabel = getDurationLabel(outputSpec);
  const status = currentStage === 'video_result' ? 'generated' : 'generating';
  const totalTimeLabel = status === 'generated' && videoAsset ? formatPlaybackTime(videoDurationSeconds) : durationLabel;
  const progressPercent =
    status === 'generated'
      ? videoAsset
        ? videoDurationSeconds > 0
          ? Math.min((videoCurrentSeconds / videoDurationSeconds) * 100, 100)
          : 0
        : isPlaying
          ? 62
          : 0
      : Math.min(progressSteps[activeProgressIndex]?.progress ?? 0, 100);
  const currentTimeLabel = status === 'generated' ? (videoAsset ? formatPlaybackTime(videoCurrentSeconds) : isPlaying ? '0:09' : '0:00') : 'Rendering';
  const displayedRows = planRows.length > 0 ? planRows : videoScript ? mapScriptToPlanRows(videoScript) : scenario!.scriptPlan.rows;
  const composerMentionAssets = videoScript
    ? getScriptMentionAssets(videoScript)
    : scenario!.mockAssets.length
    ? scenario!.mockAssets
    : [
        { id: 'default-1', name: 'Image 1 · Subject Reference', role: 'Primary subject and silhouette guidance' },
        { id: 'default-2', name: 'Image 2 · Scene Reference', role: 'Space, environment, and framing direction' },
        { id: 'default-3', name: 'Image 3 · Mood Reference', role: 'Lighting, palette, and emotional tone' },
      ];

  return (
    <div>
      {actionMessage && (
        <div className="mb-4 rounded-[18px] border border-[rgba(76,217,100,0.18)] bg-[rgba(76,217,100,0.08)] px-4 py-3 text-[12px] text-[#C8F7D4]">
          {actionMessage}
        </div>
      )}
      <div className="mb-4">
        <PageTopBackStrip label="Back to Script" onBack={() => navigateBackOr('script')} />
      </div>
      <VideoGenerationShell
        scenarioId={videoScript ? getScriptThemeId(videoScript) : scenario!.id}
        title={pageTitle}
        videoTitle={videoTitle}
        durationLabel={durationLabel}
        outputSpec={outputSpec}
        status={status}
        videoAsset={videoAsset}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        progressSteps={progressSteps}
        activeIndex={activeProgressIndex}
        rows={displayedRows}
        onRowsChange={(nextRows) => {
          setPlanRows(nextRows);
          if (videoScript) {
            setActiveScript({
              ...videoScript,
              shots: mapPlanRowsToScriptShots(nextRows, videoScript),
            });
          }
        }}
        mentionAssets={composerMentionAssets}
        onTogglePlay={() => setIsPlaying((prev) => !prev)}
        videoRef={videoRef}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        playbackSpeed={playbackSpeed}
        onCyclePlaybackSpeed={() => setPlaybackSpeed((prev) => (prev === 0.5 ? 1 : prev === 1 ? 1.5 : prev === 1.5 ? 2 : 0.5))}
        onReplay={() => {
          if (videoAsset && videoRef.current) {
            videoRef.current.currentTime = 0;
          }
          setIsPlaying(true);
        }}
        isMirrored={isMirrored}
        onToggleMirror={() => setIsMirrored((prev) => !prev)}
        onToggleFullscreen={() => {
          if (videoAsset && videoRef.current) {
            videoRef.current.requestFullscreen?.().catch(() => {
              setActionMessage('Unable to open fullscreen for the local demo video in this browser session.');
            });
            return;
          }
          setActionMessage('Mock fullscreen opened. No real media element is attached in demo mode.');
        }}
        currentTimeLabel={currentTimeLabel}
        totalTimeLabel={totalTimeLabel}
        progressPercent={progressPercent}
        onGenerate={handleRegenerate}
        onDownload={() => setActionMessage('Mock video download started. No real video file was generated.')}
        onAddToAssets={() => setActionMessage('Video added to Assets. This is a mock local action only.')}
        activePlanView={activePlanView}
        onPlanViewChange={setActivePlanView}
        focusedShotIndex={focusedShotIndex}
        onFocusedShotChange={setFocusedShotIndex}
        onRhythmReorderRows={(nextRows, nextActiveIndex) => {
          setPlanRows(nextRows);
          setFocusedShotIndex(nextActiveIndex);
          if (videoScript) {
            setActiveScript({
              ...videoScript,
              shots: mapPlanRowsToScriptShots(nextRows, videoScript),
            });
          }
        }}
        summaryScript={videoScript}
        summaryScenario={scenario}
      />

      <FlowChatboxDock>
        {({ onInputFocusChange, onPopoverStateChange, onInteractionLockChange }) => (
          <ScriptPlanComposerShell
            mentionAssets={composerMentionAssets}
            resetKey={`${videoScript?.id || scenario?.id || 'video-session'}-${status}`}
            scriptShots={displayedRows.map((row, index) => ({
              id: `${row.time}-${index}`,
              label: `Shot ${String(index + 1).padStart(2, '0')}`,
              time: row.time,
              title: row.purpose || `Beat ${index + 1}`,
            }))}
            activeShotId={displayedRows[focusedShotIndex] ? `${displayedRows[focusedShotIndex].time}-${focusedShotIndex}` : `shot-${focusedShotIndex}`}
            actionLabel="Generate Script"
            onAction={() => {}}
            footerNote="Composer controls remain mock-only in the generation workspace."
            onInputFocusChange={onInputFocusChange}
            onPopoverStateChange={onPopoverStateChange}
            onInteractionLockChange={onInteractionLockChange}
          />
        )}
      </FlowChatboxDock>
    </div>
  );
}
