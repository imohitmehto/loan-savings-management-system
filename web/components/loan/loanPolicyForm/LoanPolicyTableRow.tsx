"use client";

import { LoanPolicy } from "@/types/LoanPolicy";
import { EyeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import GenericTableRow from "@/components/common/table/GenericTableRow";

interface LoanPolicyTableRowProps {
  policy: LoanPolicy;
  index: number;
  isLinkView?: boolean;
}

export default function LoanPolicyTableRow({
  policy,
  index,
  isLinkView,
}: LoanPolicyTableRowProps) {
  const cells = [
    // Index
    <span
      key="index"
      className="text-[10px] sm:text-sm font-mono text-gray-700 whitespace-nowrap"
    >
      {index + 1}
    </span>,

    // Policy Name
    <span
      key="name"
      className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap"
      title={policy.name}
    >
      {policy.name}
    </span>,

    // Description
    <span
      key="description"
      className="text-xs sm:text-sm text-gray-700 truncate max-w-[140px] sm:max-w-xs"
      title={policy.description || ""}
    >
      {policy.description || "-"}
    </span>,

    // Interest Rate
    <span
      key="interestRate"
      className="text-xs sm:text-sm font-mono text-gray-800 whitespace-nowrap"
      title={
        policy.interestRate != null
          ? `${policy.interestRate}%`
          : "Not specified"
      }
    >
      {policy.interestRate != null ? `${policy.interestRate}%` : "-"}
    </span>,

    // Min Credit Score
    <span
      key="minCreditScore"
      className="text-xs sm:text-sm font-mono text-gray-800 whitespace-nowrap"
      title={policy.minCreditScore.toString()}
    >
      {policy.minCreditScore}
    </span>,

    // Max Loan Amount
    <span
      key="maxLoanAmount"
      className="text-xs sm:text-sm font-mono text-gray-800 whitespace-nowrap"
      title={policy.maxLoanAmount.toString()}
    >
      ₹
      {policy.maxLoanAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>,

    // Status
    <span
      key="status"
      className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${
        policy.isActive ? "text-green-600" : "text-red-600"
      }`}
    >
      {policy.isActive ? "Active" : "Inactive"}
    </span>,

    // Created At
    <span
      key="createdAt"
      className="text-xs sm:text-sm text-gray-600 whitespace-nowrap"
      title={new Date(policy.createdAt).toLocaleString()}
    >
      {new Date(policy.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>,

    // Actions
    isLinkView ? (
      <Link
        key="actions"
        href={`/loan-policy/${policy.id}`}
        className="flex items-center justify-center space-x-1 px-2 py-1 min-w-[60px] bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <EyeIcon className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">View</span>
      </Link>
    ) : (
      <span key="no-action">-</span>
    ),
  ];

  return <GenericTableRow index={index} cells={cells} />;
}
