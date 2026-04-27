import { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { useAppStore } from '@/stores/useAppStore';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { splitView } = useAppStore();

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <Sidebar />
      <TopHeader />
      {/* Desktop: ml-16 for sidebar, pt-12 for header */}
      {/* Mobile: no ml (sidebar hidden), pt-12 for mobile header, pb-16 for bottom tab */}
      <main className={`md:ml-16 pt-12 min-h-screen pb-16 md:pb-0 ${splitView ? '' : ''}`}>
        <div className={`${splitView ? '' : 'p-4 md:p-8 max-w-[1200px] mx-auto'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
