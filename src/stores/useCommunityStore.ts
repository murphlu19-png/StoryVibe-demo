import { create } from 'zustand';

type CommunityDetailSource = 'home-trending' | 'community';

interface CommunityState {
  selectedInspirationId: string | null;
  detailSource: CommunityDetailSource;
  detailTab: string | null;
  detailFilter: string | null;
  pendingHomeTrendingScroll: boolean;
  setSelectedInspirationId: (id: string | null) => void;
  openCommunityDetailFromHome: (id: string) => void;
  openCommunityDetailFromCommunity: (id: string, options?: { tab?: string | null; filter?: string | null }) => void;
  closeCommunityDetail: () => void;
  requestHomeTrendingScroll: () => void;
  consumeHomeTrendingScroll: () => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  selectedInspirationId: null,
  detailSource: 'community',
  detailTab: null,
  detailFilter: null,
  pendingHomeTrendingScroll: false,
  setSelectedInspirationId: (id) => set({ selectedInspirationId: id }),
  openCommunityDetailFromHome: (id) =>
    set({
      selectedInspirationId: id,
      detailSource: 'home-trending',
      detailTab: null,
      detailFilter: null,
    }),
  openCommunityDetailFromCommunity: (id, options) =>
    set({
      selectedInspirationId: id,
      detailSource: 'community',
      detailTab: options?.tab || null,
      detailFilter: options?.filter || null,
    }),
  closeCommunityDetail: () => set({ selectedInspirationId: null }),
  requestHomeTrendingScroll: () => set({ pendingHomeTrendingScroll: true }),
  consumeHomeTrendingScroll: () => set({ pendingHomeTrendingScroll: false }),
}));
