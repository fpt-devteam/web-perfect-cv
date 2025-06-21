import { useToaster } from '@/shared/hooks/use-toaster';
import { privateApi } from '@/shared/lib/api-client';
import { type User } from '@/shared/types/base.type';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_private/_admin/user-management')({
  component: UserManagement,
});

function UserManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const toaster = useToaster();

  useEffect(() => {
    const fetchData = async () => {
      const toastId = toaster.loading('Loading users...');
      try {
        const ans: User[] = await privateApi.get('/users');
        setUsers(ans);
        toaster.success('Users loaded!', { id: toastId });
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toaster.error('Failed to fetch users', { id: toastId });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toaster]);

  const notify = () => {
    toaster.success('Here is your toast.');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      {isLoading ? (
        <p>Loading UI...</p>
      ) : (
        <>
          {users.map(u => (
            <h1 key={u.id}>{u.name}</h1>
          ))}
          <button onClick={notify} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Make me a toast
          </button>
        </>
      )}
    </div>
  );
}
