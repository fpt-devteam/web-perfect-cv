import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/activation-account/')({
  component: IndexRouteComponent,
});

export function IndexRouteComponent() {
  return <Navigate to="/login" />;
}
