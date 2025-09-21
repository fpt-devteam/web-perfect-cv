import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSummary, upsertSummary } from '@/modules/summary/services/summary.services';
import type { UpSertSummaryRequest } from '@/modules/summary/types/summary.types';

const genSummaryKey = (cvId: string) => ['summary', cvId];

export function useGetSummary({ cvId }: { readonly cvId: string }) {
  return useQuery({
    queryKey: genSummaryKey(cvId),
    queryFn: () => getSummary({ cvId }),
    enabled: !!cvId,
    retry: (failureCount, error: any) => {
      // Don't retry for 404 errors (SummaryNotFound)
      if (error?.response?.status === 404 || error?.code === 'SummaryNotFound') {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useUpsertSummary({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (summaryData: UpSertSummaryRequest) => upsertSummary({ cvId, summaryData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: genSummaryKey(cvId) });
    },
    retry: 1,
  });
}