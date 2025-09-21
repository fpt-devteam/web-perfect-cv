import type {
  CreateCVRequest,
  UpdateCVRequest,
  CVListQuery,
  CVListResponse,
  CVResponse,
} from '@/modules/cv/types/cv.types';
import {
  GET_CVS_ENDPOINT,
  CREATE_CV_ENDPOINT,
  UPDATE_CV_ENDPOINT,
  DELETE_CV_ENDPOINT,
  GET_CV_ENDPOINT,
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

export const updateCV = async ({ cvId, request }: { cvId: string; request: UpdateCVRequest }) => {
  const { data } = await authClient<CVResponse>({
    method: 'PUT',
    url: UPDATE_CV_ENDPOINT(cvId),
    data: request,
  });
  return data;
};

export const deleteCV = async ({ cvId }: { cvId: string }) => {
  const { data } = await authClient<void>({
    method: 'DELETE',
    url: DELETE_CV_ENDPOINT(cvId),
  });
  return data;
};

export const getCV = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CVResponse>({
    method: 'GET',
    url: GET_CV_ENDPOINT(cvId),
  });
  return data;
};