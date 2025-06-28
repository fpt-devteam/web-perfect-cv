import { createFileRoute, useNavigate, useParams, useSearch } from '@tanstack/react-router';

import type { AuthProvider } from '@/modules/auth/types/auth.type';
import { useEffect } from 'react';
import { useLoginWithProvider } from '@/modules/auth/hooks/useLoginWithProvider';
import { useNotification } from '@/shared/hooks/useNotification';
import { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';

export const Route = createFileRoute('/oauth2/$provider/callback')({
  validateSearch: search => ({
    code: String(search.code),
  }),
  component: OAuthCallback,
});

function OAuthCallback() {
  const { mutate: loginWithProvider } = useLoginWithProvider();
  const { provider } = useParams({ from: '/oauth2/$provider/callback' });
  const { code } = useSearch({ from: '/oauth2/$provider/callback' });
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();

  useEffect(() => {
    if (code && provider) {
      loginWithProvider(
        {
          provider: provider as AuthProvider,
          code,
        },
        {
          onSuccess: () => {
            showSuccess('Login successfully');
            navigate({ to: '/user-dashboard/cvs' });
          },
          onError: error => {
            showError(error as AxiosError<BaseError>);
            navigate({ to: '/login' });
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, provider]);

  return <div>Processing authentication...</div>;
}
