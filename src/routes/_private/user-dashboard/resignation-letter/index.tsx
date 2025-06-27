import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/user-dashboard/resignation-letter/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_private/dashboard/resignation-letter/"!</div>;
}
