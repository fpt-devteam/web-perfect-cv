import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSummary, upsertSummary } from '@/modules/cv/services/cv.services';
import type { UpSertSummaryRequest } from '@/modules/cv/types/cv.types';

const genSummaryKey = (cvId: string) => ['summary', cvId];

export function useGetSummary({ cvId }: { readonly cvId: string }) {
  return useQuery({
    queryKey: genSummaryKey(cvId),
    queryFn: () => getSummary({ cvId }),
    enabled: !!cvId,
    retry: 2,
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
