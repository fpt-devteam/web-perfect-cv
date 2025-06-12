import { useEffect } from 'react';
import AdminLayout from '@/layouts/dashboard-layout';
import { SpinnerPage } from '@/shared/components/spinnerPage/SpinnerPage';
import { useGetMe } from '@/shared/hooks/useGetMe';
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
    return <SpinnerPage />;
  }

  if (user?.role === ROLE.USER) {
    navigate({ to: '/cvs' });
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
