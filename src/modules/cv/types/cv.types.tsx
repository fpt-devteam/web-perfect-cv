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
  organization: string | null;
  organizationId: string | null;
};

export type UpdateCVCertificationRequest = {
  name: string;
  issuedDate: string | null;
  description: string | null;
  organization: string;
  organizationId: string | null;
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
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  gpa: number | null;
};

export type CreateCVEducationRequest = {
  cvId: string;
  degree: string;
  degreeId: string | null;
  organizationId: string | null;
  organization: string;
  location: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  gpa: number | null;
};

export type UpdateCVEducationRequest = {
  id: string;
  degreeId: string;
  degree: string;
  organization: string;
  organizationId: string | null;
  location: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  gpa: number | null;
};

export type CVSkillResponse = {
  id: string;
  cvId: string;
  description: string;
  categoryId: string;
  categoryName: string;
};

export type CreateCVSkillRequest = {
  description: string;
  categoryName: string;
};

export type UpdateCVSkillRequest = {
  description: string;
  categoryName: string;
};
