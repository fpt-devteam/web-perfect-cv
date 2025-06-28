import { ACTIVATE_ACCOUNT_ENDPOINT } from '@/modules/auth/constants/auth.constant';
import { useMutation } from '@tanstack/react-query';
import { activateAccount } from '@/modules/auth/services/auth.service';

export const genActivateAccountKey = () => ['post', ACTIVATE_ACCOUNT_ENDPOINT];
export function useActivateAccount(options = {}) {
  return useMutation({
    mutationKey: genActivateAccountKey(),
    mutationFn: activateAccount,
    ...options,
  });
}
