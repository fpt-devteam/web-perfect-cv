import { useQuery } from '@tanstack/react-query';
import type { CVFullContentResponse } from '../types/cv.types';
import { getCVFullContent } from '../services/cv.services';

export const useCVData = (cvId: string) => {
  return useQuery({
    queryKey: ['cv-full-content', cvId],
    queryFn: async (): Promise<CVFullContentResponse> => {
      return getCVFullContent({ cvId });
    },
    enabled: !!cvId,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache in memory
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};
