"use client";

import { Loan } from "@/types/Loan";
import { EyeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import GenericTableRow from "@/components/common/table/GenericTableRow";

interface LoanTableRowProps {
  loan: Loan;
  index: number;
  isLinkView?: boolean;
}

export default function LoanTableRow({
  loan,
  index,
  isLinkView,
}: LoanTableRowProps) {
  const cells = [
    // Row Index
    <span
      key="index"
      className="text-[10px] sm:text-sm font-mono text-gray-700 whitespace-nowrap"
    >
      {index + 1}
    </span>,

    // Loan Number
    <span
      key="loanNumber"
      className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap"
      title={loan.loanNumber}
    >
      {loan.loanNumber}
    </span>,

    // Borrower
    <span
      key="borrower"
      className="text-xs sm:text-sm text-gray-700 truncate max-w-[140px] sm:max-w-xs"
      title={
        loan.user
          ? `${loan.user.firstName || ""} ${loan.user.lastName || ""}`
          : loan.userId
      }
    >
      {loan.user
        ? `${loan.user.firstName || ""} ${loan.user.lastName || ""}`
        : loan.userId}
    </span>,

    // Loan Type
    <span
      key="loanType"
      className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap"
      title={loan.loanType?.name || loan.loanTypeId}
    >
      {loan.loanType?.name || loan.loanTypeId}
    </span>,

    // Principal Amount
    <span
      key="principal"
      className="text-xs sm:text-sm font-mono text-gray-800 whitespace-nowrap"
      title={loan.principal.toString()}
    >
      ₹
      {loan.principal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>,

    // Interest Rate
    <span
      key="interestRate"
      className="text-xs sm:text-sm font-mono text-gray-800 whitespace-nowrap"
      title={`${loan.interestRate}%`}
    >
      {loan.interestRate}%
    </span>,

    // EMI Amount
    <span
      key="emiAmount"
      className="text-xs sm:text-sm font-mono text-gray-800 whitespace-nowrap"
      title={loan.emiAmount.toString()}
    >
      ₹
      {loan.emiAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>,

    // Status
    <span
      key="status"
      className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${
        loan.status === "ACTIVE"
          ? "text-green-600"
          : loan.status === "PENDING"
            ? "text-yellow-600"
            : "text-red-600"
      }`}
    >
      {loan.status}
    </span>,

    // Start Date
    <span
      key="startDate"
      className="text-xs sm:text-sm text-gray-600 whitespace-nowrap"
      title={new Date(loan.startDate).toLocaleString()}
    >
      {new Date(loan.startDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>,

    // End Date
    <span
      key="endDate"
      className="text-xs sm:text-sm text-gray-600 whitespace-nowrap"
      title={new Date(loan.endDate).toLocaleString()}
    >
      {new Date(loan.endDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>,

    // Actions
    <Link
      key="actions"
      href={`/loan/${loan.id}`}
      className="flex items-center justify-center space-x-1 px-2 py-1 min-w-[60px] bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      <EyeIcon className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">View</span>
    </Link>,
  ];

  return <GenericTableRow index={index} cells={cells} />;
}
