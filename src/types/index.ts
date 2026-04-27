export interface Asset {
  id: string;
  type: 'image' | 'video' | 'text' | 'audio' | 'tablet';
  name: string;
  url?: string;
  projectId?: string;
}

export interface AISynthesis {
  narrativeArc: string;
  technicalMapping: {
    topic: string;
    style: string;
    goal: string;
    constraint: string;
  };
}

export interface Question {
  id: string;
  category: 'mood' | 'focus' | 'story' | 'visuals' | 'expression';
  question: string;
  subtitle: string;
  options: { id: string; text: string }[];
  allowCustom: boolean;
}

export interface Shot {
  id: string;
  timeRange: string;
  preview: string;
  visual: string;
  purpose: string;
  camera: string;
  asset: string;
  copy: string;
  status?: 'draft' | 'in_progress' | 'complete';
}

export interface Chapter {
  id: string;
  title: string;
  duration: string;
  boardCount: number;
  description: string;
  boards: Board[];
}

export interface Board {
  id: string;
  title: string;
  number: string;
  duration: string;
  status: string;
  previewStatus: string;
  preview: string;
  description: string;
}

export interface Script {
  id: string;
  title: string;
  status: 'draft' | 'in_progress' | 'complete';
  duration: string;
  version: string;
  narrativeArc: string;
  emotionalGoal: string;
  visualDirection: string;
  rhythm: string;
  assetLogic: string;
  shots: Shot[];
  chapters?: Chapter[];
}

export interface CommunityItem {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  likes: number;
  duration: string;
  description: string;
  category: string;
  image?: string;
  whyItWorks?: string;
  bestUsedFor?: string[];
}

export interface Project {
  id: string;
  name: string;
  assetCount: number;
}

export interface ScriptVersion {
  id: string;
  name: string;
  updatedAt: string;
  type: 'draft' | 'autosave' | 'archive';
}
