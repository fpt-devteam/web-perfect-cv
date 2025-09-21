import { useState, useEffect, useRef } from 'react';
import { Eye, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/utils/cn.util';
import { AnalyticsModal } from './AnalyticsModal';
import type { AnalysisData } from '../types/analysis.types';
import type { CVData } from '../types/cv.types';
import { useAnalysisFeedback, useAnalyzeCV } from '../hooks/useAnalysis';
import type { AnalyzeRequest } from '../types/analysic.cv.type';
import { useAnalyzeIdForCv, getAnalyzeIdForCv, setAnalyzeIdForCv } from '../stores/analyze.store';

interface AIAnalysisCardProps {
  cvData: CVData;
}

export function AIAnalysisCard({ cvData }: AIAnalysisCardProps) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analysicData, setAnalysicData] = useState<AnalysisData>();
  const [noFeedback, setNoFeedback] = useState(false);
  const [isAnalyzingFeedback, setIsAnalyzingFeedback] = useState(false);

  const analyzeMutation = useAnalyzeCV();
  const analysisFeedback = useAnalysisFeedback();
  const workerRef = useRef<Worker | null>(null);

  const cvId = cvData?.CVId || '';
  const [analyzeIdAtom, setAnalyzeIdAtom] = useAnalyzeIdForCv(cvId);

  // Helper to start the worker
  const startWorker = (id: string) => {
    if (workerRef.current) {
      console.log('[Worker] Terminating existing worker before starting new one');
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setIsAnalyzingFeedback(true);
    console.log('[Worker] Starting new worker for analyzeId:', id);
    const AnalysisFeedbackWorker = new Worker(
      new URL('../worker/analysis-feedback.worker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = AnalysisFeedbackWorker;
    AnalysisFeedbackWorker.postMessage({
      analysisId: id,
      apiBaseUrl: import.meta.env.VITE_AI_API_ENDPOINT || '',
      intervalMs: 3000,
    });
    AnalysisFeedbackWorker.onmessage = (event: MessageEvent) => {
      if (event.data?.type === 'feedback') {
        console.log('[Worker] Feedback received, terminating worker');
        setAnalysicData(event.data.data.data);
        setIsAnalyzingFeedback(false);
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }
      } else if (event.data?.type === 'error') {
        console.log('[Worker] Error received, terminating worker');
        setIsAnalyzingFeedback(false);
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }
      }
    };
  };

  const shouldPollFeedback = !!getAnalyzeIdForCv(cvId) && !analysicData;

  useEffect(() => {
    const analyzeId = getAnalyzeIdForCv(cvId);
    if (shouldPollFeedback && analyzeId) {
      startWorker(analyzeId);
    } else {
      setIsAnalyzingFeedback(false);
      if (workerRef.current) {
        console.log(
          '[Worker] No analyzeId or feedback already present, terminating any existing worker'
        );
        workerRef.current.terminate();
        workerRef.current = null;
      }
    }
    return () => {
      if (workerRef.current) {
        console.log('[Worker] Cleaning up worker on unmount');
        workerRef.current.terminate();
        workerRef.current = null;
      }
      setIsAnalyzingFeedback(false);
    };
  }, [cvId, shouldPollFeedback, analysicData]);

  const handleAnalyze = () => {
    const newCvId = cvId;
    const analyzeCVRequest: AnalyzeRequest = {
      cvId: newCvId,
      userId: cvData.UserId,
      reason: 'User requested analysis from preview page',
      cvData: {
        title: cvData.Title,
        contact: {
          email: cvData.Contacts?.Email || 'example@example.com',
          phoneNumber: cvData.Contacts?.PhoneNumber || '0911290070',
          city: cvData.Contacts?.City || 'Hanoi',
          country: cvData.Contacts?.Country || 'Vietnam',
          linkedInUrl: cvData.Contacts?.LinkedInUrl || 'https://www.linkedin.com/in/your-profile',
          gitHubUrl: cvData.Contacts?.GitHubUrl || 'https://github.com/your-profile',
        },
        summary: {
          context: cvData.Summary || 'No summary',
        },
        experience: cvData.Experiences?.map(experience => ({
          jobTitle: experience.JobTitle || 'No job title',
          company: experience.Organization || 'No company',
          location: experience.Location || 'No location',
          startDate: experience.StartDate || '',
          endDate: experience.EndDate || '',
          description: experience.Description || 'No description',
        })),
        skills: cvData.Skills?.map(skill => ({
          category: skill.Name || 'No category',
          items: [skill.Description || 'No description'],
        })),
        education: cvData.Educations?.map(education => ({
          degree: education.Degree || '',
          organization: education.Organization || 'No organization',
          fieldOfStudy: education.FieldOfStudy || 'No field of study',
          startDate: education.StartDate || '2024-01-01',
          endDate: education.EndDate || '2024-01-01',
          gpa: education.Gpa || 0,
        })),
        projects: cvData.Projects?.map(project => ({
          title: project.Title || 'No title',
          description: project.Description || 'No description',
          link: project.Link || 'https://link-to-your-project',
          startDate: project.StartDate || '2024-01-01',
          endDate: project.EndDate || '2024-01-01',
        })),
      },
      userPreferences: {
        targetIndustry: cvData.JobDetail?.CompanyName || 'No company name',
        targetRole: cvData.JobDetail?.JobTitle || 'No job title',
        experienceLevel: 'senior' as const,
        focusAreas: ['technical-skills', 'leadership', 'achievements'],
        urgent: false,
      },
    };
    analyzeMutation.mutate(analyzeCVRequest, {
      onSuccess: response => {
        setAnalyzeIdAtom(undefined);
        setAnalyzeIdForCv(cvId, response.data.analysisId);
        setAnalysicData(undefined);
      },
    });
  };

  const handleGetFeedback = () => {
    const analyzeId = getAnalyzeIdForCv(cvId);
    if (!analyzeId) {
      setNoFeedback(true);
      setShowAnalytics(true);
      return;
    }
    setShowAnalytics(true);
    if (!analysicData && !isAnalyzingFeedback && !analysisFeedback.isPending) {
      analysisFeedback.mutate(analyzeId);
    }
  };

  const isAnalyzing = analyzeMutation.isPending;
  const isLoadingFeedback = analysisFeedback.isPending;
  const hasFeedbackData = analysisFeedback.data?.data;

  // Cache feedback data when it arrives
  useEffect(() => {
    if (hasFeedbackData && !analysicData) {
      console.log('Caching feedback data:', hasFeedbackData);
      setAnalysicData(hasFeedbackData);
    }
  }, [hasFeedbackData, analysicData]);

  // Use cached data or fresh API data
  const currentAnalysisData = analysicData || hasFeedbackData;

  const isModalLoading =
    isAnalyzing || (analyzeIdAtom && !currentAnalysisData && isLoadingFeedback);

  // Clean up worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  // Button logic
  let feedbackBtnText: string;
  if (isLoadingFeedback) {
    feedbackBtnText = 'AI is processing...';
  } else if (analysicData) {
    feedbackBtnText = 'View Details';
  } else {
    feedbackBtnText = 'View Feedback';
  }

  return (
    <>
      <Card className="shadow-md border-gray-200 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">AI Analyze</h3>
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleGetFeedback}
                disabled={!!isLoadingFeedback}
                className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm h-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="h-3 w-3" />
                {feedbackBtnText}
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                variant="outline"
                className="w-full gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm h-8"
              >
                <RefreshCw className={cn('h-3 w-3', isAnalyzing && 'animate-spin')} />
                Analyze
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Modal */}
      {showAnalytics && (
        <AnalyticsModal
          open={showAnalytics}
          onOpenChange={open => {
            setShowAnalytics(open);
            if (!open) setNoFeedback(false);
          }}
          analysisData={noFeedback ? undefined : analysicData}
          isLoading={isAnalyzingFeedback || !!isModalLoading}
          noFeedback={noFeedback}
        />
      )}
    </>
  );
}