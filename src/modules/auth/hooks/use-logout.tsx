import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useMutation } from '@tanstack/react-query';
import type { LogoutRequest } from '../types/auth.type';

export const useLogout = () => {
  const [error, setError] = useState<string | null>(null);

  const {
    mutate,
    isPending,
    data,
    error: mutationError,
  } = useMutation({
    mutationKey: ['logout'],
    mutationFn: async (logoutReq: LogoutRequest) => {
      try {
        const response = await authService.logout(logoutReq);

        if (!response) {
          return null;
        }

        return response;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        return null;
      }
    },
    onError: (error: Error) => {
      setError(error.message || 'Something went wrong');
    },
  });

  return {
    mutate,
    isPending,
    error: error || mutationError?.message || null,
    data,
  };
};
