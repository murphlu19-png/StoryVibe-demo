import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { IS_MOCK_DEMO } from '@/lib/mockDemoMode';
import {
  Home, Sparkles, FileText, Pencil, Folder, Users, UserCog,
  Bell, Settings, CircleUser, X, Menu, Download,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Home, Sparkles, FileText, Pencil, Folder, Users, UserCog,
};

const navItems = [
  { id: 'home', icon: 'Home', label: 'Home' },
  { id: 'generate', icon: 'Sparkles', label: 'Generate' },
  { id: 'script', icon: 'FileText', label: 'Script' },
  { id: 'edit', icon: 'Pencil', label: 'Edit' },
  { id: 'assets', icon: 'Folder', label: 'Assets' },
  { id: 'community', icon: 'Users', label: 'Community' },
  { id: 'user', icon: 'UserCog', label: 'Developer' },
];

export default function Sidebar() {
  const { activeNav, pageTitleOverride, setActiveNav, requestScriptOverview } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleNavItems = IS_MOCK_DEMO ? navItems.filter((item) => item.id !== 'user') : navItems;
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

  const handleNavClick = (navId: string) => {
    if (navId === 'script') {
      requestScriptOverview();
    }
    setActiveNav(navId);
  };

  return (
    <>
      {/* Desktop Sidebar — 左侧固定 */}
      <aside className="fixed left-0 top-0 h-full w-16 bg-[#141415] border-r border-[#2A2A2C] z-50 hidden md:flex flex-col items-center py-4">
        <div className="mb-6 flex items-center justify-center w-10 h-10 rounded-lg bg-[#FF843D]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="2" />
            <polygon points="10,8 16,12 10,16" fill="white" />
          </svg>
        </div>
        <nav className="flex-1 flex flex-col items-center gap-1">
          {visibleNavItems.map((item) => {
            const IconComp = iconMap[item.icon];
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                  isActive ? 'bg-[#1E1E20] text-[#FFFFFF]' : 'text-[#6B6B6F] hover:text-[#9A9A9E]'
                }`}
                title={item.label}
              >
                <IconComp size={22} strokeWidth={isActive ? 2 : 1.5} />
              </button>
            );
          })}
        </nav>
        <div className="flex flex-col items-center gap-1 mt-auto">
          <a
            href="/download.html"
            className="w-12 h-12 rounded-lg flex items-center justify-center text-[#6B6B6F] hover:text-[#FF843D] transition-all"
            title="Download Full Project"
          >
            <Download size={20} strokeWidth={1.5} />
          </a>
          <button className="w-12 h-12 rounded-lg flex items-center justify-center text-[#6B6B6F]" title="Notifications">
            <Bell size={20} strokeWidth={1.5} />
          </button>
          <button className="w-12 h-12 rounded-lg flex items-center justify-center text-[#6B6B6F]" title="Settings">
            <Settings size={20} strokeWidth={1.5} />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#2A2A2C] flex items-center justify-center mt-1" title="Profile">
            <CircleUser size={20} className="text-[#9A9A9E]" />
          </button>
        </div>
      </aside>

      {/* Mobile — 顶部Header带汉堡菜单 */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-12 bg-[#141415]/90 backdrop-blur-sm border-b border-[#2A2A2C] z-50 flex items-center justify-between px-4">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="w-10 h-10 flex items-center justify-center">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="font-bold text-[14px]">{pageTitle}</span>
        <div className="w-8 h-8 rounded-full bg-[#2A2A2C] flex items-center justify-center">
          <CircleUser size={16} className="text-[#9A9A9E]" />
        </div>
      </div>

      {/* Mobile — 全屏导航菜单 */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#141415] pt-14 pb-4 px-4 overflow-y-auto">
          <nav className="space-y-1">
            {visibleNavItems.map((item) => {
              const IconComp = iconMap[item.icon];
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all ${
                    isActive ? 'bg-[#FF843D] text-white' : 'bg-[#141415] text-[#FFFFFF]'
                  }`}
                >
                  <IconComp size={20} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-[15px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-6 pt-4 border-t border-[#2A2A2C] space-y-1">
            <a
              href="/download.html"
              className="w-full flex items-center gap-4 px-4 py-3 text-[#FF843D]"
            >
              <Download size={20} /> Download Project
            </a>
            <button className="w-full flex items-center gap-4 px-4 py-3 text-[#9A9A9E]">
              <Bell size={20} /> Notifications
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 text-[#9A9A9E]">
              <Settings size={20} /> Settings
            </button>
          </div>
        </div>
      )}

      {/* Mobile — 底部Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#141415]/90 backdrop-blur-sm border-t border-[#2A2A2C] z-50 flex items-center justify-around px-2">
        {visibleNavItems.slice(0, 5).map((item) => {
          const IconComp = iconMap[item.icon];
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-all ${
                isActive ? 'text-[#FFFFFF]' : 'text-[#6B6B6F]'
              }`}
            >
              <IconComp size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] mt-1 font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
