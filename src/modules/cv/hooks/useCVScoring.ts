import { useState, useCallback, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scoreCVJob, pollJobUntilComplete } from '@/modules/cv/services/scoring.service';
import { useCVSectionScores } from '@/modules/cv/hooks/useCVSectionScores';
import type { JobResponse, CVScoringState } from '@/modules/cv/types/job.types';

interface UseCVScoringOptions {
    onSuccess?: (job: JobResponse) => void;
    onError?: (error: Error) => void;
    onJobUpdate?: (job: JobResponse) => void;
}

export function useCVScoring(cvId: string, options: UseCVScoringOptions = {}) {
    const queryClient = useQueryClient();
    const [scoringState, setScoringState] = useState<CVScoringState>({
        isScoring: false,
        jobId: null,
        job: null,
        error: null,
    });

    // Keep track of polling to prevent multiple polls
    const pollingRef = useRef<boolean>(false);

    // Refetch section scores after scoring completes
    const { refetch: refetchSectionScores } = useCVSectionScores(cvId, { enabled: false });

    const scoringMutation = useMutation({
        mutationFn: async () => {
            const job = await scoreCVJob({ cvId });
            return job;
        },
        onSuccess: async (job) => {
            setScoringState(prev => ({
                ...prev,
                jobId: job.id,
                job,
                error: null,
            }));

            // Start polling if not already polling
            if (!pollingRef.current) {
                pollingRef.current = true;

                try {
                    const completedJob = await pollJobUntilComplete(
                        job.id,
                        (updatedJob) => {
                            setScoringState(prev => ({
                                ...prev,
                                job: updatedJob,
                            }));
                            options.onJobUpdate?.(updatedJob);
                        }
                    );

                    // Job completed - update state and refetch scores
                    setScoringState(prev => ({
                        ...prev,
                        isScoring: false,
                        job: completedJob,
                    }));

                    // Refetch section scores to get the latest data
                    await refetchSectionScores();

                    // Invalidate related queries
                    queryClient.invalidateQueries({ queryKey: ['cv-section-scores', cvId] });

                    options.onSuccess?.(completedJob);

                } catch (error) {
                    setScoringState(prev => ({
                        ...prev,
                        isScoring: false,
                        error: error instanceof Error ? error.message : 'Scoring failed',
                    }));
                    options.onError?.(error instanceof Error ? error : new Error('Scoring failed'));
                } finally {
                    pollingRef.current = false;
                }
            }
        },
        onError: (error) => {
            setScoringState(prev => ({
                ...prev,
                isScoring: false,
                error: error instanceof Error ? error.message : 'Failed to start scoring',
            }));
            options.onError?.(error instanceof Error ? error : new Error('Failed to start scoring'));
        },
    });

    const startScoring = useCallback(() => {
        setScoringState(prev => ({
            ...prev,
            isScoring: true,
            error: null,
        }));
        scoringMutation.mutate();
    }, [scoringMutation]);

    const resetScoring = useCallback(() => {
        setScoringState({
            isScoring: false,
            jobId: null,
            job: null,
            error: null,
        });
        pollingRef.current = false;
    }, []);

    return {
        ...scoringState,
        startScoring,
        resetScoring,
        isLoading: scoringMutation.isPending || scoringState.isScoring,
    };
}
