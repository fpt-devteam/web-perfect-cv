import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { RoleGuard } from '@/shared/components/guard/RoleGuard';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { UserRole } from '@/shared/constants/role.enum';

const fallback = '/forbidden';
export const Route = createFileRoute('/_private/dashboard')({
  component: () => (
    <RoleGuard requiredRoles={[UserRole.User]} fallbackRoute={fallback}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </RoleGuard>
  ),
});
