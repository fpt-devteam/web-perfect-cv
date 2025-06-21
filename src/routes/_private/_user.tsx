import { UserLayout } from '@/shared/components/layouts/user-layout';
import { AuthGuard } from '@/shared/components/guard/auth-guard';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ROLE } from '@/shared/types/base.enum';

const fallback = '/auth/login';
export const Route = createFileRoute('/_private/_user')({
  component: () => (
    <AuthGuard allowedRoles={[ROLE.USER]} fallbackRoute={fallback}>
      <UserLayout>
        <Outlet />
      </UserLayout>
      ,
    </AuthGuard>
  ),
});
