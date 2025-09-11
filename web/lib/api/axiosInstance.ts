// lib/api/axiosInstance.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { getSession, signOut } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface AxiosRetryRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Session cache to prevent excessive getSession() calls
interface SessionCache {
  session: any;
  timestamp: number;
  promise?: Promise<any>;
}

let sessionCache: SessionCache | null = null;
const CACHE_DURATION = 4 * 60 * 1000; // 4 minutes cache

const getCachedSession = async (): Promise<any> => {
  const now = Date.now();

  // Return cached session if still valid
  if (sessionCache && now - sessionCache.timestamp < CACHE_DURATION) {
    return sessionCache.session;
  }

  // If already fetching, wait for existing promise
  if (sessionCache?.promise) {
    return await sessionCache.promise;
  }

  // Fetch new session
  const sessionPromise = getSession();
  sessionCache = {
    session: null,
    timestamp: now,
    promise: sessionPromise,
  };

  try {
    const session = await sessionPromise;
    sessionCache = { session, timestamp: now };
    return session;
  } catch (error) {
    sessionCache = null;
    console.error('Session fetch failed:', error);
    return null;
  }
};

const clearSessionCache = () => {
  sessionCache = null;
};

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

// Request Interceptor
api.interceptors.request.use(
  async config => {
    try {
      const session = await getCachedSession();

      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }

      // Check for session error (token refresh failed)
      if (session?.error === 'RefreshAccessTokenError') {
        // Clear cache and sign out
        clearSessionCache();
        if (typeof window !== 'undefined') {
          await signOut({
            callbackUrl: '/auth/login',
            redirect: true,
          });
        }
        return config;
      }

      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }

      // Content-Type handling
      if (config.data && !config.headers['Content-Type']) {
        if (
          typeof FormData !== 'undefined' &&
          config.data instanceof FormData
        ) {
          delete config.headers['Content-Type'];
        } else if (
          typeof URLSearchParams !== 'undefined' &&
          config.data instanceof URLSearchParams
        ) {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else if (
          typeof config.data === 'object' &&
          config.data !== null &&
          !(config.data instanceof Date) &&
          !(config.data instanceof File) &&
          !(config.data instanceof Blob)
        ) {
          config.headers['Content-Type'] = 'application/json';
        }
      }

      return config;
    } catch (sessionError) {
      console.error('Session retrieval failed:', sessionError);
      return config;
    }
  },
  error => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRetryRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Clear session cache to force fresh session fetch
        clearSessionCache();
        const session = await getCachedSession();

        // Check if session has refresh error or no access token
        if (
          !session?.accessToken ||
          session?.error === 'RefreshAccessTokenError'
        ) {
          if (typeof window !== 'undefined') {
            await signOut({
              callbackUrl: '/auth/login',
              redirect: true,
            });
          }
          return Promise.reject(error);
        }

        // Update authorization header and retry request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
          return api(originalRequest);
        }
      } catch (sessionError) {
        console.error(
          '❌ Session refresh failed during 401 handling:',
          sessionError
        );

        if (typeof window !== 'undefined') {
          await signOut({
            callbackUrl: '/auth/login',
            redirect: true,
          });
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
