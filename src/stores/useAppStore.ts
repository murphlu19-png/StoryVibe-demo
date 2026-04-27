import { create } from 'zustand';

interface AppState {
  activeNav: string;
  setActiveNav: (nav: string) => void;
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
}

export const useAppStore = create<AppState>((set) => ({
  activeNav: 'home',
  setActiveNav: (nav) => set({ activeNav: nav, splitView: false }),
  sidebarOpen: true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  splitView: false,
  setSplitView: (v) => set({ splitView: v }),
  leftPanel: 'generate',
  rightPanel: 'assets',
  setPanels: (left, right) => set({ leftPanel: left, rightPanel: right }),
  swapPanels: () => set((s) => ({ leftPanel: s.rightPanel, rightPanel: s.leftPanel })),
}));
