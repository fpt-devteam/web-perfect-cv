import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCV } from '@/modules/cv/services/cv.services';
import { DELETE_CV_ENDPOINT } from '@/modules/cv/constants/cv-endpoint.constant';

export const genDeleteCVKey = (cvId: string) => ['delete', DELETE_CV_ENDPOINT(cvId)];

export function useDeleteCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cvId }: { cvId: string }) => deleteCV({ cvId }),
    onSuccess: () => {
      // Invalidate and refetch CV list
      queryClient.invalidateQueries({ queryKey: ['get', 'api/cvs'] });
    },
  });
}
