"use client";

import api from "@/lib/api/axiosInstance";
import { Loan } from "@/types/Loan";
import { ApiError, safeApiCall, apiLog } from "./helpers/apiHelpers";

/**
 * ============================================================
 * Loans API Service
 * - Handles CRUD operations for loans
 * - Uses safeApiCall for uniform error handling
 * ============================================================
 */

/**
 * Create a new loan
 * ----------------------------------------------------------------
 * Sends a POST request to the backend to create a loan.
 * Accepts FormData so that file or structured payloads are supported.
 *
 * @param formData - FormData containing loan details
 * @returns Promise resolving to the created Loan object
 * @throws ApiError if the API call fails
 */
export const createLoan = (formData: FormData) =>
  safeApiCall(async () => {
    apiLog("Creating new loan...");
    const { data } = await api.post("/loan/create", formData);
    return data;
  });

/**
 * Fetch all loans
 * ----------------------------------------------------------------
 * Sends a GET request to retrieve all loans.
 *
 * @returns Promise resolving to an array of Loan objects
 * @throws ApiError if the API call fails or data format is invalid
 */
export const fetchAllLoans = (): Promise<Loan[]> =>
  safeApiCall(async () => {
    apiLog("Fetching all loans...");
    const { data } = await api.get<Loan[]>("/loan/get");
    if (!Array.isArray(data)) {
      throw new ApiError("Invalid data format received from API", 500);
    }
    return data;
  });

/**
 * Fetch a single loan by ID
 * ----------------------------------------------------------------
 * Sends a GET request to fetch a loan by its ID.
 *
 * @param id - Loan ID
 * @returns Promise resolving to the Loan object
 * @throws ApiError if loan not found or API call fails
 */
export const fetchLoanById = (id: string): Promise<Loan> =>
  safeApiCall(async () => {
    apiLog(`Fetching loan ID: ${id}`);
    const { data } = await api.get<Loan>(`/loan/get/${id}`);
    if (!data) throw new ApiError("Loan not found", 404);
    return data;
  });

/**
 * Delete a loan by ID
 * ----------------------------------------------------------------
 * Sends a DELETE request to remove a loan.
 *
 * @param id - Loan ID
 * @returns Promise<void>
 * @throws ApiError if the API call fails
 */
export const deleteLoanById = (id: string): Promise<void> =>
  safeApiCall(async () => {
    apiLog(`Deleting loan ID: ${id}`);
    await api.delete(`/loan/delete/${id}`);
  });
