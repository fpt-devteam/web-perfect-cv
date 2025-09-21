export type ProjectResponse = {
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

export type CreateProjectRequest = {
  cvId: string;
  title: string;
  description: string;
  link: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type UpdateProjectRequest = {
  title: string;
  description: string;
  link: string | null;
  startDate: string | null;
  endDate: string | null;
};