import type { JobResponse } from '../types/job.types';

/**
 * Utility functions for handling JobResponse objects
 */

/**
 * Check if a job response indicates success
 */
export const isJobSuccessful = (jobResponse: JobResponse): boolean => {
  return (
    jobResponse.status === 'Succeeded' ||
    jobResponse.status === 'Queued' ||
    jobResponse.status === 'Running'
  );
};

/**
 * Check if a job response indicates failure
 */
export const isJobFailed = (jobResponse: JobResponse): boolean => {
  return jobResponse.status === 'Failed' || jobResponse.status === 'Canceled';
};

/**
 * Get appropriate success message based on job status
 */
export const getJobSuccessMessage = (
  jobResponse: JobResponse,
  defaultMessage: string = 'Operation completed successfully'
): string => {
  switch (jobResponse.status) {
    case 'Queued':
      return 'Request queued successfully! Processing will begin shortly.';
    case 'Running':
      return 'Processing your request...';
    case 'Succeeded':
      return 'Operation completed successfully!';
    default:
      return defaultMessage;
  }
};

/**
 * Get appropriate error message from job response
 */
export const getJobErrorMessage = (
  jobResponse: JobResponse,
  defaultMessage: string = 'Operation failed'
): string => {
  // Priority 1: Use errorMessage if available (most specific)
  if (jobResponse.errorMessage) {
    return jobResponse.errorMessage;
  }

  // Priority 2: Use errorCode with user-friendly translations
  if (jobResponse.errorCode) {
    // Convert error codes to user-friendly messages
    switch (jobResponse.errorCode) {
      case 'score_cv.no_rubric':
        return 'Please create a job description with meaningful rubrics before scoring.';
      case 'score_cv.invalid_cv':
        return 'The CV data is invalid or incomplete.';
      case 'score_cv.processing_error':
        return 'An error occurred while processing your CV.';
      case 'analysis.insufficient_credits':
        return 'You have insufficient credits to perform this analysis. Please purchase more credits.';
      case 'analysis.rate_limit_exceeded':
        return 'Rate limit exceeded. Please wait before trying again.';
      case 'analysis.invalid_request':
        return 'The analysis request is invalid. Please check your CV data and try again.';
      case 'analysis.service_unavailable':
        return 'Analysis service is temporarily unavailable. Please try again later.';
      default:
        return `Operation failed: ${jobResponse.errorCode}`;
    }
  }

  // Priority 3: Use status-based generic messages
  switch (jobResponse.status) {
    case 'Failed':
      return 'The operation failed to complete.';
    case 'Canceled':
      return 'The operation was canceled.';
    default:
      return defaultMessage;
  }
};

/**
 * Handle job response and return appropriate success/error info
 */
export const handleJobResponse = (
  jobResponse: JobResponse,
  defaultSuccessMessage?: string,
  defaultErrorMessage?: string
) => {
  if (isJobSuccessful(jobResponse)) {
    return {
      success: true,
      message: getJobSuccessMessage(jobResponse, defaultSuccessMessage),
    };
  } else {
    return {
      success: false,
      message: getJobErrorMessage(jobResponse, defaultErrorMessage),
    };
  }
};
