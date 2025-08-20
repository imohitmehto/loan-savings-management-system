"use client";
import { Transaction } from "@/types/Transaction";
import { EyeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import GenericTableRow from "@/components/common/table/GenericTableRow";

interface TransactionTableRowProps {
  transaction: Transaction;
  index: number;
  isLinkView?: boolean;
}

export default function TransactionTableRow({
  transaction,
  index,
  isLinkView,
}: TransactionTableRowProps) {
  const cells = [
    // Row Index
    <span
      key="index"
      className="text-[10px] sm:text-sm font-mono text-gray-700 whitespace-nowrap"
    >
      {index + 1}
    </span>,

    // Account Info
    <span
      key="account"
      className="text-xs sm:text-sm text-gray-700 truncate max-w-[140px] sm:max-w-xs"
      title={
        transaction.account
          ? `${transaction.account.firstName || ""} ${transaction.account.lastName || ""} (${transaction.account.accountNumber})`
          : transaction.accountId
      }
    >
      {transaction.account
        ? `${transaction.account.firstName || ""} ${transaction.account.lastName || ""} (${transaction.account.accountNumber})`
        : transaction.accountId}
    </span>,

    // Transaction Type
    <span
      key="type"
      className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap"
      title={transaction.type}
    >
      {transaction.type}
    </span>,

    // Amount
    <span
      key="amount"
      className="text-xs sm:text-sm font-mono text-gray-800 whitespace-nowrap"
      title={transaction.amount.toString()}
    >
      ₹
      {transaction.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>,

    // Status
    <span
      key="status"
      className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${
        transaction.status === "APPROVED"
          ? "text-green-600"
          : transaction.status === "PENDING"
            ? "text-yellow-600"
            : "text-red-600"
      }`}
    >
      {transaction.status}
    </span>,

    // Created By
    <span
      key="createdBy"
      className="text-xs sm:text-sm text-gray-700 truncate max-w-[140px]"
      title={transaction.createdBy?.name || transaction.createdById}
    >
      {transaction.createdBy?.name || transaction.createdById}
    </span>,

    // Created At
    <span
      key="createdAt"
      className="text-xs sm:text-sm text-gray-600 whitespace-nowrap"
      title={new Date(transaction.createdAt).toLocaleString()}
    >
      {new Date(transaction.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>,

    // Actions
    <Link
      key="actions"
      href={`/transaction/${transaction.id}`}
      className="flex items-center justify-center space-x-1 px-2 py-1 min-w-[60px] bg-blue-600 text-white rounded hover:bg-blue-700 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      <EyeIcon className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">View</span>
    </Link>,
  ];

  return <GenericTableRow index={index} cells={cells} />;
}
