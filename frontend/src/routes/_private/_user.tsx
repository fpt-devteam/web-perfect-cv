import UserLayout from '@/layouts/UserLayout'
import { AuthGuard } from '@/shared/components/guard/AuthGuard'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ROLE } from '@/shared/types/base.enum'

const fallback = '/forbidden'
export const Route = createFileRoute('/_private/_user')({
  component: () =>
    <AuthGuard allowedRoles={[ROLE.USER]} fallbackRoute={fallback}>
      <UserLayout><Outlet /></UserLayout>,
    </AuthGuard>,
})

