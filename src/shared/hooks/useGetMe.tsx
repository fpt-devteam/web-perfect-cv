import { useQuery } from '@tanstack/react-query';
import type { UserResponse } from '@/modules/auth/types/auth.type';
import { authClient } from '@/modules/auth/services/client.service';
import { TANSTACK_STALE_TIME, GET_ME_ENDPOINT } from '@/shared/constants/app.constant';
export function useGetMe(options = {}) {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const { data } = await authClient<UserResponse>({
        method: 'GET',
        url: GET_ME_ENDPOINT,
      });
      return data;
    },
    staleTime: TANSTACK_STALE_TIME,
    ...options,
  });
}
