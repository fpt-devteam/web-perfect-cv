import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/modules/auth/services/client.service';
import type { CVSectionScoresResponse, SectionType } from '@/modules/cv/types/ai-evaluation.types';

const CV_SECTION_SCORES_QUERY_KEY = 'cv-section-scores';

async function fetchCVSectionScores(cvId: string): Promise<CVSectionScoresResponse> {
    const response = await authClient.get(`/api/cvs/${cvId}/section-scores`);
    return response.data;
}

export function useCVSectionScores(cvId: string, options = {}) {
    return useQuery({
        queryKey: [CV_SECTION_SCORES_QUERY_KEY, cvId],
        queryFn: () => fetchCVSectionScores(cvId),
        enabled: !!cvId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        ...options,
    });
}

export function useSectionScore(cvId: string, sectionType: SectionType, options = {}) {
    const { data: allScores, ...queryResult } = useCVSectionScores(cvId, options);

    const sectionScore = allScores?.sectionScores.find(
        score => score.sectionType === sectionType
    )?.sectionScore;

    return {
        ...queryResult,
        data: sectionScore,
        sectionScore,
    };
}
