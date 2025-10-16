import { type ReactNode } from 'react';
import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { DashboardSidebar } from '@/shared/components/layouts/DashboardSidebar';
// import { DashboardHeader } from '@/shared/components/layouts/DashboardHeader';

type DashboardLayoutProps = {
  readonly children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="grid h-screen w-screen grid-cols-[auto_1fr] overflow-hidden bg-muted/30">
        <DashboardSidebar />
        <div className="flex h-full flex-col overflow-auto">
          {/* <DashboardHeader /> */}

          <main className="flex-1 overflow-auto bg-gradient-to-b from-white to-muted/20 px-8 scrollbar-hide">
            <div className="mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
