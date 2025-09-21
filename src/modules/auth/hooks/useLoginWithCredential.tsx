import { useMutation } from '@tanstack/react-query';
import { loginWithCredentials } from '@/modules/auth/services/auth.service';

const genLoginWithCredentialKey = () => ['loginWithCredential'];

export function useLoginWithCredential(options = {}) {

  return useMutation({
    mutationKey: genLoginWithCredentialKey(),
    mutationFn: loginWithCredentials,
    ...options,
  });
}
