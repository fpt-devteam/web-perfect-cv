import type {
  CreateCVRequest,
  CVListQuery,
  CVListResponse,
  CVResponse,
  CVContact,
  UpSertContactRequest,
  CVExperience,
  CreateExperienceRequest,
  UpdateExperienceRequest,
} from '@/modules/cv/types/cv.types';
import {
  GET_CVS_ENDPOINT,
  CREATE_CV_ENDPOINT,
  UPSERT_CONTACT_ENDPOINT,
  LIST_CONTACTS_ENDPOINT,
  LIST_EXPERIENCES_ENDPOINT,
  CREATE_EXPERIENCE_ENDPOINT,
  UPDATE_EXPERIENCE_ENDPOINT,
  DELETE_EXPERIENCE_ENDPOINT,
} from '@/modules/cv/constants/cv-endpoint.constant';
import { authClient } from '@/modules/auth/services/client.service';

export const listCVs = async (query: CVListQuery) => {
  const { data } = await authClient<CVListResponse>({
    method: 'GET',
    url: GET_CVS_ENDPOINT,
    params: query,
  });
  return data;
};

export const createCV = async (request: CreateCVRequest) => {
  const { data } = await authClient<CVResponse>({
    method: 'POST',
    url: CREATE_CV_ENDPOINT,
    data: request,
  });
  return data;
};

export const listContacts = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CVContact>({
    method: 'GET',
    url: LIST_CONTACTS_ENDPOINT(cvId),
  });
  return data;
};

export const upsertContact = async ({
  cvId,
  contactData,
}: {
  readonly cvId: string;
  readonly contactData: UpSertContactRequest;
}) => {
  const { data } = await authClient<CVContact>({
    method: 'POST',
    url: UPSERT_CONTACT_ENDPOINT(cvId),
    data: contactData,
  });
  return data;
};

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
