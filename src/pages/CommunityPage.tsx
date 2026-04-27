import { useState, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useGenerateStore } from '@/stores/useGenerateStore';
import { MOCK_COMMUNITY_ITEMS } from '@/lib/constants';
import {
  Search, Heart, Clock, Image, Play, X, Bookmark,
  FileText, Film, Aperture, Volume2, Sparkles, ArrowRight,
  SlidersHorizontal, Grid3X3, LayoutList, LayoutTemplate
} from 'lucide-react';

// Community filter categories
const CONTENT_TYPES = ['All', 'Narrative', 'Experimental', 'Product', 'Lifestyle', 'Environment'];
const DURATIONS = ['All', '< 1min', '1-3min', '3-5min', '> 5min'];
const VISUAL_STYLES = ['All', 'Cinematic', 'Documentary', 'Abstract', 'Neon', 'Minimalist'];

export default function CommunityPage() {
  const [activeType, setActiveType] = useState('All');
  const [activeDuration, setActiveDuration] = useState('All');
  const [activeStyle, setActiveStyle] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<typeof MOCK_COMMUNITY_ITEMS[0] | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { setActiveNav } = useAppStore();
  const { setGeneratedScript } = useGenerateStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const filtered = MOCK_COMMUNITY_ITEMS.filter(item => {
    const matchesType = activeType === 'All' || item.category === activeType;
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.creator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleUseAsReference = (item: typeof MOCK_COMMUNITY_ITEMS[0]) => {
    // 将社区作品作为参考导入Generate流程
    setGeneratedScript({
      id: `ref-${item.id}`,
      title: `Reference: ${item.title}`,
      status: 'reference',
      duration: item.duration,
      version: 'v1',
      narrativeArc: item.description,
      emotionalGoal: item.category,
      visualDirection: 'Based on community reference',
      rhythm: 'To be determined',
      assetLogic: 'Reference-based',
      shots: [],
    } as any);
    setActiveNav('generate');
    setSelectedVideo(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[24px] font-bold text-[#FFFFFF]">Community</h2>
          <p className="text-[13px] text-[#9A9A9E] mt-1">Explore AI-generated creations and use them as creative references</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#2A2A2C] bg-[#141415] focus-within:border-[#FF843D] transition-all">
            <Search size={14} className="text-[#6B6B6F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos, creators, styles..."
              className="text-[13px] text-[#FFFFFF] placeholder:text-[#6B6B6F] outline-none bg-transparent w-[200px]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X size={12} className="text-[#6B6B6F]" />
              </button>
            )}
          </div>
          {/* View toggle */}
          <div className="flex rounded-lg border border-[#2A2A2C] overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-[#FF843D] text-white' : 'text-[#9A9A9E]'}`}>
              <Grid3X3 size={14} />
            </button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-2 ${viewMode === 'list' ? 'bg-[#FF843D] text-white' : 'text-[#9A9A9E]'}`}>
              <LayoutList size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-[#141415] rounded-xl border border-[#2A2A2C] p-4 mb-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-[#6B6B6F]" />
            <span className="text-[12px] font-medium text-[#9A9A9E]">Filters:</span>
          </div>
          {/* Content Type */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#6B6B6F] uppercase">Type</span>
            <div className="flex gap-1">
              {CONTENT_TYPES.slice(0, 4).map(t => (
                <button key={t} onClick={() => setActiveType(t)} className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${activeType === t ? 'bg-[#FF843D] text-white' : 'bg-[#141415] text-[#9A9A9E] hover:bg-[#1E1E20]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* Duration */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#6B6B6F] uppercase">Duration</span>
            <div className="flex gap-1">
              {DURATIONS.map(d => (
                <button key={d} onClick={() => setActiveDuration(d)} className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${activeDuration === d ? 'bg-[#FF843D] text-white' : 'bg-[#141415] text-[#9A9A9E] hover:bg-[#1E1E20]'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          {/* Visual Style */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#6B6B6F] uppercase">Style</span>
            <div className="flex gap-1">
              {VISUAL_STYLES.slice(0, 4).map(s => (
                <button key={s} onClick={() => setActiveStyle(s)} className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${activeStyle === s ? 'bg-[#FF843D] text-white' : 'bg-[#141415] text-[#9A9A9E] hover:bg-[#1E1E20]'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-5' : 'space-y-4'}>
        {filtered.map((item) => (
          <div key={item.id} className={`group cursor-pointer ${viewMode === 'list' ? 'flex gap-4 bg-[#141415] rounded-xl border border-[#2A2A2C] overflow-hidden hover:border-[#FF843D] transition-all' : ''}`}>
            {/* Thumbnail / Video Area */}
            <div 
              className={`relative overflow-hidden rounded-xl bg-[#FF843D] ${viewMode === 'list' ? 'w-[240px] shrink-0' : 'aspect-[4/3] mb-3'}`}
              onClick={() => setSelectedVideo(item)}
            >
              <img src={item.image || `/assets/trending-${(parseInt(item.id) % 6) + 1}.jpg`} alt={item.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-[#FF843D]/30">
                <div className="w-12 h-12 bg-[#141415] rounded-full flex items-center justify-center shadow-lg">
                  <Play size={20} className="text-white ml-0.5" />
                </div>
              </div>
              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded text-white text-[11px] font-medium flex items-center gap-1">
                <Clock size={10} /> {item.duration}
              </div>
              {/* Category badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#141415]/90 rounded text-[10px] font-medium text-[#FFFFFF]">
                {item.category}
              </div>
            </div>
            {/* Info */}
            <div className={viewMode === 'list' ? 'py-3 pr-4 flex-1' : ''}>
              <h3 className="text-[15px] font-semibold text-[#FFFFFF] group-hover:text-[#333] transition-colors">{item.title}</h3>
              <p className="text-[12px] text-[#9A9A9E] mt-1">{item.creator}</p>
              <p className="text-[12px] text-[#6B6B6F] mt-1 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 text-[12px] text-[#9A9A9E]">
                  <Heart size={12} className="text-red-400 fill-red-400" /> {item.likes.toLocaleString()}
                </div>
                {/* Quick actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUseAsReference(item); }}
                    className="px-3 py-1.5 bg-[#FF843D] text-white text-[11px] font-medium rounded-full hover:bg-[#FFA465] transition-all flex items-center gap-1"
                  >
                    <Sparkles size={10} /> Use as Ref
                  </button>
                  <button className="px-3 py-1.5 border border-[#2A2A2C] text-[11px] text-[#9A9A9E] rounded-full hover:border-[#FF843D] transition-all flex items-center gap-1">
                    <Bookmark size={10} /> Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Detail Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setSelectedVideo(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-[#141415] rounded-2xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
            {/* Video Player */}
            <div className="aspect-video bg-[#FF843D] relative">
              <video 
                ref={videoRef}
                className="w-full h-full"
                poster={selectedVideo.image || `/assets/trending-${(parseInt(selectedVideo.id) % 6) + 1}.jpg`}
                controls
                autoPlay
              >
                <source src="/assets/demo-video.mp4" type="video/mp4" />
              </video>
              <button onClick={() => setSelectedVideo(null)} className="absolute top-3 right-3 w-8 h-8 bg-[#FF843D]/50 rounded-full flex items-center justify-center text-white hover:bg-[#FF843D] transition-all">
                <X size={14} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-[20px] font-bold text-[#FFFFFF]">{selectedVideo.title}</h2>
                  <p className="text-[13px] text-[#9A9A9E] mt-1">{selectedVideo.creator} · {selectedVideo.duration} · {selectedVideo.category}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUseAsReference(selectedVideo)}
                    className="px-4 py-2 bg-[#FF843D] text-white text-[13px] font-medium rounded-full hover:bg-[#FFA465] transition-all flex items-center gap-2"
                  >
                    <Sparkles size={14} /> Use as Reference
                  </button>
                  <button className="px-4 py-2 border border-[#2A2A2C] text-[13px] text-[#9A9A9E] rounded-full hover:border-[#FF843D] transition-all flex items-center gap-2">
                    <Bookmark size={14} /> Save
                  </button>
                </div>
              </div>

              <p className="text-[14px] text-[#9A9A9E] leading-relaxed mb-6">{selectedVideo.description}</p>

              {/* Why it works + Best used for */}
              {selectedVideo.whyItWorks && (
                <div className="mb-5 bg-[#141415] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-[#FFFFFF]" />
                    <h4 className="text-[13px] font-semibold text-[#FFFFFF]">Why it works</h4>
                  </div>
                  <p className="text-[13px] text-[#D4D4D8] leading-relaxed">{selectedVideo.whyItWorks}</p>
                </div>
              )}

              {selectedVideo.bestUsedFor && (
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <LayoutTemplate size={14} className="text-[#FFFFFF]" />
                    <h4 className="text-[13px] font-semibold text-[#FFFFFF]">Best used for</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.bestUsedFor.map((use, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#141415] rounded-full text-[12px] text-[#D4D4D8] font-medium">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis Toggle */}
              <button 
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="flex items-center gap-2 px-4 py-2 bg-[#141415] rounded-xl text-[13px] font-medium text-[#FFFFFF] hover:bg-[#1E1E20] transition-all mb-4"
              >
                <Film size={14} /> {showAnalysis ? 'Hide' : 'Show'} AI Analysis & Deconstruction
              </button>

              {/* Analysis Panel */}
              {showAnalysis && (
                <div className="bg-[#0A0A0B] rounded-xl p-5 border border-[#2A2A2C]">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Script Framework */}
                    <div className="p-4 bg-[#141415] rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText size={14} className="text-[#FFFFFF]" />
                        <h4 className="text-[13px] font-semibold text-[#FFFFFF]">Script Framework</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[12px]">
                          <span className="text-[#6B6B6F]">Genre</span>
                          <span className="text-[#FFFFFF] font-medium">{selectedVideo.category}</span>
                        </div>
                        <div className="flex justify-between text-[12px]">
                          <span className="text-[#6B6B6F]">Narrative Arc</span>
                          <span className="text-[#FFFFFF] font-medium">Setup → Confrontation → Resolution</span>
                        </div>
                        <div className="flex justify-between text-[12px]">
                          <span className="text-[#6B6B6F]">Emotional Goal</span>
                          <span className="text-[#FFFFFF] font-medium">Nostalgia + Wonder</span>
                        </div>
                      </div>
                    </div>

                    {/* Shot Breakdown */}
                    <div className="p-4 bg-[#141415] rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Aperture size={14} className="text-[#FFFFFF]" />
                        <h4 className="text-[13px] font-semibold text-[#FFFFFF]">Shot Breakdown</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[12px]">
                          <span className="text-[#6B6B6F]">Total Shots</span>
                          <span className="text-[#FFFFFF] font-medium">12</span>
                        </div>
                        <div className="flex justify-between text-[12px]">
                          <span className="text-[#6B6B6F]">Camera</span>
                          <span className="text-[#FFFFFF] font-medium">Static + Slow Pan</span>
                        </div>
                        <div className="flex justify-between text-[12px]">
                          <span className="text-[#6B6B6F]">Lighting</span>
                          <span className="text-[#FFFFFF] font-medium">Natural + Practical</span>
                        </div>
                      </div>
                    </div>

                    {/* Audio Analysis */}
                    <div className="p-4 bg-[#141415] rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Volume2 size={14} className="text-[#FFFFFF]" />
                        <h4 className="text-[13px] font-semibold text-[#FFFFFF]">Audio & Score</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[12px]">
                          <span className="text-[#6B6B6F]">Music Style</span>
                          <span className="text-[#FFFFFF] font-medium">Ambient / Cinematic</span>
                        </div>
                        <div className="flex justify-between text-[12px]">
                          <span className="text-[#6B6B6F]">Tempo</span>
                          <span className="text-[#FFFFFF] font-medium">72 BPM</span>
                        </div>
                        <div className="flex justify-between text-[12px]">
                          <span className="text-[#6B6B6F]">Key</span>
                          <span className="text-[#FFFFFF] font-medium">F Minor</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Extractable Assets */}
                    <div className="p-4 bg-[#141415] rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Image size={14} className="text-[#FFFFFF]" />
                        <h4 className="text-[13px] font-semibold text-[#FFFFFF]">Extractable Assets</h4>
                      </div>
                      <div className="space-y-2">
                        {['Golden Hour Establishing Shot', 'Close-up Portrait Frame', 'Transition Texture'].map((asset, i) => (
                          <div key={i} className="flex items-center gap-2 text-[12px]">
                            <div className="w-8 h-8 rounded bg-[#2A2A2C] flex items-center justify-center">
                              <Film size={10} className="text-[#9A9A9E]" />
                            </div>
                            <span className="text-[#FFFFFF]">{asset}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Potential Script */}
                  <div className="mt-4 p-4 bg-[#141415] rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-[#FFFFFF]" />
                      <h4 className="text-[13px] font-semibold text-[#FFFFFF]">Potential Script Direction</h4>
                    </div>
                    <p className="text-[12px] text-[#9A9A9E] leading-relaxed">
                      Based on this reference, a similar script could explore {selectedVideo.category.toLowerCase()} themes 
                      with a focus on visual storytelling. The pacing suggests a slow-burn approach with emotional payoff 
                      in the final third. Consider using similar lighting and color grading for cohesion.
                    </p>
                    <button 
                      onClick={() => handleUseAsReference(selectedVideo)}
                      className="mt-3 px-4 py-2 bg-[#FF843D] text-white text-[12px] font-medium rounded-full hover:bg-[#FFA465] transition-all flex items-center gap-2"
                    >
                      <ArrowRight size={12} /> Generate Similar Script
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
