import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listExperiences, createExperience, updateExperience, deleteExperience } from '@/modules/cv/services/cv.services';
import type { CreateExperienceRequest, UpdateExperienceRequest } from '@/modules/cv/types/cv.types';

const genExperiencesKey = (cvId: string) => ['experiences', cvId];

const genExperienceKey = (cvId: string, experienceId: string) => ['experience', cvId, experienceId];

export function useListExperiences({ cvId }: { readonly cvId: string }) {
  return useQuery({
    queryKey: genExperiencesKey(cvId),
    queryFn: () => listExperiences({ cvId }),
    enabled: !!cvId,
  });
}

export function useCreateExperience({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (experienceData: CreateExperienceRequest) =>
      createExperience({ cvId, experienceData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: genExperiencesKey(cvId) });
    },
  });
}

export function useUpdateExperience({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      experienceId,
      experienceData,
    }: {
      experienceId: string;
      experienceData: UpdateExperienceRequest;
    }) => updateExperience({ cvId, experienceId, experienceData }),
    onSuccess: (_, { experienceId }) => {
      queryClient.invalidateQueries({ queryKey: genExperiencesKey(cvId) });
      queryClient.invalidateQueries({ queryKey: genExperienceKey(cvId, experienceId) });
    },
  });
}

export function useDeleteExperience({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (experienceId: string) => deleteExperience({ cvId, experienceId }),
    onSuccess: (_, experienceId) => {
      queryClient.invalidateQueries({ queryKey: genExperiencesKey(cvId) });
      queryClient.invalidateQueries({ queryKey: genExperienceKey(cvId, experienceId) });
    },
  });
}
