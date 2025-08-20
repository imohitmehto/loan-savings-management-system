"use client";

import React from "react";
import GenericList from "@/components/common/table/GenericList";
import { fetchAllAccountGroup } from "@/lib/api/accountGroups";
import AccountGroupTable from "./AccountGroupTable";
import type { AccountGroup } from "@/types/AccountGroup";

export default function AccountGroupList() {
  return (
    <GenericList<AccountGroup>
      fetchData={fetchAllAccountGroup}
      filterFunction={(group, filterText) =>
        `${group.name} ${group.description ?? ""}`
          .toLowerCase()
          .includes(filterText.toLowerCase())
      }
      renderList={(groups) => <AccountGroupTable groups={groups} />}
    />
  );
}
