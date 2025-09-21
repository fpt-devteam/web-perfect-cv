export type EducationResponse = {
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

export type CreateEducationRequest = {
  cvId: string;
  degree: string;
  organization: string;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  gpa: number | null;
};

export type UpdateEducationRequest = {
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

export type SearchableItemResponse = {
  id: string;
  name: string;
};

export type DegreeResponse = SearchableItemResponse;
export type DegreeListResponse = DegreeResponse[];

// Education form values type
export type EducationFormValues = {
  degree: string;
  organization: string;
  location: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  gpa: number | null;
};