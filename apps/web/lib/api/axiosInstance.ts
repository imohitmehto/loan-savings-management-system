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

// Inject access token from NextAuth into requests
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRetryRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Redirect user to login page or show notification
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;