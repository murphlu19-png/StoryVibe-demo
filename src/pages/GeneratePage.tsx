import { useEffect, useMemo } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useMockDemoStore } from '@/stores/useMockDemoStore';
import { getMockDemoScenarioById } from '@/lib/mockDemoScenarios';
import { GuidedStageProgress } from '@/components/shared/GuidedStageProgress';
import { getGuidedStageItems } from '@/lib/mockDemoStageProgress';
import { MockComposerShell } from '@/components/shared/MockComposerShell';
import { AmbientGlow } from '@/components/AmbientGlow';
import { ArrowLeft, CheckCircle2, ChevronRight, FileText, Sparkles } from 'lucide-react';

export default function GeneratePage() {
  const { setActiveNav } = useAppStore();
  const {
    activeScenarioId,
    currentStage,
    currentQuestionIndex,
    selectedAnswers,
    classificationDetail,
    startQuestions,
    selectAnswer,
    nextQuestion,
    goToIntentSummary,
    generateScriptPlan,
  } = useMockDemoStore();

  const scenario = useMemo(
    () => (activeScenarioId ? getMockDemoScenarioById(activeScenarioId) : null),
    [activeScenarioId],
  );

  const currentQuestion = scenario?.questions[currentQuestionIndex];
  const selectedValue = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;

  useEffect(() => {
    if (currentStage === 'intent_summary' && scenario) {
      generateScriptPlan();
      setActiveNav('script');
    }
  }, [currentStage, generateScriptPlan, scenario, setActiveNav]);

  const availableMentionAssets = scenario?.mockAssets.length
    ? scenario.mockAssets
    : [
        { id: 'default-1', name: 'Image 1 · Subject Reference', role: 'Primary subject and silhouette guidance' },
        { id: 'default-2', name: 'Image 2 · Scene Reference', role: 'Space, environment, and framing direction' },
        { id: 'default-3', name: 'Image 3 · Mood Reference', role: 'Lighting, palette, and emotional tone' },
      ];

  const getUnderstandingSummary = () => {
    switch (scenario?.id) {
      case 'backrooms_vlog_fuzzy_no_asset':
        return 'A realistic first-person vlog inside a Backrooms-like space, built around quiet tension, handheld realism, and a short escalation from exploration to an unresolved final beat.';
      case 'dream_video_with_assets':
        return 'A quiet dreamlike visual piece shaped by three references: subject, space, and mood. The video should feel like moving through a memory rather than following a literal plot.';
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
          topic: 'Dreamlike memory video',
          style: 'Soft surreal emotional flow',
          goal: 'Asset-guided visual film',
          constraint: 'Uses 3 mock references',
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
        return 'Next, I will confirm how the references should guide the subject, space, mood, and ending before creating the script plan.';
      case 'fragrance_ad_script_with_assets':
        return 'Next, I will quickly confirm the production priorities before turning your brief into a structured script plan.';
      default:
        return 'Next, I will guide you through a few brief questions before creating the script plan.';
    }
  };

  const submittedPrompt = scenario?.homePrompt ?? '';
  const technicalMapping = getTechnicalMapping();

  if (!scenario) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center max-w-[520px] px-6">
          <AmbientGlow variant="warm" fixed={false} />
          <h2 className="text-[24px] font-semibold text-[#FFFFFF] mb-3">Start from Home</h2>
          <p className="text-[14px] text-[#9A9A9E] leading-relaxed mb-6">
            Enter a prompt on Home and click Generate Script. The mock demo flow classifies the prompt locally and routes you into the matching scenario automatically.
          </p>
          <button
            onClick={() => setActiveNav('home')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465] transition-all"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  const renderAiUnderstanding = () => (
    <div className="space-y-5 md:space-y-6">
      <div className="rounded-[28px] border border-[#2A2A2C] bg-[rgba(20,20,21,0.88)] px-5 py-5 md:px-7 md:py-6 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        {scenario.mockAssets.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
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
        )}
        <p className="text-[15px] md:text-[17px] leading-8 text-[#F3F3F5]">
          {submittedPrompt}
        </p>
      </div>

      <div className="px-1 text-[13px] text-[#8E8E93]">Thought for 7s</div>

      <div className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(22,22,24,0.92)_0%,rgba(15,15,16,0.94)_100%)] p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6 text-[#FFFFFF]">
          <Sparkles size={16} />
          <h2 className="text-[14px] md:text-[15px] font-semibold tracking-[0.2em] uppercase">
            AI Understanding Synthesis
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)]">
          <div className="space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8E8E93]">
              Narrative Arc Extraction
            </div>
            <div className="rounded-[24px] bg-[#0C0C0D] px-5 py-5 md:px-6 md:py-6">
              <p className="text-[14px] md:text-[15px] leading-7 text-[#E7E7EA]">
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
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93] mb-2">
                        {item.label}
                      </div>
                      <div className="text-[13px] leading-6 text-[#F3F3F5]">
                        {item.value}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-[rgba(255,255,255,0.06)] space-y-3">
          {scenario.aiUnderstanding.detectedAssets && scenario.aiUnderstanding.detectedAssets.length > 0 && (
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
          )}
          <div className="text-[12px] leading-6 text-[#8E8E93]">
            <span className="uppercase tracking-[0.18em] text-[#71717A]">Classification:</span>{' '}
            {classificationDetail?.reason ?? scenario.aiUnderstanding.recommendedFlow}
          </div>
        </div>
      </div>

      <p className="px-1 text-[14px] md:text-[15px] leading-7 text-[#CFCFD4]">
        {getNextStepCopy()}
      </p>

      <MockComposerShell
        mentionAssets={availableMentionAssets}
        resetKey={`${scenario.id}-understanding`}
        ctaLabel="Start Guided Questions"
        onCta={startQuestions}
      />
    </div>
  );

  const renderQuestionStage = () => {
    if (!currentQuestion) {
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
        <div className="bg-[#141415] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-6 md:p-7">
          <GuidedStageProgress stages={guidedStages} />
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#9A9A9E] mb-2">{currentQuestion.stage}</div>
              <h2 className="text-[20px] font-semibold text-[#FFFFFF] mb-2">{currentQuestion.question}</h2>
              <p className="text-[13px] text-[#9A9A9E] leading-6">{currentQuestion.helper}</p>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-[#0A0A0B] text-[12px] text-[#FFFFFF]">
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
                  className={`text-left rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-[#FF843D] bg-[#1E1E20]'
                      : 'border-[#2A2A2C] bg-[#0A0A0B] hover:border-[#FF843D]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-medium text-[#FFFFFF] mb-1">{option.label}</div>
                      <div className="text-[12px] text-[#9A9A9E] leading-5">{option.description}</div>
                    </div>
                    {isSelected ? <CheckCircle2 size={16} className="text-[#FF843D] shrink-0" /> : null}
                  </div>
                  {isRecommended && (
                    <div className="mt-3 text-[11px] uppercase tracking-wider text-[#FF843D]">Recommended</div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-[12px] text-[#9A9A9E]">
              {selectedValue
                ? scenario.answerFeedback[currentQuestion.id] ?? 'Selection saved locally.'
                : 'Select an option to continue. Multi-select questions support repeated clicks.'}
            </div>
            <button
              onClick={() => {
                if (isLastQuestion) {
                  generateScriptPlan();
                  setActiveNav('script');
                  return;
                }

                nextQuestion();
              }}
              className="px-5 py-2.5 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465] transition-all inline-flex items-center gap-2"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <MockComposerShell
          mentionAssets={availableMentionAssets}
          resetKey={`${scenario.id}-questions-${currentQuestionIndex}`}
        />
      </div>
    );
  };

  const renderIntentSummary = () => (
    <div className="bg-[#141415] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-6 md:p-7">
      <div className="flex items-center gap-2 mb-4 text-[#FFFFFF]">
        <FileText size={16} />
        <h2 className="text-[18px] font-semibold">{scenario.intentSummary.title}</h2>
      </div>
      <p className="text-[14px] text-[#D4D4D8] leading-7 mb-6">{scenario.intentSummary.mainCopy}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[#0A0A0B] rounded-xl p-4">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E] mb-3">Confirmed Direction</h3>
          <div className="space-y-2">
            {scenario.intentSummary.confirmedDirection.map((item) => (
              <div key={item} className="text-[13px] text-[#FFFFFF]">• {item}</div>
            ))}
          </div>
        </div>
        <div className="bg-[#0A0A0B] rounded-xl p-4">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E] mb-3">Generation Notes</h3>
          <div className="space-y-2">
            {scenario.intentSummary.generationNotes.map((item) => (
              <div key={item} className="text-[13px] text-[#FFFFFF]">• {item}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            generateScriptPlan();
            setActiveNav('script');
          }}
          className="px-5 py-2.5 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465] transition-all inline-flex items-center gap-2"
        >
          {scenario.intentSummary.cta} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-120px)] relative pb-24">
      <AmbientGlow variant="warm" fixed={false} />
      <div className="max-w-[1080px] mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#9A9A9E] mb-2">Generate</div>
            <h1 className="text-[26px] md:text-[30px] font-bold text-[#FFFFFF]">{scenario.label}</h1>
            <p className="text-[13px] text-[#9A9A9E] mt-2 max-w-[760px] leading-6">{scenario.outputSpec}</p>
          </div>
          <button
            onClick={() => setActiveNav('home')}
            className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
        </div>

        {currentStage === 'ai_understanding' && renderAiUnderstanding()}
        {(currentStage === 'questions' || currentStage === 'script_plan') && renderQuestionStage()}
        {currentStage === 'intent_summary' && null}
        {(currentStage === 'video_generating' || currentStage === 'video_result') && renderIntentSummary()}
      </div>
    </div>
  );
}
