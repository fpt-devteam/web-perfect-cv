import { useGetSummary, useUpsertSummary } from '@/modules/summary/hooks/useSummary';
import { useNotification } from '@/shared/hooks/useNotification';
import { useState } from 'react';
import { SummaryForm } from './SummaryForm';
import { AIEvaluationCard } from '@/modules/cv/components/ai-evaluation';
import { useSectionScore } from '@/modules/cv/hooks/useCVSectionScores';
import { SectionType } from '@/modules/cv/types/ai-evaluation.types';
import type { UpSertSummaryRequest } from '@/modules/summary/types/summary.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';
import { Card, CardContent, CardTitle, CardHeader } from '@/shared/components/ui/card';
import { Pencil } from 'lucide-react';

interface CVSummaryProps {
  cvId: string;
  onSuccess?: () => void;
}

export function CVSummarySection({ cvId, onSuccess }: CVSummaryProps) {
  const { showError, showSuccess } = useNotification();
  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    error: summaryError,
  } = useGetSummary({ cvId });
  const { data: sectionScore, isLoading: isLoadingScore } = useSectionScore(cvId, SectionType.Summary);
  const [isLoading, setIsLoading] = useState(false);
  const upsertSummary = useUpsertSummary({ cvId });

  const handleSubmit = async (data: UpSertSummaryRequest) => {
    setIsLoading(true);

    try {
      await upsertSummary.mutateAsync(data, {
        onSuccess: () => {
          showSuccess('Summary updated successfully!');
          onSuccess?.();
        },
        onError: error => {
          showError(error as AxiosError<BaseError>);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      setIsLoading(false);
      showError(error as AxiosError<BaseError>);
    }
  };

  // Check if error is 404 (no summary exists yet) - treat as normal state
  const is404Error =
    summaryError && (summaryError as AxiosError<BaseError>)?.response?.status === 404;

  // Show error state only for non-404 errors
  if (summaryError && !is404Error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading summary</h3>
            <p className="text-gray-500">Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingSummary) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse text-sm text-muted-foreground">Loading summary...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Evaluation Card */}
      <AIEvaluationCard
        sectionScore={sectionScore}
        sectionType={SectionType.Summary}
        isLoading={isLoadingScore}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Write a professional summary <span className="text-red-500">*</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <SummaryForm
            initialData={summaryData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            cvId={cvId}
          />
        </CardContent>
      </Card>
    </div>
  );
}