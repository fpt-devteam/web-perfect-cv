import { useQuery } from '@tanstack/react-query';
import { listCVs } from '@/modules/cv/services/cv.services';
import type { CVListQuery } from '@/modules/cv/types/cv.types';
import { GET_CVS_ENDPOINT } from '@/modules/cv/constants/cv-endpoint.constant';
export const genListCVsKey = () => ['get', GET_CVS_ENDPOINT];

export function useListCVs(query: CVListQuery, options = {}) {
  return useQuery({
    queryKey: genListCVsKey(),
    queryFn: () => listCVs(query),
    ...options,
  });
}
