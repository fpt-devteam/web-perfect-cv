import { User2, CreditCard, LayoutDashboard, FileText, Book, ChevronUp } from 'lucide-react';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Link, useNavigate } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import { Logo } from '@/shared/components/logo/Logo';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { LogoutButton } from '@/modules/auth/components/LogoutButton';

type SidebarItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string | number;
};

const generalItems: SidebarItemType[] = [
  {
    title: 'CVs',
    url: '/dashboard/cvs',
    icon: LayoutDashboard,
  },
  {
    title: 'Cover Letters',
    url: '/dashboard/cover-letter',
    icon: FileText,
  },
  {
    title: 'Resignation Letters',
    url: '/dashboard/resignation-letter',
    icon: Book,
  },
];

const toolsItems: SidebarItemType[] = [
  {
    title: 'My Account',
    url: '/dashboard/account',
    icon: User2,
  },
  // {
  //   title: 'Premium Features',
  //   url: '/dashboard/premium',
  //   icon: Star,
  // },
  {
    title: 'Billing',
    url: '/dashboard/billing',
    icon: CreditCard,
  },
];

// const supportItems: SidebarItemType[] = [
//   {
//     title: 'Notifications',
//     url: '/dashboard/notifications',
//     icon: Bell,
//   },
//   {
//     title: 'Settings',
//     url: '/dashboard/settings',
//     icon: Settings,
//   },
// ];

function truncateText(text: string | undefined, maxLength: number = 15): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function DashboardSidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'CV';

  return (
    <Sidebar
      collapsible="icon"
      side="left"
      className="border-r border-[var(--sidebar-border)] bg-gradient-to-b from-[var(--sidebar)] to-white shadow-sm"
    >
      <SidebarHeader
        onClick={() => navigate({ to: '/dashboard/cvs' })}
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
      </SidebarContent>

      <SidebarFooter className="border-t border-[var(--sidebar-border)] p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Avatar className="h-9 w-9 rounded-full">
                {user?.avatarUrl && (
                  <AvatarImage src={user.avatarUrl} alt={user.email || 'User avatar'} />
                )}
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col items-start overflow-hidden text-left">
                <span className="text-sm font-medium" title={user?.email}>
                  {truncateText(user?.email, 15)}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.remainingCredit !== undefined
                    ? `${user.remainingCredit} credits`
                    : 'Free Plan'}
                </span>
              </div>
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-gray-500">
                {user?.remainingCredit !== undefined ? (
                  <>
                    {user.remainingCredit} credits remaining{' '}
                    <span
                      className="text-primary font-medium cursor-pointer hover:underline"
                      onClick={() => navigate({ to: '/dashboard/pricing' })}
                    >
                      Get More
                    </span>
                  </>
                ) : (
                  <>
                    Free Plan{' '}
                    <span
                      className="text-primary font-medium cursor-pointer hover:underline"
                      onClick={() => navigate({ to: '/dashboard/pricing' })}
                    >
                      Upgrade
                    </span>
                  </>
                )}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/account' })}>
              <span className="text-sm">Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/billing' })}>
              <span className="text-sm">Billing History</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
