export interface CheckDef {
  id: string;
  category: string | null;
  question: string;
  active: boolean;
  createdAt: string;
  createdBy: string | null;
}

export interface CheckDefCreatePayload {
  question: string;
  referenceAnswer: string;
  category?: string;
  active: boolean;
}

export interface CheckDefFormValues {
  question: string;
  referenceAnswer: string;
  category: string;
  active: boolean;
}

export interface CheckRunSummary {
  id: string;
  score: number | null;
  summary: string | null;
}

export interface CheckRunSummaryResponse {
  id: string;
  score: number | null;
  createdAt: string;
  createdBy: string | null;
  createdByUsername: string | null;
}

export interface CheckRunPage {
  content: CheckRunSummaryResponse[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CheckRunResult {
  question: string;
  referenceAnswer: string;
  actualAnswer: string | null;
  score: number | null;
  log: string | null;
}

export interface GetCheckRunsParams {
  page?: number;
  size?: number;
}
