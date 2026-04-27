import { create } from 'zustand';

interface HistoryEntry {
  type: 'script' | 'shot' | 'full';
  data: any;
  label: string;
  timestamp: number;
}

interface EditorState {
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  lastAutoSave: number;
  isDirty: boolean;

  pushUndo: (entry: HistoryEntry) => void;
  undo: () => HistoryEntry | null;
  redo: () => HistoryEntry | null;
  markDirty: () => void;
  markClean: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  undoStack: [],
  redoStack: [],
  lastAutoSave: 0,
  isDirty: false,

  pushUndo: (entry) => {
    set((s) => ({
      undoStack: [...s.undoStack.slice(-49), entry], // 保留最近50条
      redoStack: [], // 新操作清空redo栈
      isDirty: true,
      lastAutoSave: Date.now(),
    }));
  },

  undo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return null;
    const entry = undoStack[undoStack.length - 1];
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, entry],
      isDirty: true,
    });
    return entry;
  },

  redo: () => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return null;
    const entry = redoStack[redoStack.length - 1];
    set({
      undoStack: [...undoStack, entry],
      redoStack: redoStack.slice(0, -1),
      isDirty: true,
    });
    return entry;
  },

  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,
}));
