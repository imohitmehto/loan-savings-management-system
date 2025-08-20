"use client";

import GenericTable from "@/components/common/table/GenericTable";
import AccountTableRow from "./AccountTableRow";
import { Account } from "@/types/Account";

export default function AccountTable({
  accounts,
  isLinkView,
}: {
  accounts: Account[];
  isLinkView?: boolean;
}) {
  const columns = [
    { label: "#" },
    { label: "Image" },
    { label: "A/C No." },
    { label: "Name" },
    { label: "Group" },
    { label: "Status" },
    { label: "Created At", className: "whitespace-nowrap" },
    { label: "Actions", className: "whitespace-nowrap" },
  ];

  return (
    <GenericTable
      columns={columns}
      data={accounts}
      renderRow={(account, index) => (
        <AccountTableRow
          key={account.id}
          account={account}
          index={index}
          isLinkView={isLinkView}
        />
      )}
    />
  );
}
