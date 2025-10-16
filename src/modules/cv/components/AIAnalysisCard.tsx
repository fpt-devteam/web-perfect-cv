import { useState, useEffect, useRef } from 'react';
import { Eye, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/utils/cn.util';
import { AnalyticsModal } from './AnalyticsModal';
import type { AnalysisData } from '../types/analysis.types';
import type { CVResponse } from '../types/cv.types';
import { useAnalysisFeedback, useAnalyzeCV } from '../hooks/useAnalysis';
import type { AnalyzeRequest } from '../types/analysic.cv.type';
import { useAnalyzeIdForCv, getAnalyzeIdForCv, setAnalyzeIdForCv } from '../stores/analyze.store';

interface AIAnalysisCardProps {
  cvData: CVResponse;
}

export function AIAnalysisCard({ cvData }: AIAnalysisCardProps) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analysicData, setAnalysicData] = useState<AnalysisData>();
  const [noFeedback, setNoFeedback] = useState(false);
  const [isAnalyzingFeedback, setIsAnalyzingFeedback] = useState(false);

  const analyzeMutation = useAnalyzeCV();
  const analysisFeedback = useAnalysisFeedback();
  const workerRef = useRef<Worker | null>(null);

  const cvId = cvData?.cvId || '';
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
    const content = cvData.content;
    const jobDesc = cvData.jobDescription;

    const analyzeCVRequest: AnalyzeRequest = {
      cvId: newCvId,
      userId: '', // TODO: Get userId from auth context
      reason: 'User requested analysis from preview page',
      cvData: {
        title: cvData.title || 'Untitled CV',
        contact: {
          email: content?.contact?.email || 'example@example.com',
          phoneNumber: content?.contact?.phoneNumber || '0911290070',
          city: content?.contact?.city || 'Hanoi',
          country: content?.contact?.country || 'Vietnam',
          linkedInUrl: content?.contact?.linkedInUrl || 'https://www.linkedin.com/in/your-profile',
          gitHubUrl: content?.contact?.gitHubUrl || 'https://github.com/your-profile',
        },
        summary: {
          context: content?.summary?.content || 'No summary',
        },
        experience: content?.experiences?.map((experience: any) => ({
          jobTitle: experience.jobTitle || 'No job title',
          company: experience.organization || 'No company',
          location: experience.location || 'No location',
          startDate: experience.startDate || '',
          endDate: experience.endDate || '',
          description: experience.description || 'No description',
        })) || [],
        skills: content?.skills?.map((skill: any) => ({
          category: skill.category || 'No category',
          items: [skill.content || 'No description'],
        })) || [],
        education: content?.educations?.map((education: any) => ({
          degree: education.degree || '',
          organization: education.organization || 'No organization',
          fieldOfStudy: education.fieldOfStudy || 'No field of study',
          startDate: education.startDate || '2024-01-01',
          endDate: education.endDate || '2024-01-01',
          gpa: education.gpa || 0,
        })) || [],
        projects: content?.projects?.map((project: any) => ({
          title: project.title || 'No title',
          description: project.description || 'No description',
          link: project.link || 'https://link-to-your-project',
          startDate: project.startDate || '2024-01-01',
          endDate: project.endDate || '2024-01-01',
        })) || [],
      },
      userPreferences: {
        targetIndustry: jobDesc?.companyName || 'No company name',
        targetRole: jobDesc?.title || 'No job title',
        experienceLevel: 'senior' as const,
        focusAreas: ['technical-skills', 'leadership', 'achievements'],
        urgent: false,
      },
    };
    analyzeMutation.mutate(analyzeCVRequest, {
      onSuccess: response => {
        setAnalyzeIdAtom(undefined);
        // The job ID is stored as the analysis ID for polling
        setAnalyzeIdForCv(cvId, response.id);
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