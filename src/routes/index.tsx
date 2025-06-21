import { useEffect } from 'react';
import { AdminLayout } from '@/shared/components/layouts/dashboard-layout';
import { Spinner } from '@/shared/components/loading/spinner';
import { useGetMe } from '@/shared/hooks/use-get-me';
import { ROLE } from '@/shared/types/base.enum';
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: () => <RoleBaseLayoutComponent />,
});

function RoleBaseLayoutComponent() {
  const { mutate, isPending, user } = useGetMe();
  const navigate = useNavigate();

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (isPending) {
    return <Spinner size="lg" />;
  }

  if (user?.role === ROLE.USER) {
    navigate({ to: '/cv' });
    return null;
  }

  if (user?.role === ROLE.ADMIN) {
    return (
      <AdminLayout>
        <h1>Admin Layout</h1>
        <Outlet />
      </AdminLayout>
    );
  }

  return <div>Role not recognized. Please contact support.</div>;
}
