import { HelpCircle, Columns2, X } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

export default function TopHeader() {
  const { activeNav, pageTitleOverride, splitView, setSplitView } = useAppStore();
  const baseTitleMap: Record<string, string> = {
    home: 'Home',
    generate: 'Generate',
    script: 'Scripts',
    edit: 'Edit',
    assets: 'Assets',
    community: 'Community',
    user: 'Developer',
  };
  const pageTitle = pageTitleOverride || baseTitleMap[activeNav] || 'Workspace';

  return (
    <header className="fixed top-0 left-0 md:left-16 right-0 h-12 bg-[#141415]/80 backdrop-blur-sm border-b border-[#2A2A2C] z-40 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <span className="font-bold text-[15px] text-[#FFFFFF] hidden md:inline">StoryVibe</span>
        <span className="text-[#D4D4D8] hidden md:inline">|</span>
        <span className="text-[13px] text-[#9A9A9E]">{pageTitle}</span>
      </div>
      <div className="flex items-center gap-3">
        {/* 分屏切换 */}
        <button
          onClick={() => setSplitView(!splitView)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
            splitView
              ? 'bg-[#FF843D] text-white'
              : 'bg-[#141415] text-[#9A9A9E] hover:bg-[#1E1E20]'
          }`}
          title={splitView ? 'Exit Split View' : 'Split View (Generate + Assets)'}
        >
          {splitView ? <X size={14} /> : <Columns2 size={14} />}
          <span className="hidden sm:inline">{splitView ? 'Exit Split' : 'Split'}</span>
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B6B6F] hover:text-[#9A9A9E] hover:bg-[#141415] transition-all">
          <HelpCircle size={18} strokeWidth={1.5} />
        </button>
        <button className="px-4 py-1.5 bg-[#FF843D] text-white text-[13px] font-medium rounded-full hover:bg-[#333333] transition-colors hidden sm:block">
          Upgrade
        </button>
      </div>
    </header>
  );
}
