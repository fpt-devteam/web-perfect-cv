import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/public-page')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>This is public parks page!</div>;
}
