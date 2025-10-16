// import { TabsList, TabsTrigger, Tabs } from '@/shared/components/ui/tabs';
// import { FileText, Sparkles, FileX, Search, Bell, ChevronDown } from 'lucide-react';
// import { useNavigate } from '@tanstack/react-router';
// import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/shared/components/ui/dropdown-menu';
// import { Button } from '@/shared/components/ui/button';
// import { useAuth } from '@/modules/auth/hooks/useAuth';
// import { LogoutButton } from '@/modules/auth/components/LogoutButton';

// export function SearchBar() {
//   return (
//     <div className="relative w-60">
//       <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//       <input
//         type="text"
//         placeholder="Search"
//         className="w-full pl-8 pr-4 py-1 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
//       />
//     </div>
//   );
// }

// export function UpgradeButton() {
//   const navigate = useNavigate();

//   return (
//     <Button
//       size="sm"
//       variant="outline"
//       className="bg-white border-primary text-primary hover:bg-primary/5 hover:text-primary"
//       onClick={() => navigate({ to: '/dashboard/pricing' })}
//     >
//       UPGRADE
//     </Button>
//   );
// }

// export function NotificationButton() {
//   return (
//     <Button size="icon" variant="ghost">
//       <Bell className="h-4 w-4" />
//     </Button>
//   );
// }

// export function UserProfileMenu() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'CV';

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="flex items-center gap-2">
//           <Avatar className="h-8 w-8 rounded-full">
//             {user?.avatarUrl && (
//               <AvatarImage src={user.avatarUrl} alt={user.email || 'User avatar'} />
//             )}
//             <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white">
//               {userInitials}
//             </AvatarFallback>
//           </Avatar>
//           <ChevronDown className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-56">
//         <div className="px-3 py-2">
//           <p className="text-sm font-medium">{user?.email}</p>
//           <p className="text-xs text-gray-500">
//             {user?.remainingCredit !== undefined ? (
//               <>
//                 {user.remainingCredit} credits remaining{' '}
//                 <span
//                   className="text-primary font-medium cursor-pointer hover:underline"
//                   onClick={() => navigate({ to: '/dashboard/pricing' })}
//                 >
//                   Get More
//                 </span>
//               </>
//             ) : (
//               <>
//                 Free Plan{' '}
//                 <span
//                   className="text-primary font-medium cursor-pointer hover:underline"
//                   onClick={() => navigate({ to: '/dashboard/pricing' })}
//                 >
//                   Upgrade
//                 </span>
//               </>
//             )}
//           </p>
//         </div>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/account' })}>
//           <span className="text-sm">Account</span>
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/billing' })}>
//           <span className="text-sm">Billing History</span>
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>
//           <LogoutButton />
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// export function DashboardNavTabs() {
//   return (
//     <Tabs defaultValue="/dashboard/cvs" className="w-full">
//       <TabsList className="flex h-10 gap-1 rounded-lg bg-muted p-1 w-fit">
//         <TabsTrigger
//           value="/dashboard/cvs"
//           className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg transition-all"
//         >
//           <FileText className="h-4 w-4" />
//           <span className="font-medium">RESUMES</span>
//         </TabsTrigger>
//         <TabsTrigger
//           value="/dashboard/cover-letter"
//           className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg transition-all"
//         >
//           <Sparkles className="h-4 w-4" />
//           <span className="font-medium">COVER LETTERS</span>
//         </TabsTrigger>
//         <TabsTrigger
//           value="/dashboard/resignation-letter"
//           className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg transition-all"
//         >
//           <FileX className="h-4 w-4" />
//           <span className="font-medium">RESIGNATION LETTERS</span>
//         </TabsTrigger>
//       </TabsList>
//     </Tabs>
//   );
// }

// export function ActionsBar() {
//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-4 w-full">
//         {/* <SearchBar /> */}
//         <div className="flex-1"></div>
//         <UpgradeButton />
//         <NotificationButton />
//         <UserProfileMenu />
//       </div>
//     </div>
//   );
// }

// export function DashboardHeader() {
//   return (
//     <div className="flex border-b border-[var(--border)] bg-white px-6 py-4">
//       <DashboardNavTabs />
//       <ActionsBar />
//     </div>
//   );
// }
