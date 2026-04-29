import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useGenerateStore } from '@/stores/useGenerateStore';
import { useMockDemoStore } from '@/stores/useMockDemoStore';
import { useScriptStore } from '@/stores/useScriptStore';
import { getMockDemoScenarioById } from '@/lib/mockDemoScenarios';
import {
  MOCK_GENERATE_PROJECT_HISTORY,
  MOCK_GENERATE_SINGLE_HISTORY,
  type GenerateHistoryProjectItem,
  type GenerateHistoryProjectSequence,
  type GenerateHistorySingleItem,
} from '@/lib/mockGenerateHistory';
import { GenerateHistoryPanel } from '@/components/generate/GenerateHistoryPanel';
import { GenerateWorkspace } from '@/components/generate/GenerateWorkspace';
import { GeneratePageChatbox } from '@/components/generate/GeneratePageChatbox';
import { GuidedStageProgress } from '@/components/shared/GuidedStageProgress';
import { getGuidedStageItems } from '@/lib/mockDemoStageProgress';
import { MockComposerShell } from '@/components/shared/MockComposerShell';
import { FlowChatboxDock } from '@/components/shared/FlowChatboxDock';
import { AmbientGlow } from '@/components/AmbientGlow';
import { CheckCircle2, ChevronRight, FileText, Sparkles } from 'lucide-react';

type GenerateHistoryItem = GenerateHistorySingleItem | GenerateHistoryProjectItem;
type DetailTab = 'description' | 'video' | 'scriptPlan';

function getDefaultDetailTab(item: GenerateHistoryItem): DetailTab {
  if (item.type === 'project') return 'description';
  return item.statusTag === 'Draft' ? 'description' : 'video';
}

function buildHistoryMentionAssets(item: GenerateHistoryItem | null) {
  if (!item) return [];

  if (item.type === 'single') {
    return item.script.shots.slice(0, 5).map((shot, index) => ({
      id: `${item.id}-mention-${shot.id}`,
      name: `Shot ${String(index + 1).padStart(2, '0')} · ${shot.purpose}`,
      thumbnail: shot.preview || item.script.coverImage,
    }));
  }

  return item.sequences.map((sequence, index) => ({
    id: `${item.id}-mention-${sequence.id}`,
    name: `Sequence ${String(index + 1).padStart(2, '0')} · ${sequence.title}`,
    thumbnail: sequence.thumbnail,
  }));
}

function buildScriptFromProjectSequence(sequence: GenerateHistoryProjectSequence) {
  return {
    ...sequence.script,
    id: `${sequence.script.id}-${sequence.id}`,
    title: sequence.title,
    duration: sequence.duration,
    shortDescription: sequence.summary,
    coverImage: sequence.thumbnail,
    shots: sequence.script.shots.map((shot) => ({
      ...shot,
      preview: shot.preview || sequence.thumbnail,
    })),
  };
}

function buildScriptPageProjectIntent(item: GenerateHistoryProjectItem) {
  return {
    id: item.id,
    title: item.title,
    status: item.statusTag === 'Draft' ? ('Drafting' as const) : ('Ready' as const),
    duration: item.duration,
    description: item.narrativeDirection,
    cover: item.cover,
    sequenceCount: item.sequenceCount,
    aspectRatio: item.aspectRatio,
    frameRate: item.frameRate,
    renderMode: item.renderMode,
    collaborationMode: {
      summary: item.collaborationMode.split('·')[0]?.trim() || item.collaborationMode,
      contributors: item.sequences.length,
      syncStatus: item.collaborationMode.split('·').slice(1).join(' · ').trim() || 'Version synced',
      tags: item.collaborationMode.split('·').map((part) => part.trim()).filter(Boolean),
    },
    narrativeDirection: item.narrativeDirection,
    lastEdited: item.updatedAt,
    collaborators: ['SV', 'MK', 'JL'].slice(0, Math.max(2, Math.min(item.sequenceCount, 3))),
    sequences: item.sequences.map((sequence, index) => ({
      id: sequence.id,
      scriptKey: sequence.script.id,
      number: String(index + 1).padStart(2, '0'),
      duration: sequence.duration,
      status: sequence.status === 'Draft' ? ('Draft' as const) : ('Ready' as const),
      title: sequence.title,
      description: sequence.summary,
      tags: [
        sequence.status.toUpperCase(),
        sequence.script.category?.split('/')[0]?.trim() || 'SEQUENCE',
      ],
      preview: sequence.thumbnail,
      previewLabel: index === 0 ? 'Main Preview' : undefined,
      technicalIntent: {
        motion: sequence.script.shots[0]?.camera || 'Mock motion plan',
        lighting: sequence.script.visualDirection || 'Mock lighting direction',
        lens: sequence.script.category || 'Mock lens direction',
        sound: sequence.script.shots[0]?.copy || sequence.summary,
      },
    })),
  };
}

