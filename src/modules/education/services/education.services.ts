import { authClient } from '@/modules/auth/services/client.service';
import {
  LIST_EDUCATIONS_ENDPOINT,
  CREATE_EDUCATION_ENDPOINT,
  UPDATE_EDUCATION_ENDPOINT,
  DELETE_EDUCATION_ENDPOINT,
  GET_DEGREE_ENDPOINT,
  GET_ORGANIZATION_ENDPOINT,
} from '../constants/education-endpoint.constant';
import type {
  EducationResponse,
  CreateEducationRequest,
  UpdateEducationRequest,
  DegreeListResponse,
  SearchableItemResponse,
} from '../types/education.types';

export const listEducations = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<EducationResponse[]>({
    method: 'GET',
    url: LIST_EDUCATIONS_ENDPOINT(cvId),
  });
  return data;
};

export const createEducation = async ({
  cvId,
  educationData,
}: {
  readonly cvId: string;
  readonly educationData: CreateEducationRequest;
}) => {
  const { data } = await authClient<EducationResponse>({
    method: 'POST',
    url: CREATE_EDUCATION_ENDPOINT(cvId),
    data: educationData,
  });
  return data;
};

export const updateEducation = async ({
  cvId,
  educationId,
  educationData,
}: {
  readonly cvId: string;
  readonly educationId: string;
  readonly educationData: UpdateEducationRequest;
}) => {
  const { data } = await authClient<EducationResponse>({
    method: 'PUT',
    url: UPDATE_EDUCATION_ENDPOINT(cvId, educationId),
    data: educationData,
  });
  return data;
};

export const deleteEducation = async ({
  cvId,
  educationId,
}: {
  readonly cvId: string;
  readonly educationId: string;
}) => {
  const { data } = await authClient<void>({
    method: 'DELETE',
    url: DELETE_EDUCATION_ENDPOINT(cvId, educationId),
  });
  return data;
};

export const getDegrees = async () => {
  const { data } = await authClient<DegreeListResponse>({
    method: 'GET',
    url: GET_DEGREE_ENDPOINT(),
  });
  return data;
};

export const searchSchools = async (searchTerm: string) => {
  const { data } = await authClient<SearchableItemResponse[]>({
    method: 'GET',
    url: GET_ORGANIZATION_ENDPOINT(),
    params: {
      SearchTerm: searchTerm,
    },
  });
  return data;
};