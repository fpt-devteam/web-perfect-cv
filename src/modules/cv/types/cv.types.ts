import type { SortOrder } from '@/shared/constants/sort-order.enum';
import type { PaginationQuery } from '@/shared/types/pagination.type';

export type CVResponse = {
  cvId: string;
  title: string;
  jobDescription: JobDescription;
  content: CVContent;
  lastEditedAt: string;
};

export type CVListResponse = {
  total: number;
  items: CVResponse[];
};

export type CVListQuery = PaginationQuery & {
  sort?: CVSort | null;
  sortBy?: string;
  sortOrder?: string;
  searchTerm?: string;
};

export type CVSort = {
  updatedAt: SortOrder | string | null;
};

export type JobDescription = {
  id: string;
  cvId: string;
  title: string;
  companyName: string;
  responsibility: string;
  qualification: string;
};

export type CreateJobDescriptionRequest = {
  title: string;
  companyName: string;
  responsibility: string;
  qualification: string;
};

export type CVContent = {
  contact: {
    phoneNumber: string;
    email: string;
    linkedInUrl: string;
    gitHubUrl: string;
    personalWebsiteUrl: string;
    country: string;
    city: string;
  };
  summary: {
    content: string;
  };
  educations: Array<{
    degree: string;
    organization: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description: string;
    gpa: number;
  }>;
  experiences: Array<{
    jobTitle: string;
    employmentTypeId: string;
    organization: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    link: string;
    startDate: string;
    endDate: string;
  }>;
  skills: Array<{
    category: string;
    content: string;
  }>;
  certifications: Array<{
    name: string;
    organization: string;
    issuedDate: string;
    description: string;
  }>;
};

export type CreateCVRequest = {
  title: string;
  jobDescription: CreateJobDescriptionRequest;
};

export type UpdateCVRequest = {
  title: string;
  jobDescription?: CreateJobDescriptionRequest;
  analysisId?: string | null;
};

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