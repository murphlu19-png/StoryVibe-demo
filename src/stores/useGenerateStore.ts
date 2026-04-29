import { create } from 'zustand';
import type { Script } from '@/types';
import type { IntentAnalysis, GuidedQuestion } from '@/lib/ai-service';
import type { UserInputState, DynamicQuestion } from '@/lib/conversation-engine';

export type SavedAssetPackage = {
  id: string;
  type: 'script-package';
  title: string;
  summary: string;
  outputSpec: string;
  thumbnail: string;
  thumbnails: string[];
  createdAt: string;
  script: Script;
};

interface GenerateState {
  // Agent 状态
  step: 'idle' | 'uploading' | 'analyzing' | 'synthesis' | 'questioning' | 'generating' | 'complete';
  thinkingMessage: string;
  thinkingProgress: number;
  
  // 输入
  userText: string;
  uploadedFiles: File[];
  filePreviews: { id: string; url: string; type: string; name: string }[];
  
  // 用户输入状态分类
  userInputState: UserInputState;
  
  // 分析结果
  analysis: IntentAnalysis | null;
  synthesis: { narrativeArc: string; technicalMapping: { topic: string; style: string; goal: string; constraint: string } } | null;
  
  // 问答（支持固定问题和动态问题）
  questions: GuidedQuestion[];
  dynamicQuestions: DynamicQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  questionPath: string[]; // 记录用户走了哪些问题ID
  skippedQuestions: string[];
  
  // 生成结果
  generatedScript: Script | null;
  viewMode: 'table' | 'storyboard';
  activeTab: 'description' | 'video';
  selectedShot: any | null;
  savedAssetPackages: SavedAssetPackage[];
  
  // HomePage → GeneratePage 桥接（用户输入传递）
  pendingHomeInput: { text: string; filePreviews: { id: string; url: string; type: string; name: string }[]; formatSettings: GenerateState['formatSettings'] } | null;
  setPendingHomeInput: (input: GenerateState['pendingHomeInput']) => void;
  clearPendingHomeInput: () => void;

  // 格式选择器
  formatSettings: {
    aspectRatio: string;
    duration: string;
    quality: string;
    frameRate: string;
  };
  videoQuota: { used: number; total: number; remaining: number };
  
  // 生成进度
  generationProgress: {
    stage: 'idle' | 'narrative' | 'shots' | 'assets' | 'copy' | 'assembly' | 'done';
    message: string;
    percent: number;
    logs: string[];
  };
  // Actions
  setStep: (step: GenerateState['step']) => void;
  setThinkingMessage: (msg: string) => void;
  setThinkingProgress: (p: number) => void;
  setUserText: (text: string) => void;
  addFiles: (files: File[]) => void;
  addMockPreview: (preview: { id: string; url: string; type: string; name: string }) => void;
  removeFile: (id: string) => void;
  setUserInputState: (state: UserInputState) => void;
  setAnalysis: (analysis: IntentAnalysis | null) => void;
  setSynthesis: (s: GenerateState['synthesis']) => void;
  setQuestions: (qs: GuidedQuestion[]) => void;
  setDynamicQuestions: (qs: DynamicQuestion[]) => void;
  setCurrentQuestionIndex: (i: number) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  addToPath: (questionId: string) => void;
  skipQuestion: (questionId: string) => void;
  goBackToStep: (stepIndex: number) => void;
  setGeneratedScript: (script: Script | null) => void;
  addSavedAssetPackage: (item: SavedAssetPackage) => void;
  setViewMode: (mode: 'table' | 'storyboard') => void;
  setActiveTab: (tab: 'description' | 'video') => void;
  setSelectedShot: (shot: any | null) => void;
  updateShot: (shotId: string, updates: Partial<any>) => void;
  setFormatSettings: (settings: Partial<GenerateState['formatSettings']>) => void;
  setVideoQuota: (quota: { used: number; total: number; remaining: number }) => void;
  decrementQuota: () => void;
  setGenerationProgress: (progress: Partial<GenerateState['generationProgress']>) => void;
  addGenerationLog: (log: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const initialState = {
  step: 'idle' as const,
  pendingHomeInput: null as GenerateState['pendingHomeInput'],
  thinkingMessage: '',
  thinkingProgress: 0,
  userText: '',
  uploadedFiles: [],
  filePreviews: [],
  userInputState: 'semi-clear' as UserInputState,
  analysis: null,
  synthesis: null,
  questions: [],
  dynamicQuestions: [],
  currentQuestionIndex: 0,
  answers: {},
  questionPath: [],
  skippedQuestions: [],
  generatedScript: null,
  viewMode: 'table' as const,
  activeTab: 'description' as const,
  selectedShot: null,
  savedAssetPackages: [],
  formatSettings: {
    aspectRatio: '9:16',
    duration: '30s',
    quality: '1080p',
    frameRate: '30fps',
  },
  videoQuota: { used: 0, total: 100, remaining: 100 },
  generationProgress: {
    stage: 'idle' as const,
    message: '',
    percent: 0,
    logs: [],
  },
};

export const useGenerateStore = create<GenerateState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setThinkingMessage: (msg) => set({ thinkingMessage: msg }),
  setThinkingProgress: (p) => set({ thinkingProgress: p }),
  setUserText: (text) => set({ userText: text }),
  
  addFiles: (files) => {
    const previews = files.map((file, i) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const type = ['jpg','jpeg','png','gif','webp'].includes(ext) ? 'image' :
                   ['mp4','mov','avi','webm'].includes(ext) ? 'video' :
                   ['txt','md','doc','docx'].includes(ext) ? 'text' : 'document';
      return {
        id: `file-${Date.now()}-${i}`,
        url: type === 'image' ? URL.createObjectURL(file) : '',
        type,
        name: file.name,
      };
    });
    set((s) => ({
      uploadedFiles: [...s.uploadedFiles, ...files],
      filePreviews: [...s.filePreviews, ...previews],
    }));
  },

