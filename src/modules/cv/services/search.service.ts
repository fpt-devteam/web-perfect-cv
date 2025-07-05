import { authClient } from '@/modules/auth/services/client.service';
import { GET_JOB_TITLES_ENDPOINT, GET_ORGANIZATION_ENDPOINT, LIST_CATEGORIES_ENDPOINT } from '../constants/cv-endpoint.constant';
import type {
  DegreeListResponse,
  EmploymentTypeListResponse,
  JobTitleListResponse,
  OrganizationListResponse,
  SkillCategoryListResponse,
} from '../types/cv.types';


const MOCK_EMPLOYMENT_TYPES: EmploymentTypeListResponse = [
  { id: '41a582ec-3eb2-4804-9b5f-1941ed8fb465', name: 'Self-employed' },
  { id: '70d7e086-f5f1-4f6e-9095-4c8bd90cf007', name: 'Full-time' },
  { id: '1a061f2b-a741-4ed4-9437-5b148266be87', name: 'Seasonal' },
  { id: '8bb51ae4-bb91-479e-80fc-7dccdfd77bad', name: 'Contract' },
  { id: '458bfcd6-10c6-4d53-a5db-a5bc5f08f0f9', name: 'Freelance' },
  { id: '71a1613f-4207-479e-92e3-bb3df212e843', name: 'Apprenticeship' },
  { id: '81c4ff8a-bb29-4a3f-88a4-e1a5320b3b05', name: 'Internship' },
  { id: '0b20eea2-f67e-4872-a2ec-f96548e1c836', name: 'Part-time' },
];

const MOCK_DEGREES: DegreeListResponse = [
  { id: 'd9371846-d729-41a4-a681-2cf82e89c0ed', name: 'Doctoral Degree' },
  { id: '6fae67cc-cd84-4e14-b8be-311a66ccc80f', name: 'Associate Degree' },
  { id: 'e18fc958-c4fa-46e6-bbca-537d290dd20f', name: 'Master’s Degree' },
  { id: '7a760d04-4548-4a3d-96a9-5e19e945443a', name: 'Master of Business Administration (MBA)' },
  { id: '1ff5ab94-8178-479c-aa20-87c91ae3bc27', name: 'Engineering Degree' },
  { id: 'e018e28b-e6af-4506-acf7-9080815c83a5', name: 'Bachelor’s Degree' },
  { id: '3733dcbf-940d-43c5-ac3f-ca336ea25b32', name: 'Doctor of Philosophy (PhD)' },
  { id: '6efa57a3-01a9-4eb2-9e4d-d9c2f8db662e', name: 'High School Diploma' },
];

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

export const searchSchools = async (query: string) => {
  const { data } = await authClient<OrganizationListResponse>({
    method: 'GET',
    url: GET_ORGANIZATION_ENDPOINT(),
    params: {
      SearchTerm: query,
      OrganizationType: 'School',
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
  // const { data } = await authClient<EmploymentTypeListResponse>({
  //   method: 'GET',
  //   url: GET_EMPLOYMENT_TYPE_ENDPOINT(),
  // });

  return MOCK_EMPLOYMENT_TYPES;
};

export const getDegrees = async () => {
  // const { data } = await authClient<DegreeListResponse>({
  //   method: 'GET',
  //   url: GET_DEGREE_ENDPOINT(),
  // });

  return MOCK_DEGREES;
};
