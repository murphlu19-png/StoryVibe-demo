import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useCommunityStore } from '@/stores/useCommunityStore';
import { useGenerateStore } from '@/stores/useGenerateStore';
import { COMMUNITY_FILTER_CHIPS, COMMUNITY_INSPIRATIONS, COMMUNITY_PRIMARY_TABS } from '@/lib/mockCommunityInspirations';
import { ChevronLeft, ChevronRight, Heart, Maximize2, MoreHorizontal, Pause, Play, Search, Sparkles, Bookmark, X, Users, ArrowUpRight } from 'lucide-react';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<(typeof COMMUNITY_PRIMARY_TABS)[number]>('Trending');
  const [activeFilter, setActiveFilter] = useState<(typeof COMMUNITY_FILTER_CHIPS)[number]>('Recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [actionMessage, setActionMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { setActiveNav, setPageTitleOverride } = useAppStore();
  const {
    selectedInspirationId,
    detailSource,
    detailTab,
    detailFilter,
    openCommunityDetailFromCommunity,
    closeCommunityDetail,
    requestHomeTrendingScroll,
  } = useCommunityStore();
  const { setGeneratedScript, setUserText } = useGenerateStore();

  useEffect(() => {
    setPageTitleOverride(selectedInspirationId ? 'Community / Inspiration' : null);
    return () => setPageTitleOverride(null);
  }, [selectedInspirationId, setPageTitleOverride]);

  useEffect(() => {
    if (!selectedInspirationId && detailSource === 'community') {
      if (detailTab && COMMUNITY_PRIMARY_TABS.includes(detailTab as (typeof COMMUNITY_PRIMARY_TABS)[number])) {
        setActiveTab(detailTab as (typeof COMMUNITY_PRIMARY_TABS)[number]);
      }
      if (detailFilter && COMMUNITY_FILTER_CHIPS.includes(detailFilter as (typeof COMMUNITY_FILTER_CHIPS)[number])) {
        setActiveFilter(detailFilter as (typeof COMMUNITY_FILTER_CHIPS)[number]);
      }
    }
  }, [detailFilter, detailSource, detailTab, selectedInspirationId]);

  useEffect(() => {
    if (!actionMessage) return;
    const timer = window.setTimeout(() => setActionMessage(''), 2600);
    return () => window.clearTimeout(timer);
  }, [actionMessage]);

  const itemsForTab = useMemo(() => {
    switch (activeTab) {
      case 'Following':
        return COMMUNITY_INSPIRATIONS.filter((item) => ['@c_aigc', '@nightframe', '@atelier_motion', '@analog_haze'].includes(item.handle || ''));
      case 'Saved':
        return COMMUNITY_INSPIRATIONS.filter((item) => savedIds.includes(item.id));
      case 'Templates':
        return COMMUNITY_INSPIRATIONS.filter((item) => item.tags?.includes('Premium') || item.tags?.includes('Commercial') || item.badges?.includes('Featured'));
      case 'Creators':
        return [...COMMUNITY_INSPIRATIONS].sort((a, b) => a.creator.localeCompare(b.creator));
      default:
        return COMMUNITY_INSPIRATIONS;
    }
  }, [activeTab, savedIds]);

  const filteredItems = useMemo(() => {
    return itemsForTab
      .filter((item) => {
        const matchesFilter = activeTab !== 'Trending'
          ? true
          : activeFilter === 'Recent'
            ? true
            : activeFilter === 'Popular'
              ? item.badges?.includes('Popular') || item.badges?.includes('Featured') || item.likes > 200
              : item.category === activeFilter || item.tags?.includes(activeFilter);

        const query = searchQuery.trim().toLowerCase();
        const matchesSearch = !query
          || item.title.toLowerCase().includes(query)
          || item.creator.toLowerCase().includes(query)
          || item.handle?.toLowerCase().includes(query)
          || item.description.toLowerCase().includes(query)
          || item.tags?.some((tag) => tag.toLowerCase().includes(query));

        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        if (activeTab === 'Trending' && activeFilter === 'Recent') {
          return (b.date || '').localeCompare(a.date || '');
        }
        if (activeTab === 'Trending' && activeFilter === 'Popular') {
          return b.likes - a.likes;
        }
        return 0;
      });
  }, [activeFilter, activeTab, itemsForTab, searchQuery]);

  const selectedItem = useMemo(
    () => COMMUNITY_INSPIRATIONS.find((item) => item.id === selectedInspirationId) || null,
    [selectedInspirationId],
  );

  const detailItems = useMemo(() => (activeTab === 'Trending' ? COMMUNITY_INSPIRATIONS : itemsForTab), [activeTab, itemsForTab]);
  const selectedIndex = selectedItem ? detailItems.findIndex((item) => item.id === selectedItem.id) : -1;

  const navigateDetail = (direction: 'prev' | 'next') => {
    if (!selectedItem || detailItems.length === 0) return;
    const offset = direction === 'next' ? 1 : -1;
    const nextIndex = (selectedIndex + offset + detailItems.length) % detailItems.length;
    openCommunityDetailFromCommunity(detailItems[nextIndex].id, { tab: activeTab, filter: activeFilter });
  };

  const handleCloseDetail = () => {
    if (detailSource === 'home-trending') {
      closeCommunityDetail();
      requestHomeTrendingScroll();
      setActiveNav('home');
      return;
    }
    closeCommunityDetail();
  };

  const handleUseAsReference = (item: typeof COMMUNITY_INSPIRATIONS[number]) => {
    setGeneratedScript({
      id: `ref-${item.id}`,
      title: `Reference: ${item.title}`,
      status: 'reference',
      duration: item.duration,
      version: 'v1',
      narrativeArc: item.description,
      emotionalGoal: item.category,
      visualDirection: `Reference based on ${item.title}`,
      rhythm: (item.bestUsedFor || []).join(' · ') || 'Reference pacing',
      assetLogic: `Community reference from ${item.creator}`,
      shots: [],
    } as any);
    setActionMessage('Added as reference to current workspace');
  };

  const handleUseForScript = (item: typeof COMMUNITY_INSPIRATIONS[number]) => {
    setUserText(`${item.title}. ${item.description}`);
    setActiveNav('generate');
    setActionMessage('Loaded reference into script prompt seed');
  };

  const handleSave = (itemId: string) => {
    setSavedIds((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
    setActionMessage(savedIds.includes(itemId) ? 'Removed from Community references' : 'Saved to Community references');
  };

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => undefined);
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (selectedItem) {
    const isSaved = savedIds.includes(selectedItem.id);
    const mediaIsVideo = selectedItem.type === 'video' && selectedItem.mediaUrl;
    const backLabel = detailSource === 'home-trending' ? 'Back to Trending Inspirations' : 'Back to Community';

    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={handleCloseDetail}
          className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-4 py-2 text-[13px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
        >
          <ChevronLeft size={14} /> {backLabel}
        </button>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_72px_360px]">
          <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
            <div className="overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#0E0E0F]">
              <div className="relative aspect-video overflow-hidden">
                {mediaIsVideo ? (
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    poster={selectedItem.image}
                    src={selectedItem.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img src={selectedItem.image} alt={selectedItem.title} className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.12)_48%,rgba(0,0,0,0.62)_100%)]" />
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="absolute left-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.78)] text-white backdrop-blur-sm transition-all hover:border-[rgba(255,132,61,0.28)] hover:text-[#FFB07A]"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>
                <button
                  type="button"
                  className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.78)] text-[#D4D4D8] backdrop-blur-sm transition-all hover:border-[rgba(255,132,61,0.28)] hover:text-white"
                >
                  <Maximize2 size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.14)]">
                    <div className="h-full w-[58%] rounded-full bg-[#FF843D]" />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[12px] text-[#E7E7EA]">
                    <span>00:09</span>
                    <span>{selectedItem.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-center gap-3 xl:flex-col xl:items-center">
            {[
              { key: 'close', icon: X, onClick: handleCloseDetail },
              { key: 'prev', icon: ChevronLeft, onClick: () => navigateDetail('prev') },
              { key: 'next', icon: ChevronRight, onClick: () => navigateDetail('next') },
            ].map((control) => {
              const Icon = control.icon;
              return (
                <button
                  key={control.key}
                  type="button"
                  onClick={control.onClick}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#2A2A2C] bg-[#101011] text-[#B2B2B8] transition-all hover:border-[#FF843D] hover:text-white"
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>

          <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FF843D_0%,#B44B0D_100%)] text-[13px] font-semibold text-white">
                  {selectedItem.creator.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white">{selectedItem.creator}</div>
                  <div className="text-[12px] text-[#8E8E93]">{selectedItem.handle}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[12px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white">Follow</button>
                <div className="inline-flex items-center gap-1 rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[12px] text-[#D4D4D8]">
                  <Heart size={12} className="text-[#FF843D]" /> {selectedItem.likes}
                </div>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2A2A2C] text-[#A1A1AA] transition-all hover:border-[#FF843D] hover:text-white">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>

            <div className="mt-5">
              <h2 className="text-[24px] font-semibold leading-8 text-white">{selectedItem.title}</h2>
              <p className="mt-3 text-[13px] leading-6 text-[#A1A1AA]">{selectedItem.description}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex h-[28px] items-center rounded-full border border-[#2A2A2C] bg-[#101011] px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[#E7E7EA]">{selectedItem.date}</span>
              <span className="inline-flex h-[28px] items-center rounded-full border border-[#2A2A2C] bg-[#101011] px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[#E7E7EA]">AI-generated content</span>
              <span className="inline-flex h-[28px] items-center rounded-full border border-[#2A2A2C] bg-[#101011] px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[#E7E7EA]">{selectedItem.category}</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleUseAsReference(selectedItem)}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465]"
              >
                <Sparkles size={14} /> Use as Reference
              </button>
              <button
                type="button"
                onClick={() => handleUseForScript(selectedItem)}
                className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-4 py-2.5 text-[13px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
              >
                <ArrowUpRight size={14} /> Use for Script
              </button>
              <button
                type="button"
                onClick={() => handleSave(selectedItem.id)}
                className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-4 py-2.5 text-[13px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
              >
                <Bookmark size={14} className={isSaved ? 'fill-[#FF843D] text-[#FF843D]' : ''} /> Save
              </button>
            </div>

            <div className="mt-6 rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[#101011] p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Why it works</div>
              <p className="mt-3 text-[13px] leading-6 text-[#D4D4D8]">{selectedItem.whyItWorks}</p>
            </div>

            <div className="mt-4 rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[#101011] p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Best used for</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(selectedItem.bestUsedFor || []).map((useCase) => (
                  <span key={`${selectedItem.id}-${useCase}`} className="inline-flex h-[30px] items-center rounded-full border border-[#2A2A2C] bg-[#141415] px-3 text-[11px] text-[#E7E7EA]">
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {actionMessage && (
          <div className="fixed bottom-6 left-1/2 z-[220] -translate-x-1/2 rounded-full border border-[rgba(255,132,61,0.28)] bg-[rgba(20,20,21,0.94)] px-4 py-2 text-[13px] text-white shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
            {actionMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(20,20,21,0.96)_0%,rgba(16,16,17,0.96)_100%)] p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-[24px] font-bold text-[#FFFFFF]">Community</h2>
            <p className="mt-2 max-w-[720px] text-[13px] leading-6 text-[#9A9A9E]">
              Explore community references, mock videos, and reusable visual prompts.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-xl border border-[#2A2A2C] bg-[#141415] px-3 py-2 transition-all focus-within:border-[#FF843D]">
              <Search size={14} className="text-[#6B6B6F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search community inspirations..."
                className="w-[220px] bg-transparent text-[13px] text-white outline-none placeholder:text-[#6B6B6F]"
              />
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-4 py-2 text-[13px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white">
              <Users size={14} /> Submit Reference
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {COMMUNITY_PRIMARY_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
              activeTab === tab
                ? 'bg-[#FF843D] text-white shadow-[0_8px_20px_rgba(255,132,61,0.2)]'
                : 'border border-[#2A2A2C] bg-[#101011] text-[#9A9A9E] hover:border-[#FF843D] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {COMMUNITY_FILTER_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setActiveFilter(chip)}
            className={`rounded-full px-3 py-1.5 text-[12px] transition-all ${
              activeFilter === chip && activeTab === 'Trending'
                ? 'bg-[rgba(255,132,61,0.14)] text-[#FFD2B4] border border-[rgba(255,132,61,0.28)]'
                : 'border border-[#2A2A2C] bg-[#101011] text-[#8E8E93] hover:border-[#FF843D] hover:text-white'
            } ${activeTab !== 'Trending' ? 'opacity-45' : ''}`}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => {
          const isSaved = savedIds.includes(item.id);

          return (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#121213] shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:border-[rgba(255,132,61,0.35)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.28)]"
            >
              <button
                type="button"
                onClick={() => openCommunityDetailFromCommunity(item.id, { tab: activeTab, filter: activeFilter })}
                className="block w-full text-left"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.14)_50%,rgba(0,0,0,0.72)_100%)]" />
                  <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.84)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white">
                      {item.category}
                    </span>
                    <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.78)] px-2.5 py-1 text-[11px] text-[#E7E7EA]">
                      {item.duration}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.84)] px-2.5 py-1 text-[11px] text-[#E7E7EA]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF843D]" />
                      {item.creator}
                    </div>
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.8)] text-white">
                      <Play size={14} className="ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[16px] font-semibold leading-6 text-white">{item.title}</h3>
                    <span className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-[#6F6F77]">{item.badges?.[0] || 'Mock'}</span>
                  </div>
                  <div className="mt-2 text-[12px] text-[#8E8E93]">{item.handle}</div>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#9A9A9E]">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(item.tags || []).slice(0, 3).map((tag) => (
                      <span key={`${item.id}-${tag}`} className="inline-flex h-[26px] items-center rounded-full border border-[#2A2A2C] bg-[#101011] px-2.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#E7E7EA]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>

              <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] px-4 py-3">
                <div className="inline-flex items-center gap-1 text-[12px] text-[#A1A1AA]">
                  <Heart size={12} className="text-[#FF843D]" /> {item.likes}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUseAsReference(item)}
                    className="rounded-full bg-[#FF843D] px-3 py-1.5 text-[11px] font-medium text-white transition-all hover:bg-[#FFA465]"
                  >
                    Use as Reference
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(item.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2A2A2C] text-[#A1A1AA] transition-all hover:border-[#FF843D] hover:text-white"
                  >
                    <Bookmark size={13} className={isSaved ? 'fill-[#FF843D] text-[#FF843D]' : ''} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#121213] px-6 py-14 text-center">
          <Search size={28} className="mx-auto text-[#6B6B6F]" />
          <div className="mt-3 text-[15px] font-medium text-white">No inspirations match the current filters.</div>
          <div className="mt-2 text-[13px] text-[#8E8E93]">Try another tab, clear the search, or switch the filter chip.</div>
        </div>
      )}

      {actionMessage && (
        <div className="fixed bottom-6 left-1/2 z-[220] -translate-x-1/2 rounded-full border border-[rgba(255,132,61,0.28)] bg-[rgba(20,20,21,0.94)] px-4 py-2 text-[13px] text-white shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
          {actionMessage}
        </div>
      )}
    </div>
  );
}
