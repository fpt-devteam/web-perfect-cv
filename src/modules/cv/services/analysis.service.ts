import { createAIClient } from '@/shared/utils/ai-client.util';
import type {
  AnalysisAPIResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  ApplySuggestionResponse,
} from '../types/analysis.types';

const aiClient = createAIClient();

/**
 * Get analysis feedback by analysis ID
 */
export const getAnalysisFeedback = async (analysisId: string): Promise<AnalysisAPIResponse> => {
  const { data } = await aiClient<AnalysisAPIResponse>({
    method: 'GET',
    url: `/api/cv/${analysisId}/feedback`,
  });
  return data;
};

/**
 * Submit CV for analysis
 */
export const analyzeCV = async (
  cvId: string,
  request: AnalyzeRequest
): Promise<AnalyzeResponse> => {
  const { data } = await aiClient<AnalyzeResponse>({
    method: 'POST',
    url: `/api/cv/analyze`,
    data: { cvId, ...request },
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
    url: `/api/cv/analyze/${analysisId}/suggestions/${suggestionId}/apply`,
    data: { appliedBy },
  });
  return data;
};
