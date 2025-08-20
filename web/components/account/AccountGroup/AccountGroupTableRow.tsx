"use client";

import React from "react";
import { AccountGroup } from "@/types/AccountGroup";
import { EyeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import GenericTableRow from "@/components/common/table/GenericTableRow";

interface AccountGroupRowProps {
  group: AccountGroup;
  index: number;
}

export default function AccountGroupTableRow({
  group,
  index,
}: AccountGroupRowProps) {
  const renderAccounts = () => {
    if (Array.isArray(group.accounts)) {
      if (group.accounts.length === 0) return "0";
      const firstTwo = group.accounts.slice(0, 2).map((acc) => acc.name);
      return group.accounts.length > 2
        ? `${firstTwo.join(", ")} ...and ${group.accounts.length - 2} more`
        : firstTwo.join(", ");
    }
    return typeof group.accounts === "number" ? group.accounts : "-";
  };

  const cells = [
    // #
    <span key="index" className="text-sm text-gray-600">
      {index + 1}
    </span>,

    // Group Name
    <span key="name" className="font-medium text-gray-800">
      {group.name}
    </span>,

    // Description
    <span key="description" className="text-gray-600 text-sm">
      {group.description || "-"}
    </span>,

    // Accounts List
    <span key="accounts" className="text-center text-gray-600 text-sm">
      {renderAccounts()}
    </span>,

    // Actions
    <Link
      key="actions"
      href={`/account/group/${group.id}`}
      className="flex items-center justify-center space-x-1 px-2 py-1 min-w-[60px] 
                 bg-blue-600 text-white rounded hover:bg-blue-700 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      <EyeIcon className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">View</span>
    </Link>,
  ];

  return <GenericTableRow index={index} cells={cells} />;
}
