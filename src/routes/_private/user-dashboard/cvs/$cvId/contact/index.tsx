import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/user-dashboard/cvs/$cvId/contact/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="p-6">contact</div>;
}
