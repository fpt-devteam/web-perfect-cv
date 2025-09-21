export interface CVContact {
  id: string;
  cvId: string;
  phoneNumber: string | null;
  email: string | null;
  linkedInUrl: string | null;
  gitHubUrl: string | null;
  personalWebsiteUrl: string | null;
  city: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpSertContactRequest {
  cvId: string;
  phoneNumber: string | null;
  email: string | null;
  linkedInUrl: string | null;
  gitHubUrl: string | null;
  personalWebsiteUrl: string | null;
  city: string | null;
  country: string | null;
}