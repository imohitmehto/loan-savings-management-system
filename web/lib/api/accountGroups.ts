import api from "@/lib/api/axiosInstance";
import { ApiError, safeApiCall, apiLog } from "./helpers/apiHelpers";

/**
 * ============================================================
 * Account Groups API Service
 * - Handles CRUD operations for account groups
 * - Uses safeApiCall for uniform error handling
 * ============================================================
 */

/**
 * Create a new account group
 */
export const createAccountGroup = (formData: FormData) =>
  safeApiCall(async () => {
    apiLog("Creating account group...");
    const { data } = await api.post("/account/group/create", formData);
    return data;
  });

/**
 * Fetch all account groups
 */
export const fetchAllAccountGroup = () =>
  safeApiCall(async () => {
    apiLog("Fetching all account groups...");
    const { data } = await api.get("/account/group/get");
    if (!Array.isArray(data)) {
      throw new ApiError("Invalid data format received from API", 500);
    }
    return data;
  });

/**
 * Fetch account group by ID
 */
export const fetchAccountGroupById = (id: string) =>
  safeApiCall(async () => {
    apiLog(`Fetching account group ID: ${id}`);
    const { data } = await api.get(`/account/group/get/${id}`);
    if (!data) {
      throw new ApiError("Account group not found", 404);
    }
    return data;
  });

/**
 * Update account group by ID
 */
export const updateAccountGroupById = (id: string, payload: FormData) =>
  safeApiCall(async () => {
    apiLog(`Updating account group ID: ${id}`);
    const { data } = await api.put(`/account/group/update/${id}`, payload);
    if (!data) {
      throw new ApiError("Failed to update account group", 500);
    }
    return data;
  });

/**
 * Delete account group by ID
 */
export const deleteAccountGroupById = (id: string): Promise<void> =>
  safeApiCall(async () => {
    apiLog(`Deleting account group ID: ${id}`);
    await api.delete(`/account/group/delete/${id}`);
  });
