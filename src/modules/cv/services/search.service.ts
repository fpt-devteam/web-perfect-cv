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
  { id: '6e81996a-f9e6-45a7-a55d-190982795894', name: 'Full-time' },
  { id: '8b677902-f267-4bdd-bb60-5afb3a4fc794', name: 'Freelance' },
  { id: 'b7c17331-b3f4-4a51-8abe-669ca9d4ae88', name: 'Self-employed' },
  { id: 'd08d8ed7-4a66-4c08-a4b2-71ede68863fb', name: 'Internship' },
  { id: '827b11b3-7728-4ad5-af09-b8937d86c99b', name: 'Contract' },
  { id: '22afee52-a7a5-481f-a12b-b99fd0a30365', name: 'Seasonal' },
  { id: 'ef4bc3de-eb8a-467e-bc55-dc02fef8f3ad', name: 'Apprenticeship' },
  { id: '222993ba-0717-42ff-b85c-fcf5bb37bfd0', name: 'Part-time' },
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
