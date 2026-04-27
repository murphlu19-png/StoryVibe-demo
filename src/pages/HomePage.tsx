import { useRef, useCallback, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useGenerateStore } from '@/stores/useGenerateStore';
import { useMockDemoStore } from '@/stores/useMockDemoStore';
import { QUICK_MODES, TRENDING_ITEMS, TRENDING_TABS } from '@/lib/constants';
import {
  Plus, FolderOpen, ChevronDown, AtSign, Sparkles, FileText, Zap, LayoutGrid, Search,
  Video, File, X
} from 'lucide-react';
import { FormatSelector } from '@/components/shared/FormatSelector';
import { AmbientGlow } from '@/components/AmbientGlow';

const modeIconMap: Record<string, React.ElementType> = {
  Sparkles, FileText, Zap, LayoutGrid,
};

export default function HomePage() {
  const { setActiveNav } = useAppStore();
  const { startFromPrompt, resetMockDemo } = useMockDemoStore();
  const {
    userText, setUserText, filePreviews, formatSettings, setFormatSettings, videoQuota,
    addFiles, removeFile,
  } = useGenerateStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Recent');

  const filteredItems = TRENDING_ITEMS.filter(item => {
    const matchesTab = activeTab === 'All' || item.category === activeTab;
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.creator.toLowerCase().includes(searchQuery.toLowerCase());
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
  ][activeTab === 'Recent' ? 0 : activeTab === 'Dreamy' ? 1 : 2];

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
          className={`bg-[#141415] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-6 transition-all ${
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
          <div className="flex gap-4">
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
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder={`Describe your idea, attach a reference, or start from assets...\nTry: ${promptPreview}`}
              className="flex-1 min-h-[80px] resize-none text-[14px] text-[#FFFFFF] placeholder:text-[#6B6B6F] outline-none bg-transparent leading-relaxed"
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
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:bg-[#141415] transition-all">
                Guided Script Flow
                <ChevronDown size={14} />
              </button>
              <FormatSelector settings={formatSettings} onChange={setFormatSettings} />
              <button className="w-8 h-8 rounded-lg border border-[#2A2A2C] flex items-center justify-center text-[#9A9A9E] hover:bg-[#141415] transition-all">
                <AtSign size={14} />
              </button>
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
              {/* Video Quota Display */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-[#6B6B6F]">API Quota</span>
                  <span className={`font-semibold ${videoQuota.remaining < 10 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                    {videoQuota.remaining}
                  </span>
                  <span className="text-[#6B6B6F]">/ {videoQuota.total} left</span>
                </div>
                <div className="w-20 h-1 bg-[#2A2A2C] rounded-full mt-0.5">
                  <div 
                    className={`h-full rounded-full ${videoQuota.remaining < 10 ? 'bg-red-400' : 'bg-[rgba(34,197,94,0.15)]0'}`}
                    style={{ width: `${(videoQuota.remaining / videoQuota.total) * 100}%` }}
                  />
                </div>
              </div>
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
      <section>
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
        <h2 className="text-[20px] font-semibold text-[#FFFFFF] mb-4">Trending Inspirations</h2>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {TRENDING_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  activeTab === tab ? 'bg-[#FF843D] text-white' : 'bg-[#141415] text-[#9A9A9E] hover:bg-[#1E1E20]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2A2A2C] bg-[#141415] focus-within:border-[#FF843D] transition-all">
              <Search size={14} className="text-[#6B6B6F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, creator, or keyword..."
                className="text-[13px] text-[#FFFFFF] placeholder:text-[#6B6B6F] outline-none bg-transparent w-[200px]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-[#6B6B6F] hover:text-[#FFFFFF]">
                  <X size={12} />
                </button>
              )}
            </div>
            <button className="text-[13px] text-[#9A9A9E] hover:text-[#FFFFFF] font-medium flex items-center gap-1">
              View All <span className="text-[11px]">&rarr;</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.length > 0 ? filteredItems.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-xl mb-3 relative overflow-hidden group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all">
                <img 
                  src={(item as any).image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2 py-1 bg-[#141415]/90 backdrop-blur-sm rounded text-[11px] font-medium text-[#FFFFFF]">{item.category}</span>
                </div>
              </div>
              <h3 className="text-[14px] font-semibold text-[#FFFFFF]">{item.title}</h3>
              <p className="text-[12px] text-[#6B6B6F]">{item.creator}</p>
            </div>
          )) : (
            <div className="col-span-4 py-12 text-center">
              <Search size={32} className="text-[#D4D4D8] mx-auto mb-3" />
              <p className="text-[14px] text-[#6B6B6F]">No results for &quot;{searchQuery}&quot;</p>
              <button onClick={() => setSearchQuery('')} className="text-[13px] text-[#FFFFFF] mt-2 font-medium hover:underline">Clear search</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
