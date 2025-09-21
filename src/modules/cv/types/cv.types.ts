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

// Contact and Experience types moved to their respective modules
// @/modules/contact/types/contact.types.ts
// @/modules/experience/types/experience.types.ts

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

// Summary types moved to summary module
// @/modules/summary/types/summary.types.ts

// export type CVSkill = {
//   id: string;
//   cvId: string;
//   description: string | null;
// };

// export type UpSertSkillRequest = Omit<CVSkill, 'id'>;

// Certification types moved to certification module
// @/modules/certification/types/certification.types.ts

// Project types moved to project module
// @/modules/project/types/project.types.ts

// Education types moved to education module
// @/modules/education/types/education.types.ts

// Skill types moved to skill module
// @/modules/skill/types/skill.types.ts

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
