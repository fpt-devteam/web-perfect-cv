export const ANALYSIS_ENDPOINTS = {
  ANALYZE_CV: 'api/cv/analyze',
  GET_FEEDBACK: (analysisId: string) => `api/cv/${analysisId}/feedback`,
  GET_ANALYSIS_STATUS: (analysisId: string) => `api/cv/analyze/${analysisId}/status`,
  APPLY_SUGGESTION: (analysisId: string, suggestionId: string) =>
    `api/cv/analyze/${analysisId}/suggestions/${suggestionId}/apply`,
};
