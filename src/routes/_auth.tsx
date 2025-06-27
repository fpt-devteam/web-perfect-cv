import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Navbar } from '@/shared/components/navbar/Navbar';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  beforeLoad: async ({ context }) => {
    if (await context.auth.isAuthenticated()) throw redirect({ to: '/' });
  },
});

function AuthLayout() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Outlet />
      </div>
    </>
  );
}
