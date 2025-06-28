import { useMutation } from '@tanstack/react-query';
import { loginWithCredentials } from '@/modules/auth/services/auth.service';
import { useAuth } from '@/modules/auth/hooks/useAuth';

const genLoginWithCredentialKey = () => ['loginWithCredential'];

export function useLoginWithCredential(options = {}) {
  const { syncUserInfo } = useAuth();

  return useMutation({
    mutationKey: genLoginWithCredentialKey(),
    mutationFn: loginWithCredentials,
    onSuccess: () => {
      syncUserInfo();
    },
    ...options,
  });
}
