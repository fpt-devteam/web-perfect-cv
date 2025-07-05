import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/modules/cv/services/cv.services';
import type {
  CreateCVProjectRequest,
  UpdateCVProjectRequest,
  CVProjectResponse,
} from '@/modules/cv/types/cv.types';

const genProjectsKey = (cvId: string) => ['projects', cvId];

const genProjectKey = (cvId: string, projectId: string) => ['project', cvId, projectId];

export function useListProjects({ cvId }: { readonly cvId: string }) {
  return useQuery({
    queryKey: genProjectsKey(cvId),
    queryFn: () => listProjects({ cvId }),
    enabled: !!cvId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateProject({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectData: CreateCVProjectRequest) => createProject({ cvId, projectData }),
    onMutate: async newProject => {
      await queryClient.cancelQueries({ queryKey: genProjectsKey(cvId) });

      const previousProjects = queryClient.getQueryData<CVProjectResponse[]>(genProjectsKey(cvId));

      if (previousProjects) {
        const optimisticProject: CVProjectResponse = {
          id: `temp-${Date.now()}`,
          cvId: cvId,
          title: newProject.title,
          description: newProject.description,
          link: newProject.link,
          startDate: newProject.startDate,
          endDate: newProject.endDate,
          createdAt: new Date().toISOString(),
          updatedAt: null,
        };

        queryClient.setQueryData<CVProjectResponse[]>(genProjectsKey(cvId), [
          ...previousProjects,
          optimisticProject,
        ]);
      }

      return { previousProjects };
    },
    onError: (_, __, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(genProjectsKey(cvId), context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: genProjectsKey(cvId) });
    },
  });
}

export function useUpdateProject({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      projectData,
    }: {
      projectId: string;
      projectData: UpdateCVProjectRequest;
    }) => updateProject({ cvId, projectId, projectData }),
    onMutate: async ({ projectId, projectData }) => {
      await queryClient.cancelQueries({ queryKey: genProjectsKey(cvId) });

      const previousProjects = queryClient.getQueryData<CVProjectResponse[]>(genProjectsKey(cvId));

      if (previousProjects) {
        queryClient.setQueryData<CVProjectResponse[]>(
          genProjectsKey(cvId),
          previousProjects.map(project =>
            project.id === projectId
              ? {
                  ...project,
                  ...projectData,
                }
              : project
          )
        );
      }

      return { previousProjects };
    },
    onError: (_, __, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(genProjectsKey(cvId), context.previousProjects);
      }
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: genProjectsKey(cvId) });
      queryClient.invalidateQueries({ queryKey: genProjectKey(cvId, projectId) });
    },
  });
}

export function useDeleteProject({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject({ cvId, projectId }),
    onMutate: async projectId => {
      await queryClient.cancelQueries({ queryKey: genProjectsKey(cvId) });

      const previousProjects = queryClient.getQueryData<CVProjectResponse[]>(genProjectsKey(cvId));

      if (previousProjects) {
        queryClient.setQueryData<CVProjectResponse[]>(
          genProjectsKey(cvId),
          previousProjects.filter(project => project.id !== projectId)
        );
      }

      return { previousProjects };
    },
    onError: (_, __, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(genProjectsKey(cvId), context.previousProjects);
      }
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: genProjectsKey(cvId) });
      queryClient.invalidateQueries({ queryKey: genProjectKey(cvId, projectId) });
    },
  });
}
