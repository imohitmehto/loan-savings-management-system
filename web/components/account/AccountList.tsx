"use client";
import React, { useEffect, useState } from "react";
import GenericList from "@/components/common/table/GenericList";
import { fetchAllAccounts } from "@/lib/api/accounts";
import AccountTable from "./AccountTable";
import { useSearchParams } from "next/navigation";

export default function AccountList({ isLinkView = false }) {
  const searchParams = useSearchParams();
  const initialStatusFilter = searchParams.get("status") || "";
  const [filterText, setFilterText] = useState(initialStatusFilter);

  useEffect(() => {
    setFilterText(initialStatusFilter);
  }, [initialStatusFilter]);

  return (
    <GenericList
      fetchData={fetchAllAccounts}
      filterFunction={(acc, filter) =>
        [
          acc.accountNumber,
          `${acc.firstName} ${acc.lastName}`,
          acc.status,
          acc.groupName,
        ]
          .join(" ")
          .toLowerCase()
          .includes(filter.toLowerCase())
      }
      renderList={(accounts) => (
        <AccountTable accounts={accounts} isLinkView={isLinkView} />
      )}
      filterText={filterText}
      setFilterText={setFilterText}
    />
  );
}
