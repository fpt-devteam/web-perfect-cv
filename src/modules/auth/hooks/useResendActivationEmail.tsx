import { useMutation } from '@tanstack/react-query';
import { resendActivationEmail } from '@/modules/auth/services/auth.service';
import { RESEND_ACTIVATION_EMAIL_ENDPOINT } from '@/modules/auth/constants/auth.constant';

export const genResendActivationEmailKey = () => ['post', RESEND_ACTIVATION_EMAIL_ENDPOINT];
export function useResendActivationEmail(options = {}) {
  return useMutation({
    mutationKey: genResendActivationEmailKey(),
    mutationFn: resendActivationEmail,
    ...options,
  });
}
