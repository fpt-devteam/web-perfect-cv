import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/admin-dashboard/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Admin Dashboard page</div>;
}
