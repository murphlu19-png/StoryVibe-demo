import { useState, useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import AppShell from '@/components/layout/AppShell';
import HomePage from '@/pages/HomePage';
import GeneratePage from '@/pages/GeneratePage';
import ScriptPage from '@/pages/ScriptPage';
import EditPage from '@/pages/EditPage';
import AssetsPage from '@/pages/AssetsPage';
import CommunityPage from '@/pages/CommunityPage';
import UserPage from '@/pages/UserPage';
import { IS_MOCK_DEMO } from '@/lib/mockDemoMode';

const pageMap: Record<string, React.ComponentType> = {
  home: HomePage,
  generate: GeneratePage,
  script: ScriptPage,
  edit: EditPage,
  assets: AssetsPage,
  community: CommunityPage,
  user: UserPage,
};

function ResizableSplitView({ leftPanel, rightPanel }: { leftPanel: string; rightPanel: string }) {
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const LeftComponent = pageMap[leftPanel] || GeneratePage;
  const RightComponent = pageMap[rightPanel] || AssetsPage;

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(20, Math.min(80, (x / rect.width) * 100));
    setLeftWidth(pct);
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="flex h-[calc(100vh-48px)] overflow-hidden">
      {/* 左侧面板 */}
      <div 
        className="overflow-y-auto border-r border-[#2A2A2C]"
        style={{ width: `${leftWidth}%`, minWidth: '20%' }}
      >
        <div className="p-4 md:p-6">
          <LeftComponent />
        </div>
      </div>
      {/* 拖拽分割线 */}
      <div
        className="w-1 bg-[#2A2A2C] hover:bg-[#FF843D] cursor-col-resize transition-colors shrink-0 relative z-10 flex items-center justify-center"
        onMouseDown={handleMouseDown}
        title="Drag to resize panels"
      >
        <div className="w-4 h-8 bg-[#141415] border border-[#2A2A2C] rounded-full flex flex-col items-center justify-center gap-0.5 shadow-sm">
          <div className="w-0.5 h-1 bg-[#999999]" />
          <div className="w-0.5 h-1 bg-[#999999]" />
          <div className="w-0.5 h-1 bg-[#999999]" />
        </div>
      </div>
      {/* 右侧面板 */}
      <div 
        className="overflow-y-auto"
        style={{ width: `${100 - leftWidth}%`, minWidth: '20%' }}
      >
        <div className="p-4 md:p-6">
          <RightComponent />
        </div>
      </div>
    </div>
  );
}

function App() {
  const { activeNav, splitView, leftPanel, rightPanel } = useAppStore();
  const PageComponent = pageMap[activeNav] || HomePage;

  // 页面加载时自动测试 Supabase 连接
  useEffect(() => {
    if (IS_MOCK_DEMO) {
      return;
    }
    import('@/lib/supabase-test').then(m => m.testSupabase()).catch(console.error);
  }, []);

  // 分屏模式：左右并排显示两个页面，可拖拽调整宽度
  if (splitView) {
    return (
      <AppShell>
        <ResizableSplitView leftPanel={leftPanel} rightPanel={rightPanel} />
      </AppShell>
    );
  }

  // 普通单页模式
  return (
    <AppShell>
      <PageComponent />
    </AppShell>
  );
}

export default App;
