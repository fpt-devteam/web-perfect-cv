import { useMutation } from '@tanstack/react-query';
import { createCV } from '@/modules/cv/services/cv.services';
import { useQueryClient } from '@tanstack/react-query';
import { CREATE_CV_ENDPOINT } from '../constants/cv-endpoint.constant';
import { GET_CVS_ENDPOINT } from '../constants/cv-endpoint.constant';

const genCreateCVKey = () => ['post', CREATE_CV_ENDPOINT];

export const useCreateCV = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: genCreateCVKey(),
    mutationFn: createCV,
    onSuccess: () => {
      // Invalidate all CV list queries by using partial query key
      queryClient.invalidateQueries({
        queryKey: ['get', GET_CVS_ENDPOINT],
      });
    },
  });
};
