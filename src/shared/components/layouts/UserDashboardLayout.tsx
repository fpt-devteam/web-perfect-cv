import { type ReactNode } from 'react';

type UserDashboardLayoutProps = {
  readonly children: ReactNode;
};

import {
  Inbox,
  Settings,
  User2,
  CreditCard,
  Sparkle,
  Newspaper,
  Book,
  ChevronsUpDown,
  Bell,
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
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { AppIcon } from '@/shared/components/ui/app-icon';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Separator } from '@/shared/components/ui/separator';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { useGetMe } from '@/shared/hooks/useGetMe';
import { Spinner } from '@/shared/components/loading/Spinner';
import { LogoutButton } from '@/modules/auth/components/LogoutButton';

const items = [
  {
    title: 'My Dashboard',
    url: '/cvs',
    icon: Newspaper,
  },
  {
    title: 'Review CV',
    url: '/review-cv',
    icon: Inbox,
  },
  {
    title: 'Sample Library',
    url: '/sample-library',
    icon: Book,
  },
];

function UserSidebar() {
  const { data: user, isPending } = useGetMe();

  if (isPending || !user) {
    return <Spinner size="sm" />;
  }

  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader>
        <AppIcon />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="group-data-[collapsible=icon]:p-2!">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <Avatar className="rounded-lg">
                    {/* <AvatarImage src={user?.avatarUrl} alt={user?.name} /> */}
                    <AvatarFallback>PL</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem className="cursor-pointer">
                  <User2 />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Sparkle />
                  <span>Upgrade to Pro</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <CreditCard />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Bell />
                  <span>Notification</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function UserDashboardTabs() {
  return (
    <Tabs defaultValue="/cvs">
      <TabsList>
        <TabsTrigger value="/cvs">CVs</TabsTrigger>
        <TabsTrigger value="/cover-letter">Cover Letters</TabsTrigger>
        <TabsTrigger value="/resignation-letter">Resignation Letters</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <UserSidebar />
      <main className="p-2 flex flex-col flex-grow">
        <div className="flex items-center">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <UserDashboardTabs />
        </div>
        <div className="p-4 flex-grow overflow-y-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
