import { AxiosError } from "axios";

/** Custom API error class with HTTP status */
export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Handle axios errors and throw typed ApiError */
export function handleAxiosError(error: unknown): never {
  let message = "An unexpected error occurred.";
  let status: number | undefined;

  if (error instanceof AxiosError) {
    if (error.response) {
      type ErrorResponseData = { message?: string };
      const data = error.response.data as ErrorResponseData;
      message = data?.message || error.response.statusText || message;
      status = error.response.status;
    } else if (error.request) {
      message = "No response received from server.";
    } else {
      message = error.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  console.error("API Error:", message);
  throw new ApiError(message, status);
}

/** Wrapper to standardise API calls */
export async function safeApiCall<T>(callback: () => Promise<T>): Promise<T> {
  try {
    return await callback();
  } catch (error) {
    handleAxiosError(error);
  }
}

/** Optional API debug logging */
const DEBUG = true;
export function apiLog(...args: unknown[]) {
  if (DEBUG) console.log("[API]", ...args);
}
