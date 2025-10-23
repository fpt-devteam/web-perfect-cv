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
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="py-3 flex items-center gap-3 lg:hidden">
                <SidebarTrigger className="h-9 w-9" />
              </div>
              <div className="w-full">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
