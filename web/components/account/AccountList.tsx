"use client";

import React from "react";
import GenericList from "@/components/common/table/GenericList";
import { Account } from "@/types/Account";
import { fetchAllAccounts } from "@/lib/api/accounts";
import AccountTable from "./AccountTable";

export default function AccountList({
  isLinkView = false,
}: {
  isLinkView?: boolean;
}) {
  return (
    <GenericList<Account>
      fetchData={fetchAllAccounts}
      filterFunction={(acc, filterText) =>
        [
          acc.accountNumber,
          `${acc.firstName} ${acc.lastName}`,
          acc.status,
          acc.groupName,
        ]
          .join(" ")
          .toLowerCase()
          .includes(filterText.toLowerCase())
      }
      renderList={(accounts) => (
        <AccountTable accounts={accounts} isLinkView={isLinkView} />
      )}
    />
  );
}
