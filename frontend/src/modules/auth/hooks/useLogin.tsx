import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/modules/auth/services/auth.service';
import type { LoginRequest } from '../types/auth.type';

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending, data, error: mutationError } = useMutation({
    mutationKey: ['login'],
    mutationFn: async (loginReq: LoginRequest) => {
      try {
        const response = await authService.login(loginReq);

        if (!response) {
          return null;
        }

        return response;
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
        return null;
      }
    },
    onError: (error: any) => {
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
