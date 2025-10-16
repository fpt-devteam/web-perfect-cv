import { type ReactNode } from 'react';
import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { DashboardSidebar } from '@/shared/components/layouts/DashboardSidebar';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';

type DashboardLayoutProps = {
  readonly children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-muted/30">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-muted/20">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
              <div className="mb-6 flex items-center gap-3">
                <SidebarTrigger className="h-9 w-9 lg:hidden" />
              </div>
              <div className="w-full">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
