"use client";

import api from "@/lib/api/axiosInstance";
import { LoanPolicy } from "@/types/LoanPolicy";
import { ApiError, safeApiCall, apiLog } from "./helpers/apiHelpers";

/**
 * ============================================================
 * Loan Policies API Service
 * - Handles CRUD operations for loan policies
 * - Uses safeApiCall for uniform error handling
 * ============================================================
 */

/**
 * Create a new loan policy
 * ----------------------------------------------------------------
 * @param formData - FormData containing policy details
 * @returns Promise<LoanPolicy>
 * @throws ApiError if API call fails
 */
export const createLoanPolicy = (formData: FormData) =>
  safeApiCall(async () => {
    apiLog("Creating new loan policy...");
    const { data } = await api.post("/loan-policy/create", formData);
    console.log("Loan policy created:", data);
    return data;
  });

/**
 * Fetch all loan policies
 * ----------------------------------------------------------------
 * @returns Promise<LoanPolicy[]>
 * @throws ApiError if API call fails or invalid data
 */
export const fetchAllLoanPolicies = (): Promise<LoanPolicy[]> =>
  safeApiCall(async () => {
    apiLog("Fetching all loan policies...");
    const { data } = await api.get<LoanPolicy[]>("/loan-policy/get");
    if (!Array.isArray(data)) {
      throw new ApiError("Invalid data format received from API", 500);
    }
    return data;
  });

/**
 * Fetch loan policy by ID
 * ----------------------------------------------------------------
 * @param id - Loan Policy ID
 * @returns Promise<LoanPolicy>
 * @throws ApiError if not found or API fails
 */
export const fetchLoanPolicyById = (id: string): Promise<LoanPolicy> =>
  safeApiCall(async () => {
    apiLog(`Fetching loan policy ID: ${id}`);
    const { data } = await api.get<LoanPolicy>(`/loan-policy/get/${id}`);
    if (!data) throw new ApiError("Loan policy not found", 404);
    return data;
  });

/**
 * Delete loan policy by ID
 * ----------------------------------------------------------------
 * @param id - Loan Policy ID
 * @returns Promise<void>
 * @throws ApiError if deletion fails
 */
export const deleteLoanPolicyById = (id: string): Promise<void> =>
  safeApiCall(async () => {
    apiLog(`Deleting loan policy ID: ${id}`);
    await api.delete(`/loan-policy/delete/${id}`);
  });
