import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private')({
  component: PrivateLayout,
  beforeLoad: async ({ context }) => {
    const authTest = await context.auth.isAuthenticated();
    console.log('authTest', authTest);
    if (!(await context.auth.isAuthenticated())) throw redirect({ to: '/login' });
  },
});

function PrivateLayout() {
  return <Outlet />;
}
