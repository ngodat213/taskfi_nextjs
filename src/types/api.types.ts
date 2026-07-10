export interface BaseResponse<T = unknown> {
  success: boolean;
  message?: string;
  errorCode?: string;
  validationErrors?: Record<string, string[]>;
  data?: T;
  details?: unknown;
}

export interface PaginationData<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PaginatedResponse<T> = BaseResponse<PaginationData<T>>;
