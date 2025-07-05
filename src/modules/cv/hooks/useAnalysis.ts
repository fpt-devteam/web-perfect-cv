import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnalysisFeedback, analyzeCV, applySuggestion } from '../services/analysis.service';
import type { AnalyzeRequest } from '../types/analysis.types';
import { useNotification } from '@/shared/hooks/useNotification';

/**
 * Hook to fetch analysis feedback
 */
export const useAnalysisFeedback = (analysisId: string | undefined) => {
  return useQuery({
    queryKey: ['analysisFeedback', analysisId],
    queryFn: () => getAnalysisFeedback(analysisId!),
    enabled: !!analysisId,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to analyze CV
 */
export const useAnalyzeCV = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: ({ cvId, request }: { cvId: string; request: AnalyzeRequest }) =>
      analyzeCV(cvId, request),
    onSuccess: () => {
      showSuccess('CV analysis started successfully!');
      // Invalidate analysis feedback to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['analysisFeedback'] });
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to start analysis');
    },
  });
};

/**
 * Hook to apply improvement suggestion
 */
export const useApplySuggestion = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: ({
      analysisId,
      suggestionId,
      appliedBy,
    }: {
      analysisId: string;
      suggestionId: string;
      appliedBy?: string;
    }) => applySuggestion(analysisId, suggestionId, appliedBy),
    onSuccess: (_, variables) => {
      showSuccess('Suggestion marked as applied!');
      // Invalidate analysis feedback to update UI
      queryClient.invalidateQueries({ queryKey: ['analysisFeedback', variables.analysisId] });
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to apply suggestion');
    },
  });
};
