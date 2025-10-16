import { Brain, Loader2, CheckCircle, XCircle, Clock, Play } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { JobStatus } from '@/modules/cv/types/job.types';
import type { CVScoringState } from '@/modules/cv/types/job.types';

interface ScoreCVButtonProps {
    onScore: () => void;
    scoringState: CVScoringState;
    disabled?: boolean;
}

function getJobStatusIcon(status: JobStatus) {
    switch (status) {
        case JobStatus.Queued:
            return <Clock className="h-4 w-4" />;
        case JobStatus.Running:
            return <Loader2 className="h-4 w-4 animate-spin" />;
        case JobStatus.Succeeded:
            return <CheckCircle className="h-4 w-4" />;
        case JobStatus.Failed:
        case JobStatus.Canceled:
            return <XCircle className="h-4 w-4" />;
        default:
            return <Brain className="h-4 w-4" />;
    }
}

function getJobStatusText(status: JobStatus) {
    switch (status) {
        case JobStatus.Queued:
            return 'Queued for Analysis';
        case JobStatus.Running:
            return 'Analyzing CV...';
        case JobStatus.Succeeded:
            return 'Analysis Complete';
        case JobStatus.Failed:
            return 'Analysis Failed';
        case JobStatus.Canceled:
            return 'Analysis Canceled';
        default:
            return 'Score My CV';
    }
}

function getJobStatusVariant(status: JobStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case JobStatus.Succeeded:
            return 'default';
        case JobStatus.Failed:
        case JobStatus.Canceled:
            return 'destructive';
        case JobStatus.Queued:
        case JobStatus.Running:
            return 'secondary';
        default:
            return 'outline';
    }
}

export function ScoreCVButton({ onScore, scoringState, disabled }: ScoreCVButtonProps) {
    const { isLoading, job, error } = scoringState;
    const isScoring = isLoading || (job && ['Queued', 'Running'].includes(job.status as JobStatus));

    return (
        <div className="flex flex-col items-center gap-3">
            <Button
                onClick={onScore}
                disabled={disabled || !!isScoring}
                size="lg"
                className="relative overflow-hidden group transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
                <div className="flex items-center gap-3">
                    {isScoring ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : job?.status === JobStatus.Succeeded ? (
                        <CheckCircle className="h-5 w-5" />
                    ) : (
                        <Brain className="h-5 w-5" />
                    )}
                    <span className="font-semibold">
                        {isScoring
                            ? 'Analyzing CV...'
                            : job?.status === JobStatus.Succeeded
                                ? 'Re-analyze CV'
                                : 'Score My CV'
                        }
                    </span>
                </div>

                {/* Animated background for loading state */}
                {isScoring && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
                )}
            </Button>

            {/* Status Badge */}
            {job && (
                <div className="flex items-center gap-2">
                    <Badge
                        variant={getJobStatusVariant(job.status as JobStatus)}
                        className="flex items-center gap-1.5 px-3 py-1"
                    >
                        {getJobStatusIcon(job.status as JobStatus)}
                        <span className="text-xs font-medium">
                            {getJobStatusText(job.status as JobStatus)}
                        </span>
                    </Badge>

                    {job.status === JobStatus.Running && (
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        </div>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* Progress Description */}
            {isScoring && (
                <div className="text-center max-w-md">
                    <p className="text-sm text-gray-600 mb-2">
                        Our AI is analyzing your CV across all sections...
                    </p>
                    <div className="flex justify-center items-center gap-2 text-xs text-gray-500">
                        <Play className="h-3 w-3" />
                        <span>This usually takes 30-60 seconds</span>
                    </div>
                </div>
            )}
        </div>
    );
}
