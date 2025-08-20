"use client";

import React from "react";
import { Account } from "@/types/Account";
import StatusIcon from "./StatusIcon";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/solid";
import GenericTableRow from "@/components/common/table/GenericTableRow";
import Image from "next/image";

interface AccountTableRowProps {
  account: Account;
  index: number;
  isLinkView?: boolean;
}

export default function AccountTableRow({
  account,
  index,
  isLinkView,
  // onViewClick,
}: AccountTableRowProps) {
  const imageCell = account.imageUrl ? (
    <Image
      src={account.imageUrl}
      alt={`${account.firstName} ${account.lastName}`}
      width={40} // use actual pixel width
      height={40} // use actual pixel height
      className="rounded-full object-cover border border-gray-300"
      style={{ width: "2.5rem", height: "2.5rem" }} // for tailwind compatibility
      priority={false} // loading="lazy" is default in Next.js
    />
  ) : (
    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-semibold text-xs sm:text-base select-none">
      {`${account.firstName?.[0] || ""}${account.lastName?.[0] || ""}`.toUpperCase()}
    </div>
  );

  const statusCell = (
    <>
      <StatusIcon status={account.status} />
      <span
        className={`font-semibold ${
          account.status === "ACTIVE"
            ? "text-green-600"
            : account.status === "INACTIVE"
              ? "text-yellow-600"
              : "text-red-600"
        }`}
      >
        {account.status}
      </span>
    </>
  );

  const cells = [
    // #
    <span
      key="index"
      className="text-[10px] sm:text-sm font-mono text-gray-700 whitespace-nowrap"
    >
      {index + 1}
    </span>,

    // Image
    React.isValidElement(imageCell) ? (
      React.cloneElement(imageCell, { key: "image" })
    ) : (
      <React.Fragment key="image">{imageCell}</React.Fragment>
    ),

    // Account Number
    <span
      key="accountNumber"
      className="text-xs sm:text-sm font-mono text-gray-700 truncate max-w-[140px]"
      title={account.accountNumber}
    >
      {account.accountNumber}
    </span>,

    // Name
    <span
      key="name"
      className="text-sm font-medium text-gray-900 truncate max-w-[140px] sm:max-w-xs"
      title={`${account.firstName} ${account.lastName}`}
    >
      {`${account.firstName} ${account.lastName}`}
    </span>,

    // Group
    <span
      key="group"
      className="text-xs sm:text-sm text-gray-700 truncate max-w-[120px]"
      title={account.groupName || "N/A"}
    >
      {account.groupName || "N/A"}
    </span>,

    // Status
    <div key="status" className="flex items-center space-x-2">
      {statusCell}
    </div>,

    // Created At
    <span
      key="createdAt"
      className="text-xs sm:text-sm text-gray-600 whitespace-nowrap"
      title={new Date(account.createdAt).toLocaleString()}
    >
      {new Date(account.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>,

    // Actions
    <Link
      key="actions"
      href={`/account/${account.id}`}
      className="flex items-center justify-center space-x-1 px-2 py-1 min-w-[60px] bg-blue-600 text-white rounded hover:bg-blue-700 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      <EyeIcon className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">View</span>
    </Link>,
  ];

  return <GenericTableRow index={index} cells={cells} />;
}
