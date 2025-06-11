import { useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import UserLayout from '@/layouts/UserLayout';
import { SpinnerPage } from '@/shared/components/spinnerPage/SpinnerPage';
import { useGetMe } from '@/shared/hooks/useGetMe';
import { ROLE } from '@/shared/types/base.enum';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

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

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (isPending) {
    return <SpinnerPage />;
  }

  if (user?.role === ROLE.USER) {
    return (
      <UserLayout>
        <h1>User Layout</h1>
        <Outlet />
      </UserLayout>
    );
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
