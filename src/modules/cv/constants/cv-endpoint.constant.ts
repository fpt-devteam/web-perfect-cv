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
export const GET_JOB_TITLES_ENDPOINT = () => `api/jobTitles/suggestions`;
export const GET_EMPLOYMENT_TYPE_ENDPOINT = () => `api/employmentTypes/suggestions`;
export const GET_DEGREE_ENDPOINT = () => `api/degrees/suggestions`;
export const LIST_CATEGORIES_ENDPOINT = () => `api/skill/categories/suggestions`;

export const UPSERT_SUMMARY_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/summary`;
export const GET_SUMMARY_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/summary`;

export const LIST_CERTIFICATIONS_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/certifications`;
export const CREATE_CERTIFICATION_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/certifications`;
export const UPDATE_CERTIFICATION_ENDPOINT = (cvId: string, certificationId: string) =>
  `api/cvs/${cvId}/certifications/${certificationId}`;
export const DELETE_CERTIFICATION_ENDPOINT = (cvId: string, certificationId: string) =>
  `api/cvs/${cvId}/certifications/${certificationId}`;

export const LIST_PROJECTS_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/projects`;
export const CREATE_PROJECT_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/projects`;
export const UPDATE_PROJECT_ENDPOINT = (cvId: string, projectId: string) =>
  `api/cvs/${cvId}/projects/${projectId}`;
export const DELETE_PROJECT_ENDPOINT = (cvId: string, projectId: string) =>
  `api/cvs/${cvId}/projects/${projectId}`;

export const LIST_EDUCATIONS_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/educations`;
export const CREATE_EDUCATION_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/educations`;
export const UPDATE_EDUCATION_ENDPOINT = (cvId: string, educationId: string) =>
  `api/cvs/${cvId}/educations/${educationId}`;
export const DELETE_EDUCATION_ENDPOINT = (cvId: string, educationId: string) =>
  `api/cvs/${cvId}/educations/${educationId}`;

export const LIST_SKILLS_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/skills`;
export const CREATE_SKILL_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/skills`;
export const UPDATE_SKILL_ENDPOINT = (cvId: string, skillId: string) =>
  `api/cvs/${cvId}/skills/${skillId}`;
export const DELETE_SKILL_ENDPOINT = (cvId: string, skillId: string) =>
  `api/cvs/${cvId}/skills/${skillId}`;
