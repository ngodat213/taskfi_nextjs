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

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UploadResponse {
  url: string;
  publicId: string;
  resourceType: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  folder: string;
}
