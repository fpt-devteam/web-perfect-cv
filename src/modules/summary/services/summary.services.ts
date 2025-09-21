import type { CVSummary, UpSertSummaryRequest } from '@/modules/summary/types/summary.types';
import { GET_SUMMARY_ENDPOINT, UPSERT_SUMMARY_ENDPOINT } from '@/modules/cv/constants/cv-endpoint.constant';
import { authClient } from '@/modules/auth/services/client.service';

export const getSummary = async ({ cvId }: { readonly cvId: string }) => {
  try {
    const { data } = await authClient<CVSummary>({
      method: 'GET',
      url: GET_SUMMARY_ENDPOINT(cvId),
    });

    // Handle case where API returns null or empty data
    if (!data) {
      return {
        id: '',
        cvId,
        context: null,
      };
    }

    return data;
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
};

export const upsertSummary = async ({
  cvId,
  summaryData,
}: {
  readonly cvId: string;
  readonly summaryData: UpSertSummaryRequest;
}) => {
  const { data } = await authClient<CVSummary>({
    method: 'POST',
    url: UPSERT_SUMMARY_ENDPOINT(cvId),
    data: summaryData,
  });
  return data;
};