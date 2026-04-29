import { create } from 'zustand';
import type { LibraryAsset } from '@/lib/mockAssets';

interface AssetState {
  selectedAssetIds: string[];
  customAssets: LibraryAsset[];
  toggleSelectedAsset: (assetId: string) => void;
  clearSelectedAssets: () => void;
  addCustomAsset: (asset: LibraryAsset) => void;
}

export const useAssetStore = create<AssetState>((set) => ({
  selectedAssetIds: [],
  customAssets: [],
  toggleSelectedAsset: (assetId) =>
    set((state) => ({
      selectedAssetIds: state.selectedAssetIds.includes(assetId)
        ? state.selectedAssetIds.filter((id) => id !== assetId)
        : [...state.selectedAssetIds, assetId],
    })),
  clearSelectedAssets: () => set({ selectedAssetIds: [] }),
  addCustomAsset: (asset) =>
    set((state) => ({
      customAssets: [asset, ...state.customAssets.filter((item) => item.id !== asset.id)],
    })),
}));
