import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectResponse,
} from '@/modules/project/types/project.types';
import {
  LIST_PROJECTS_ENDPOINT,
  CREATE_PROJECT_ENDPOINT,
  UPDATE_PROJECT_ENDPOINT,
  DELETE_PROJECT_ENDPOINT,
} from '@/modules/project/constants/project-endpoint.constant';
import { authClient } from '@/modules/auth/services/client.service';

export const listProjects = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<ProjectResponse[]>({
    method: 'GET',
    url: LIST_PROJECTS_ENDPOINT(cvId),
  });
  return data;
};

export const createProject = async ({
  cvId,
  projectData,
}: {
  readonly cvId: string;
  readonly projectData: CreateProjectRequest;
}) => {
  const { data } = await authClient<ProjectResponse>({
    method: 'POST',
    url: CREATE_PROJECT_ENDPOINT(cvId),
    data: projectData,
  });
  return data;
};

export const updateProject = async ({
  cvId,
  projectId,
  projectData,
}: {
  readonly cvId: string;
  readonly projectId: string;
  readonly projectData: UpdateProjectRequest;
}) => {
  const { data } = await authClient<ProjectResponse>({
    method: 'PUT',
    url: UPDATE_PROJECT_ENDPOINT(cvId, projectId),
    data: projectData,
  });
  return data;
};

export const deleteProject = async ({
  cvId,
  projectId,
}: {
  readonly cvId: string;
  readonly projectId: string;
}) => {
  const { data } = await authClient<void>({
    method: 'DELETE',
    url: DELETE_PROJECT_ENDPOINT(cvId, projectId),
  });
  return data;
};