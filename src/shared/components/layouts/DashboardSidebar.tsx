import {
  FileText,
  Settings,
  User2,
  CreditCard,
  LayoutDashboard,
  Book,
  Bell,
  Star,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import { Link, useNavigate } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import { Logo } from '@/shared/components/logo/Logo';

type SidebarItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string | number;
};

const generalItems: SidebarItemType[] = [
  {
    title: 'My Dashboard',
    url: '/user-dashboard/cvs',
    icon: LayoutDashboard,
  },
  {
    title: 'Review CV',
    url: '/user-dashboard/review-cv',
    icon: FileText,
  },
  {
    title: 'Sample Library',
    url: '/user-dashboard/sample-library',
    icon: Book,
  },
];

const toolsItems: SidebarItemType[] = [
  {
    title: 'My Account',
    url: '/user-dashboard/account',
    icon: User2,
  },
  {
    title: 'Premium Features',
    url: '/user-dashboard/premium',
    icon: Star,
  },
  {
    title: 'Billing',
    url: '/user-dashboard/billing',
    icon: CreditCard,
  },
];

const supportItems: SidebarItemType[] = [
  {
    title: 'Notifications',
    url: '/user-dashboard/notifications',
    icon: Bell,
  },
  {
    title: 'Settings',
    url: '/user-dashboard/settings',
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  return (
    <Sidebar
      collapsible="icon"
      side="left"
      className="border-r border-[var(--sidebar-border)] bg-gradient-to-b from-[var(--sidebar)] to-white shadow-sm"
    >
      <SidebarHeader
        onClick={() => navigate({ to: '/user-dashboard/cvs' })}
        className="flex items-center justify-center cursor-pointer pb-6 pt-6"
      >
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            General
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group transition-all duration-200 hover:bg-primary/10"
                  >
                    <Link
                      to={item.url}
                      className="group-data-[collapsible=icon]:p-2! flex items-center gap-3 rounded-lg px-4 py-2 justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Tools
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group transition-all duration-200 hover:bg-primary/10"
                  >
                    <Link
                      to={item.url}
                      className="group-data-[collapsible=icon]:p-2! flex items-center gap-3 rounded-lg px-4 py-2 justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-purple-100 text-purple-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Support
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group transition-all duration-200 hover:bg-primary/10"
                  >
                    <Link
                      to={item.url}
                      className="group-data-[collapsible=icon]:p-2! flex items-center gap-3 rounded-lg px-4 py-2"
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-[var(--sidebar-border)] pt-4"></SidebarFooter>
    </Sidebar>
  );
}
