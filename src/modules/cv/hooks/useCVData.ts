import { useQuery } from '@tanstack/react-query';
import type { CVData } from '../types/cv.types';
import { mockCVData } from '../mock/mockCVData';

export const useCVData = (cvId: string) => {
  return useQuery({
    queryKey: ['cv-data', cvId],
    queryFn: async (): Promise<CVData> => {
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return mock data for now
      // TODO: Replace with actual API call to base API when ready
      // const response = await baseClient.get(`/cv/${cvId}`);
      // return response.data;

      return mockCVData;
    },
    enabled: !!cvId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
