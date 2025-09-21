export const LIST_CERTIFICATIONS_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/certifications`;
export const CREATE_CERTIFICATION_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/certifications`;
export const UPDATE_CERTIFICATION_ENDPOINT = (cvId: string, certificationId: string) =>
  `api/cvs/${cvId}/certifications/${certificationId}`;
export const DELETE_CERTIFICATION_ENDPOINT = (cvId: string, certificationId: string) =>
  `api/cvs/${cvId}/certifications/${certificationId}`;