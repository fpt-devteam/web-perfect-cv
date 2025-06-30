import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { Navbar } from '@/shared/components/navbar/Navbar';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Spinner } from '@/shared/components/loading/Spinner';
export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  // beforeLoad: async ({ context }) => {
  //   const { getCurrentUser } = context.auth;
  //   const user = await getCurrentUser();
  //   console.log('user in beforeLoad auth', user);
  //   if (user) {
  //     console.log('user is logged in');
  //     throw redirect({ to: '/user-dashboard/cvs' });
  //   }
  // },
});

function AuthLayout() {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) {
        return navigate({ to: '/user-dashboard/cvs' });
      }
      setReady(true);
    });
  }, [getCurrentUser, navigate]);

  if (!ready) {
    return <Spinner />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Outlet />
      </div>
    </>
  );
}
