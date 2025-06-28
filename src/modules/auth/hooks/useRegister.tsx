import { registerWithCredentials } from '@/modules/auth/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { REGISTER_ENDPOINT } from '@/modules/auth/constants/auth.constant';

const genRegisterKey = () => ['post', REGISTER_ENDPOINT];
export function useRegister(options = {}) {
  return useMutation({
    mutationFn: registerWithCredentials,
    mutationKey: genRegisterKey(),
    ...options,
  });
}
