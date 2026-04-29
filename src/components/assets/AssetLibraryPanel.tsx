import { Check } from 'lucide-react';
import type { LibraryAsset } from '@/lib/mockAssets';

function MiniAssetButton({
  asset,
  selected,
  onToggle,
}: {
  asset: LibraryAsset;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-3 rounded-[18px] border px-3 py-2 text-left transition-all ${
        selected
          ? 'border-[#FF843D] bg-[rgba(255,132,61,0.1)]'
          : 'border-[#2A2A2C] bg-[#101011] hover:border-[rgba(255,132,61,0.28)]'
      }`}
    >
      <div className="h-11 w-11 overflow-hidden rounded-xl bg-[#1A1A1D]">
        {asset.thumbnail ? (
          <img src={asset.thumbnail} alt={asset.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.14em] text-[#8E8E93]">
            {asset.kind}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-medium text-white">{asset.name}</div>
        <div className="truncate text-[10px] uppercase tracking-[0.14em] text-[#8E8E93]">{asset.kind}</div>
      </div>
      {selected ? (
        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FF843D] text-white">
          <Check size={12} />
        </div>
      ) : null}
    </button>
  );
}

export function AssetLibraryPanel({
  selectedAssets,
  recentAssets,
  generatedAssets,
  selectedAssetIds,
  onToggleAsset,
}: {
  selectedAssets: LibraryAsset[];
  recentAssets: LibraryAsset[];
  generatedAssets: LibraryAsset[];
  selectedAssetIds: string[];
  onToggleAsset: (assetId: string) => void;
}) {
  const sections = [
    { title: 'Selected Assets', items: selectedAssets },
    { title: 'Recent Assets', items: recentAssets },
    { title: 'Generated Assets', items: generatedAssets },
  ];

  return (
    <div className="space-y-4 px-4 py-4">
      {sections.map((section) => (
        <div key={section.title}>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
            {section.title}
          </div>
          {section.items.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {section.items.map((asset) => (
                <MiniAssetButton
                  key={`${section.title}-${asset.id}`}
                  asset={asset}
                  selected={selectedAssetIds.includes(asset.id)}
                  onToggle={() => onToggleAsset(asset.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#2A2A2C] bg-[#101011] px-4 py-4 text-[13px] text-[#8E8E93]">
              No assets in this section yet.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
