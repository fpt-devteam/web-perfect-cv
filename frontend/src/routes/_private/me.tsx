import { useGetMe } from '@/shared/hooks/useGetMe';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/me')({
  component: () => <Profile />,
});

function Profile() {
  const { user } = useGetMe();
  return <div>Hello {user?.name}</div>;
}
