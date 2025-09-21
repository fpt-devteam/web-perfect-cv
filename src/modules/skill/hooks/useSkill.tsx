import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '@/modules/skill/services/skill.services';
import type {
  CreateSkillRequest,
  UpdateSkillRequest,
  SkillResponse,
} from '@/modules/skill/types/skill.types';

const genSkillsKey = (cvId: string) => ['skills', cvId];

const genSkillKey = (cvId: string, skillId: string) => ['skill', cvId, skillId];

export function useListSkills({ cvId }: { readonly cvId: string }) {
  return useQuery({
    queryKey: genSkillsKey(cvId),
    queryFn: () => listSkills({ cvId }),
    enabled: !!cvId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateSkill({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skillData: CreateSkillRequest) => createSkill({ cvId, skillData }),
    onMutate: async newSkill => {
      await queryClient.cancelQueries({ queryKey: genSkillsKey(cvId) });

      const previousSkills = queryClient.getQueryData<SkillResponse[]>(genSkillsKey(cvId));

      if (previousSkills) {
        const optimisticSkill: SkillResponse = {
          id: `temp-${Date.now()}`,
          category: newSkill.category,
          content: newSkill.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData<SkillResponse[]>(genSkillsKey(cvId), [
          ...previousSkills,
          optimisticSkill,
        ]);
      }

      return { previousSkills };
    },
    onError: (_, __, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(genSkillsKey(cvId), context.previousSkills);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: genSkillsKey(cvId) });
    },
  });
}

export function useUpdateSkill({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ skillId, skillData }: { skillId: string; skillData: UpdateSkillRequest }) =>
      updateSkill({ cvId, skillId, skillData }),
    onMutate: async ({ skillId, skillData }) => {
      await queryClient.cancelQueries({ queryKey: genSkillsKey(cvId) });

      const previousSkills = queryClient.getQueryData<SkillResponse[]>(genSkillsKey(cvId));

      if (previousSkills) {
        queryClient.setQueryData<SkillResponse[]>(
          genSkillsKey(cvId),
          previousSkills.map(skill =>
            skill.id === skillId
              ? {
                ...skill,
                content: skillData.content,
                category: skillData.category,
                updatedAt: new Date().toISOString(),
              }
              : skill
          )
        );
      }

      return { previousSkills };
    },
    onError: (_, __, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(genSkillsKey(cvId), context.previousSkills);
      }
    },
    onSuccess: (_, { skillId }) => {
      queryClient.invalidateQueries({ queryKey: genSkillsKey(cvId) });
      queryClient.invalidateQueries({ queryKey: genSkillKey(cvId, skillId) });
    },
  });
}

export function useDeleteSkill({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skillId: string) => deleteSkill({ cvId, skillId }),
    onMutate: async skillId => {
      await queryClient.cancelQueries({ queryKey: genSkillsKey(cvId) });

      const previousSkills = queryClient.getQueryData<SkillResponse[]>(genSkillsKey(cvId));

      if (previousSkills) {
        queryClient.setQueryData<SkillResponse[]>(
          genSkillsKey(cvId),
          previousSkills.filter(skill => skill.id !== skillId)
        );
      }

      return { previousSkills };
    },
    onError: (_, __, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(genSkillsKey(cvId), context.previousSkills);
      }
    },
    onSuccess: (_, skillId) => {
      queryClient.invalidateQueries({ queryKey: genSkillsKey(cvId) });
      queryClient.invalidateQueries({ queryKey: genSkillKey(cvId, skillId) });
    },
  });
}