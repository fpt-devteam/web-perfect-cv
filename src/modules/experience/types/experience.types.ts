export interface CVExperience {
  id: string;
  cvId: string;
  jobTitle: string;
  jobTitleId: string | null;
  employmentTypeId: string;
  employmentTypeName: string;
  organization: string;
  organizationId: string | null;
  location: string;
  startDate: string;
  endDate: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExperienceRequest {
  cvId: string;
  jobTitle: string;
  jobTitleId: string | null;
  employmentTypeId: string;
  organization: string;
  organizationId: string | null;
  location: string;
  startDate: string;
  endDate: string;
  description: string | null;
}

export interface UpdateExperienceRequest {
  jobTitle: string;
  jobTitleId: string | null;
  employmentTypeId: string;
  organization: string;
  organizationId: string | null;
  location: string;
  startDate: string;
  endDate: string;
  description: string | null;
}

export type ExperienceFormValues = {
  jobTitle: string;
  jobTitleId: string | null;
  employmentTypeId: string;
  organization: string;
  organizationId: string | null;
  location: string;
  startDate: Date;
  endDate: Date;
  description: string | null;
};