import { Plus } from 'lucide-react';
import type { LibraryAsset } from '@/lib/mockAssets';
import { AssetCard } from './AssetCard';

export function AssetGrid({
  assets,
  selectedAssetIds,
  onToggleAsset,
  showUploadCard,
  onUploadClick,
}: {
  assets: LibraryAsset[];
  selectedAssetIds: string[];
  onToggleAsset: (assetId: string) => void;
  showUploadCard?: boolean;
  onUploadClick?: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          selected={selectedAssetIds.includes(asset.id)}
          onToggle={() => onToggleAsset(asset.id)}
        />
      ))}

      {showUploadCard ? (
        <button
          type="button"
          onClick={onUploadClick}
          className="flex aspect-[4/5] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#323236] bg-[#101011] text-[#8E8E93] transition-all hover:border-[rgba(255,132,61,0.34)] hover:text-white"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2A2A2C] bg-[#151518]">
            <Plus size={22} />
          </div>
          <div className="mt-4 text-[14px] font-medium">Upload New</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#6B6B6F]">Local Mock Import</div>
        </button>
      ) : null}
    </div>
  );
}
