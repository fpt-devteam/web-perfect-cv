import { useQuery } from '@tanstack/react-query';
import { listCVs } from '@/modules/cv/services/cv.services';
import type { CVListQuery } from '@/modules/cv/types/cv.types';
import { GET_CVS_ENDPOINT } from '@/modules/cv/constants/cv-endpoint.constant';

export const genListCVsKey = (query: CVListQuery) => ['get', GET_CVS_ENDPOINT, query];

export function useListCVs(query: CVListQuery, options = {}) {
  return useQuery({
    queryKey: genListCVsKey(query),
    queryFn: () => {
      console.log('API call triggered with query:', query);
      return listCVs(query);
    },
    staleTime: 0, // Force fresh data for debugging
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
}
