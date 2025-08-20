"use client";

import React from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchAllAccounts } from "@/lib/api/accounts";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorState from "../common/ErrorState";

export default function AccountsOverview() {
  const { data: accounts, loading, error } = useFetchData(fetchAllAccounts); // Pass fetchAllAccounts function directly

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  const activeCount = accounts?.filter((a) => a.status).length ?? 0;
  const totalCount = accounts?.length ?? 0;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Accounts Overview</h2>
      <p className="text-sm text-gray-600 mb-2">Total Accounts: {totalCount}</p>
      <p className="text-sm text-green-600">Active: {activeCount}</p>
    </div>
  );
}
