import { useMutation } from '@tanstack/react-query';
import { logout } from '@/modules/auth/services/auth.service';
import { useAuth } from '@/modules/auth/hooks/useAuth';

const genLogoutKey = () => ['logout'];
export function useLogout(options = {}) {
  const { clear } = useAuth();
  return useMutation({
    mutationKey: genLogoutKey(),
    mutationFn: logout,
    onSuccess: () => {
      clear();
    },
    ...options,
  });
}
