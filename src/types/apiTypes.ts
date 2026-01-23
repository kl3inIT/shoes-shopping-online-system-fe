export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  status: number;
  timestamp: string;
}

export interface ApiProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  messageKey?: string;
  params?: Record<string, unknown>;
  errors?: Record<string, string>;
}

export type ApiListResponse<T> = ApiSuccessResponse<T[]>;
