import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiClient } from "./axios";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface FetchOptions extends Omit<
  AxiosRequestConfig,
  "method" | "data" | "url"
> {
  method?: ApiMethod;
  body?: unknown;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const apiFetch = async <T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { method = "GET", body, ...customConfig } = options;

  try {
    const response = await apiClient({
      url: endpoint,
      method,
      data: body,
      ...customConfig,
    });

    return response.data as T;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;

    throw new ApiError(
      axiosError.response?.status || 500,
      axiosError.response?.data?.message || axiosError.message,
      axiosError.response?.data,
    );
  }
};
