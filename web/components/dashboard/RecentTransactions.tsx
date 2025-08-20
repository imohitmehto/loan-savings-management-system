"use client";

import React from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchAllTransactions } from "@/lib/api/transactions";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorState from "../common/ErrorState";

export default function RecentTransactions() {
  const {
    data: transactions,
    loading,
    error,
  } = useFetchData(fetchAllTransactions);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left text-xs font-medium text-gray-500">
              Account
            </th>
            <th className="text-left text-xs font-medium text-gray-500">
              Type
            </th>
            <th className="text-left text-xs font-medium text-gray-500">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions?.slice(0, 5).map((t) => (
            <tr key={t.id}>
              <td className="text-sm">{t.account?.accountNumber}</td>
              <td className="text-sm">{t.type}</td>
              <td className="text-sm">₹{t.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
