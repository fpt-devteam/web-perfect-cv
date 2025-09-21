import { authClient } from '@/modules/auth/services/client.service';
import {
  GET_EMPLOYMENT_TYPE_ENDPOINT,
  GET_JOB_TITLES_ENDPOINT,
  GET_ORGANIZATION_ENDPOINT,
} from '@/modules/cv/constants/cv-endpoint.constant';
import type {
  EmploymentTypeListResponse,
  JobTitleListResponse,
  OrganizationListResponse,
} from '@/modules/cv/types/cv.types';

export const searchCompanies = async (query: string) => {
  const { data } = await authClient<OrganizationListResponse>({
    method: 'GET',
    url: GET_ORGANIZATION_ENDPOINT(),
    params: {
      SearchTerm: query,
      OrganizationType: 'Company',
    },
  });

  return data;
};

export const searchJobTitles = async (query: string) => {
  const { data } = await authClient<JobTitleListResponse>({
    method: 'GET',
    url: GET_JOB_TITLES_ENDPOINT(),
    params: {
      SearchTerm: query,
    },
  });

  return data;
};

export const getEmploymentTypes = async () => {
  const { data } = await authClient<EmploymentTypeListResponse>({
    method: 'GET',
    url: GET_EMPLOYMENT_TYPE_ENDPOINT(),
  });

  return data;
};