export interface CVSummary {
  id: string;
  cvId: string;
  context: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpSertSummaryRequest {
  cvId: string;
  context: string;
}

export type SummaryFormValues = {
  context: string;
};