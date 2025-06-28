import { useQuery } from '@tanstack/react-query';
import { getLoginLink } from '@/modules/auth/services/auth.service';
import { GET_LOGIN_LINK_ENDPOINT } from '@/modules/auth/constants/auth.constant';
import type { AuthProvider } from '@/modules/auth/types/auth.type';

export const genGetLoginLinkKey = (provider: AuthProvider) => [
  'get',
  GET_LOGIN_LINK_ENDPOINT,
  provider,
];

export function useGetLoginLink(provider: AuthProvider, options = {}) {
  return useQuery({
    queryKey: genGetLoginLinkKey(provider),
    queryFn: () => getLoginLink(provider),
    ...options,
  });
}
