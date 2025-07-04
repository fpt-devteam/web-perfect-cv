export const GET_CVS_ENDPOINT = 'api/cvs';
export const CREATE_CV_ENDPOINT = 'api/cvs';

export const UPSERT_CONTACT_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/contacts`;
export const LIST_CONTACTS_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/contacts`;

export const LIST_EXPERIENCES_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/experiences`;
export const CREATE_EXPERIENCE_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/experiences`;
export const UPDATE_EXPERIENCE_ENDPOINT = (cvId: string, experienceId: string) =>
  `api/cvs/${cvId}/experiences/${experienceId}`;
export const DELETE_EXPERIENCE_ENDPOINT = (cvId: string, experienceId: string) =>
  `api/cvs/${cvId}/experiences/${experienceId}`;

export const GET_ORGANIZATION_ENDPOINT = () => `api/organizations`;
export const GET_EMPLOYMENT_TYPE_ENDPOINT = () => `api/employment-types`;
export const GET_JOB_TITLES_ENDPOINT = () => `api/job-titles`;
