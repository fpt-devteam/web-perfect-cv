import { useQuery } from '@tanstack/react-query';
import { listCVs } from '@/modules/cv/services/cv.services';
import type { CVListQuery } from '@/modules/cv/types/cv.types';
import { GET_CVS_ENDPOINT } from '@/modules/cv/constants/cv-endpoint.constant';

export const genListCVsKey = (query: CVListQuery) => ['get', GET_CVS_ENDPOINT, query];

export function useListCVs(query: CVListQuery, options = {}) {
  return useQuery({
    queryKey: genListCVsKey(query),
    queryFn: () => listCVs(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
}
