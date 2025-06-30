import { useMutation } from '@tanstack/react-query';
import { createCV } from '@/modules/cv/services/cv.services';
import { useQueryClient } from '@tanstack/react-query';
import { CREATE_CV_ENDPOINT } from '../constants/cv-endpoint.constant';
import { genListCVsKey } from '@/modules/cv/hooks/useListCV';

const genCreateCVKey = () => ['post', CREATE_CV_ENDPOINT];
export const useCreateCV = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: genCreateCVKey(),
    mutationFn: createCV,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: genListCVsKey(),
      });
    },
  });
};
