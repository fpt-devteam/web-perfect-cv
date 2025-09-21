export const GET_DEGREE_ENDPOINT = () => `api/degrees/suggestions`;
export const LIST_EDUCATIONS_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/educations`;
export const CREATE_EDUCATION_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/educations`;
export const UPDATE_EDUCATION_ENDPOINT = (cvId: string, educationId: string) =>
  `api/cvs/${cvId}/educations/${educationId}`;
export const DELETE_EDUCATION_ENDPOINT = (cvId: string, educationId: string) =>
  `api/cvs/${cvId}/educations/${educationId}`;
export const GET_ORGANIZATION_ENDPOINT = () => `api/organizations/suggestions`;