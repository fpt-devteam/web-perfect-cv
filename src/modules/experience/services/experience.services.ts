import type { CVExperience, CreateExperienceRequest, UpdateExperienceRequest } from '@/modules/experience/types/experience.types';
import {
  LIST_EXPERIENCES_ENDPOINT,
  CREATE_EXPERIENCE_ENDPOINT,
  UPDATE_EXPERIENCE_ENDPOINT,
  DELETE_EXPERIENCE_ENDPOINT,
} from '@/modules/cv/constants/cv-endpoint.constant';
import { authClient } from '@/modules/auth/services/client.service';

export const listExperiences = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CVExperience[]>({
    method: 'GET',
    url: LIST_EXPERIENCES_ENDPOINT(cvId),
  });
  return data;
};

export const createExperience = async ({
  cvId,
  experienceData,
}: {
  readonly cvId: string;
  readonly experienceData: CreateExperienceRequest;
}) => {
  const { data } = await authClient<CVExperience>({
    method: 'POST',
    url: CREATE_EXPERIENCE_ENDPOINT(cvId),
    data: experienceData,
  });
  return data;
};

export const updateExperience = async ({
  cvId,
  experienceId,
  experienceData,
}: {
  readonly cvId: string;
  readonly experienceId: string;
  readonly experienceData: UpdateExperienceRequest;
}) => {
  const { data } = await authClient<CVExperience>({
    method: 'PUT',
    url: UPDATE_EXPERIENCE_ENDPOINT(cvId, experienceId),
    data: experienceData,
  });
  return data;
};

export const deleteExperience = async ({
  cvId,
  experienceId,
}: {
  readonly cvId: string;
  readonly experienceId: string;
}) => {
  const { data } = await authClient<void>({
    method: 'DELETE',
    url: DELETE_EXPERIENCE_ENDPOINT(cvId, experienceId),
  });
  return data;
};