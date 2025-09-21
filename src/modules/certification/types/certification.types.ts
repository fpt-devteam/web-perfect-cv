export type CertificationResponse = {
  id: string;
  cvId: string;
  name: string;
  issuedDate: string | null;
  description: string | null;
  organization: string;
  organizationId: string | null;
};

export type CreateCertificationRequest = {
  cvId: string;
  name: string;
  issuedDate: string | null;
  description: string | null;
  organization: string;
};

export type UpdateCertificationRequest = {
  name: string;
  issuedDate: string | null;
  description: string | null;
  organization: string;
};