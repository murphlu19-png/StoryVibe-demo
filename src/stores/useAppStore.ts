import { create } from 'zustand';

export type ScriptPageIntentProjectSequence = {
  id: string;
  scriptKey: string;
  number: string;
  duration: string;
  status: 'Draft' | 'Ready';
  title: string;
  description: string;
  tags: string[];
  preview: string;
  previewLabel?: string;
  technicalIntent: {
    motion: string;
    lighting: string;
    lens: string;
    sound: string;
  };
};

export type ScriptPageIntentProject = {
  id: string;
  title: string;
  status: 'Drafting' | 'Ready';
  duration: string;
  description: string;
  cover: string;
  sequenceCount: number;
  aspectRatio: string;
  frameRate: string;
  renderMode: string;
  collaborationMode: {
    summary: string;
    contributors: number;
    syncStatus: string;
    tags: string[];
  };
  narrativeDirection: string;
  lastEdited: string;
  collaborators: string[];
  sequences: ScriptPageIntentProjectSequence[];
};

export type ScriptPageIntent =
  | { type: 'script_editor' }
  | { type: 'project_detail'; project: ScriptPageIntentProject }
  | null;

export type ScriptPageRoute = 'overview' | 'current_generation';

interface AppState {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  pageTitleOverride: string | null;
  setPageTitleOverride: (title: string | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  // 分屏模式
  splitView: boolean;
  setSplitView: (v: boolean) => void;
  // 分屏时的左右面板
  leftPanel: string;
  rightPanel: string;
  setPanels: (left: string, right: string) => void;
  swapPanels: () => void;
  scriptPageIntent: ScriptPageIntent;
  setScriptPageIntent: (intent: ScriptPageIntent) => void;
  clearScriptPageIntent: () => void;
  scriptPageRoute: ScriptPageRoute;
  setScriptPageRoute: (route: ScriptPageRoute) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeNav: 'home',
  setActiveNav: (nav) => set({ activeNav: nav, splitView: false, pageTitleOverride: null }),
  pageTitleOverride: null,
  setPageTitleOverride: (title) => set({ pageTitleOverride: title }),
  sidebarOpen: true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  splitView: false,
  setSplitView: (v) => set({ splitView: v }),
  leftPanel: 'generate',
  rightPanel: 'assets',
  setPanels: (left, right) => set({ leftPanel: left, rightPanel: right }),
  swapPanels: () => set((s) => ({ leftPanel: s.rightPanel, rightPanel: s.leftPanel })),
  scriptPageIntent: null,
  setScriptPageIntent: (intent) => set({ scriptPageIntent: intent }),
  clearScriptPageIntent: () => set({ scriptPageIntent: null }),
  scriptPageRoute: 'overview',
  setScriptPageRoute: (route) => set({ scriptPageRoute: route }),
}));
