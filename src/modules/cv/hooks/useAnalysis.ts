import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAnalysisFeedback,
  analyzeCV,
  applySuggestion,
  getAnalysicStatus,
} from '../services/analysis.service';
import type { AnalyzeRequest } from '../types/analysic.cv.type';
import { handleJobResponse } from '../utils/job-response.util';
import { useNotification } from '@/shared/hooks/useNotification';
import { AxiosError } from 'axios';

/**
 * Hook to fetch analysis feedback
 */
// export const useAnalysisFeedback = () => {
//   return useQuery({
//     queryKey: ['analysisFeedback', analysisId],
//     queryFn: (analysisId: string) => getAnalysisFeedback(analysisId),
//     enabled: !!analysisId,
//     retry: 3,
//     staleTime: 5 * 60 * 1000,
//   });
// };

export const useAnalysisFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (analysisId: string) => getAnalysisFeedback(analysisId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysisFeedback'] });
    },
  });
};

/**
 * Hook to analyze CV
 */
export const useAnalyzeCV = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: (request: AnalyzeRequest) => analyzeCV(request),
    onSuccess: (data) => {
      // Use utility function to handle job response
      const result = handleJobResponse(data, 'CV analysis started successfully!', 'Failed to start analysis');

      if (result.success) {
        showSuccess(result.message);
        // Invalidate analysis feedback to trigger refetch
        queryClient.invalidateQueries({ queryKey: ['analysisFeedback'] });
      } else {
        showError(result.message);
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      // Handle HTTP-level errors (network, server errors, etc.)
      showError(error?.response?.data?.message || 'Failed to start analysis');
    },
  });
};

export const useAnalysicStatus = (analysisId: string) => {
  return useQuery({
    queryKey: ['analysisStatus', analysisId],
    queryFn: () => getAnalysicStatus(analysisId),
    enabled: !!analysisId,
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
    onError: (error: AxiosError<{ message?: string }>) => {
      showError(error?.response?.data?.message || 'Failed to apply suggestion');
    },
  });
};
