"use client";

import React from "react";
import Link from "next/link";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchAllTransactions } from "@/lib/api/transactions";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorState from "../common/ErrorState";
import { FaMoneyBillTransfer } from "react-icons/fa6";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

function TransactionRow({ transaction }: { transaction: any }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-4 py-3 text-sm font-medium text-gray-700">
        {transaction.account?.accountNumber} <br />
        <span className="text-xs text-gray-500">
          {transaction.account?.fullName}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{transaction.id}</td>
      <td className="px-4 py-3 text-sm">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            transaction.status === "SUCCESS"
              ? "bg-green-100 text-green-700"
              : transaction.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {transaction.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{transaction.type}</td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-800">
        ₹{transaction.amount.toLocaleString("en-IN")}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {formatDate(transaction.createdAt)}
      </td>
      <td className="px-4 py-3 text-sm">
        <Link
          href={`/transactions/${transaction.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium underline"
        >
          View
        </Link>
      </td>
    </tr>
  );
}

export default function RecentTransactions() {
  const {
    data: transactions,
    loading,
    error,
  } = useFetchData(fetchAllTransactions);

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Recent Transactions
        </h2>
        <ErrorState message={error} />
      </div>
    );

  // Show only last 5 transactions
  const lastFiveTransactions = transactions?.slice(0, 5) ?? [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <FaMoneyBillTransfer className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-semibold text-gray-900">
          Recent Transactions
        </h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Account
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Transaction ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Type
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Created At
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {lastFiveTransactions.length > 0 ? (
              lastFiveTransactions.map((t: any) => (
                <TransactionRow key={t.id} transaction={t} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-sm text-gray-500 italic"
                >
                  No recent transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {transactions && transactions.length > 5 && (
        <div className="mt-4 text-right">
          <Link
            href="/transactions"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View All
          </Link>
        </div>
      )}
    </div>
  );
}