export default function GeneratePage() {
  const { setActiveNav, setScriptPageIntent, setScriptPageRoute } = useAppStore();
  const { setActiveScript } = useScriptStore();
  const { pendingHomeInput, clearPendingHomeInput } = useGenerateStore();
  const {
    activeScenarioId,
    currentStage,
    currentQuestionIndex,
    selectedAnswers,
    classificationDetail,
    startFromPrompt,
    startQuestions,
    selectAnswer,
    nextQuestion,
    goToIntentSummary,
    generateScriptPlan,
  } = useMockDemoStore();
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('description');
  const [composerFocusSignal, setComposerFocusSignal] = useState(0);
  const [collapsedGroups, setCollapsedGroups] = useState({ single: false, project: false });

  const scenario = useMemo(
    () => (activeScenarioId ? getMockDemoScenarioById(activeScenarioId) : null),
    [activeScenarioId],
  );
  const selectedHistoryItem = useMemo<GenerateHistoryItem | null>(
    () =>
      MOCK_GENERATE_SINGLE_HISTORY.find((item) => item.id === selectedHistoryId) ||
      MOCK_GENERATE_PROJECT_HISTORY.find((item) => item.id === selectedHistoryId) ||
      null,
    [selectedHistoryId],
  );
  const workspaceMentionAssets = useMemo(
    () => buildHistoryMentionAssets(selectedHistoryItem),
    [selectedHistoryItem],
  );
  const isGenerateFlowStage = Boolean(
    scenario &&
      (currentStage === 'ai_understanding' ||
        currentStage === 'questions' ||
        currentStage === 'intent_summary'),
  );

  const currentQuestion = scenario?.questions[currentQuestionIndex];
  const selectedValue = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;

  useEffect(() => {
    if (currentStage === 'intent_summary' && scenario) {
      generateScriptPlan();
      setScriptPageRoute('current_generation');
      setActiveNav('script');
    }
  }, [currentStage, generateScriptPlan, scenario, setActiveNav, setScriptPageRoute]);

  useEffect(() => {
    if (!pendingHomeInput || activeScenarioId) return;

    setSelectedHistoryId(null);
    setComposerFocusSignal((prev) => prev + 1);
  }, [activeScenarioId, pendingHomeInput]);

  const availableMentionAssets = scenario?.mockAssets.length
    ? scenario.mockAssets
    : [
        {
          id: 'default-1',
          name: 'Image 1 · Subject Reference',
          role: 'Primary subject and silhouette guidance',
        },
        {
          id: 'default-2',
          name: 'Image 2 · Scene Reference',
          role: 'Space, environment, and framing direction',
        },
        {
          id: 'default-3',
          name: 'Image 3 · Mood Reference',
          role: 'Lighting, palette, and emotional tone',
        },
      ];

  const getUnderstandingSummary = () => {
    switch (scenario?.id) {
      case 'backrooms_vlog_fuzzy_no_asset':
        return 'A realistic first-person vlog inside a Backrooms-like space, built around quiet tension, handheld realism, and a short escalation from exploration to an unresolved final beat.';
      case 'dream_video_with_assets':
        return 'A 15-second dreamlike video shaped by three references: Image 1 for the main figure, Image 2 for the remembered space, and Image 3 for mood, light, and color. The piece should feel emotionally immersive and minimally narrative.';
      case 'fragrance_ad_script_with_assets':
        return 'A premium fragrance brand film with a clear commercial brief, using product, urban night, talent mood, and logo references to build a restrained 15-second vertical spot.';
      default:
        return scenario?.aiUnderstanding.mainFeedback ?? '';
    }
  };

  const getTechnicalMapping = () => {
    switch (scenario?.id) {
      case 'backrooms_vlog_fuzzy_no_asset':
        return {
          topic: 'Backrooms POV vlog',
          style: 'Realistic handheld tension',
          goal: 'A short suspense video',
          constraint: 'No assets, no real API generation',
        };
      case 'dream_video_with_assets':
        return {
          topic: 'Dreamwalk through a memory space',
          style: 'Quiet / soft / dreamlike atmospheric flow',
          goal: 'A poetic 15-second emotional drift',
          constraint: 'Uses 3 mock references with fixed local roles',
        };
      case 'fragrance_ad_script_with_assets':
        return {
          topic: 'Fragrance brand film',
          style: 'Quiet luxury commercial',
          goal: 'Premium 15s product spot',
          constraint: 'Uses 4 mock references',
        };
      default:
        return {
          topic: scenario?.label ?? 'Mock video concept',
          style: scenario?.outputSpec ?? 'Structured mock demo output',
          goal: 'Create a structured video script plan',
          constraint: 'Fixed golden-path mock result',
        };
    }
  };

  const getNextStepCopy = () => {
    switch (scenario?.id) {
      case 'backrooms_vlog_fuzzy_no_asset':
        return 'Next, I will guide you through a few brief questions to help turn your idea into an executable video plan.';
      case 'dream_video_with_assets':
        return 'Next, I will confirm the emotional tone, movement, environment, abstraction level, atmospheric structure, and light direction before creating the script plan.';
      case 'fragrance_ad_script_with_assets':
        return 'Next, I will quickly confirm the production priorities before turning your brief into a structured script plan.';
      default:
        return 'Next, I will guide you through a few brief questions before creating the script plan.';
    }
  };

  const submittedPrompt = scenario?.homePrompt ?? '';
  const technicalMapping = getTechnicalMapping();

  const renderAiUnderstanding = () => (
    <div className="space-y-5 md:space-y-6">
      <div className="rounded-[28px] border border-[#2A2A2C] bg-[rgba(20,20,21,0.88)] px-5 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm md:px-7 md:py-6">
        {scenario?.mockAssets.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {scenario.mockAssets.map((asset) => (
              <span
                key={asset.id}
                className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1.5 text-[12px] text-[#E7E7EA]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF843D]" />
                {asset.name}
              </span>
            ))}
          </div>
        ) : null}
        <p className="text-[15px] leading-8 text-[#F3F3F5] md:text-[17px]">{submittedPrompt}</p>
      </div>

      <div className="px-1 text-[13px] text-[#8E8E93]">Thought for 7s</div>

      <div className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(22,22,24,0.92)_0%,rgba(15,15,16,0.94)_100%)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm md:p-8">
        <div className="mb-6 flex items-center gap-2 text-[#FFFFFF]">
          <Sparkles size={16} />
          <h2 className="text-[14px] font-semibold uppercase tracking-[0.2em] md:text-[15px]">
            AI Understanding Synthesis
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)]">
          <div className="space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8E8E93]">
              Narrative Arc Extraction
            </div>
            <div className="rounded-[24px] bg-[#0C0C0D] px-5 py-5 md:px-6 md:py-6">
              <p className="text-[14px] leading-7 text-[#E7E7EA] md:text-[15px]">
                {getUnderstandingSummary()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8E8E93]">
              Technical Mapping
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'TOPIC', value: technicalMapping.topic },
                { label: 'STYLE', value: technicalMapping.style },
                { label: 'GOAL', value: technicalMapping.goal },
                { label: 'CONSTRAINT', value: technicalMapping.constraint },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] bg-[#0C0C0D] px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-10 w-[3px] rounded-full bg-[#FF843D]" />
                    <div>
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                        {item.label}
                      </div>
                      <div className="text-[13px] leading-6 text-[#F3F3F5]">{item.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3 border-t border-[rgba(255,255,255,0.06)] pt-5">
          {scenario?.aiUnderstanding.detectedAssets?.length ? (
            <div className="flex flex-wrap gap-2">
              {scenario.aiUnderstanding.detectedAssets.map((asset) => (
                <span
                  key={asset}
                  className="rounded-full border border-[#2A2A2C] bg-[#111113] px-3 py-1.5 text-[12px] text-[#D4D4D8]"
                >
                  {asset}
                </span>
              ))}
            </div>
          ) : null}
          <div className="text-[12px] leading-6 text-[#8E8E93]">
            <span className="uppercase tracking-[0.18em] text-[#71717A]">Classification:</span>{' '}
            {classificationDetail?.reason ?? scenario?.aiUnderstanding.recommendedFlow}
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={startQuestions}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465]"
            >
              Start Guided Questions <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <p className="px-1 text-[14px] leading-7 text-[#CFCFD4] md:text-[15px]">{getNextStepCopy()}</p>

      <FlowChatboxDock>
        {({ onInputFocusChange, onPopoverStateChange }) => (
          <MockComposerShell
            mentionAssets={availableMentionAssets}
            resetKey={`${scenario?.id || 'generate'}-understanding`}
            ctaLabel="Generate"
            onCta={() => {}}
            onInputFocusChange={onInputFocusChange}
            onPopoverStateChange={onPopoverStateChange}
          />
        )}
      </FlowChatboxDock>
    </div>
  );

  const renderQuestionStage = () => {
    if (!scenario || !currentQuestion) {
      goToIntentSummary();
      return null;
    }

    const recommendedValues = Array.isArray(currentQuestion.recommended)
      ? currentQuestion.recommended
      : [currentQuestion.recommended];
    const guidedStages = getGuidedStageItems(scenario.id, currentQuestionIndex);
    const isLastQuestion = currentQuestionIndex >= scenario.questions.length - 1;

    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-[#141415] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.3)] md:p-7">
          <GuidedStageProgress stages={guidedStages} />
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-wider text-[#9A9A9E]">
                {currentQuestion.stage}
              </div>
              <h2 className="mb-2 text-[20px] font-semibold text-[#FFFFFF]">
                {currentQuestion.question}
              </h2>
              <p className="text-[13px] leading-6 text-[#9A9A9E]">{currentQuestion.helper}</p>
            </div>
            <div className="rounded-full bg-[#0A0A0B] px-3 py-1.5 text-[12px] text-[#FFFFFF]">
              {currentQuestionIndex + 1} / {scenario.questions.length}
            </div>
          </div>

          <div className="grid gap-3">
            {currentQuestion.options.map((option) => {
              const isSelected = Array.isArray(selectedValue)
                ? selectedValue.includes(option.value)
                : selectedValue === option.value;
              const isRecommended = recommendedValues.includes(option.value);

              return (
                <button
                  key={option.value}
                  onClick={() => selectAnswer(currentQuestion.id, option.value)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-[#FF843D] bg-[#1E1E20]'
                      : 'border-[#2A2A2C] bg-[#0A0A0B] hover:border-[#FF843D]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-1 text-[14px] font-medium text-[#FFFFFF]">
                        {option.label}
                      </div>
                      <div className="text-[12px] leading-5 text-[#9A9A9E]">{option.description}</div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 size={16} className="shrink-0 text-[#FF843D]" />
                    ) : null}
                  </div>
                  {isRecommended ? (
                    <div className="mt-3 text-[11px] uppercase tracking-wider text-[#FF843D]">
                      Recommended
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-[12px] text-[#9A9A9E]">
              {selectedValue
                ? scenario.answerFeedback[currentQuestion.id] ?? 'Selection saved locally.'
                : 'Select an option to continue. Multi-select questions support repeated clicks.'}
            </div>
            <button
              onClick={() => {
                if (isLastQuestion) {
                  generateScriptPlan();
                  setScriptPageRoute('current_generation');
                  setActiveNav('script');
                  return;
                }

                nextQuestion();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465]"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <FlowChatboxDock>
          {({ onInputFocusChange, onPopoverStateChange }) => (
            <MockComposerShell
              mentionAssets={availableMentionAssets}
              resetKey={`${scenario.id}-questions-${currentQuestionIndex}`}
              onInputFocusChange={onInputFocusChange}
              onPopoverStateChange={onPopoverStateChange}
            />
          )}
        </FlowChatboxDock>
      </div>
    );
  };

  const renderIntentSummary = () =>
    scenario ? (
      <div className="rounded-2xl bg-[#141415] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.3)] md:p-7">
        <div className="mb-4 flex items-center gap-2 text-[#FFFFFF]">
          <FileText size={16} />
          <h2 className="text-[18px] font-semibold">{scenario.intentSummary.title}</h2>
        </div>
        <p className="mb-6 text-[14px] leading-7 text-[#D4D4D8]">
          {scenario.intentSummary.mainCopy}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-[#0A0A0B] p-4">
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E]">
              Confirmed Direction
            </h3>
            <div className="space-y-2">
              {scenario.intentSummary.confirmedDirection.map((item) => (
                <div key={item} className="text-[13px] text-[#FFFFFF]">
                  • {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-[#0A0A0B] p-4">
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E]">
              Generation Notes
            </h3>
            <div className="space-y-2">
              {scenario.intentSummary.generationNotes.map((item) => (
                <div key={item} className="text-[13px] text-[#FFFFFF]">
                  • {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              generateScriptPlan();
              setScriptPageRoute('current_generation');
              setActiveNav('script');
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465]"
          >
            {scenario.intentSummary.cta} <ChevronRight size={14} />
          </button>
        </div>
      </div>
    ) : null;

  const handleToggleHistoryGroup = (group: 'single' | 'project') => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleSelectHistory = (item: GenerateHistoryItem) => {
    setSelectedHistoryId(item.id);
    setActiveDetailTab(getDefaultDetailTab(item));
  };

  const handleNewScript = () => {
    setSelectedHistoryId(null);
    setActiveDetailTab('description');
    setComposerFocusSignal((prev) => prev + 1);
  };

  const handleOpenPlan = (item: GenerateHistorySingleItem) => {
    setActiveScript({ ...item.script });
    setScriptPageIntent({ type: 'script_editor' });
    setActiveNav('script');
  };

  const handleOpenProject = (item: GenerateHistoryProjectItem) => {
    setScriptPageIntent({
      type: 'project_detail',
      project: buildScriptPageProjectIntent(item),
    });
    setActiveNav('script');
  };

  const handleOpenProjectSequence = (project: GenerateHistoryProjectItem, sequenceId: string) => {
    const sequence = project.sequences.find((item) => item.id === sequenceId);
    if (!sequence) return;

    setActiveScript(buildScriptFromProjectSequence(sequence));
    setScriptPageIntent({ type: 'script_editor' });
    setActiveNav('script');
  };

  const handleGenerateFromWorkspace = (input: string, attachedAssets: File[]) => {
    if (pendingHomeInput) {
      clearPendingHomeInput();
    }
    const assetInputs = attachedAssets.map((file, index) => ({
      id: `${file.name}-${index}-${file.lastModified}`,
      name: file.name,
      type: file.type,
    }));
    startFromPrompt(input, assetInputs);
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)]">
      <AmbientGlow variant="warm" fixed={false} />

      {isGenerateFlowStage && scenario ? (
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-wider text-[#9A9A9E]">Generate</div>
              <h1 className="text-[26px] font-bold text-[#FFFFFF] md:text-[30px]">{scenario.label}</h1>
              <p className="mt-2 max-w-[760px] text-[13px] leading-6 text-[#9A9A9E]">
                {scenario.outputSpec}
              </p>
            </div>
          </div>

          {currentStage === 'ai_understanding' && renderAiUnderstanding()}
          {currentStage === 'questions' && renderQuestionStage()}
          {currentStage === 'intent_summary' && null}
          {(currentStage === 'video_generating' || currentStage === 'video_result') &&
            renderIntentSummary()}
        </div>
      ) : (
        <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-[1460px] flex-col">
          <div className="mb-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
              Generate
            </div>
            <h1 className="mt-2 text-[28px] font-semibold text-white md:text-[32px]">
              Generate Workspace
            </h1>
            <p className="mt-3 max-w-[860px] text-[14px] leading-7 text-[#9A9A9E]">
              Browse history, inspect previous scripts, and continue generating directly from this workspace without returning to Home.
            </p>
          </div>

          <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[272px_minmax(0,1fr)]">
            <div className="min-h-0">
              <GenerateHistoryPanel
                singleItems={MOCK_GENERATE_SINGLE_HISTORY}
                projectItems={MOCK_GENERATE_PROJECT_HISTORY}
                selectedHistoryId={selectedHistoryId}
                collapsedGroups={collapsedGroups}
                onToggleGroup={handleToggleHistoryGroup}
                onSelectHistory={handleSelectHistory}
                onNewScript={handleNewScript}
              />
            </div>

            <div className="min-h-0">
              <GenerateWorkspace
                selectedItem={selectedHistoryItem}
                activeDetailTab={activeDetailTab}
                onDetailTabChange={setActiveDetailTab}
                onOpenPlan={handleOpenPlan}
                onOpenProject={handleOpenProject}
                onOpenSequence={handleOpenProjectSequence}
              />
            </div>
          </div>

          <div className="sticky bottom-0 z-10 mt-5 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/96 to-transparent pt-6">
            <GeneratePageChatbox
              resetKey={`generate-workspace-${selectedHistoryId ?? 'new'}-${pendingHomeInput?.text ?? 'empty'}`}
              autoFocusSignal={composerFocusSignal}
              initialInput={pendingHomeInput?.text}
              mentionAssets={workspaceMentionAssets}
              selectedContextTitle={selectedHistoryItem?.title ?? null}
              onSubmit={handleGenerateFromWorkspace}
            />
          </div>
        </div>
      )}
    </div>
  );
}
