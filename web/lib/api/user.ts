'use client';

import api from '@/lib/api/axiosInstance';
import { Account } from '@/types/Account';
import { ApiError, safeApiCall, apiLog } from './helpers/apiHelpers';

/**
 * ============================================================
 * Accounts API Service
 * - Handles CRUD operations for accounts
 * - Uses safeApiCall for uniform error handling
 * ============================================================
 */

/**
 * Create a new account
 * ----------------------------------------------------------------
 * Sends a POST request to the backend to create an account.
 * Supports FormData so that files (images, documents) can be uploaded.
 *
 * @param formData - FormData containing account details and any file uploads
 * @returns Promise resolving to the created Account object
 * @throws ApiError if the API call fails
 */
export const createAccount = (formData: FormData) =>
  safeApiCall(async () => {
    const { data } = await api.post('/account/create', formData);
    return data;
  });

/**
 * Fetch all accounts
 * ----------------------------------------------------------------
 * Sends a GET request to retrieve a list of all accounts in the system.
 *
 * @returns Promise resolving to an array of Account objects
 * @throws ApiError if the API call fails or data format is invalid
 */
export const fetchProfile = () =>
  safeApiCall(async () => {
    apiLog('Fetching user...');
    const { data } = await api.get('/user/profile');
    if (!data) throw new ApiError('Invalid data format received from API', 500);
    return data;
  });

/**
 * Fetch a single account by its ID
 * ----------------------------------------------------------------
 * Sends a GET request to retrieve an account by ID.
 *
 * @param id - The ID of the account to fetch
 * @returns Promise resolving to the Account object
 * @throws ApiError if account not found or API call fails
 */
export const fetchAccountById = (id: string): Promise<Account> =>
  safeApiCall(async () => {
    apiLog(`Fetching account ID: ${id}`);
    const { data } = await api.get<Account>(`/account/${id}`);
    if (!data) throw new ApiError('Account not found', 404);
    return data;
  });

/**
 * Update an account by its ID
 * ----------------------------------------------------------------
 * Sends a PUT request to update an existing account.
 * Can send either:
 * - FormData (for file uploads) → includes correct headers
 * - Partial<Account> as JSON
 *
 * @param id - The ID of the account to update
 * @param payload - Partial account data or FormData for file upload
 * @returns Promise resolving to the updated Account object
 * @throws ApiError if the API call fails or response is invalid
 */
export const updateAccountById = (
  id: string,
  payload: Partial<Account> | FormData
): Promise<Account> =>
  safeApiCall(async () => {
    apiLog(`Updating account ID: ${id}`);
    const isFormData = payload instanceof FormData;
    const { data } = await api.put<Account>(
      `/account/${id}`,
      payload,
      isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined
    );
    if (!data) throw new ApiError('Failed to update account', 500);
    return data;
  });

/**
 * Delete an account by its ID
 * ----------------------------------------------------------------
 * Sends a DELETE request to permanently remove an account.
 *
 * @param id - The ID of the account to delete
 * @returns Promise that resolves when deletion is complete
 * @throws ApiError if the API call fails
 */
export const deleteAccountById = (id: string): Promise<void> =>
  safeApiCall(async () => {
    apiLog(`Deleting account ID: ${id}`);
    await api.delete(`/account/${id}`);
  });
