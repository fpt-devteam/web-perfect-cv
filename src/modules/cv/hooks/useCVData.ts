import { useQuery } from '@tanstack/react-query';
import type { CVResponse } from '../types/cv.types';
import { getCV } from '../services/cv.services';

interface UseCVDataOptions {
  enabled?: boolean;
}

export const useCVData = (cvId: string, options?: UseCVDataOptions) => {
  return useQuery({
    queryKey: ['cv', cvId],
    queryFn: async (): Promise<CVResponse> => {
      return getCV({ cvId });
    },
    enabled: options?.enabled !== undefined ? options.enabled && !!cvId : !!cvId,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache in memory
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
    // Polling configuration
    refetchInterval: (query) => {
      // If CV structure is not done, poll every 2 seconds
      if (query.state.data && !query.state.data.isStructuredDone) {
        return 2000; // 2 seconds
      }
      // If structure is done, stop polling
      return false;
    },
    refetchIntervalInBackground: true, // Continue polling even when window is not focused
  });
};
