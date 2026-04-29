import { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useCommunityStore } from '@/stores/useCommunityStore';
import { useGenerateStore } from '@/stores/useGenerateStore';
import { useMockDemoStore } from '@/stores/useMockDemoStore';
import { getMockDemoScenarioById } from '@/lib/mockDemoScenarios';
import { QUICK_MODES } from '@/lib/constants';
import { COMMUNITY_INSPIRATIONS, HOME_TRENDING_TABS } from '@/lib/mockCommunityInspirations';
import {
  Plus, FolderOpen, ChevronDown, AtSign, Sparkles, FileText, Zap, LayoutGrid, Search,
  Video, File, X, Check, SlidersHorizontal, Wand2, ArrowRight
} from 'lucide-react';
import { AmbientGlow } from '@/components/AmbientGlow';

const modeIconMap: Record<string, React.ElementType> = {
  Sparkles, FileText, Zap, LayoutGrid,
};

export default function HomePage() {
  const { setActiveNav } = useAppStore();
  const { startFromPrompt, resetMockDemo, activeScenarioId } = useMockDemoStore();
  const {
    userText, setUserText, filePreviews,
    addFiles, removeFile,
  } = useGenerateStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isCreativeTypesOpen, setIsCreativeTypesOpen] = useState(false);
  const [isOutputSpecOpen, setIsOutputSpecOpen] = useState(false);
  const [isMentionPopoverOpen, setIsMentionPopoverOpen] = useState(false);
  const [selectedCreativeType, setSelectedCreativeType] = useState('Guided Script Flow');
  const [aspectMode, setAspectMode] = useState<'Customize' | 'Auto'>('Customize');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('9:16');
  const [selectedResolution, setSelectedResolution] = useState('1080P');
  const [selectedDuration, setSelectedDuration] = useState('30S');
  const creativeTypesRef = useRef<HTMLDivElement>(null);
  const outputSpecRef = useRef<HTMLDivElement>(null);
  const mentionPopoverRef = useRef<HTMLDivElement>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const creativeTypeOptions = useMemo(
    () => [
      {
        title: 'Guided Script Flow',
        description: 'Start from an idea and build a script through guided questions',
        icon: Sparkles,
      },
      {
        title: 'Text To Video',
        description: 'Generate directly from a text prompt',
        icon: Wand2,
      },
      {
        title: 'Script Editing',
        description: 'Write or refine script segments before generation',
        icon: FileText,
      },
      {
        title: 'Smart Reference',
        description: 'Use references to guide subject, scene, mood, or style',
        icon: LayoutGrid,
      },
    ],
    [],
  );

  const formatControlClassName =
    'px-3 py-2 rounded-lg border border-[#2A2A2C] text-[13px] text-[#9A9A9E] bg-[#141415] hover:bg-[#1A1A1C] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF843D]/40';

  const { openCommunityDetailFromHome, closeCommunityDetail, pendingHomeTrendingScroll, consumeHomeTrendingScroll } = useCommunityStore();
  const activeMockScenario = useMemo(
    () => (activeScenarioId ? getMockDemoScenarioById(activeScenarioId) : null),
    [activeScenarioId],
  );

  const mentionAssets = useMemo(() => {
    const uploadedAssets = filePreviews.map((preview) => ({
      id: preview.id,
      name: preview.name,
      mentionLabel: preview.name.replace(/\.[^/.]+$/, ''),
      thumbnailUrl: preview.type === 'image' ? preview.url : '',
      type: preview.type,
    }));

    const scenarioAssets = (activeMockScenario?.mockAssets || [])
      .filter((asset) => !uploadedAssets.some((preview) => preview.name === asset.name))
      .map((asset) => ({
        id: asset.id,
        name: asset.name,
        mentionLabel: asset.name.split(' · ')[0],
        thumbnailUrl: '',
        type: 'mock',
      }));

    return [...uploadedAssets, ...scenarioAssets];
  }, [activeMockScenario, filePreviews]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (creativeTypesRef.current && !creativeTypesRef.current.contains(target)) {
        setIsCreativeTypesOpen(false);
      }

      if (outputSpecRef.current && !outputSpecRef.current.contains(target)) {
        setIsOutputSpecOpen(false);
      }

      if (mentionPopoverRef.current && !mentionPopoverRef.current.contains(target)) {
        setIsMentionPopoverOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCreativeTypesOpen(false);
        setIsOutputSpecOpen(false);
        setIsMentionPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!pendingHomeTrendingScroll) return;
    const timer = window.setTimeout(() => {
      const section = document.getElementById('trending-inspirations');
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      consumeHomeTrendingScroll();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [consumeHomeTrendingScroll, pendingHomeTrendingScroll]);

  useEffect(() => {
    if (mentionAssets.length === 0 && isMentionPopoverOpen) {
      setIsMentionPopoverOpen(false);
    }
  }, [isMentionPopoverOpen, mentionAssets.length]);

  const trendingItems = useMemo(() => COMMUNITY_INSPIRATIONS.slice(0, 12), []);

  const filteredItems = trendingItems.filter(item => {
    const matchesTab = activeTab === 'All'
      ? true
      : item.tags?.includes(activeTab) || item.category === activeTab || item.badges?.includes(activeTab);
    const matchesSearch = !searchQuery
      || item.title.toLowerCase().includes(searchQuery.toLowerCase())
      || item.creator.toLowerCase().includes(searchQuery.toLowerCase())
      || item.description.toLowerCase().includes(searchQuery.toLowerCase())
      || item.category.toLowerCase().includes(searchQuery.toLowerCase())
      || item.handle?.toLowerCase().includes(searchQuery.toLowerCase())
      || item.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件拖放
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) addFiles(files);
  }, [addFiles]);

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) addFiles(files);
  };

  const promptPreview = [
    '后室第一视角 vlog，15秒，真实紧张，没有素材',
    '用 Image 1 / Image 2 / Image 3 做一个安静模糊的梦境视频',
    '做一个 15 秒香水品牌短片，包含产品图、logo 和品牌广告镜头',
  ][activeTab === 'All' || activeTab === 'Recent' ? 0 : activeTab === 'Dreamy' ? 1 : 2];

  const handleGenerate = async () => {
    if (!userText.trim() && filePreviews.length === 0) return;

    const assetInputs = filePreviews.map((preview) => ({
      id: preview.id,
      name: preview.name,
      type: preview.type,
      url: preview.url,
    }));

    resetMockDemo();
    startFromPrompt(userText.trim(), assetInputs);

    setUserText('');
    setActiveNav('generate');
  };

  const hasContent = userText.trim().length > 0 || filePreviews.length > 0;
  const outputSpecLabel = aspectMode === 'Auto'
    ? 'Auto'
    : `${selectedAspectRatio} · ${selectedDuration.toLowerCase()} · ${selectedResolution.toLowerCase()}`;

  const insertMentionIntoHomeInput = (assetLabel: string) => {
    const mention = `@${assetLabel}`;
    const normalized = userText.trimEnd();
    setUserText(normalized ? `${normalized} ${mention} ` : `${mention} `);
    setIsMentionPopoverOpen(false);
    window.setTimeout(() => {
      promptInputRef.current?.focus();
      const valueLength = (normalized ? `${normalized} ${mention} ` : `${mention} `).length;
      promptInputRef.current?.setSelectionRange(valueLength, valueLength);
    }, 0);
  };

  const handleOpenCommunityList = () => {
    closeCommunityDetail();
    setActiveNav('community');
  };

  const handleOpenCommunityDetail = (id: string) => {
    openCommunityDetailFromHome(id);
    setActiveNav('community');
  };

  const renderSegmentedGroup = (
    title: string,
    options: string[],
    selectedValue: string,
    onSelect: (value: string) => void,
  ) => {
    const isDisabled = aspectMode === 'Auto';

    return (
      <div className={isDisabled ? 'opacity-45' : ''}>
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7D7D84] mb-2.5">
          {title}
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(option)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium border transition-all ${
                selectedValue === option
                  ? 'border-[#FF843D] bg-[rgba(255,132,61,0.18)] text-[#FFFFFF]'
                  : 'border-[#2A2A2C] bg-[#101011] text-[#B2B2B8] hover:border-[#FF843D] hover:text-[#FFFFFF]'
              } ${isDisabled ? 'cursor-not-allowed' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 relative">
      {/* Cinematic Ambient Lighting */}
      <AmbientGlow variant="hero" />

      {/* Hero Section */}
      <section className="relative z-10">
        <h1 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold text-[#FFFFFF] leading-tight mb-8">
          What will you<br />
          <span className="italic sv-gradient-text-glow font-normal">dream</span> into life today?
        </h1>

        {/* Input Card */}
        <div 
          className={`bg-[#141415] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-6 md:p-7 min-h-[240px] md:min-h-[272px] transition-all ${
            isDragOver ? 'ring-2 ring-black ring-offset-2' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* File Previews */}
          {filePreviews.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {filePreviews.map((preview) => (
                <div key={preview.id} className="relative group">
                  {preview.type === 'image' && preview.url ? (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#141415]">
                      <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-[#141415] flex flex-col items-center justify-center gap-1">
                      {preview.type === 'video' ? <Video size={20} className="text-[#6B6B6F]" /> :
                       preview.type === 'text' ? <FileText size={20} className="text-[#6B6B6F]" /> :
                       <File size={20} className="text-[#6B6B6F]" />}
                      <span className="text-[9px] text-[#9A9A9E] truncate max-w-[70px] px-1">{preview.name}</span>
                    </div>
                  )}
                  <button 
                    onClick={() => removeFile(preview.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF843D] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Text Input */}
          <div className="flex items-start gap-4 min-h-[132px] md:min-h-[156px]">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,text/plain,.txt,.md,.doc,.docx,.pdf,.csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-xl border-2 border-dashed border-[#D4D4D4] flex items-center justify-center text-[#6B6B6F] hover:border-[#FF843D] hover:text-[#FFFFFF] shrink-0 transition-all"
              title="Upload images, videos, or documents"
            >
              <Plus size={24} />
            </button>
            <textarea
              ref={promptInputRef}
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder={`Describe your idea, attach a reference, or start from assets...\nTry: ${promptPreview}`}
              className="flex-1 min-h-[132px] md:min-h-[156px] resize-none self-stretch py-1 text-[14px] text-[#FFFFFF] placeholder:text-[#6B6B6F] outline-none bg-transparent leading-7"
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F5F5F5]">
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:bg-[#141415] hover:border-[#D4D4D4] transition-all"
              >
                <FolderOpen size={14} />
                Add Assets
                {filePreviews.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-[#FF843D] text-white text-[10px] rounded-full">{filePreviews.length}</span>
                )}
              </button>
              <div className="relative" ref={creativeTypesRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreativeTypesOpen((prev) => !prev);
                    setIsOutputSpecOpen(false);
                    setIsMentionPopoverOpen(false);
                  }}
                  className={`flex items-center gap-2 ${formatControlClassName} ${isCreativeTypesOpen ? 'border-[#FF843D] text-[#FFFFFF]' : ''}`}
                >
                  {selectedCreativeType}
                  <ChevronDown size={14} className={`transition-transform ${isCreativeTypesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCreativeTypesOpen && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-[320px] rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(20,20,21,0.98)_0%,rgba(14,14,15,0.98)_100%)] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
                    <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7D7D84]">
                      Creative Types
                    </div>
                    <div className="space-y-1">
                      {creativeTypeOptions.map((option) => {
                        const IconComp = option.icon;
                        const isSelected = selectedCreativeType === option.title;

                        return (
                          <button
                            key={option.title}
                            type="button"
                            onClick={() => {
                              setSelectedCreativeType(option.title);
                              setIsCreativeTypesOpen(false);
                            }}
                            className={`flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition-all ${
                              isSelected
                                ? 'bg-[rgba(255,132,61,0.12)] text-[#FFFFFF]'
                                : 'text-[#B2B2B8] hover:bg-[#1A1A1C] hover:text-[#FFFFFF]'
                            }`}
                          >
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border ${
                              isSelected
                                ? 'border-[rgba(255,132,61,0.45)] bg-[rgba(255,132,61,0.12)] text-[#FF843D]'
                                : 'border-[#2A2A2C] bg-[#101011] text-[#8E8E93]'
                            }`}>
                              <IconComp size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[13px] font-medium">{option.title}</div>
                              <div className="mt-1 text-[11px] leading-5 text-[#7D7D84]">
                                {option.description}
                              </div>
                            </div>
                            <div className="w-5 flex justify-end">
                              {isSelected ? <Check size={15} className="text-[#FF843D]" /> : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={outputSpecRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsOutputSpecOpen((prev) => !prev);
                    setIsCreativeTypesOpen(false);
                    setIsMentionPopoverOpen(false);
                  }}
                  className={`flex items-center gap-2 ${formatControlClassName} ${isOutputSpecOpen ? 'border-[#FF843D] text-[#FFFFFF]' : ''}`}
                >
                  <SlidersHorizontal size={14} />
                  <span className="font-medium">{outputSpecLabel}</span>
                  <ChevronDown size={14} className={`transition-transform ${isOutputSpecOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOutputSpecOpen && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-[420px] max-w-[calc(100vw-48px)] rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(20,20,21,0.98)_0%,rgba(14,14,15,0.98)_100%)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
                    <div className="space-y-4">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7D7D84] mb-2.5">
                          Aspect Mode
                        </div>
                        <div className="inline-flex rounded-full border border-[#2A2A2C] bg-[#101011] p-1">
                          {(['Customize', 'Auto'] as const).map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setAspectMode(mode)}
                              className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-all ${
                                aspectMode === mode
                                  ? 'bg-[#FF843D] text-white'
                                  : 'text-[#A0A0A8] hover:text-[#FFFFFF]'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                        {aspectMode === 'Auto' && (
                          <p className="mt-2 text-[11px] leading-5 text-[#7D7D84]">
                            Auto selected. Output settings stay visible but are not editable.
                          </p>
                        )}
                      </div>

                      <div className="rounded-[20px] border border-[rgba(255,255,255,0.06)] bg-[#101011] p-4 space-y-4">
                        {renderSegmentedGroup('Aspect Ratio', ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'], selectedAspectRatio, setSelectedAspectRatio)}
                        {renderSegmentedGroup('Resolution', ['480P', '720P', '1080P'], selectedResolution, setSelectedResolution)}
                        {renderSegmentedGroup('Duration', ['4S', '5S', '6S', '7S', '8S', '9S', '10S', '11S', '12S', '13S', '14S', '15S', '30S'], selectedDuration, setSelectedDuration)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={mentionPopoverRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (mentionAssets.length === 0) return;
                    setIsMentionPopoverOpen((prev) => !prev);
                    setIsCreativeTypesOpen(false);
                    setIsOutputSpecOpen(false);
                  }}
                  disabled={mentionAssets.length === 0}
                  className={`w-8 h-8 rounded-lg border border-[#2A2A2C] flex items-center justify-center transition-all ${
                    mentionAssets.length === 0
                      ? 'cursor-not-allowed opacity-40 text-[#66666B]'
                      : `text-[#9A9A9E] hover:bg-[#141415] ${isMentionPopoverOpen ? 'border-[#FF843D] text-[#FFFFFF]' : ''}`
                  }`}
                >
                  <AtSign size={14} />
                </button>

                {isMentionPopoverOpen && (
                  <div className="absolute top-full right-0 mt-2 z-50 w-[320px] rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(20,20,21,0.98)_0%,rgba(14,14,15,0.98)_100%)] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
                    <div className="space-y-1">
                      {mentionAssets.map((asset) => (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => insertMentionIntoHomeInput(asset.mentionLabel)}
                          className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left text-[#B2B2B8] transition-all hover:bg-[#1A1A1C] hover:text-[#FFFFFF]"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-[#2A2A2C] bg-[#101011] text-[#FF843D]">
                            {asset.thumbnailUrl ? (
                              <img src={asset.thumbnailUrl} alt={asset.name} className="h-full w-full object-cover" />
                            ) : asset.type === 'video' ? (
                              <Video size={16} />
                            ) : asset.type === 'text' ? (
                              <FileText size={16} />
                            ) : (
                              <FolderOpen size={16} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[13px] font-medium text-[#FFFFFF]">{asset.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={!hasContent}
                className={`px-6 py-2.5 text-[13px] font-medium rounded-full transition-all flex items-center gap-2 ${
                  hasContent
                    ? 'bg-[#FF843D] text-white hover:bg-[#FFA465]'
                    : 'bg-[#2A2A2C] text-[#6B6B6F] cursor-not-allowed'
                }`}
              >
                <Sparkles size={14} />
                Generate Script
              </button>
            </div>
          </div>
        </div>

        {/* Drag Drop Hint */}
        {isDragOver && (
          <div className="fixed inset-0 z-50 bg-[#FF843D]/5 pointer-events-none flex items-center justify-center">
            <div className="bg-[#141415] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#141415] flex items-center justify-center mx-auto mb-3">
                <FolderOpen size={28} className="text-[#6B6B6F]" />
              </div>
              <p className="text-[16px] font-medium text-[#FFFFFF]">Drop files here</p>
              <p className="text-[13px] text-[#9A9A9E] mt-1">Images, videos, text files, or documents</p>
            </div>
          </div>
        )}
      </section>

      {/* Quick Mode Cards */}
      <section id="trending-inspirations">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_MODES.map((mode) => {
            const IconComp = modeIconMap[mode.icon] || Sparkles;
            return (
              <button
                key={mode.id}
                onClick={() => { setActiveNav('generate'); }}
                className="bg-[#141415] rounded-xl p-5 text-left hover:bg-[#1E1E20] transition-all group"
              >
                <IconComp size={22} className="text-[#FFFFFF] mb-3" strokeWidth={1.5} />
                <h3 className="text-[15px] font-semibold text-[#FFFFFF] mb-1">{mode.title}</h3>
                <p className="text-[13px] text-[#9A9A9E] leading-relaxed">{mode.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Trending Inspirations */}
      <section>
        <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(20,20,21,0.92)_0%,rgba(16,16,17,0.96)_100%)] p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
          <div className="mb-6 space-y-4">
            <div>
              <h2 className="text-[20px] md:text-[22px] font-semibold text-[#FFFFFF]">Trending Inspirations</h2>
              <p className="text-[13px] text-[#8E8E93] mt-2 max-w-[620px] leading-6">
                Explore mood-led references, cinematic loops, and product-style mock demos arranged for faster scanning.
              </p>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {HOME_TRENDING_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-[#FF843D] text-white shadow-[0_8px_20px_rgba(255,132,61,0.2)]'
                        : 'bg-[#141415] text-[#9A9A9E] hover:bg-[#1E1E20] hover:text-[#FFFFFF]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="w-full xl:w-auto xl:max-w-[360px]">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#2A2A2C] bg-[#141415] focus-within:border-[#FF843D] transition-all min-w-0">
                  <Search size={14} className="text-[#6B6B6F] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, creator, or keyword..."
                    className="text-[13px] text-[#FFFFFF] placeholder:text-[#6B6B6F] outline-none bg-transparent w-full"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-[#6B6B6F] hover:text-[#FFFFFF] shrink-0">
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.length > 0 ? filteredItems.map((item) => (
            <article
              key={item.id}
              onClick={() => handleOpenCommunityDetail(item.id)}
              className="group overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#121213] shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:border-[rgba(255,132,61,0.35)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.28)]"
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.16)_45%,rgba(0,0,0,0.7)_100%)]" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-[rgba(20,20,21,0.84)] backdrop-blur-sm text-[11px] font-medium text-[#FFFFFF] border border-[rgba(255,255,255,0.08)]">
                    {item.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[rgba(20,20,21,0.72)] backdrop-blur-sm text-[11px] text-[#E7E7EA] border border-[rgba(255,255,255,0.06)]">
                    {item.duration}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(20,20,21,0.78)] px-2.5 py-1 text-[11px] text-[#E7E7EA] backdrop-blur-sm border border-[rgba(255,255,255,0.06)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF843D]" />
                    {item.creator}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-[15px] font-semibold text-[#FFFFFF] leading-6">{item.title}</h3>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#6F6F77] shrink-0">{item.badges?.[0] || 'Mock'}</span>
                </div>
                <p className="text-[13px] text-[#9A9A9E] leading-6 min-h-[48px]">
                  {item.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {(item.tags || []).slice(0, 2).map((tag) => (
                    <span
                      key={`${item.id}-${tag}`}
                      className="inline-flex h-[26px] items-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[#101011] px-2.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#E7E7EA]"
                    >
                      {tag}
                    </span>
                  ))}
                  {(item.badges || []).slice(0, 2).map((badge) => (
                    <span
                      key={`${item.id}-${badge}`}
                      className="inline-flex h-[26px] items-center rounded-full border border-[rgba(255,132,61,0.22)] bg-[rgba(255,132,61,0.10)] px-2.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#FFD2B4]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          )) : (
            <div className="md:col-span-2 xl:col-span-3 py-12 text-center">
              <Search size={32} className="text-[#D4D4D8] mx-auto mb-3" />
              <p className="text-[14px] text-[#6B6B6F]">No results for &quot;{searchQuery}&quot;</p>
              <button onClick={() => setSearchQuery('')} className="text-[13px] text-[#FFFFFF] mt-2 font-medium hover:underline">Clear search</button>
            </div>
          )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleOpenCommunityList}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-6 py-3 text-[13px] font-medium text-white shadow-[0_18px_36px_rgba(255,132,61,0.18)] transition-all hover:bg-[#FFA465]"
            >
              Explore Community
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
