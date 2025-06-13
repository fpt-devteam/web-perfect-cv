import { createFileRoute, Outlet } from '@tanstack/react-router';
import { z } from 'zod';
import { AuthGuard } from '@/shared/components/guard/AuthGuard';

export const Route = createFileRoute('/_private/_private')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  component: () => (
    <AuthGuard allowedRoles={[]} fallbackRoute="/auth/login">
      <Outlet />
    </AuthGuard>
  ),
});
