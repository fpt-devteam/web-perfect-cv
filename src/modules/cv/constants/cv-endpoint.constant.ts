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

export const GET_ORGANIZATION_ENDPOINT = () => `api/organizations/suggestions`;
export const GET_EMPLOYMENT_TYPE_ENDPOINT = () => `api/employment-types`;
export const GET_JOB_TITLES_ENDPOINT = () => `api/jobTitles/suggestions`;

export const UPSERT_SUMMARY_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/summary`;
export const GET_SUMMARY_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/summary`;

export const LIST_CERTIFICATIONS_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/certifications`;
export const CREATE_CERTIFICATION_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/certifications`;
export const UPDATE_CERTIFICATION_ENDPOINT = (cvId: string, certificationId: string) =>
  `api/cvs/${cvId}/certifications/${certificationId}`;
export const DELETE_CERTIFICATION_ENDPOINT = (cvId: string, certificationId: string) =>
  `api/cvs/${cvId}/certifications/${certificationId}`;
