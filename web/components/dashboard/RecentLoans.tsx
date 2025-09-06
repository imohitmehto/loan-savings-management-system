"use client";
import React from "react";
import Link from "next/link";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchAllLoans } from "@/lib/api/loans";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorState from "../common/ErrorState";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

// Utility to format date
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// Modular loan row component
function LoanRow({ loan }: { loan: any }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="p-2">{loan.loanNumber}</td>
      <td className="p-2">
        {loan.user?.firstName} {loan.user?.lastName}
      </td>
      <td className="p-2 font-semibold">
        ₹{loan.principal.toLocaleString("en-IN")}
      </td>
      <td className="p-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            loan.status === "APPROVED"
              ? "bg-green-100 text-green-700"
              : loan.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {loan.status}
        </span>
      </td>
      <td className="p-2">{loan.type}</td>
      <td className="p-2">{formatDate(loan.disbursementDate)}</td>
      <td className="p-2 font-semibold">
        ₹{loan.remainingBalance?.toLocaleString("en-IN") ?? "N/A"}
      </td>
      <td className="p-2">
        <Link
          href={`/loans/${loan.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium underline"
        >
          View
        </Link>
      </td>
    </tr>
  );
}

export default function RecentLoans() {
  const { data: loans, loading, error } = useFetchData(fetchAllLoans);

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <div className="bg-white p-6 rounded shadow overflow-auto">
        <div className="flex items-center gap-3 mb-6">
          <FaMoneyBillTrendUp className="w-8 h-8 text-blue-500" />
          <h2 className="font-semibold text-lg text-gray-800">Recent Loans</h2>
        </div>
        <ErrorState message={error} />
      </div>
    );

  return (
    <div className="bg-white p-6 rounded shadow overflow-auto">
      <div className="flex items-center gap-3 mb-6">
        <FaMoneyBillTrendUp className="w-8 h-8 text-blue-500" />
        <h2 className="text-2xl font-semibold text-gray-900">Recent Loans</h2>
      </div>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-2">Loan No.</th>
            <th className="text-left p-2">Borrower</th>
            <th className="text-left p-2">Principal</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Disbursement Date</th>
            <th className="text-left p-2">Remaining Balance</th>
            <th className="text-left p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {loans && loans.length > 0 ? (
            loans
              .slice(0, 5)
              .map((loan: any) => <LoanRow key={loan.id} loan={loan} />)
          ) : (
            <tr>
              <td
                colSpan={8}
                className="text-center py-6 text-sm text-gray-500 italic"
              >
                No recent loans found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
