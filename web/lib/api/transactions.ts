"use client";

import api from "@/lib/api/axiosInstance";
import { Transaction } from "@/types/Transaction";
import { ApiError, safeApiCall, apiLog } from "./helpers/apiHelpers";

/**
 * ============================================================
 * Transactions API Service
 * - Handles CRUD operations for transactions
 * - Uses safeApiCall for uniform error handling
 * ============================================================
 */

/**
 * Create a new transaction
 * ----------------------------------------------------------------
 * Sends a POST request to the backend to create a transaction.
 * Supports FormData for flexible payloads.
 *
 * @param formData - FormData containing transaction details
 * @returns Promise resolving to the created Transaction object
 * @throws ApiError if the API call fails
 */
export const createTransaction = (formData: FormData) =>
  safeApiCall(async () => {
    apiLog("Creating new transaction...");
    const { data } = await api.post("/transaction/create", formData);
    return data;
  });

/**
 * Fetch all transactions
 * ----------------------------------------------------------------
 * Sends a GET request to retrieve all transactions.
 *
 * @returns Promise resolving to an array of Transaction objects
 * @throws ApiError if the API call fails or data format is invalid
 */
export const fetchAllTransactions = (): Promise<Transaction[]> =>
  safeApiCall(async () => {
    apiLog("Fetching all transactions...");
    const { data } = await api.get<Transaction[]>("/transaction/get");
    if (!Array.isArray(data)) {
      throw new ApiError("Invalid data format received from API", 500);
    }
    return data;
  });

/**
 * Fetch a single transaction by ID
 * ----------------------------------------------------------------
 * Sends a GET request to fetch a transaction by ID.
 *
 * @param id - Transaction ID
 * @returns Promise resolving to the Transaction object
 * @throws ApiError if transaction not found or API call fails
 */
export const fetchTransactionById = (id: string): Promise<Transaction> =>
  safeApiCall(async () => {
    apiLog(`Fetching transaction ID: ${id}`);
    const { data } = await api.get<Transaction>(`/transaction/get/${id}`);
    if (!data) throw new ApiError("Transaction not found", 404);
    return data;
  });

/**
 * Delete a transaction by ID
 * ----------------------------------------------------------------
 * Sends a DELETE request to permanently remove a transaction.
 *
 * @param id - Transaction ID
 * @returns Promise<void>
 * @throws ApiError if the API call fails
 */
export const deleteTransactionById = (id: string): Promise<void> =>
  safeApiCall(async () => {
    apiLog(`Deleting transaction ID: ${id}`);
    await api.delete(`/transaction/delete/${id}`);
  });
