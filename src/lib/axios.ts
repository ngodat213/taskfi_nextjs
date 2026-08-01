import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { API_ENDPOINTS } from "@/config/api-endpoints";
import { useAuthStore } from "@/store/auth.store";

type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  headers: {
    "Content-Type": "application/json",
  },
});

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleLogout = () => {
  useAuthStore.getState().logout();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (config.headers) {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      let locale = "en";
      if (typeof document !== "undefined") {
        const match = document.cookie.match(/(^| )NEXT_LOCALE=([^;]+)/);
        if (match) {
          locale = match[2];
        } else {
          locale = window.location.pathname.split("/")[1] || "en";
        }
      }
      config.headers["Accept-Language"] = locale;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Bỏ qua nếu không phải lỗi 401 hoặc request đã được retry trước đó
    // Bỏ qua nếu là request đang gọi tới các endpoint auth (login, register...)
    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register");

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }

    // Nếu đang trong quá trình refresh token, đưa request vào hàng đợi
    if (isRefreshing) {
      try {
        const token = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return apiClient(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    // Bắt đầu quá trình refresh token
    originalRequest._retry = true;
    isRefreshing = true;

    const { refreshToken, setAuth } = useAuthStore.getState();

    if (!refreshToken) {
      handleLogout();
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken },
      );

      const {
        accessToken,
        token,
        refreshToken: newRefreshToken,
      } = response.data.data;
      const newToken = token || accessToken;

      // Lưu token mới
      setAuth(newToken, newRefreshToken);

      // Xử lý các request đang chờ
      processQueue(null, newToken);

      // Thực hiện lại request ban đầu
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      return apiClient(originalRequest);
    } catch (err) {
      processQueue(err, null);
      handleLogout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
