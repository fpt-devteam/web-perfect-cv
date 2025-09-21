export interface CVSummary {
  id: string;
  cvId: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpSertSummaryRequest {
  cvId: string;
  content: string;
}

export type SummaryFormValues = {
  content: string;
};