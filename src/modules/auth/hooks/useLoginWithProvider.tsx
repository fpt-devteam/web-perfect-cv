import { useMutation } from '@tanstack/react-query';
import { loginWithProvider } from '@/modules/auth/services/auth.service';
import { LOGIN_ENDPOINT } from '@/modules/auth/constants/auth.constant';
import type { LoginResponse, AuthProvider } from '@/modules/auth/types/auth.type';

const genLoginWithProviderKey = () => ['post', LOGIN_ENDPOINT];

export function useLoginWithProvider(options = {}) {

  return useMutation<LoginResponse, Error, { provider: AuthProvider; code: string }>({
    mutationKey: genLoginWithProviderKey(),
    mutationFn: ({ provider, code }) => loginWithProvider(provider, code),
    ...options,
  });
}
