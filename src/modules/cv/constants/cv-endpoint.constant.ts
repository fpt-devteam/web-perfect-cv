export const GET_CVS_ENDPOINT = 'api/cvs';
export const CREATE_CV_ENDPOINT = 'api/cvs';

export const UPSERT_CONTACT_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/contacts`;
export const LIST_CONTACTS_ENDPOINT = (cvId: string) => `api/cvs/${cvId}/contacts`;
