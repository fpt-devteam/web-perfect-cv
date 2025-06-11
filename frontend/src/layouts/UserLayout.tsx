import { useEffect, useState, type ReactNode } from 'react';

type UserLayoutProps = {
    readonly children: ReactNode;
};

import { Inbox, Settings, User2, CreditCard, LogOut, Sparkle, Newspaper, Book, ChevronsUpDown, Bell } from "lucide-react"

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
} from "@/shared/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import AppIcon from '@/shared/components/ui/app-icon';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Separator } from '@/shared/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useGetMe } from '@/shared/hooks/useGetMe';
import { Button } from '@/shared/components/ui/button';
import { useLogout } from '@/modules/auth/hooks/useLogout';
import { useToaster } from '@/shared/hooks/useToaster';
import type { LogoutRequest } from '@/modules/auth/types/auth.type';
import { authService } from '@/modules/auth/services/auth.service';
import { SpinnerPage } from '@/shared/components/spinnerPage/SpinnerPage';

const items = [
    {
        title: "My Dashboard",
        url: "/cvs",
        icon: Newspaper,
    },
    {
        title: "Review CV",
        url: "/review-cv",
        icon: Inbox,
    },
    {
        title: "Sample Library",
        url: "/sample-library",
        icon: Book,
    },
]

function UserSidebar() {

    const { mutate, isPending, user } = useGetMe();

    useEffect(() => {
        if (!user) {
            mutate();
        }
    }, [mutate, user]);

    if (isPending || !user) {
        return <SpinnerPage />;
    }

    return (
        <Sidebar collapsible="icon" side="left" >
            <SidebarHeader>
                <AppIcon />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup >
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url} className="group-data-[collapsible=icon]:p-2!" >
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
                                    <div className="grid flex-1 text-left text-sm leading-tight"><span className="truncate font-medium">{user?.name}</span><span className="truncate text-xs">{user?.email}</span></div>
                                    <ChevronsUpDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="right"
                                className="w-[--radix-popper-anchor-width]"
                            >
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
                                    <LogoutButton />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar >
    )
}

function LogoutButton() {
    const { mutate } = useLogout();
    const toast = useToaster();
    const [isClick, setIsClick] = useState(false);

    useEffect(() => {
        if (isClick) {
            const logoutReq: LogoutRequest = {
                accessToken: authService.getData()!.accessToken
            };

            mutate(logoutReq, {
                onSuccess: () => {
                    window.location.reload();
                    toast.success("Logout successful");
                },
                onError: (error: any) => {
                    toast.error(error.message || "Logout failed");
                },
            });
        }
    }, [isClick]);

    return (
        <Button onClick={() => setIsClick(true)}>
            <LogOut />
            <span>Sign out</span>
        </Button>
    )
}

function DashboardTabs() {
    return (
        <Tabs defaultValue='/cvs'>
            <TabsList>
                <TabsTrigger value="/cvs">CVs</TabsTrigger>
                <TabsTrigger value="/cover-letter">Cover Letters</TabsTrigger>
                <TabsTrigger value="/resignation-letter">Resignation Letters</TabsTrigger>
            </TabsList>

        </Tabs>
    );
}

function UserLayout({ children }: UserLayoutProps) {


    return (
        <SidebarProvider>
            <UserSidebar />
            <main className="p-2 flex flex-col flex-grow">
                <div className="flex items-center">
                    <SidebarTrigger />
                    <Separator orientation="vertical" />
                    <DashboardTabs />
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}

export default UserLayout; 
