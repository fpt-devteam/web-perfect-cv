import type { UserResponse } from '../types/auth.type';
import { authClient } from '../services/client.service';
import { useQuery } from '@tanstack/react-query';
import { GET_ME_ENDPOINT } from '@/modules/auth/constants/auth.constant';

export const genGetMeKey = () => ['get', GET_ME_ENDPOINT];

export async function getMe() {
  const { data } = await authClient<UserResponse>({
    method: 'get',
    url: GET_ME_ENDPOINT,
  });

  return data;
}

export function useGetMe(options = {}) {
  return useQuery({
    queryKey: genGetMeKey(),
    queryFn: () => getMe(),
    ...options,
  });
}
