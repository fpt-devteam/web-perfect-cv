import { type ReactNode } from 'react';
import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { DashboardSidebar } from '@/shared/components/layouts/DashboardSidebar';
import { DashboardHeader } from '@/shared/components/layouts/DashboardHeader';

type UserDashboardLayoutProps = {
  readonly children: ReactNode;
};

export function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="grid h-screen w-screen grid-cols-[auto_1fr] overflow-hidden bg-muted/30">
        <DashboardSidebar />
        <div className="flex h-full flex-col overflow-auto">
          {/* <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[var(--border)] bg-white px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search documents..."
                  className="h-9 w-64 rounded-lg border border-[var(--border)] bg-white pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-muted-foreground hover:bg-muted/50 transition-colors">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-muted-foreground hover:bg-muted/50 transition-colors">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </header> */}

          <DashboardHeader />

          <main className="flex-1 overflow-auto bg-gradient-to-b from-white to-muted/20 px-6 py-6">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
