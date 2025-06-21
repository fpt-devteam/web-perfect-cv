import { AuthGuard } from '@/shared/components/guard/auth-guard';
import { ROLE } from '@/shared/types/base.enum';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';
import { z } from 'zod';

const fallback = '/forbidden';
export const Route = createFileRoute('/_private/_admin')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),

  component: () => (
    <AuthGuard allowedRoles={[ROLE.ADMIN]} fallbackRoute={fallback}>
      <Outlet />
      <Toaster position="top-right" />
    </AuthGuard>
  ),
});
