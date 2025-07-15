import { authClient } from '@/modules/auth/services/client.service';
import {
  GET_DEGREE_ENDPOINT,
  GET_EMPLOYMENT_TYPE_ENDPOINT,
  GET_JOB_TITLES_ENDPOINT,
  GET_ORGANIZATION_ENDPOINT,
  LIST_CATEGORIES_ENDPOINT,
} from '../constants/cv-endpoint.constant';
import type {
  DegreeListResponse,
  EmploymentTypeListResponse,
  JobTitleListResponse,
  OrganizationListResponse,
  SkillCategoryListResponse,
} from '../types/cv.types';

export const searchSkillCategories = async (query: string) => {
  const { data } = await authClient<SkillCategoryListResponse>({
    method: 'GET',
    url: LIST_CATEGORIES_ENDPOINT(),
    params: {
      SearchTerm: query,
    },
  });

  return data;
};

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

export const searchSchools = async (searchTerm: string) => {
  const { data } = await authClient<OrganizationListResponse>({
    method: 'GET',
    url: GET_ORGANIZATION_ENDPOINT(),
    params: {
      SearchTerm: searchTerm,
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

export const getDegrees = async () => {
  const { data } = await authClient<DegreeListResponse>({
    method: 'GET',
    url: GET_DEGREE_ENDPOINT(),
  });

  return data;
};
