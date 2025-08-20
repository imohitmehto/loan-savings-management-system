import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface AxiosRetryRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    // Inject Bearer token if found
    if (session?.accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${session.accessToken}`,
      };
    }

    // 🔹 Auto-detect and set Content-Type if not explicitly set
    if (config.data && !config.headers?.["Content-Type"]) {
      if (typeof FormData !== "undefined" && config.data instanceof FormData) {
        // Let Axios/browser set multipart boundary
        config.headers["Content-Type"] = "multipart/form-data";
      } else if (
        typeof URLSearchParams !== "undefined" &&
        config.data instanceof URLSearchParams
      ) {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      } else if (typeof config.data === "object") {
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRetryRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Redirect on unauthorized
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
