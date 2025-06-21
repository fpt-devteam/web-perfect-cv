import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/_user/cv/create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_private/dashboard/cvs/create"!</div>;
}
