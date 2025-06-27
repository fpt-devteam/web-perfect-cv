import { RoleGuard } from '@/shared/components/guard/RoleGuard';
import { UserRole } from '@/shared/constants/role.enum';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { z } from 'zod';

const fallback = '/_public/forbidden';
export const Route = createFileRoute('/_private/admin-dashboard')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),

  component: () => (
    <RoleGuard requiredRoles={[UserRole.Admin]} fallbackRoute={fallback}>
      <Outlet />
    </RoleGuard>
  ),
});
