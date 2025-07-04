export interface AnalysisAPIResponse {
  success: boolean;
  data: AnalysisData;
}

export interface AnalysisData {
  feedbackId: string;
  analysisId: string;
  cvId: string;
  userId: string;
  version: number;
  analysis: CVAnalysis;
  metadata: AnalysisMetadata;
  userPreferences: UserPreferences;
}

export interface CVAnalysis {
  overallScore: number;
  sectionAnalysis: SectionAnalysis;
  improvementSuggestions: ImprovementSuggestion[];
  industrySpecificAdvice: IndustrySpecificAdvice;
  atsCompatibility: ATSCompatibility;
}

export interface SectionAnalysis {
  summary: SectionScore;
  skills: SkillsSection;
  experience: ExperienceSection;
  education: EducationSection;
  projects: ProjectsSection;
  certifications: CertificationsSection;
  formatting: SectionScore;
}

export interface SectionScore {
  score: number;
  feedback: string;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface SkillsSection extends SectionScore {
  missingSkills: string[];
  relevantSkills: string[];
}

export interface ExperienceSection extends SectionScore {
  careerProgression: string;
  quantificationLevel: string;
}

export interface EducationSection extends SectionScore {
  relevance: string;
}

export interface ProjectsSection extends SectionScore {
  technicalDepth: string;
  businessImpact: string;
}

export interface CertificationsSection extends SectionScore {
  industryRelevance: string;
}

export interface ImprovementSuggestion {
  id: string;
  section: string;
  priority: 'low' | 'medium' | 'high';
  suggestion: string;
  explanation: string;
  autoApplicable: boolean;
  category: string;
  estimatedImpact: 'low' | 'medium' | 'high';
  _id: string;
}

export interface IndustrySpecificAdvice {
  targetIndustry: string;
  relevanceScore: number;
  industryTrends: string[];
  recommendedSkills: string[];
  industrySpecificSuggestions: string[];
  competitorAnalysis: string;
  marketDemand: string;
}

export interface ATSCompatibility {
  score: number;
  issues: string[];
  recommendations: string[];
  keywordDensity: number;
  formatCompliance: string;
  scanability: string;
}

export interface AnalysisMetadata {
  processingTime: number;
  modelInfo: {
    model: string;
    temperature: number;
    tokensUsed: number;
    requestId: string;
  };
  createdAt: string;
}

export interface UserPreferences {
  targetIndustry: string;
  targetRole: string;
  experienceLevel: string;
  focusAreas: string[];
  urgent: boolean;
}

export interface AnalyzeRequest {
  cvData?: Record<string, unknown>;
  userPreferences?: UserPreferences;
  reason?: string;
}

// API Response Types
export interface AnalyzeResponse {
  success: boolean;
  message: string;
  data: {
    analysisId: string;
    status: string;
  };
}

export interface ApplySuggestionResponse {
  success: boolean;
  message: string;
  data: {
    suggestionId: string;
    appliedAt: string;
    appliedBy: string;
  };
}
