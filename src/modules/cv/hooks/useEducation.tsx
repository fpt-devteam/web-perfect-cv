import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listEducations,
  createEducation,
  updateEducation,
  deleteEducation,
} from '@/modules/cv/services/cv.services';
import type {
  CreateCVEducationRequest,
  UpdateCVEducationRequest,
  CVEducationResponse,
} from '@/modules/cv/types/cv.types';

const genEducationsKey = (cvId: string) => ['educations', cvId];

const genEducationKey = (cvId: string, educationId: string) => ['education', cvId, educationId];

export function useListEducations({ cvId }: { readonly cvId: string }) {
  return useQuery({
    queryKey: genEducationsKey(cvId),
    queryFn: () => listEducations({ cvId }),
    enabled: !!cvId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateEducation({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (educationData: CreateCVEducationRequest) =>
      createEducation({ cvId, educationData }),
    onMutate: async newEducation => {
      await queryClient.cancelQueries({ queryKey: genEducationsKey(cvId) });

      const previousEducations = queryClient.getQueryData<CVEducationResponse[]>(
        genEducationsKey(cvId)
      );

      if (previousEducations) {
        const optimisticEducation: CVEducationResponse = {
          id: `temp-${Date.now()}`,
          cvId: cvId,
          degree: newEducation.degree,
          organization: newEducation.organization,
          fieldOfStudy: newEducation.fieldOfStudy,
          startDate: newEducation.startDate,
          endDate: newEducation.endDate,
          description: newEducation.description,
          gpa: newEducation.gpa,
        };

        queryClient.setQueryData<CVEducationResponse[]>(genEducationsKey(cvId), [
          ...previousEducations,
          optimisticEducation,
        ]);
      }

      return { previousEducations };
    },
    onError: (_, __, context) => {
      if (context?.previousEducations) {
        queryClient.setQueryData(genEducationsKey(cvId), context.previousEducations);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: genEducationsKey(cvId) });
    },
  });
}

export function useUpdateEducation({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      educationId,
      educationData,
    }: {
      educationId: string;
      educationData: UpdateCVEducationRequest;
    }) => updateEducation({ cvId, educationId, educationData }),
    onMutate: async ({ educationId, educationData }) => {
      await queryClient.cancelQueries({ queryKey: genEducationsKey(cvId) });

      const previousEducations = queryClient.getQueryData<CVEducationResponse[]>(
        genEducationsKey(cvId)
      );

      if (previousEducations) {
        queryClient.setQueryData<CVEducationResponse[]>(
          genEducationsKey(cvId),
          previousEducations.map(education =>
            education.id === educationId
              ? {
                  ...education,
                  ...educationData,
                }
              : education
          )
        );
      }

      return { previousEducations };
    },
    onError: (_, __, context) => {
      if (context?.previousEducations) {
        queryClient.setQueryData(genEducationsKey(cvId), context.previousEducations);
      }
    },
    onSuccess: (_, { educationId }) => {
      queryClient.invalidateQueries({ queryKey: genEducationsKey(cvId) });
      queryClient.invalidateQueries({ queryKey: genEducationKey(cvId, educationId) });
    },
  });
}

export function useDeleteEducation({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (educationId: string) => deleteEducation({ cvId, educationId }),
    onMutate: async educationId => {
      await queryClient.cancelQueries({ queryKey: genEducationsKey(cvId) });

      const previousEducations = queryClient.getQueryData<CVEducationResponse[]>(
        genEducationsKey(cvId)
      );

      if (previousEducations) {
        queryClient.setQueryData<CVEducationResponse[]>(
          genEducationsKey(cvId),
          previousEducations.filter(education => education.id !== educationId)
        );
      }

      return { previousEducations };
    },
    onError: (_, __, context) => {
      if (context?.previousEducations) {
        queryClient.setQueryData(genEducationsKey(cvId), context.previousEducations);
      }
    },
    onSuccess: (_, educationId) => {
      queryClient.invalidateQueries({ queryKey: genEducationsKey(cvId) });
      queryClient.invalidateQueries({ queryKey: genEducationKey(cvId, educationId) });
    },
  });
}
