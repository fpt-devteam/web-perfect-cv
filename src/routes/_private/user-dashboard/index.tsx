import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_private/user-dashboard/')({
  component: IndexRouteComponent,
});

export function IndexRouteComponent() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: '/user-dashboard/cvs', replace: true });
  }, [navigate]);
  return null;
}
