import { useState, useEffect } from 'react';
import { Eye, BarChart3, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils/cn.util';
import { AnalyticsModal } from './AnalyticsModal';
import { CVPDFViewer } from './CVPDFViewer';
import type { AnalysisData } from '../types/analysis.types';
import type { CVData } from '../types/cv.types';
import { useAnalyzeCV, useAnalysisFeedback } from '../hooks/useAnalysis';
import { useCVData } from '../hooks/useCVData';
import { transformCVFullContentToCVData } from '../utils/cv-data-transformer';
import { mockCVData } from '../mock/mockCVData';

interface CVPreviewPageProps {
  cvId: string;
}

// Mock data that matches the exact structure from the conversation summary
const mockAnalysisData: AnalysisData = {
  feedbackId: '550e1230-e29b-41d4-a716-446655440000',
  analysisId: '550e8400-e29b-41d4-a716-446655442211',
  cvId: 'cv_54321',
  userId: 'user_98765',
  version: 2,
  analysis: {
    overallScore: 85,
    sectionAnalysis: {
      summary: {
        score: 80,
        feedback: 'Your summary effectively highlights your key skills and experience.',
        suggestions: ['Add more quantifiable achievements', 'Include industry-specific keywords'],
        strengths: ['Clear career objective', 'Relevant experience mentioned'],
        weaknesses: ['Lacks specific metrics', 'Could be more industry-focused'],
      },
      skills: {
        score: 90,
        feedback: 'Excellent technical skills coverage with good balance.',
        suggestions: ['Add cloud computing skills', 'Include version control systems'],
        strengths: ['Strong programming languages', 'Good framework knowledge'],
        weaknesses: ['Missing emerging technologies'],
        missingSkills: ['Docker', 'Kubernetes', 'AWS'],
        relevantSkills: ['React', 'Node.js', 'Python', 'JavaScript'],
      },
      experience: {
        score: 85,
        feedback: 'Good work experience with clear progression.',
        suggestions: ['Add more quantified achievements', 'Include team leadership examples'],
        strengths: ['Clear career progression', 'Relevant industry experience'],
        weaknesses: ['Could show more impact metrics'],
        careerProgression: 'Strong upward trajectory',
        quantificationLevel: 'Moderate - some metrics present',
      },
      education: {
        score: 95,
        feedback: 'Strong educational background highly relevant to target role.',
        suggestions: ['Add relevant coursework', 'Include academic projects'],
        strengths: ['Relevant degree', 'Good academic performance'],
        weaknesses: ['Limited additional certifications'],
        relevance: 'Highly relevant to Software Technology industry',
      },
      projects: {
        score: 80,
        feedback: 'Good project showcase demonstrating practical skills.',
        suggestions: ['Add live demo links', 'Include technical challenges overcome'],
        strengths: ['Diverse project portfolio', 'Clear technology stack'],
        weaknesses: ['Limited business impact description'],
        technicalDepth: 'Good technical complexity demonstrated',
        businessImpact: 'Moderate - some business value shown',
      },
      certifications: {
        score: 90,
        feedback: 'Excellent certification portfolio showing commitment to learning.',
        suggestions: ['Add cloud certifications', 'Include recent certifications'],
        strengths: ['Industry-recognized certifications', 'Recent completion dates'],
        weaknesses: ['Could include more cloud-specific certs'],
        industryRelevance: 'Highly relevant to current market demands',
      },
      formatting: {
        score: 85,
        feedback: 'Clean, professional formatting with good readability.',
        suggestions: ['Improve section spacing', 'Use consistent bullet points'],
        strengths: ['Professional appearance', 'Good use of white space'],
        weaknesses: ['Minor inconsistencies in formatting'],
      },
    },
    improvementSuggestions: [
      {
        id: 'suggestion_1',
        section: 'summary',
        priority: 'high',
        suggestion: 'Add specific metrics to quantify your achievements',
        explanation:
          'Numbers and percentages make your accomplishments more credible and impactful.',
        autoApplicable: false,
        category: 'Content Enhancement',
        estimatedImpact: 'high',
        _id: 'suggestion_1',
      },
      {
        id: 'suggestion_2',
        section: 'skills',
        priority: 'medium',
        suggestion: 'Include cloud computing technologies',
        explanation: 'Cloud skills are highly valued in the current job market.',
        autoApplicable: true,
        category: 'Technical Skills',
        estimatedImpact: 'medium',
        _id: 'suggestion_2',
      },
      {
        id: 'suggestion_3',
        section: 'experience',
        priority: 'high',
        suggestion: 'Quantify your impact with specific numbers',
        explanation: 'Show how your work contributed to company goals with measurable results.',
        autoApplicable: false,
        category: 'Achievement Metrics',
        estimatedImpact: 'high',
        _id: 'suggestion_3',
      },
    ],
    industrySpecificAdvice: {
      targetIndustry: 'Software Technology',
      relevanceScore: 88,
      industryTrends: [
        'Increased demand for full-stack developers',
        'Growing importance of cloud-native technologies',
        'Rising focus on DevOps and automation',
      ],
      recommendedSkills: ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'TypeScript'],
      industrySpecificSuggestions: [
        'Highlight experience with modern development practices',
        'Emphasize any exposure to cloud platforms',
      ],
      competitorAnalysis:
        'Your profile is competitive but could benefit from more cloud experience',
      marketDemand: 'High demand for your skill set with 15% growth expected in the next 2 years',
    },
    atsCompatibility: {
      score: 80,
      issues: [
        'Header formatting may not parse correctly',
        'Some bullet points use non-standard characters',
      ],
      recommendations: [
        'Use standard bullet points throughout',
        'Ensure consistent date formatting',
        'Add more industry keywords',
      ],
      keywordDensity: 75,
      formatCompliance: 'Good',
      scanability: 'Excellent',
    },
  },
  metadata: {
    processingTime: 3200,
    modelInfo: {
      model: 'mistral-medium-latest',
      temperature: 0.3,
      tokensUsed: 2847,
      requestId: 'req_abc123def456',
    },
    createdAt: '2024-03-15T10:30:00Z',
  },
  userPreferences: {
    targetIndustry: 'Software Technology',
    targetRole: 'Senior Full Stack Developer',
    experienceLevel: 'senior',
    focusAreas: ['Technical Skills', 'Leadership', 'Innovation'],
    urgent: false,
  },
};

