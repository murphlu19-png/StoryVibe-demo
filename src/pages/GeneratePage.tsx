import { useMemo } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useMockDemoStore } from '@/stores/useMockDemoStore';
import { getMockDemoScenarioById } from '@/lib/mockDemoScenarios';
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
    <div className="space-y-6">
      <div className="bg-[#141415] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-6 md:p-7">
        <div className="flex items-center gap-2 mb-4 text-[#FFFFFF]">
          <Sparkles size={16} />
          <h2 className="text-[18px] font-semibold">{scenario.aiUnderstanding.title}</h2>
        </div>
        <p className="text-[14px] text-[#D4D4D8] leading-7 mb-5">{scenario.aiUnderstanding.mainFeedback}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-[#0A0A0B] rounded-xl p-4">
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E] mb-3">Detected Direction</h3>
            <div className="space-y-2">
              {scenario.aiUnderstanding.detectedDirection.map((item) => (
                <div key={item} className="text-[13px] text-[#FFFFFF]">• {item}</div>
              ))}
            </div>
          </div>
          <div className="bg-[#0A0A0B] rounded-xl p-4">
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E] mb-3">Missing Details</h3>
            <div className="space-y-2">
              {scenario.aiUnderstanding.missingDetails.map((item) => (
                <div key={item} className="text-[13px] text-[#FFFFFF]">• {item}</div>
              ))}
            </div>
          </div>
        </div>
        {scenario.aiUnderstanding.detectedAssets && scenario.aiUnderstanding.detectedAssets.length > 0 && (
          <div className="mt-4 bg-[#0A0A0B] rounded-xl p-4">
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E] mb-3">Detected Assets</h3>
            <div className="flex flex-wrap gap-2">
              {scenario.aiUnderstanding.detectedAssets.map((asset) => (
                <span key={asset} className="px-3 py-1.5 rounded-full bg-[#141415] text-[12px] text-[#FFFFFF]">{asset}</span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[12px] uppercase tracking-wider text-[#9A9A9E] mb-1">Classification</div>
            <div className="text-[13px] text-[#FFFFFF]">
              {classificationDetail?.reason ?? scenario.aiUnderstanding.recommendedFlow}
            </div>
          </div>
          <button
            onClick={startQuestions}
            className="px-5 py-2.5 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465] transition-all"
          >
            {scenario.aiUnderstanding.cta}
          </button>
        </div>
      </div>
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

    return (
      <div className="bg-[#141415] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-6 md:p-7">
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
            onClick={nextQuestion}
            className="px-5 py-2.5 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465] transition-all inline-flex items-center gap-2"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
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
        {currentStage === 'questions' && renderQuestionStage()}
        {currentStage === 'intent_summary' && renderIntentSummary()}
        {(currentStage === 'script_plan' || currentStage === 'video_generating' || currentStage === 'video_result') && renderIntentSummary()}
      </div>
    </div>
  );
}
