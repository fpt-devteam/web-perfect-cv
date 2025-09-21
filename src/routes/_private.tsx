import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private')({
  component: PrivateLayout,
  beforeLoad: async ({ context }) => {
    if (!(await context.auth.isAuthenticated())) throw redirect({ to: "/login" });
  },
});

function PrivateLayout() {
  return <Outlet />;
}
