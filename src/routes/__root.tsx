import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { NotFound } from '@/shared/components/error-pages/NotFound';
import type { useNotification } from '@/shared/hooks/useNotification';
import type { useAuth } from '@/modules/auth/hooks/useAuth';
type RouterContext = {
  auth: ReturnType<typeof useAuth>;
  notification: ReturnType<typeof useNotification>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
  notFoundComponent: () => <NotFound />,
});

export function Root() {
  return <Outlet />;
}
