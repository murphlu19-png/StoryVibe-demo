import { create } from 'zustand';
import { classifyMockDemoScenario, getMockDemoClassificationDetail } from '@/lib/mockDemoClassifier';
import { getMockDemoScenarioById, type MockDemoScenarioId } from '@/lib/mockDemoScenarios';

export type MockDemoStage =
  | 'idle'
  | 'ai_understanding'
  | 'questions'
  | 'intent_summary'
  | 'script_plan'
  | 'video_generating'
  | 'video_result';

type MockDemoClassificationDetail = ReturnType<typeof getMockDemoClassificationDetail>;

type SelectedAnswerValue = string | string[];

interface MockDemoState {
  activeScenarioId: MockDemoScenarioId | null;
  currentStage: MockDemoStage;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, SelectedAnswerValue>;
  classificationDetail: MockDemoClassificationDetail | null;
  scriptPlanReady: boolean;
  videoProgressIndex: number;

  startFromPrompt: (inputText: string, assets?: unknown[]) => void;
  startQuestions: () => void;
  selectAnswer: (questionId: string, value: string) => void;
  nextQuestion: () => void;
  goToIntentSummary: () => void;
  generateScriptPlan: () => void;
  startVideoGeneration: () => void;
  nextVideoProgress: () => void;
  completeVideoGeneration: () => void;
  resetMockDemo: () => void;
}

const initialState = {
  activeScenarioId: null as MockDemoScenarioId | null,
  currentStage: 'idle' as MockDemoStage,
  currentQuestionIndex: 0,
  selectedAnswers: {} as Record<string, SelectedAnswerValue>,
  classificationDetail: null as MockDemoClassificationDetail | null,
  scriptPlanReady: false,
  videoProgressIndex: 0,
};

export const useMockDemoStore = create<MockDemoState>((set, get) => ({
  ...initialState,

  startFromPrompt: (inputText, assets = []) => {
    const scenarioId = classifyMockDemoScenario(inputText, assets);
    const classificationDetail = getMockDemoClassificationDetail(inputText, assets);

    set({
      activeScenarioId: scenarioId,
      classificationDetail,
      currentStage: 'ai_understanding',
      currentQuestionIndex: 0,
      selectedAnswers: {},
      scriptPlanReady: false,
      videoProgressIndex: 0,
    });
  },

  startQuestions: () => set({ currentStage: 'questions' }),

  selectAnswer: (questionId, value) => {
    const { activeScenarioId, selectedAnswers } = get();

    if (!activeScenarioId) return;

    const scenario = getMockDemoScenarioById(activeScenarioId);
    const question = scenario.questions.find((item) => item.id === questionId);

    if (!question) return;

    if (question.type === 'multi') {
      const currentValue = selectedAnswers[questionId];
      const currentSelections = Array.isArray(currentValue)
        ? currentValue
        : typeof currentValue === 'string' && currentValue.length > 0
          ? [currentValue]
          : [];

      const nextSelections = currentSelections.includes(value)
        ? currentSelections.filter((item) => item !== value)
        : [...currentSelections, value];

      set((state) => ({
        selectedAnswers: {
          ...state.selectedAnswers,
          [questionId]: nextSelections,
        },
      }));

      return;
    }

    set((state) => ({
      selectedAnswers: {
        ...state.selectedAnswers,
        [questionId]: value,
      },
    }));
  },

  nextQuestion: () => {
    const { activeScenarioId, currentQuestionIndex } = get();

    if (!activeScenarioId) return;

    const scenario = getMockDemoScenarioById(activeScenarioId);
    const isLastQuestion = currentQuestionIndex >= scenario.questions.length - 1;

    if (isLastQuestion) {
      set({ currentStage: 'intent_summary' });
      return;
    }

    set({ currentQuestionIndex: currentQuestionIndex + 1 });
  },

  goToIntentSummary: () => set({ currentStage: 'intent_summary' }),

  generateScriptPlan: () =>
    set({
      scriptPlanReady: true,
      currentStage: 'script_plan',
    }),

  startVideoGeneration: () =>
    set({
      currentStage: 'video_generating',
      videoProgressIndex: 0,
    }),

  nextVideoProgress: () => {
    const { activeScenarioId, videoProgressIndex } = get();

    if (!activeScenarioId) return;

    const scenario = getMockDemoScenarioById(activeScenarioId);
    const lastProgressIndex = Math.max(scenario.generation.progressSteps.length - 1, 0);

    if (videoProgressIndex >= lastProgressIndex) {
      set({ currentStage: 'video_result' });
      return;
    }

    const nextIndex = videoProgressIndex + 1;
    const shouldComplete = nextIndex >= lastProgressIndex;

    set({
      videoProgressIndex: nextIndex,
      currentStage: shouldComplete ? 'video_result' : 'video_generating',
    });
  },

  completeVideoGeneration: () => set({ currentStage: 'video_result' }),

  resetMockDemo: () => set({ ...initialState }),
}));
