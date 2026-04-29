import { ArrowUpRight, BookmarkPlus, Film, Sparkles } from 'lucide-react';
import type { LibraryAsset, MockGeneratedIdea } from '@/lib/mockAssets';

function SelectedAssetChip({ asset }: { asset: LibraryAsset }) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-[#2A2A2C] bg-[#101011] px-3 py-2">
      <div className="h-10 w-10 overflow-hidden rounded-xl bg-[#1A1A1D]">
        {asset.thumbnail ? (
          <img src={asset.thumbnail} alt={asset.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.14em] text-[#8E8E93]">
            {asset.kind}
          </div>
        )}
      </div>
      <div>
        <div className="text-[12px] font-medium text-white">{asset.name}</div>
        <div className="text-[10px] uppercase tracking-[0.14em] text-[#8E8E93]">{asset.kind}</div>
      </div>
    </div>
  );
}

export function GenerateIdeaPanel({
  selectedAssets,
  inputValue,
  onInputChange,
  idea,
  isLoading,
  onOpenInGenerate,
  onCreateScript,
  onSaveIdea,
}: {
  selectedAssets: LibraryAsset[];
  inputValue: string;
  onInputChange: (value: string) => void;
  idea: MockGeneratedIdea | null;
  isLoading: boolean;
  onOpenInGenerate: () => void;
  onCreateScript: () => void;
  onSaveIdea: () => void;
}) {
  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Selected Assets</div>
        {selectedAssets.length > 0 ? (
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {selectedAssets.map((asset) => (
              <SelectedAssetChip key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] border border-dashed border-[#2A2A2C] bg-[#101011] px-4 py-4 text-[13px] leading-6 text-[#8E8E93]">
            Select assets from your library or describe the idea you want to explore.
          </div>
        )}
      </div>

      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Idea Prompt</div>
        <textarea
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Describe the mood, structure, or concept you want to generate from these assets..."
          className="min-h-[110px] w-full rounded-[20px] border border-[#2A2A2C] bg-[#101011] px-4 py-3 text-[13px] leading-6 text-white outline-none transition-all focus:border-[rgba(255,132,61,0.4)] focus:ring-2 focus:ring-[rgba(255,132,61,0.16)]"
        />
      </div>

      {isLoading ? (
        <div className="rounded-[20px] border border-[#2A2A2C] bg-[#101011] px-4 py-4 text-[13px] text-[#8E8E93]">
          Generating a mock idea from the selected assets...
        </div>
      ) : null}

      {idea ? (
        <div className="rounded-[24px] border border-[rgba(255,132,61,0.2)] bg-[linear-gradient(180deg,#161619_0%,#101011_100%)] p-5 shadow-[0_12px_36px_rgba(0,0,0,0.24)]">
          <div className="mb-3 flex items-center gap-2 text-[#FFB07E]">
            <Sparkles size={16} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Generated Idea</span>
          </div>
          <h4 className="text-[18px] font-semibold text-white">{idea.title}</h4>
          <p className="mt-2 text-[13px] leading-6 text-[#CFCFD4]">{idea.description}</p>
          <div className="mt-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Suggested Structure</div>
            <div className="space-y-2">
              {idea.suggestedStructure.map((item) => (
                <div key={item} className="rounded-[16px] bg-[#0D0D0F] px-3 py-2 text-[12px] text-[#E4E4E7]">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenInGenerate}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-4 py-2 text-[12px] font-medium text-white transition-all hover:bg-[#FFA465]"
            >
              <ArrowUpRight size={14} />
              Open in Generate
            </button>
            <button
              type="button"
              onClick={onCreateScript}
              className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] px-4 py-2 text-[12px] font-medium text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.34)] hover:text-white"
            >
              <Film size={14} />
              Create Script
            </button>
            <button
              type="button"
              onClick={onSaveIdea}
              className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] px-4 py-2 text-[12px] font-medium text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.34)] hover:text-white"
            >
              <BookmarkPlus size={14} />
              Save Idea
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
