import type { SortOrder } from '@/shared/constants/sort-order.enum';
import type { PaginationQuery } from '@/shared/types/pagination.type';

export type CVResponse = {
  cvId: string;
  title: string;
  fullContent: string;
  lastEditedAt: string;
};

export type CVListResponse = {
  total: number;
  items: CVResponse[];
};

export type CVListQuery = PaginationQuery & {
  sort: CVSort | null;
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
  endDate: string | null;
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

export type SearchableItemListResponse = {
  total: number;
  items: SearchableItemResponse[];
};

export type OrganizationResponse = SearchableItemResponse;

export type JobTitleResponse = SearchableItemResponse;

export type EmploymentTypeResponse = SearchableItemResponse;

export type OrganizationListResponse = {
  total: number;
  items: OrganizationResponse[];
};

export type EmploymentTypeListResponse = {
  total: number;
  items: EmploymentTypeResponse[];
};

export type JobTitleListResponse = {
  total: number;
  items: JobTitleResponse[];
};

export type CVSummary = {
  id: string;
  cvId: string;
  context: string | null;
};

export type UpSertSummaryRequest = Omit<CVSummary, 'id'>;

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
