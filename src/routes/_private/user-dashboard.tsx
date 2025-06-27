import { UserDashboardLayout } from '@/shared/components/layouts/UserDashboardLayout';
import { RoleGuard } from '@/shared/components/guard/RoleGuard';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { UserRole } from '@/shared/constants/role.enum';

const fallback = '/login';
export const Route = createFileRoute('/_private/user-dashboard')({
  component: () => (
    <RoleGuard requiredRoles={[UserRole.User]} fallbackRoute={fallback}>
      <UserDashboardLayout>
        <Outlet />
      </UserDashboardLayout>
    </RoleGuard>
  ),
});
