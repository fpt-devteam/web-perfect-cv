import type { SortOrder } from '@/shared/constants/sort-order.enum';
import type { PaginationQuery } from '@/shared/types/pagination.type';

export type CVResponse = {
  cvId: string;
  title: string;
  fullContent: string;
  lastEditedAt: string;
  jobDetail?: JobDetail | null;
};

export type CVListResponse = {
  total: number;
  items: CVResponse[];
};

export type CVListQuery = PaginationQuery & {
  sort: CVSort | null;
  searchTerm?: string;
};

export type CVSort = {
  updatedAt: SortOrder | null;
};

export type JobDetail = {
  jobTitle: string;
  description: string;
  companyName: string;
};

export type CreateCVRequest = {
  title: string;
  jobDetail: JobDetail | null;
};

export type UpdateCVRequest = {
  title: string;
  jobDetail?: JobDetail | null;
  analysisId?: string | null;
};

export type CVContact = {
  id: string;
  cvId: string;
  phoneNumber: string | null;
  email: string | null;
  linkedInUrl: string | null;
  gitHubUrl: string | null;
  personalWebsiteUrl: string | null;
  city: string | null;
  country: string | null;
};

export type UpSertContactRequest = Omit<CVContact, 'id'>;

export type CVExperience = {
  id: string;
  cvId: string;
  jobTitle: string;
  jobTitleId: string | null;
  employmentTypeId: string;
  employmentTypeName: string;
  organizationId: string | null;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateExperienceRequest = Omit<
  CVExperience,
  'id' | 'createdAt' | 'updatedAt' | 'employmentTypeName'
>;

export type UpdateExperienceRequest = Omit<
  CVExperience,
  'id' | 'cvId' | 'createdAt' | 'updatedAt' | 'employmentTypeName'
>;

export type SearchableItemResponse = {
  id: string;
  name: string;
};

export type SearchableItemListResponse = SearchableItemResponse[];
export type OrganizationResponse = SearchableItemResponse;
export type SkillCategoryResponse = SearchableItemResponse;
export type JobTitleResponse = SearchableItemResponse;
export type EmploymentTypeResponse = SearchableItemResponse;
export type DegreeResponse = SearchableItemResponse;
export type OrganizationListResponse = OrganizationResponse[];
export type EmploymentTypeListResponse = EmploymentTypeResponse[];
export type JobTitleListResponse = JobTitleResponse[];
export type DegreeListResponse = DegreeResponse[];
export type SkillCategoryListResponse = SkillCategoryResponse[];

export type CVSummary = {
  id: string;
  cvId: string;
  context: string | null;
};

export type UpSertSummaryRequest = Omit<CVSummary, 'id'>;

// export type CVSkill = {
//   id: string;
//   cvId: string;
//   description: string | null;
// };

// export type UpSertSkillRequest = Omit<CVSkill, 'id'>;

export type CVCertificationResponse = {
  id: string;
  cvId: string;
  name: string;
  issuedDate: string | null;
  description: string | null;
  organization: string;
  organizationId: string | null;
};

export type CreateCVCertificationRequest = {
  cvId: string;
  name: string;
  issuedDate: string | null;
  description: string | null;
  organization: string;
};

export type UpdateCVCertificationRequest = {
  name: string;
  issuedDate: string | null;
  description: string | null;
  organization: string;
};

export type CVProjectResponse = {
  id: string;
  cvId: string;
  title: string;
  description: string;
  link: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateCVProjectRequest = {
  cvId: string;
  title: string;
  description: string;
  link: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type UpdateCVProjectRequest = {
  title: string;
  description: string;
  link: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type CVEducationResponse = {
  id: string;
  cvId: string;
  organization: string;
  degree: string;
  location: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  gpa: number | null;
};

export type CreateCVEducationRequest = {
  cvId: string;
  degree: string;
  organization: string;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  gpa: number | null;
};

export type UpdateCVEducationRequest = {
  id: string;
  degree: string;
  organization: string;
  location: string | null;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string | null;
  gpa: number | null;
};

export type CVSkillResponse = {
  id: string;
  cvId: string;
  description: string;
  category: string;
};

export type CreateCVSkillRequest = {
  description: string;
  categoryName: string;
};

export type UpdateCVSkillRequest = {
  description: string;
  categoryName: string;
};

// New CV Data structure matching backend JSON format
export interface CVData {
  CVId?: string;
  UserId: string;
  Title: string;
  JobDetail: {
    JobTitle: string;
    CompanyName: string;
    Description: string;
  };
  Contacts: {
    Id: string;
    CVId: string;
    PhoneNumber: string;
    Email: string;
    LinkedInUrl: string | null;
    GitHubUrl: string | null;
    PersonalWebsiteUrl: string | null;
    Country: string;
    City: string;
  };
  Summary: string | null;
  Skills: Array<{
    Id: string;
    CVId: string;
    Name: string;
    Level: number;
    Description: string | null;
  }>;
  Educations: Array<{
    Organization: string;
    Degree: string;
    FieldOfStudy: string;
    StartDate: string;
    EndDate: string;
    Description: string;
    Gpa: number;
  }>;
  Certifications: Array<{
    Id: string;
    CVId: string;
    Name: string;
    OrganizationId: string;
    Organization: string;
    IssuedDate: string;
    Description: string;
  }>;
  Experiences: Array<{
    Id: string;
    CVId: string;
    JobTitleId: string;
    JobTitle: string;
    EmploymentTypeId: string;
    EmploymentTypeName: string;
    OrganizationId: string;
    Organization: string;
    Location: string;
    StartDate: string;
    EndDate: string;
    Description: string;
    CreatedAt: string;
    UpdatedAt: string;
  }>;
  Projects: Array<{
    Id: string;
    CVId: string;
    Title: string;
    Description: string;
    Link: string;
    StartDate: string;
    EndDate: string;
    CreatedAt: string;
    UpdatedAt: string;
  }>;
  lastEditedAt: string;
}

// New type for the full content API response
export interface CVFullContentResponse {
  id: string;
  userId: string;
  title: string;
  versionId: string;
  analysisId: string | null;
  createdAt: string;
  updatedAt: string;
  jobDetail: {
    jobTitle: string;
    companyName: string;
    description: string;
  };
  contact: {
    id: string;
    cvId: string;
    phoneNumber: string;
    email: string;
    linkedInUrl: string | null;
    gitHubUrl: string | null;
    personalWebsiteUrl: string | null;
    country: string;
    city: string;
  };
  summary: {
    id: string;
    cvId: string;
    context: string | null;
  };
  skills: Array<{
    id: string;
    category: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
  }>;
  educations: Array<{
    id: string;
    organization: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string | null;
    endDate: string | null;
    description: string;
    gpa: number | null;
  }>;
  experiences: Array<{
    id: string;
    cvId: string;
    jobTitleId: string | null;
    jobTitle: string;
    employmentTypeId: string;
    employmentTypeName: string;
    organizationId: string | null;
    organization: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
  }>;
  projects: Array<{
    id: string;
    cvId: string;
    title: string;
    description: string;
    link: string | null;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
    updatedAt: string | null;
  }>;
  certifications: Array<{
    id: string;
    cvId: string;
    name: string;
    organizationId: string | null;
    organization: string;
    issuedDate: string | null;
    description: string;
  }>;
}
