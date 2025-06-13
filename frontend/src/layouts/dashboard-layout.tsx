import { type ReactNode } from 'react';

type AdminLayoutProps = {
  readonly children: ReactNode;
};

import {
  Inbox,
  Settings,
  User2,
  CreditCard,
  LogOut,
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
import AppIcon from '@/shared/components/ui/app-icon';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Separator } from '@/shared/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useGetMe } from '@/shared/hooks/useGetMe';

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

function AdminSidebar() {
  const { user, isPending } = useGetMe();

  if (isPending) {
    return (
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem key={index}>
            <item.icon />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
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
                <SidebarMenuButton>
                  <Avatar className="rounded-lg">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback>PL</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <User2 />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Sparkle />
                  <span>Upgrade to Pro</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CreditCard />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  <span>Notification</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function DashboardTabs() {
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

function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="p-2 flex flex-col flex-grow ">
        <div className="flex items-center">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <DashboardTabs />
        </div>

        <div className="p-4 flex-grow overflow-y-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default AdminLayout;
