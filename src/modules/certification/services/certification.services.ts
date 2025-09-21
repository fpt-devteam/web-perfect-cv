import { authClient } from '@/modules/auth/services/client.service';
import type {
  CertificationResponse,
  CreateCertificationRequest,
  UpdateCertificationRequest,
} from '@/modules/certification/types/certification.types';
import {
  LIST_CERTIFICATIONS_ENDPOINT,
  CREATE_CERTIFICATION_ENDPOINT,
  UPDATE_CERTIFICATION_ENDPOINT,
  DELETE_CERTIFICATION_ENDPOINT,
} from '@/modules/certification/constants/certification-endpoint.constant';

export const listCertifications = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CertificationResponse[]>({
    method: 'GET',
    url: LIST_CERTIFICATIONS_ENDPOINT(cvId),
  });
  return data;
};

export const createCertification = async ({
  cvId,
  certificationData,
}: {
  readonly cvId: string;
  readonly certificationData: CreateCertificationRequest;
}) => {
  const { data } = await authClient<CertificationResponse>({
    method: 'POST',
    url: CREATE_CERTIFICATION_ENDPOINT(cvId),
    data: certificationData,
  });
  return data;
};

export const updateCertification = async ({
  cvId,
  certificationId,
  certificationData,
}: {
  readonly cvId: string;
  readonly certificationId: string;
  readonly certificationData: UpdateCertificationRequest;
}) => {
  const { data } = await authClient<CertificationResponse>({
    method: 'PUT',
    url: UPDATE_CERTIFICATION_ENDPOINT(cvId, certificationId),
    data: certificationData,
  });
  return data;
};

export const deleteCertification = async ({
  cvId,
  certificationId,
}: {
  readonly cvId: string;
  readonly certificationId: string;
}) => {
  const { data } = await authClient<void>({
    method: 'DELETE',
    url: DELETE_CERTIFICATION_ENDPOINT(cvId, certificationId),
  });
  return data;
};