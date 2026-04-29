import { AtSign, FolderOpen, Search, Sparkles, X } from 'lucide-react';
import type { LibraryAsset, MockGeneratedIdea, MockSimilarResult } from '@/lib/mockAssets';
import { AssetLibraryPanel } from './AssetLibraryPanel';
import { FindSimilarPanel } from './FindSimilarPanel';
import { GenerateIdeaPanel } from './GenerateIdeaPanel';

export type AssetComposerMode = 'generateIdea' | 'findSimilar' | 'library' | 'mention';

function PanelHeader({
  title,
  description,
  icon,
  onClose,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#101011] text-[#FFB07E]">
          {icon}
        </div>
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white">{title}</div>
          <div className="mt-1 max-w-[760px] text-[12px] leading-6 text-[#8E8E93]">{description}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[#101011] text-[#8E8E93] transition-all hover:border-[rgba(255,132,61,0.36)] hover:text-white"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function MentionPanel({
  assets,
  onMention,
}: {
  assets: LibraryAsset[];
  onMention: (assetName: string) => void;
}) {
  return (
    <div className="px-4 py-4">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            onClick={() => onMention(asset.name)}
            className="flex items-center gap-3 rounded-[18px] border border-[#2A2A2C] bg-[#101011] px-3 py-2 text-left transition-all hover:border-[rgba(255,132,61,0.3)]"
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
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function AssetActionPanel({
  mode,
  selectedAssets,
  availableAssets,
  recentAssets,
  generatedAssets,
  selectedAssetIds,
  inputValue,
  onInputChange,
  idea,
  similarResults,
  isLoading,
  onClose,
  onOpenInGenerate,
  onCreateScript,
  onSaveIdea,
  onToggleAsset,
  onUseForIdea,
  onMention,
}: {
  mode: AssetComposerMode;
  selectedAssets: LibraryAsset[];
  availableAssets: LibraryAsset[];
  recentAssets: LibraryAsset[];
  generatedAssets: LibraryAsset[];
  selectedAssetIds: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  idea: MockGeneratedIdea | null;
  similarResults: MockSimilarResult[];
  isLoading: boolean;
  onClose: () => void;
  onOpenInGenerate: () => void;
  onCreateScript: () => void;
  onSaveIdea: () => void;
  onToggleAsset: (assetId: string) => void;
  onUseForIdea: (assetId: string) => void;
  onMention: (assetName: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(13,13,15,0.96)] shadow-[0_22px_52px_rgba(0,0,0,0.34)] backdrop-blur-xl">
      {mode === 'generateIdea' ? (
        <>
          <PanelHeader
            title="Generate Idea"
            description="Use selected assets as the mood and reference base for a concise story or visual direction."
            icon={<Sparkles size={18} />}
            onClose={onClose}
          />
          <GenerateIdeaPanel
            selectedAssets={selectedAssets}
            inputValue={inputValue}
            onInputChange={onInputChange}
            idea={idea}
            isLoading={isLoading}
            onOpenInGenerate={onOpenInGenerate}
            onCreateScript={onCreateScript}
            onSaveIdea={onSaveIdea}
          />
        </>
      ) : null}

      {mode === 'findSimilar' ? (
        <>
          <PanelHeader
            title="Find Similar"
            description="Search with a selected asset, a text prompt, or both together to find matching visuals in your library."
            icon={<Search size={18} />}
            onClose={onClose}
          />
          <FindSimilarPanel
            selectedAssets={selectedAssets}
            inputValue={inputValue}
            onInputChange={onInputChange}
            results={similarResults}
            isLoading={isLoading}
            onAddToSelection={onToggleAsset}
            onUseForIdea={onUseForIdea}
          />
        </>
      ) : null}

      {mode === 'library' ? (
        <>
          <PanelHeader
            title="Asset Library"
            description="Review selected, recent, and generated assets. Tap any card to add or remove it from the current selection."
            icon={<FolderOpen size={18} />}
            onClose={onClose}
          />
          <AssetLibraryPanel
            selectedAssets={selectedAssets}
            recentAssets={recentAssets}
            generatedAssets={generatedAssets}
            selectedAssetIds={selectedAssetIds}
            onToggleAsset={onToggleAsset}
          />
        </>
      ) : null}

      {mode === 'mention' ? (
        <>
          <PanelHeader
            title="Mention Assets"
            description="Insert one or more assets into the current prompt. Each item shows only its visual and name."
            icon={<AtSign size={18} />}
            onClose={onClose}
          />
          <MentionPanel assets={availableAssets} onMention={onMention} />
        </>
      ) : null}
    </div>
  );
}
