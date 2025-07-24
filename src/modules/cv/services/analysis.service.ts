import { createAIClient } from '@/shared/utils/ai-client.util';
import { ANALYSIS_ENDPOINTS } from '../constants/cv.analyze.endpoint.constant';

import type { AnalysisAPIResponse, ApplySuggestionResponse } from '../types/analysis.types';
import type {
  AnalysisStatusResponse,
  AnalyzeRequest,
  AnalyzeResponse,
} from '../types/analysic.cv.type';

const aiClient = createAIClient();

/**
 * Get analysis feedback by analysis ID
 */
export const getAnalysisFeedback = async (
  analysisId: string | undefined
): Promise<AnalysisAPIResponse> => {
  const { data } = await aiClient<AnalysisAPIResponse>({
    method: 'GET',
    url: ANALYSIS_ENDPOINTS.GET_FEEDBACK(analysisId!),
  });
  return data;
};

/**
 * Submit CV for analysis
 */
export const analyzeCV = async (request: AnalyzeRequest): Promise<AnalyzeResponse> => {
  const { data } = await aiClient<AnalyzeResponse>({
    method: 'POST',
    url: ANALYSIS_ENDPOINTS.ANALYZE_CV,
    data: request,
  });
  return data;
};

/**
 * Apply improvement suggestion
 */
export const applySuggestion = async (
  analysisId: string,
  suggestionId: string,
  appliedBy: string = 'user'
): Promise<ApplySuggestionResponse> => {
  const { data } = await aiClient<ApplySuggestionResponse>({
    method: 'POST',
    url: ANALYSIS_ENDPOINTS.APPLY_SUGGESTION(analysisId, suggestionId),
    data: { appliedBy },
  });
  return data;
};
export const getAnalysicStatus = async (analysisId: string): Promise<AnalysisStatusResponse> => {
  const { data } = await aiClient<AnalysisStatusResponse>({
    method: 'GET',
    url: ANALYSIS_ENDPOINTS.GET_ANALYSIS_STATUS(analysisId),
  });
  return data;
};
