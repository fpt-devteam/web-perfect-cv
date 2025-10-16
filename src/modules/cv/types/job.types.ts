export enum JobStatus {
    Queued = 'Queued',
    Running = 'Running',
    Succeeded = 'Succeeded',
    Failed = 'Failed',
    Canceled = 'Canceled'
}

export enum JobType {
    ScoreCV = 'ScoreCV'
}

export interface JobResponse {
    id: string;
    type: string;
    status: JobStatus;
    createdAt: string;
    startedAt: string | null;
    completedAt: string | null;
    inputJson: {
        CvId: string;
        UserId: string;
    };
    outputJson: any | null;
    errorCode: string | null;
    errorMessage: string | null;
}

export interface ScoreCVRequest {
    cvId: string;
}

export interface ScoreCVJobOutput {
    cvId: string;
    totalScore: number;
    maxPossibleScore: number;
    scorePercentage: number;
    sectionScores: Array<{
        sectionType: string;
        score: number;
        maxScore: number;
        percentage: number;
    }>;
    completedAt: string;
}

export interface CVScoringState {
    isLoading: boolean;
    isScoring: boolean;
    jobId: string | null;
    job: JobResponse | null;
    error: string | null;
}
