import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSummary, upsertSummary } from '@/modules/summary/services/summary.services';
import type { UpSertSummaryRequest } from '@/modules/summary/types/summary.types';

const genSummaryKey = (cvId: string) => ['summary', cvId];

export function useGetSummary({ cvId }: { readonly cvId: string }) {
  return useQuery({
    queryKey: genSummaryKey(cvId),
    queryFn: () => getSummary({ cvId })
  });
}

export function useUpsertSummary({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (summaryData: UpSertSummaryRequest) => upsertSummary({ cvId, summaryData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: genSummaryKey(cvId) });
    }
  });
}