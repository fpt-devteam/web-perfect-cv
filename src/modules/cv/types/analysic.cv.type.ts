import type { JobResponse } from './job.types';

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type QueuePosition = 'active' | 'waiting' | number;

export type AnalysisSubmissionData = {
  analysisId: string;
  cvId: string;
  jobId: string;
  status: AnalysisStatus;
  estimatedProcessingTime: string;
  queuePosition: QueuePosition;
};

export type AnalysisResubmissionData = AnalysisSubmissionData & {
  isResubmission: true;
};

export type AnalysisInProgressData = {
  analysisId: string;
  jobId: string;
  status: AnalysisStatus;
};

export type AnalysisCompletedData = {
  analysisId: string;
  status: AnalysisStatus;
  completedAt: string;
  suggestion: string;
};

export type AnalysisSubmissionResponse = ApiResponse<AnalysisSubmissionData>;
export type AnalysisResubmissionResponse = ApiResponse<AnalysisResubmissionData>;
export type AnalysisInProgressResponse = ApiResponse<AnalysisInProgressData>;
export type AnalysisCompletedResponse = ApiResponse<AnalysisCompletedData>;

export type AnalyzeResponse = JobResponse;

// Legacy types - keeping for backward compatibility
export type LegacyAnalyzeResponse =
  | AnalysisSubmissionResponse
  | AnalysisResubmissionResponse
  | AnalysisInProgressResponse
  | AnalysisCompletedResponse;

export type Contact = {
  phoneNumber: string;
  email: string;
  linkedInUrl: string;
  gitHubUrl: string;
  country: string;
  city: string;
};

export type Summary = {
  context: string;
};

export type Experience = {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Education = {
  degree: string;
  organization: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: number;
};

export type SkillCategory = {
  category: string;
  items: string[];
};

export type Project = {
  title: string;
  description: string;
  link: string;
  startDate: string;
  endDate: string;
};

export type AnalyzeCVData = {
  title: string;
  contact: Contact;
  summary: Summary;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
};

export type UserPreferences = {
  targetIndustry: string;
  targetRole: string;
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  focusAreas: string[];
  urgent: boolean;
};

export type AnalyzeRequest = {
  cvId: string;
  userId: string;
  cvData: AnalyzeCVData;
  userPreferences: UserPreferences;
  reason: string;
};

export type AnalysisStatusResponse = {
  success: boolean;
  data: {
    analysisId: string;
    cvId: string;
    userId: string;
    status: AnalysisStatus;
    userPreferences: UserPreferences;
    createdAt: string;
    updatedAt: string;
  };
  jobStatus: {
    status: AnalysisStatus;
    progress: number;
    processedOn: string;
  };
  processingProgress: number;
  estimatedTimeRemaining: string;
};
