import { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
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

type PopoverPosition = {
  top: number;
  left: number;
  width: number;
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
  const creativeTypesTriggerRef = useRef<HTMLDivElement>(null);
  const outputSpecTriggerRef = useRef<HTMLDivElement>(null);
  const mentionPopoverTriggerRef = useRef<HTMLDivElement>(null);
  const creativeTypesPopoverRef = useRef<HTMLDivElement>(null);
  const outputSpecPopoverRef = useRef<HTMLDivElement>(null);
  const mentionPopoverRef = useRef<HTMLDivElement>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const [creativeTypesPopoverPosition, setCreativeTypesPopoverPosition] = useState<PopoverPosition | null>(null);
  const [outputSpecPopoverPosition, setOutputSpecPopoverPosition] = useState<PopoverPosition | null>(null);
  const [mentionPopoverPosition, setMentionPopoverPosition] = useState<PopoverPosition | null>(null);

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
    const isWithinPopover = (
      target: Node,
      triggerRef: React.RefObject<HTMLDivElement | null>,
      popoverRef: React.RefObject<HTMLDivElement | null>,
    ) => {
      return Boolean(
        triggerRef.current?.contains(target)
        || popoverRef.current?.contains(target),
      );
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!isWithinPopover(target, creativeTypesTriggerRef, creativeTypesPopoverRef)) {
        setIsCreativeTypesOpen(false);
      }

      if (!isWithinPopover(target, outputSpecTriggerRef, outputSpecPopoverRef)) {
        setIsOutputSpecOpen(false);
      }

      if (!isWithinPopover(target, mentionPopoverTriggerRef, mentionPopoverRef)) {
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

  const resolvePopoverPosition = useCallback((triggerRef: React.RefObject<HTMLDivElement | null>, desiredWidth: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return null;

    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 16;
    const resolvedWidth = Math.min(desiredWidth, window.innerWidth - viewportPadding * 2);
    const left = Math.min(
      Math.max(rect.left, viewportPadding),
      window.innerWidth - resolvedWidth - viewportPadding,
    );

    return {
      top: rect.bottom + 8,
      left,
      width: resolvedWidth,
    };
  }, []);

  useEffect(() => {
    const hasOpenPopover = isCreativeTypesOpen || isOutputSpecOpen || isMentionPopoverOpen;
    if (!hasOpenPopover) return;

    const syncPopoverPositions = () => {
      if (isCreativeTypesOpen) {
        setCreativeTypesPopoverPosition(resolvePopoverPosition(creativeTypesTriggerRef, 320));
      }

      if (isOutputSpecOpen) {
        setOutputSpecPopoverPosition(resolvePopoverPosition(outputSpecTriggerRef, 420));
      }

      if (isMentionPopoverOpen) {
        setMentionPopoverPosition(resolvePopoverPosition(mentionPopoverTriggerRef, 320));
      }
    };

    syncPopoverPositions();
    window.addEventListener('resize', syncPopoverPositions);
    window.addEventListener('scroll', syncPopoverPositions, true);

    return () => {
      window.removeEventListener('resize', syncPopoverPositions);
      window.removeEventListener('scroll', syncPopoverPositions, true);
    };
  }, [isCreativeTypesOpen, isMentionPopoverOpen, isOutputSpecOpen, resolvePopoverPosition]);

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
  const promptPreview = [
    '后室第一视角 vlog，15秒，真实紧张，没有素材',
    '用 Image 1 / Image 2 / Image 3 做一个安静模糊的梦境视频',
    '做一个 15 秒香水品牌短片，包含产品图、logo 和品牌广告镜头',
  ][activeTab === 'All' || activeTab === 'Recent' ? 0 : activeTab === 'Dreamy' ? 1 : 2];

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

  const renderFloatingPopover = (
    isOpen: boolean,
    popoverRef: React.RefObject<HTMLDivElement | null>,
    position: PopoverPosition | null,
    className: string,
    children: React.ReactNode,
  ) => {
    if (!isOpen || !position) return null;

    return createPortal(
      <div
        ref={popoverRef}
        className={`fixed z-[140] ${className}`}
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
        }}
      >
        {children}
      </div>,
      document.body,
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-['Inter'] flex flex-col">
      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto pb-24">
        {/* Cinematic Ambient Lighting */}
        <AmbientGlow variant="hero" />

        {/* Hero Section */}
        <section className="relative z-10 mb-12 pt-2">
          <h1 className="text-[52px] leading-[64px] tracking-[-1.5px] font-bold text-[#E4E4E7] mb-8">
            What will you <br />
            <span className="italic text-[#FF8A3D] font-serif font-normal">dream</span> into life today?
          </h1>

          {/* Creation Composer */}
          <div 
            className={`relative bg-[#121214] border border-[#2A2A2E] rounded-[24px] shadow-lg overflow-visible transition-all focus-within:border-[#FF8A3D] ${
              isDragOver ? 'ring-2 ring-[#FF8A3D] ring-offset-2 ring-offset-[#0A0A0B]' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
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
                  className="w-16 h-16 rounded-[16px] border border-dashed border-[#52525B] flex items-center justify-center text-[#71717A] hover:text-[#E4E4E7] hover:border-[#E4E4E7] transition-colors shrink-0"
                  title="Upload images, videos, or documents"
                >
                  <Plus size={24} />
                </button>
                <div className="flex-1 flex flex-col min-h-[88px]">
                  {/* File Previews */}
                  {filePreviews.length > 0 && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {filePreviews.map((preview) => (
                        <div key={preview.id} className="relative group">
                          {preview.type === 'image' && preview.url ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#1A1A1D]">
                              <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-[#1A1A1D] flex flex-col items-center justify-center gap-1">
                              {preview.type === 'video' ? <Video size={16} className="text-[#71717A]" /> :
                               preview.type === 'text' ? <FileText size={16} className="text-[#71717A]" /> :
                               <File size={16} className="text-[#71717A]" />}
                              <span className="text-[9px] text-[#A1A1AA] truncate max-w-[50px] px-1">{preview.name}</span>
                            </div>
                          )}
                          <button 
                            onClick={() => removeFile(preview.id)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#EF4444] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            <X size={10} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea
                    ref={promptInputRef}
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    className="w-full bg-transparent text-[16px] leading-[24px] text-[#E4E4E7] placeholder-[#71717A] resize-none outline-none flex-1 min-h-[88px]"
                    placeholder={`Describe your idea, attach a reference, or start from assets...\nTry: ${promptPreview}`}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Control Bar */}
            <div className="relative z-20 px-6 py-4 bg-[#121214] border-t border-[#2A2A2E] flex flex-wrap items-center justify-between gap-3 rounded-b-[24px]">
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#1A1A1D] border border-[#2A2A2E] rounded-[14px] text-[14px] text-[#E4E4E7] hover:bg-[#2A2A2E] transition-colors"
                >
                  <FolderOpen size={16} />
                  <span>Add Assets</span>
                  {filePreviews.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-[#FF8A3D] text-[#0A0A0B] text-[10px] rounded-full font-medium">{filePreviews.length}</span>
                  )}
                </button>

                <div className="relative" ref={creativeTypesTriggerRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreativeTypesOpen((prev) => !prev);
                      setIsOutputSpecOpen(false);
                      setIsMentionPopoverOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 bg-[#1A1A1D] border border-[#2A2A2E] rounded-[14px] text-[14px] transition-colors ${
                      isCreativeTypesOpen ? 'border-[#FF8A3D] text-[#E4E4E7]' : 'text-[#E4E4E7] hover:bg-[#2A2A2E]'
                    }`}
                  >
                    <Sparkles size={16} className="text-[#FF8A3D]" />
                    <span>{selectedCreativeType}</span>
                    <ChevronDown size={16} className={`text-[#71717A] transition-transform ${isCreativeTypesOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {renderFloatingPopover(
                  isCreativeTypesOpen,
                  creativeTypesPopoverRef,
                  creativeTypesPopoverPosition,
                  'rounded-[24px] border border-[#2A2A2E] bg-[#121214] p-3 shadow-xl backdrop-blur-md',
                  <>
                    <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#71717A]">
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
                            className={`flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left transition-all ${
                              isSelected
                                ? 'bg-[#FF8A3D]/10 text-[#E4E4E7]'
                                : 'text-[#A1A1AA] hover:bg-[#1A1A1D] hover:text-[#E4E4E7]'
                            }`}
                          >
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border ${
                              isSelected
                                ? 'border-[#FF8A3D]/50 bg-[#FF8A3D]/20 text-[#FF8A3D]'
                                : 'border-[#2A2A2E] bg-[#1A1A1D] text-[#71717A]'
                            }`}>
                              <IconComp size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[13px] font-medium">{option.title}</div>
                              <div className="mt-1 text-[11px] leading-5 text-[#71717A]">
                                {option.description}
                              </div>
                            </div>
                            <div className="w-5 flex justify-end">
                              {isSelected ? <Check size={15} className="text-[#FF8A3D]" /> : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>,
                )}

                <div className="relative" ref={outputSpecTriggerRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOutputSpecOpen((prev) => !prev);
                      setIsCreativeTypesOpen(false);
                      setIsMentionPopoverOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 bg-[#1A1A1D] border border-[#2A2A2E] rounded-[14px] text-[14px] transition-colors ${
                      isOutputSpecOpen ? 'border-[#FF8A3D] text-[#E4E4E7]' : 'text-[#E4E4E7] hover:bg-[#2A2A2E]'
                    }`}
                  >
                    <SlidersHorizontal size={14} className="text-[#71717A]" />
                    <span>{outputSpecLabel}</span>
                    <ChevronDown size={16} className={`text-[#71717A] transition-transform ${isOutputSpecOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {renderFloatingPopover(
                  isOutputSpecOpen,
                  outputSpecPopoverRef,
                  outputSpecPopoverPosition,
                  'rounded-[24px] border border-[#2A2A2E] bg-[#121214] p-4 shadow-xl backdrop-blur-md',
                  <div className="space-y-4">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#71717A] mb-2.5">
                        Aspect Mode
                      </div>
                      <div className="inline-flex rounded-full border border-[#2A2A2E] bg-[#1A1A1D] p-1">
                        {(['Customize', 'Auto'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setAspectMode(mode)}
                            className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-all ${
                              aspectMode === mode
                                ? 'bg-[#FF8A3D] text-[#0A0A0B]'
                                : 'text-[#A1A1AA] hover:text-[#E4E4E7]'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-[#2A2A2E] bg-[#1A1A1D] p-4 space-y-4">
                      {renderSegmentedGroup('Aspect Ratio', ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'], selectedAspectRatio, setSelectedAspectRatio)}
                      {renderSegmentedGroup('Resolution', ['480P', '720P', '1080P'], selectedResolution, setSelectedResolution)}
                      {renderSegmentedGroup('Duration', ['4S', '5S', '6S', '7S', '8S', '9S', '10S', '11S', '12S', '13S', '14S', '15S', '30S'], selectedDuration, setSelectedDuration)}
                    </div>
                  </div>,
                )}

                <div className="relative" ref={mentionPopoverTriggerRef}>
                  <button
                    type="button"
                    onClick={() => {
                      if (mentionAssets.length === 0) return;
                      setIsMentionPopoverOpen((prev) => !prev);
                      setIsCreativeTypesOpen(false);
                      setIsOutputSpecOpen(false);
                    }}
                    disabled={mentionAssets.length === 0}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      mentionAssets.length === 0
                        ? 'cursor-not-allowed opacity-40 text-[#52525B] bg-[#1A1A1D]'
                        : `text-[#E4E4E7] bg-[#1A1A1D] hover:bg-[#2A2A2E] ${isMentionPopoverOpen ? 'ring-2 ring-[#FF8A3D]' : ''}`
                    }`}
                  >
                    <AtSign size={14} />
                  </button>
                </div>
                {renderFloatingPopover(
                  isMentionPopoverOpen,
                  mentionPopoverRef,
                  mentionPopoverPosition,
                  'rounded-[24px] border border-[#2A2A2E] bg-[#121214] p-3 shadow-xl backdrop-blur-md',
                  <div className="space-y-1">
                    {mentionAssets.map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => insertMentionIntoHomeInput(asset.mentionLabel)}
                        className="flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left text-[#A1A1AA] transition-all hover:bg-[#1A1A1D] hover:text-[#E4E4E7]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[#2A2A2E] bg-[#1A1A1D] text-[#FF8A3D]">
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
                          <div className="truncate text-[13px] font-medium text-[#E4E4E7]">{asset.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>,
                )}
              </div>

              <div className="flex items-center">
                <button
                  onClick={handleGenerate}
                  disabled={!hasContent}
                  className={`px-6 py-3 rounded-full text-[16px] font-semibold transition-all flex items-center space-x-2 ${
                    hasContent
                      ? 'bg-[#FF8A3D] text-[#0A0A0B] hover:bg-[#FFAA65]'
                      : 'bg-[#2A2A2E] text-[#71717A] cursor-not-allowed'
                  }`}
                >
                  <Sparkles size={18} />
                  <span>Generate Script</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Drag Drop Hint */}
          {isDragOver && (
            <div className="fixed inset-0 z-50 bg-[#FF8A3D]/5 pointer-events-none flex items-center justify-center">
              <div className="bg-[#121214] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-8 text-center border border-[#2A2A2E]">
                <div className="w-16 h-16 rounded-2xl bg-[#1A1A1D] flex items-center justify-center mx-auto mb-3">
                  <FolderOpen size={28} className="text-[#71717A]" />
                </div>
                <p className="text-[16px] font-medium text-[#E4E4E7]">Drop files here</p>
                <p className="text-[13px] text-[#71717A] mt-1">Images, videos, text files, or documents</p>
              </div>
            </div>
          )}
        </section>

        {/* Action Cards (Quick Modes) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {QUICK_MODES.map((mode) => {
            const IconComp = modeIconMap[mode.icon] || Sparkles;
            return (
              <div
                key={mode.id}
                onClick={() => { setActiveNav('generate'); }}
                className="bg-[#121214] border border-[#2A2A2E] rounded-[20px] p-6 hover:border-[#FF8A3D] transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-[12px] bg-[#1A1A1D] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <IconComp size={20} className="text-[#E4E4E7] group-hover:text-[#FF8A3D] transition-colors" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#E4E4E7] mb-2">{mode.title}</h3>
                <p className="text-[14px] text-[#71717A] leading-[20px]">{mode.description}</p>
                <div className="mt-4 flex justify-end">
                  <div className="w-6 h-6 rounded-full bg-[#1A1A1D] flex items-center justify-center text-[#71717A] group-hover:bg-[#FF8A3D] group-hover:text-[#0A0A0B] transition-colors">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Trending Inspirations */}
        <section id="trending-inspirations">
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <h2 className="text-[24px] font-semibold text-[#E4E4E7]">Trending Inspirations</h2>
              <p className="mt-1 text-[14px] text-[#8F8F97]">
                Explore mood-led references, cinematic loops, and product-style mock demos arranged for faster scanning.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {HOME_TRENDING_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-[14px] transition-colors ${
                      activeTab === tab
                        ? 'bg-[#FF8A3D] text-[#0A0A0B] font-medium'
                        : 'text-[#71717A] hover:text-[#E4E4E7] hover:bg-[#121214]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-3 text-[#71717A]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, creator, or keyword"
                  className="pl-9 pr-8 py-2 bg-[#121214] border border-[#2A2A2E] rounded-full text-[14px] text-[#E4E4E7] placeholder-[#71717A] outline-none focus:border-[#FF8A3D] w-[280px] transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 text-[#71717A] hover:text-[#E4E4E7]">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {filteredItems.length > 0 ? filteredItems.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenCommunityDetail(item.id)}
                  className="group overflow-hidden rounded-[20px] cursor-pointer bg-[#121214] border border-[#2A2A2E] hover:border-[#FF8A3D] hover:shadow-[0_20px_50px_rgba(0,0,0,0.28)] transition-all"
                >
                  <div className="relative aspect-[4/3] w-full bg-[#1A1A1D]">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/10 to-transparent" />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span className="inline-flex h-[24px] items-center rounded-full border border-[rgba(255,132,61,0.26)] bg-[rgba(255,132,61,0.16)] px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FFD2B4]">
                        {item.category}
                      </span>
                      <span className="inline-flex h-[24px] items-center rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(10,10,11,0.62)] px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F4F4F5]">
                        {item.badges?.includes('Mock') ? 'Mock' : item.type === 'video' ? 'Video' : 'Image'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 inline-flex h-[24px] items-center rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(10,10,11,0.62)] px-2.5 text-[11px] font-medium text-[#F4F4F5]">
                      {item.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[16px] font-semibold text-[#E4E4E7] leading-6">{item.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-[13px] text-[#A1A1AA]">
                      <span>By {item.creator}</span>
                      <span className="text-[#5B5B63]">•</span>
                      <span>{item.likes} likes</span>
                    </div>
                    <p className="mt-2 min-h-[60px] text-[13px] leading-5 text-[#8F8F97]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            }) : (
              <div className="md:col-span-2 xl:col-span-4 py-12 text-center border border-dashed border-[#2A2A2E] rounded-[20px] bg-[#121214]">
                <Search size={32} className="text-[#71717A] mx-auto mb-3" />
                <p className="text-[14px] text-[#E4E4E7]">No results for "{searchQuery}"</p>
                <button onClick={() => setSearchQuery('')} className="text-[13px] text-[#FF8A3D] mt-2 font-medium hover:underline">Clear search</button>
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
        </section>
      </main>
    </div>
  );
}
