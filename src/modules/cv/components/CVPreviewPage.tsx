import { useState, useEffect, useRef } from 'react';
import { Eye, BarChart3, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/utils/cn.util';
import { AnalyticsModal } from './AnalyticsModal';
import { CVPDFViewer } from './CVPDFViewer';
import type { AnalysisData } from '../types/analysis.types';
import type { CVData, CVFullContentResponse } from '../types/cv.types';
import { useAnalysisFeedback, useAnalyzeCV } from '../hooks/useAnalysis';
import { transformCVFullContentToCVData } from '../utils/cv-data-transformer';

import type { AnalyzeRequest } from '../types/analysic.cv.type';
import { useAnalyzeIdForCv, getAnalyzeIdForCv, setAnalyzeIdForCv } from '../stores/analyze.store';

interface CVPreviewPageProps {
  data: CVFullContentResponse;
}

export function CVPreviewPage({ data }: CVPreviewPageProps) {
  // Show modal
  const [showAnalytics, setShowAnalytics] = useState(false);

  //Save analysicData for show modal
  const [analysicData, setAnalysicData] = useState<AnalysisData>();

  //Call api analyze
  const analyzeMutation = useAnalyzeCV();
  const analysisFeedback = useAnalysisFeedback();

  //Call api get feedback

  const transformedCVData: CVData | null = data ? transformCVFullContentToCVData(data) : null;
  const currentCVData = transformedCVData;

  const workerRef = useRef<Worker | null>(null);

  const cvId = data ? data.versionId : '';
  const [analyzeIdAtom, setAnalyzeIdAtom] = useAnalyzeIdForCv(cvId);

  // Add a state to indicate no feedback is available
  const [noFeedback, setNoFeedback] = useState(false);
  const [isAnalyzingFeedback, setIsAnalyzingFeedback] = useState(false);

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

  // Determine if we should poll for feedback (worker)
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
  }, [cvId, startWorker, shouldPollFeedback, analysicData]);

  const handleAnalyze = () => {
    // Do not remove previous analyzeId immediately
    const newCvId = cvId;
    const analyzeCVRequest: AnalyzeRequest = {
      cvId: newCvId,
      userId: data.userId,
      reason: 'User requested analysis from preview page',
      cvData: {
        title: data.title,
        contact: {
          email: data.contact.email,
          phoneNumber: data.contact.phoneNumber,
          city: data.contact.city,
          country: data.contact.country,
          linkedInUrl: data.contact.linkedInUrl || 'https://www.linkedin.com/in/your-profile',
          gitHubUrl: data.contact.gitHubUrl || 'https://github.com/your-profile',
        },
        summary: {
          context: data.summary.context || '',
        },
        experience: data.experiences.map(experience => ({
          jobTitle: experience.jobTitle,
          company: experience.organization,
          location: experience.location,
          startDate: experience.startDate,
          endDate: experience.endDate,
          description: experience.description,
        })),
        skills: data.skills.map(skill => ({
          category: skill.category,
          items: [skill.description],
        })),
        education: data.educations.map(education => ({
          degree: education.degree,
          organization: education.organization,
          fieldOfStudy: education.fieldOfStudy,
          startDate: education.startDate || '2024-01-01',
          endDate: education.endDate || '2024-01-01',
          gpa: education.gpa || 0,
        })),
        projects: data.projects.map(project => ({
          title: project.title,
          description: project.description,
          link: project.link || '',
          startDate: project.startDate || '2024-01-01',
          endDate: project.endDate || '2024-01-01',
        })),
      },
      userPreferences: {
        targetIndustry: data.jobDetail.companyName,
        targetRole: data.jobDetail.jobTitle,
        experienceLevel: 'senior' as const,
        focusAreas: ['technical-skills', 'leadership', 'achievements'],
        urgent: false,
      },
    };
    analyzeMutation.mutate(analyzeCVRequest, {
      onSuccess: response => {
        setAnalyzeIdAtom(undefined); // Remove old analyzeId only on success
        setAnalyzeIdForCv(cvId, response.data.analysisId);
        setAnalysicData(undefined);
        // Worker will auto-start via useEffect
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
    // Always open the modal, even if worker is polling
    setShowAnalytics(true);
    // If feedback is not available and not currently loading via mutation, optionally trigger a fetch
    if (!analysicData && !isAnalyzingFeedback && !analysisFeedback.isPending) {
      analysisFeedback.mutate(analyzeId);
    }
  };

  const isAnalyzing = analyzeMutation.isPending;
  const isLoadingFeedback = analysisFeedback.isPending;
  const hasFeedbackData = analysisFeedback.data?.data;

  // Cache feedback data when it arrives (no automatic modal opening)
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

  // Clean up worker on unmount or when analysisId changes
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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Main CV Content - Made much wider */}
        <div className="xl:col-span-4">
          <CVPDFViewer cvData={currentCVData} isLoading={false} error={null} />
        </div>

        {/* Sidebar - Made more compact */}
        <div className="xl:col-span-1 space-y-4">
          {/* AI Analyze Card */}
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

      {/* Analytics Modal - Only shows when user explicitly opens it */}
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
    </div>
  );
}
