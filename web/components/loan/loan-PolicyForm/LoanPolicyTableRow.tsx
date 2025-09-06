"use client";

import { LoanPolicy } from "@/types/LoanPolicy";
import { EyeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import GenericTableRow from "@/components/common/table/GenericTableRow";
import StatusIcon, { statusTextColorMap } from "@/components/common/StatusIcon";

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
  const statusValue = policy.isActive ? "ACTIVE" : "INACTIVE";
  const statusTextColor = statusTextColorMap[statusValue] || "text-yellow-600";

  const statusCell = (
    <>
      <StatusIcon status={statusValue} />
      <span
        className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${statusTextColor} capitalize`}
      >
        {policy.isActive ? "Active" : "Inactive"}
      </span>
    </>
  );

  const cells = [
    <span
      key="index"
      className="text-[10px] sm:text-sm font-mono text-gray-700 whitespace-nowrap"
    >
      {index + 1}
    </span>,

    <span
      key="name"
      className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap"
      title={policy.name}
    >
      {policy.name}
    </span>,

    <span
      key="interestType"
      className="text-xs sm:text-sm text-gray-700 truncate max-w-[140px] sm:max-w-xs"
      title={policy.interestType || ""}
    >
      {policy.interestType || "-"}
    </span>,

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

    <span
      key="maxLoanAmount"
      className="text-xs sm:text-sm font-mono text-gray-800 whitespace-nowrap"
      title={policy.maxAmount.toString()}
    >
      ₹
      {policy.maxAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>,

    <div key="status" className="flex items-center space-x-2">
      {statusCell}
    </div>,

    isLinkView ? (
      <Link
        key="actions"
        href={`/loans/policies/${policy.id}`}
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
