import { useMemo, useRef, useState } from 'react';
import { Columns2, Search } from 'lucide-react';
import { AssetGrid } from '@/components/assets/AssetGrid';
import { AssetsFloatingChatbox } from '@/components/assets/AssetsFloatingChatbox';
import { FlowChatboxDock } from '@/components/shared/FlowChatboxDock';
import {
  ASSET_FILTER_TABS,
  MOCK_MY_ASSETS,
  MOCK_SHARED_ASSETS,
  buildScriptFromIdea,
  createSavedIdeaAsset,
  filterAssetsByTab,
  mapFilePreviewToAsset,
  mapSavedAssetPackageToAsset,
  type AssetFilterTab,
  type LibraryAsset,
  type MockGeneratedIdea,
} from '@/lib/mockAssets';
import { useAppStore } from '@/stores/useAppStore';
import { useAssetStore } from '@/stores/useAssetStore';
import { useGenerateStore } from '@/stores/useGenerateStore';
import { useScriptStore } from '@/stores/useScriptStore';

function dedupeAssets(assets: LibraryAsset[]) {
  const map = new Map<string, LibraryAsset>();
  assets.forEach((asset) => {
    map.set(asset.id, asset);
  });
  return Array.from(map.values());
}

export default function AssetsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeScope, setActiveScope] = useState<'my' | 'shared'>('my');
  const [activeFilter, setActiveFilter] = useState<AssetFilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { setActiveNav, setSplitView, setScriptPageIntent, setScriptPageRoute } = useAppStore();
  const { selectedAssetIds, customAssets, toggleSelectedAsset, addCustomAsset } = useAssetStore();
  const { filePreviews, savedAssetPackages, setPendingHomeInput, formatSettings } = useGenerateStore();
  const { setActiveScript } = useScriptStore();

  const importedAssets = useMemo(() => filePreviews.map(mapFilePreviewToAsset), [filePreviews]);
  const savedPackageAssets = useMemo(
    () => savedAssetPackages.map(mapSavedAssetPackageToAsset),
    [savedAssetPackages],
  );

  const myAssets = useMemo(
    () => dedupeAssets([...customAssets, ...savedPackageAssets, ...importedAssets, ...MOCK_MY_ASSETS]),
    [customAssets, importedAssets, savedPackageAssets],
  );
  const sharedAssets = useMemo(() => MOCK_SHARED_ASSETS, []);
  const scopedAssets = activeScope === 'my' ? myAssets : sharedAssets;

  const filteredAssets = useMemo(() => {
    const filterMatched = filterAssetsByTab(scopedAssets, activeFilter);
    if (!searchQuery.trim()) return filterMatched;

    const normalized = searchQuery.trim().toLowerCase();
    return filterMatched.filter((asset) => {
      const searchable = `${asset.name} ${asset.description} ${asset.tags?.join(' ') ?? ''}`.toLowerCase();
      return searchable.includes(normalized);
    });
  }, [activeFilter, scopedAssets, searchQuery]);

  const selectionUniverse = useMemo(
    () => dedupeAssets([...myAssets, ...sharedAssets]),
    [myAssets, sharedAssets],
  );
  const selectedAssets = useMemo(
    () => selectionUniverse.filter((asset) => selectedAssetIds.includes(asset.id)),
    [selectedAssetIds, selectionUniverse],
  );
  const recentAssets = useMemo(() => scopedAssets.slice(0, 6), [scopedAssets]);
  const generatedAssets = useMemo(
    () =>
      myAssets
        .filter(
          (asset) =>
            asset.source === 'generated' || asset.source === 'saved-idea' || asset.source === 'script-package',
        )
        .slice(0, 6),
    [myAssets],
  );

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file, index) => {
      const type = file.type.toLowerCase();
      const kind = type.startsWith('video/')
        ? 'video'
        : type.startsWith('audio/')
          ? 'audio'
          : type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')
            ? 'text'
            : 'image';
      const previewUrl = kind === 'image' || kind === 'video' ? URL.createObjectURL(file) : '';

      addCustomAsset(
        mapFilePreviewToAsset({
          id: `local-file-${Date.now()}-${index}`,
          url: previewUrl,
          type: kind,
          name: file.name,
        }),
      );
    });

    event.target.value = '';
  };

  const handleOpenInGenerate = (idea: MockGeneratedIdea) => {
    setPendingHomeInput({
      text: idea.prompt,
      filePreviews: selectedAssets
        .filter((asset) => asset.thumbnail)
        .slice(0, 4)
        .map((asset) => ({
          id: asset.id,
          url: asset.thumbnail || '',
          type: asset.kind,
          name: asset.name,
        })),
      formatSettings,
    });
    setActiveNav('generate');
  };

  const handleCreateScript = (idea: MockGeneratedIdea) => {
    const draftScript = buildScriptFromIdea(idea, selectedAssets);
    setActiveScript(draftScript);
    setScriptPageRoute('overview');
    setScriptPageIntent({ type: 'script_editor' });
    setActiveNav('script');
  };

  const handleSaveIdea = (idea: MockGeneratedIdea) => {
    addCustomAsset(createSavedIdeaAsset(idea, selectedAssets));
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] pb-28">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[#8E8E93]">ASSETS</div>
          <div className="flex flex-wrap items-center gap-2 text-[24px] font-semibold text-white">
            <span>MyStack Library</span>
            <span className="text-[#3A3A3E]">/</span>
            <span className="text-[14px] font-normal text-[#8E8E93]">
              {activeScope === 'my' ? `${myAssets.length} assets in My Assets` : `${sharedAssets.length} assets in Shared Assets`}
            </span>
          </div>
          <p className="mt-2 max-w-[760px] text-[13px] leading-6 text-[#8E8E93]">
            Organize pictures, videos, audio, notes, and style packs in one clean asset library. AI actions stay local and only help with idea generation, similarity lookup, and asset selection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSplitView(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-4 py-2 text-[12px] text-[#D4D4D8] transition-all hover:border-[rgba(255,132,61,0.3)] hover:text-white"
          >
            <Columns2 size={14} />
            Split
          </button>
          <div className="flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-2 text-[#8E8E93]">
            <Search size={14} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search assets..."
              className="w-[180px] bg-transparent text-[12px] text-white outline-none placeholder:text-[#6B6B6F]"
            />
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-[#232326] bg-[#101011] p-1">
          <button
            type="button"
            onClick={() => setActiveScope('my')}
            className={`rounded-full px-4 py-2 text-[12px] transition-all ${
              activeScope === 'my' ? 'bg-[#18181B] text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            My Assets
          </button>
          <button
            type="button"
            onClick={() => setActiveScope('shared')}
            className={`rounded-full px-4 py-2 text-[12px] transition-all ${
              activeScope === 'shared' ? 'bg-[#18181B] text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Shared Assets
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ASSET_FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`rounded-full px-4 py-2 text-[12px] transition-all ${
                activeFilter === tab
                  ? 'bg-[#18181B] text-white'
                  : 'text-[#8E8E93] hover:bg-[#101011] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3 text-[12px] text-[#8E8E93]">
        <div className="rounded-full border border-[#232326] bg-[#101011] px-3 py-1.5">
          Showing {filteredAssets.length} items
        </div>
        <div className="rounded-full border border-[#232326] bg-[#101011] px-3 py-1.5">
          {selectedAssets.length} selected
        </div>
      </div>

      <AssetGrid
        assets={filteredAssets}
        selectedAssetIds={selectedAssetIds}
        onToggleAsset={toggleSelectedAsset}
        showUploadCard={activeScope === 'my'}
        onUploadClick={() => fileInputRef.current?.click()}
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.txt,.md"
        onChange={handleUpload}
        className="hidden"
      />

      <FlowChatboxDock handleLabel="Assets AI">
        {({ onInputFocusChange, onPopoverStateChange, onInteractionLockChange }) => (
          <AssetsFloatingChatbox
            availableAssets={scopedAssets}
            selectedAssets={selectedAssets}
            recentAssets={recentAssets}
            generatedAssets={generatedAssets}
            selectedAssetIds={selectedAssetIds}
            onToggleAsset={toggleSelectedAsset}
            onAddLocalAsset={() => fileInputRef.current?.click()}
            onOpenInGenerate={handleOpenInGenerate}
            onCreateScript={handleCreateScript}
            onSaveIdea={handleSaveIdea}
            onInputFocusChange={onInputFocusChange}
            onPopoverStateChange={onPopoverStateChange}
            onInteractionLockChange={onInteractionLockChange}
          />
        )}
      </FlowChatboxDock>
    </div>
  );
}
