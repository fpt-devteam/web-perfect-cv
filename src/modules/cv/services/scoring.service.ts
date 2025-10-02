import { authClient } from '@/modules/auth/services/client.service';
import type { JobResponse, ScoreCVRequest } from '@/modules/cv/types/job.types';

/**
 * Initiate CV scoring job
 */
export async function scoreCVJob(request: ScoreCVRequest): Promise<JobResponse> {
    const response = await authClient.post('/api/jobs/score-cv', request);
    return response.data;
}

/**
 * Get job status and result by job ID
 */
export async function getJobResult(jobId: string): Promise<JobResponse> {
    const response = await authClient.get(`/api/jobs/${jobId}/result`);
    return response.data;
}

/**
 * Poll job status until completion (success, failed, or canceled)
 */
export async function pollJobUntilComplete(
    jobId: string,
    onUpdate?: (job: JobResponse) => void,
    pollInterval = 2000,
    maxAttempts = 150 // 5 minutes with 2s intervals
): Promise<JobResponse> {
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const job = await getJobResult(jobId);

            // Notify caller of status update
            onUpdate?.(job);

            // Check if job is in terminal state
            if (['Succeeded', 'Failed', 'Canceled'].includes(job.status)) {
                return job;
            }

            // Wait before next poll
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            attempts++;

        } catch (error) {
            console.error('Error polling job status:', error);
            attempts++;

            // If we've tried many times, throw the error
            if (attempts >= 5) {
                throw error;
            }

            // Wait a bit longer on error
            await new Promise(resolve => setTimeout(resolve, pollInterval * 2));
        }
    }

    throw new Error('Job polling timeout - maximum attempts reached');
}
