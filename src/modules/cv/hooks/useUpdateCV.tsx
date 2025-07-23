import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCV } from '@/modules/cv/services/cv.services';
import { UPDATE_CV_ENDPOINT } from '@/modules/cv/constants/cv-endpoint.constant';
import type { UpdateCVRequest } from '@/modules/cv/types/cv.types';

export const genUpdateCVKey = (cvId: string) => ['update', UPDATE_CV_ENDPOINT(cvId)];

export function useUpdateCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cvId, request }: { cvId: string; request: UpdateCVRequest }) =>
      updateCV({ cvId, request }),
    onSuccess: () => {
      // Invalidate and refetch CV list
      queryClient.invalidateQueries({ queryKey: ['get', 'api/cvs'] });
    },
  });
}
