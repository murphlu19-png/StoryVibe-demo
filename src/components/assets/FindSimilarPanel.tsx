import { ArrowRight, Plus, Search } from 'lucide-react';
import type { LibraryAsset, MockSimilarResult } from '@/lib/mockAssets';

export function FindSimilarPanel({
  selectedAssets,
  inputValue,
  onInputChange,
  results,
  isLoading,
  onAddToSelection,
  onUseForIdea,
}: {
  selectedAssets: LibraryAsset[];
  inputValue: string;
  onInputChange: (value: string) => void;
  results: MockSimilarResult[];
  isLoading: boolean;
  onAddToSelection: (assetId: string) => void;
  onUseForIdea: (assetId: string) => void;
}) {
  const sourceAsset = selectedAssets.find((asset) => asset.kind === 'image') || selectedAssets[0] || null;

  return (
    <div className="space-y-4 px-4 py-4">
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-[20px] border border-[#2A2A2C] bg-[#101011] p-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
            <Search size={14} />
            Search Source
          </div>
          {sourceAsset ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-[18px] bg-[#1A1A1D]">
                {sourceAsset.thumbnail ? (
                  <img src={sourceAsset.thumbnail} alt={sourceAsset.name} className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center text-[11px] uppercase tracking-[0.18em] text-[#8E8E93]">
                    {sourceAsset.kind}
                  </div>
                )}
              </div>
              <div>
                <div className="text-[13px] font-medium text-white">{sourceAsset.name}</div>
                <div className="mt-1 text-[12px] leading-5 text-[#8E8E93]">{sourceAsset.description}</div>
              </div>
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#2A2A2C] px-3 py-3 text-[13px] leading-6 text-[#8E8E93]">
              Select an image asset or describe what kind of visual you want to find.
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-[#2A2A2C] bg-[#101011] p-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Text Prompt</div>
          <textarea
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="Find soft blurry dreamlike interior images..."
            className="min-h-[110px] w-full rounded-[18px] border border-[#2A2A2C] bg-[#0D0D0F] px-4 py-3 text-[13px] leading-6 text-white outline-none transition-all focus:border-[rgba(255,132,61,0.4)] focus:ring-2 focus:ring-[rgba(255,132,61,0.16)]"
          />
          <div className="mt-3 text-[12px] text-[#8E8E93]">
            Search source can be the selected asset above, the prompt here, or both together.
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[20px] border border-[#2A2A2C] bg-[#101011] px-4 py-4 text-[13px] text-[#8E8E93]">
          Matching similar assets inside the local mock library...
        </div>
      ) : null}

      {results.length > 0 ? (
        <div>
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Similar Results</div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {results.map((result) => (
              <div key={result.asset.id} className="overflow-hidden rounded-[22px] border border-[#2A2A2C] bg-[#101011]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#18181B]">
                  {result.asset.thumbnail ? (
                    <img src={result.asset.thumbnail} alt={result.asset.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.18em] text-[#8E8E93]">
                      {result.asset.kind}
                    </div>
                  )}
                  <div className="absolute right-3 top-3 rounded-full bg-[rgba(12,12,13,0.84)] px-2 py-1 text-[10px] font-medium text-white">
                    {result.score}% match
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <div className="text-[13px] font-medium text-white">{result.asset.name}</div>
                    <div className="mt-1 text-[12px] leading-5 text-[#8E8E93]">{result.asset.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onAddToSelection(result.asset.id)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#2A2A2C] px-3 py-2 text-[11px] font-medium text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.34)] hover:text-white"
                    >
                      <Plus size={12} />
                      Add to Selection
                    </button>
                    <button
                      type="button"
                      onClick={() => onUseForIdea(result.asset.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#FF843D] px-3 py-2 text-[11px] font-medium text-white transition-all hover:bg-[#FFA465]"
                    >
                      Use for Idea
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
