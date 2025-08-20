"use client";

import GenericTable from "@/components/common/table/GenericTable";
import AccountGroupTableRow from "./AccountGroupTableRow";
import { AccountGroup } from "@/types/AccountGroup";

export default function AccountGroupTable({
  groups,
}: {
  groups: AccountGroup[];
}) {
  const columns = [
    { label: "#" },
    { label: "Group Name" },
    { label: "Description" },
    { label: "Accounts Count", className: "text-center" },
    { label: "Actions", className: "text-right" },
  ];

  return (
    <GenericTable
      columns={columns}
      data={groups}
      renderRow={(group, index) => (
        <AccountGroupTableRow key={group.id} group={group} index={index} />
      )}
    />
  );
}
