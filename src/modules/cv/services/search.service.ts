import { authClient } from '@/modules/auth/services/client.service';
import { GET_JOB_TITLES_ENDPOINT, GET_ORGANIZATION_ENDPOINT } from '../constants/cv-endpoint.constant';
import type {
  EmploymentTypeListResponse,
  JobTitleListResponse,
  OrganizationListResponse,
} from '../types/cv.types';

const MOCK_EMPLOYMENT_TYPES: EmploymentTypeListResponse = {
  total: 8,
  items: [
    { id: '6e81996a-f9e6-45a7-a55d-190982795894', name: 'Full-time' },
    { id: '8b677902-f267-4bdd-bb60-5afb3a4fc794', name: 'Freelance' },
    { id: 'b7c17331-b3f4-4a51-8abe-669ca9d4ae88', name: 'Self-employed' },
    { id: 'd08d8ed7-4a66-4c08-a4b2-71ede68863fb', name: 'Internship' },
    { id: '827b11b3-7728-4ad5-af09-b8937d86c99b', name: 'Contract' },
    { id: '22afee52-a7a5-481f-a12b-b99fd0a30365', name: 'Seasonal' },
    { id: 'ef4bc3de-eb8a-467e-bc55-dc02fef8f3ad', name: 'Apprenticeship' },
    { id: '222993ba-0717-42ff-b85c-fcf5bb37bfd0', name: 'Part-time' },
  ],
};

export const searchOrganizations = async (query: string) => {
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
  // const { data } = await authClient<EmploymentTypeListResponse>({
  //   method: 'GET',
  //   url: GET_EMPLOYMENT_TYPE_ENDPOINT(),
  // });

  return MOCK_EMPLOYMENT_TYPES;
};
