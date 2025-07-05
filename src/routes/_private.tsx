import { useAuth } from '@/modules/auth/hooks/useAuth';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Spinner } from '@/shared/components/loading/spinner';

export const Route = createFileRoute('/_private')({
  component: PrivateLayout,
  // beforeLoad: async ({ context }) => {
  //   const { getCurrentUser } = context.auth;
  //   const user = await getCurrentUser();
  //   if (!user) {
  //     throw redirect({ to: '/login' });
  //   }
  // },
});

function PrivateLayout() {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getCurrentUser().then(user => {
      console.log('user in _private', user);
      if (!user && ready) {
        return navigate({ to: '/login' });
      }
      setReady(true);
    });
  }, [getCurrentUser, navigate, ready]);

  if (!ready) {
    return <Spinner />;
  }

  return <Outlet />;
}