export function CVPreviewPage({ cvId }: CVPreviewPageProps) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [analysisId, setAnalysisId] = useState<string | undefined>(undefined);
  const analyzeMutation = useAnalyzeCV();
  const analysisFeedback = useAnalysisFeedback(analysisId);

  // Fetch CV data
  const { data: cvFullContentData, isLoading: isCVLoading, error: cvError } = useCVData(cvId);

  // Transform API data to CVData format
  const transformedCVData: CVData | null = cvFullContentData
    ? transformCVFullContentToCVData(cvFullContentData)
    : null;

  // Use transformed data or fallback to mock data for development
  const currentCVData = transformedCVData || mockCVData;

  // Debug: Log the data for testing
  useEffect(() => {
    if (cvFullContentData) {
      console.log('🔍 API Response:', cvFullContentData);
      console.log('🔄 Transformed Data:', transformedCVData);
    }
  }, [cvFullContentData, transformedCVData]);

  // Set mock analysis ID on mount to fetch feedback
  useEffect(() => {
    setAnalysisId('6868c94fd909c821c767df67');
  }, []);

  // Use mock data initially, but allow real API calls to override
  useEffect(() => {
    setAnalysisData(mockAnalysisData);
  }, []);

  // Handle feedback data when available
  useEffect(() => {
    if (analysisFeedback.data?.success && analysisFeedback.data.data) {
      console.log('Feedback API Response:', analysisFeedback.data);
      setAnalysisData(analysisFeedback.data.data);
    }
  }, [analysisFeedback.data]);

  // Handle feedback loading and error states
  useEffect(() => {
    if (analysisFeedback.isLoading && analysisId) {
      console.log('Fetching feedback for analysis ID:', analysisId);
    }
    if (analysisFeedback.error) {
      console.error('Feedback API Error:', analysisFeedback.error);
      // On error, show mock data as fallback
      setAnalysisData(mockAnalysisData);
    }
  }, [analysisFeedback.isLoading, analysisFeedback.error, analysisId]);

  const handleAnalyze = () => {
    // Hardcoded request body for testing API integration
    const hardcodedRequest = {
      userId: '550e8400-e29b-41d4-a716-446655441234', // Use proper UUID format
      reason: 'User requested analysis from preview page',
      cvData: {
        personalInfo: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1-555-0123',
          location: 'San Francisco, CA',
          linkedIn: 'linkedin.com/in/johndoe',
          github: 'github.com/johndoe',
        },
        summary: {
          content:
            'Experienced Full Stack Developer with 5+ years of experience in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading development teams.',
          keywords: [
            'Full Stack Developer',
            'React',
            'Node.js',
            'Cloud Technologies',
            'Web Applications',
            'Leadership',
          ],
        },
        experience: [
          {
            title: 'Senior Full Stack Developer',
            company: 'Tech Solutions Inc.',
            duration: '2021 - Present',
            location: 'San Francisco, CA',
            responsibilities: [
              'Led development of microservices architecture serving 100K+ users',
              'Implemented CI/CD pipelines reducing deployment time by 60%',
              'Mentored 3 junior developers and conducted code reviews',
            ],
          },
          {
            title: 'Full Stack Developer',
            company: 'StartupXYZ',
            duration: '2019 - 2021',
            location: 'Remote',
            responsibilities: [
              'Developed responsive web applications using React and Node.js',
              'Integrated third-party APIs and payment systems',
              'Collaborated with design team to implement pixel-perfect UIs',
            ],
          },
        ],
        skills: [
          { name: 'React', level: 'Expert', category: 'Frontend' },
          { name: 'Node.js', level: 'Expert', category: 'Backend' },
          { name: 'TypeScript', level: 'Advanced', category: 'Programming Language' },
          { name: 'Python', level: 'Intermediate', category: 'Programming Language' },
          { name: 'PostgreSQL', level: 'Advanced', category: 'Database' },
          { name: 'MongoDB', level: 'Intermediate', category: 'Database' },
          { name: 'AWS', level: 'Intermediate', category: 'Cloud' },
          { name: 'Docker', level: 'Intermediate', category: 'DevOps' },
          { name: 'Leadership', level: 'Advanced', category: 'Soft Skill' },
          { name: 'Problem Solving', level: 'Expert', category: 'Soft Skill' },
          { name: 'Communication', level: 'Advanced', category: 'Soft Skill' },
          { name: 'Team Collaboration', level: 'Expert', category: 'Soft Skill' },
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of California, Berkeley',
            year: '2019',
            gpa: 3.8,
          },
        ],
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution with payment integration',
            technologies: ['React', 'Node.js', 'Stripe API', 'PostgreSQL'],
            link: 'https://github.com/johndoe/ecommerce-platform',
          },
          {
            name: 'Task Management App',
            description: 'Real-time collaborative task management application',
            technologies: ['React', 'Socket.io', 'MongoDB', 'Express'],
            link: 'https://github.com/johndoe/task-manager',
          },
        ],
        certifications: [
          {
            name: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            year: '2023',
          },
          {
            name: 'React Developer Certification',
            issuer: 'Meta',
            year: '2022',
          },
        ],
      },
      userPreferences: {
        targetIndustry: 'Software Technology',
        targetRole: 'Senior Full Stack Developer',
        experienceLevel: 'senior',
        focusAreas: ['technical-skills', 'leadership', 'achievements'],
        urgent: false,
      },
    };

    analyzeMutation.mutate(
      {
        cvId,
        request: hardcodedRequest,
      },
      {
        onSuccess: response => {
          // Handle real API response
          console.log('Analysis API Response:', response);

          // Show the analytics modal immediately
          setShowAnalytics(true);
        },
        onError: error => {
          console.error('Analysis API Error:', error);
          // On error, still show mock data for development
          setShowAnalytics(true);
        },
      }
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-700 bg-green-50 border-green-300';
    if (score >= 80) return 'text-blue-700 bg-blue-50 border-blue-300';
    if (score >= 70) return 'text-yellow-700 bg-yellow-50 border-yellow-300';
    if (score >= 60) return 'text-orange-700 bg-orange-50 border-orange-300';
    return 'text-red-700 bg-red-50 border-red-300';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  // Use current analysis data or fallback to mock
  const currentAnalysisData = analysisData || mockAnalysisData;

  // Check if we're in a loading state
  const isAnalyzing = analyzeMutation.isPending;
  const isLoadingFeedback = analysisFeedback.isLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Main CV Content - Made much wider */}
        <div className="xl:col-span-4">
          <CVPDFViewer
            cvData={currentCVData}
            isLoading={isCVLoading}
            error={cvError?.message || null}
          />
        </div>

        {/* Sidebar - Made more compact */}
        <div className="xl:col-span-1 space-y-4">
          {/* AI Score Card */}
          <Card className="shadow-md border-gray-200 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">AI Score</h3>
                  {isLoadingFeedback ? (
                    // Skeleton loading state
                    <>
                      <div className="h-10 w-12 bg-gray-200 rounded animate-pulse mx-auto mt-2"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto mt-2"></div>
                    </>
                  ) : (
                    // Normal state with data
                    <>
                      <div
                        className={cn(
                          'text-2xl font-bold mt-2',
                          getScoreColor(currentAnalysisData.analysis.overallScore).split(' ')[0]
                        )}
                      >
                        {currentAnalysisData.analysis.overallScore}
                      </div>
                      <Badge
                        className={cn(
                          'mt-1 border text-xs',
                          getScoreColor(currentAnalysisData.analysis.overallScore)
                        )}
                        variant="outline"
                      >
                        {getScoreLabel(currentAnalysisData.analysis.overallScore)}
                      </Badge>
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={() => setShowAnalytics(true)}
                    disabled={isLoadingFeedback}
                    className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm h-8"
                  >
                    <Eye className="h-3 w-3" />
                    {isLoadingFeedback ? 'Loading...' : 'View Details'}
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    variant="outline"
                    className="w-full gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm h-8"
                  >
                    <RefreshCw className={cn('h-3 w-3', isAnalyzing && 'animate-spin')} />
                    {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-md border-gray-200 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                {isLoadingFeedback ? (
                  // Skeleton loading state
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">ATS Score</span>
                      <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">Suggestions</span>
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">Industry Match</span>
                      <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">Keywords</span>
                      <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </>
                ) : (
                  // Normal state with data
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">ATS Score</span>
                      <span className="font-semibold text-purple-700 text-sm">
                        {currentAnalysisData.analysis.atsCompatibility.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">Suggestions</span>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-800 border-gray-300 px-2 py-0"
                      >
                        {currentAnalysisData.analysis.improvementSuggestions.length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">Industry Match</span>
                      <span className="font-semibold text-green-700 text-sm">
                        {currentAnalysisData.analysis.industrySpecificAdvice.relevanceScore}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">Keywords</span>
                      <span className="font-semibold text-primary text-sm">
                        {currentAnalysisData.analysis.atsCompatibility.keywordDensity}%
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Industry Advice Preview */}
          <Card className="shadow-md border-gray-200 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Industry Focus</h3>
              <div className="space-y-3">
                {isLoadingFeedback ? (
                  // Skeleton loading state
                  <>
                    <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                    </div>
                    <div className="text-xs text-gray-700">
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="flex flex-wrap gap-1">
                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Normal state with data
                  <>
                    <div className="text-center p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      <p className="font-medium text-purple-900 text-sm">
                        {currentAnalysisData.analysis.industrySpecificAdvice.targetIndustry}
                      </p>
                      <p className="text-xs text-purple-700 mt-1">Target Industry</p>
                    </div>
                    <div className="text-xs text-gray-700">
                      <p className="mb-2 font-medium">Top Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {currentAnalysisData.analysis.industrySpecificAdvice.recommendedSkills
                          .slice(0, 2)
                          .map(skill => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-xs bg-primary/10 text-primary border-primary/20 px-2 py-0"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {currentAnalysisData.analysis.industrySpecificAdvice.recommendedSkills
                          .length > 2 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-800 border-gray-300 px-2 py-0"
                          >
                            +
                            {currentAnalysisData.analysis.industrySpecificAdvice.recommendedSkills
                              .length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Tips Card */}
          <Card className="shadow-md border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4">
              <h3 className="text-base font-semibold text-green-900 mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Pro Tips
              </h3>
              <div className="space-y-2">
                <div className="text-xs text-green-800 bg-green-100 p-2 rounded border border-green-200">
                  <p className="font-medium mb-1">💡 Quick Tip</p>
                  <p>Use action verbs and quantify your achievements for better ATS scoring.</p>
                </div>
                <div className="text-xs text-blue-800 bg-blue-100 p-2 rounded border border-blue-200">
                  <p className="font-medium mb-1">🎯 Optimization</p>
                  <p>Include relevant keywords from the job description you're targeting.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Modal */}
      <AnalyticsModal
        open={showAnalytics}
        onOpenChange={setShowAnalytics}
        analysisData={currentAnalysisData}
        isLoading={isLoadingFeedback}
      />
    </div>
  );
}
