export const LIST_PROJECTS_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/projects`;
export const CREATE_PROJECT_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/projects`;
export const UPDATE_PROJECT_ENDPOINT = (cvId: string, projectId: string) =>
  `api/cvs/${cvId}/projects/${projectId}`;
export const DELETE_PROJECT_ENDPOINT = (cvId: string, projectId: string) =>
  `api/cvs/${cvId}/projects/${projectId}`;