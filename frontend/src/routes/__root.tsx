import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { AuthContextType } from '@/modules/auth/types/auth.type';

interface MyRouterContext {
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Outlet />,
});
