import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AtSign,
  FolderOpen,
  Loader2,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import type { LibraryAsset, MockGeneratedIdea, MockSimilarResult } from '@/lib/mockAssets';
import { buildIdeaFromAssets, buildSimilarResults } from '@/lib/mockAssets';
import { AssetActionPanel, type AssetComposerMode } from './AssetActionPanel';

export function AssetsFloatingChatbox({
  availableAssets,
  selectedAssets,
  recentAssets,
  generatedAssets,
  selectedAssetIds,
  onToggleAsset,
  onAddLocalAsset,
  onOpenInGenerate,
  onCreateScript,
  onSaveIdea,
  onInputFocusChange,
  onPopoverStateChange,
  onInteractionLockChange,
}: {
  availableAssets: LibraryAsset[];
  selectedAssets: LibraryAsset[];
  recentAssets: LibraryAsset[];
  generatedAssets: LibraryAsset[];
  selectedAssetIds: string[];
  onToggleAsset: (assetId: string) => void;
  onAddLocalAsset: () => void;
  onOpenInGenerate: (idea: MockGeneratedIdea) => void;
  onCreateScript: (idea: MockGeneratedIdea) => void;
  onSaveIdea: (idea: MockGeneratedIdea) => void;
  onInputFocusChange?: (isFocused: boolean) => void;
  onPopoverStateChange?: (isOpen: boolean) => void;
  onInteractionLockChange?: (isLocked: boolean) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<AssetComposerMode | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ideaResult, setIdeaResult] = useState<MockGeneratedIdea | null>(null);
  const [similarResults, setSimilarResults] = useState<MockSimilarResult[]>([]);

  const hasMentionAssets = availableAssets.length > 0;
  const isLocked = Boolean(mode) || isLoading;

  useEffect(() => {
    onInteractionLockChange?.(isLocked);
  }, [isLocked, onInteractionLockChange]);

  useEffect(() => {
    onPopoverStateChange?.(mode === 'mention' || mode === 'library');
  }, [mode, onPopoverStateChange]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!mode || !wrapperRef.current) return;
      if (wrapperRef.current.contains(event.target as Node)) return;
      setMode(null);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [mode]);

  const primaryActionLabel = useMemo(() => {
    if (mode === 'generateIdea') return 'Generate Idea';
    if (mode === 'findSimilar') return 'Find Similar';
    if (mode === 'library') return 'Apply';
    return 'Generate';
  }, [mode]);

  const runGenerateIdea = () => {
    setIsLoading(true);
    window.setTimeout(() => {
      const nextIdea = buildIdeaFromAssets(selectedAssets, chatInput);
      setIdeaResult(nextIdea);
      setMode('generateIdea');
      setIsLoading(false);
    }, 700);
  };

  const runFindSimilar = () => {
    setIsLoading(true);
    window.setTimeout(() => {
      const nextResults = buildSimilarResults(availableAssets, selectedAssets, chatInput);
      setSimilarResults(nextResults);
      setMode('findSimilar');
      setIsLoading(false);
    }, 700);
  };

  const handlePrimaryAction = () => {
    if (mode === 'library') {
      setMode(null);
      return;
    }

    if (mode === 'findSimilar') {
      runFindSimilar();
      return;
    }

    runGenerateIdea();
  };

  const handleUseForIdea = (assetId: string) => {
    onToggleAsset(assetId);
    setMode('generateIdea');
  };

  const handleMention = (assetName: string) => {
    const mention = `@${assetName}`;
    setChatInput((prev) => {
      const normalized = prev.trimEnd();
      return normalized ? `${normalized} ${mention} ` : `${mention} `;
    });
    setMode(null);
    window.setTimeout(() => {
      textareaRef.current?.focus();
      const value = textareaRef.current?.value ?? '';
      textareaRef.current?.setSelectionRange(value.length, value.length);
    }, 0);
  };

  return (
    <div ref={wrapperRef} className="space-y-3">
      {mode ? (
        <AssetActionPanel
          mode={mode}
          selectedAssets={selectedAssets}
          availableAssets={availableAssets}
          recentAssets={recentAssets}
          generatedAssets={generatedAssets}
          selectedAssetIds={selectedAssetIds}
          inputValue={chatInput}
          onInputChange={setChatInput}
          idea={ideaResult}
          similarResults={similarResults}
          isLoading={isLoading}
          onClose={() => setMode(null)}
          onOpenInGenerate={() => {
            if (ideaResult) onOpenInGenerate(ideaResult);
          }}
          onCreateScript={() => {
            if (ideaResult) onCreateScript(ideaResult);
          }}
          onSaveIdea={() => {
            if (ideaResult) onSaveIdea(ideaResult);
          }}
          onToggleAsset={onToggleAsset}
          onUseForIdea={handleUseForIdea}
          onMention={handleMention}
        />
      ) : null}

      <div className="overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(13,13,15,0.96)] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#101011] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[#8E8E93]">
            <span>{selectedAssetIds.length} assets selected</span>
          </div>
          <div className="text-[11px] text-[#6B6B6F]">Mock-only local asset assistant</div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onAddLocalAsset}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-dashed border-[#343438] text-[#8E8E93] transition-all hover:border-[rgba(255,132,61,0.34)] hover:text-white"
          >
            <Plus size={18} />
          </button>

          <textarea
            ref={textareaRef}
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            onFocus={() => onInputFocusChange?.(true)}
            onBlur={() => onInputFocusChange?.(false)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handlePrimaryAction();
              }
            }}
            placeholder="Ask AI to generate ideas from assets, find similar visuals, or organize your library..."
            className="min-h-[72px] flex-1 resize-none bg-transparent py-2 text-[14px] leading-6 text-white outline-none placeholder:text-[#6B6B6F]"
          />

          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={isLoading || ((mode === 'findSimilar' || mode === 'generateIdea' || mode === null) && !chatInput.trim() && selectedAssets.length === 0)}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF843D] px-4 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465] disabled:bg-[#2A2A2C] disabled:text-[#6B6B6F]"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : primaryActionLabel}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode('generateIdea')}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] transition-all ${
              mode === 'generateIdea'
                ? 'border-[rgba(255,132,61,0.4)] bg-[rgba(255,132,61,0.12)] text-white'
                : 'border-[#2A2A2C] bg-[#101011] text-[#A9A9AF] hover:border-[rgba(255,132,61,0.28)] hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            Generate Idea
          </button>
          <button
            type="button"
            onClick={() => setMode('findSimilar')}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] transition-all ${
              mode === 'findSimilar'
                ? 'border-[rgba(255,132,61,0.4)] bg-[rgba(255,132,61,0.12)] text-white'
                : 'border-[#2A2A2C] bg-[#101011] text-[#A9A9AF] hover:border-[rgba(255,132,61,0.28)] hover:text-white'
            }`}
          >
            <Search size={14} />
            Find Similar
          </button>
          <button
            type="button"
            onClick={() => setMode('library')}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] transition-all ${
              mode === 'library'
                ? 'border-[rgba(255,132,61,0.4)] bg-[rgba(255,132,61,0.12)] text-white'
                : 'border-[#2A2A2C] bg-[#101011] text-[#A9A9AF] hover:border-[rgba(255,132,61,0.28)] hover:text-white'
            }`}
          >
            <FolderOpen size={14} />
            Asset Library
          </button>
          <button
            type="button"
            disabled={!hasMentionAssets}
            onClick={() => {
              if (!hasMentionAssets) return;
              setMode('mention');
            }}
            className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-2 text-[12px] text-[#A9A9AF] transition-all hover:border-[rgba(255,132,61,0.28)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <AtSign size={14} />
            @
          </button>
        </div>
      </div>
    </div>
  );
}