  addMockPreview: (preview) =>
    set((s) => ({
      filePreviews: [preview, ...s.filePreviews.filter((item) => item.id !== preview.id)],
    })),
  
  removeFile: (id) => {
    set((s) => ({
      uploadedFiles: s.uploadedFiles.filter((_, i) => s.filePreviews[i]?.id !== id),
      filePreviews: s.filePreviews.filter((p) => p.id !== id),
    }));
  },

  setUserInputState: (state) => set({ userInputState: state }),
  setAnalysis: (analysis) => set({ analysis }),
  setSynthesis: (synthesis) => set({ synthesis }),
  setQuestions: (questions) => set({ questions }),
  setDynamicQuestions: (dynamicQuestions) => set({ dynamicQuestions }),
  setCurrentQuestionIndex: (i) => set({ currentQuestionIndex: i }),
  
  answerQuestion: (questionId, answer) => {
    set((s) => ({
      answers: { ...s.answers, [questionId]: answer },
    }));
  },

  addToPath: (questionId) => {
    set((s) => ({
      questionPath: [...s.questionPath, questionId],
    }));
  },

  skipQuestion: (questionId) => {
    set((s) => ({
      skippedQuestions: [...s.skippedQuestions, questionId],
    }));
  },

  goBackToStep: (stepIndex: number) => {
    set((s) => {
      // 清除该步骤之后的所有答案
      const newAnswers: Record<string, string> = {};
      const newPath: string[] = [];
      
      for (let i = 0; i <= stepIndex && i < s.dynamicQuestions.length; i++) {
        const qId = s.dynamicQuestions[i].id;
        if (s.answers[qId]) {
          newAnswers[qId] = s.answers[qId];
        }
        if (i < stepIndex) {
          newPath.push(qId);
        }
      }
      
      return {
        currentQuestionIndex: stepIndex,
        answers: newAnswers,
        questionPath: newPath,
      };
    });
  },
  
  setGeneratedScript: (script) => set({ generatedScript: script }),
  addSavedAssetPackage: (item) =>
    set((s) => ({
      savedAssetPackages: [item, ...s.savedAssetPackages],
    })),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedShot: (shot) => set({ selectedShot: shot }),
  updateShot: (shotId, updates) =>
    set((s) => ({
      generatedScript: s.generatedScript
        ? {
            ...s.generatedScript,
            shots: s.generatedScript.shots.map((sh) =>
              sh.id === shotId ? { ...sh, ...updates } : sh
            ),
          }
        : null,
      selectedShot:
        s.selectedShot?.id === shotId
          ? { ...s.selectedShot, ...updates }
          : s.selectedShot,
    })),
  setFormatSettings: (settings) =>
    set((s) => ({
      formatSettings: { ...s.formatSettings, ...settings },
    })),
  setVideoQuota: (quota) => set({ videoQuota: quota }),
  decrementQuota: () =>
    set((s) => {
      const newUsed = Math.min(s.videoQuota.used + 1, s.videoQuota.total);
      return {
        videoQuota: { ...s.videoQuota, used: newUsed, remaining: s.videoQuota.total - newUsed },
      };
    }),
  
  setGenerationProgress: (progress) =>
    set((s) => ({
      generationProgress: { ...s.generationProgress, ...progress },
    })),
  
  addGenerationLog: (log) =>
    set((s) => ({
      generationProgress: {
        ...s.generationProgress,
        logs: [...s.generationProgress.logs, `[${new Date().toLocaleTimeString()}] ${log}`].slice(-20),
      },
    })),
  
  nextStep: () => {
    const { step } = get();
    const flow: GenerateState['step'][] = ['idle', 'uploading', 'analyzing', 'synthesis', 'questioning', 'generating', 'complete'];
    const idx = flow.indexOf(step);
    if (idx < flow.length - 1) set({ step: flow[idx + 1] });
  },
  
  prevStep: () => {
    const { step } = get();
    const flow: GenerateState['step'][] = ['idle', 'uploading', 'analyzing', 'synthesis', 'questioning', 'generating', 'complete'];
    const idx = flow.indexOf(step);
    if (idx > 0) set({ step: flow[idx - 1] });
  },
  
  setPendingHomeInput: (input) => set({ pendingHomeInput: input }),
  clearPendingHomeInput: () => set({ pendingHomeInput: null }),

  reset: () => {
    const state = get();
    state.filePreviews.forEach(p => {
      if (p.url) URL.revokeObjectURL(p.url);
    });
    set(initialState);
  },
}));
