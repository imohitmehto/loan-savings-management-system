"use client";

import GenericList from "@/components/common/table/GenericList";
import { fetchAllTransactions } from "@/lib/api/transactions";
import TransactionTable from "./TransactionTable";
import { Transaction } from "@/types/Transaction";

export default function AccountList({
  isLinkView = false,
}: {
  isLinkView?: boolean;
}) {
  return (
    <GenericList<Transaction>
      fetchData={fetchAllTransactions}
      filterFunction={(data, filterText) =>
        [
          data.accountNumber,
          `${data.firstName} ${data.lastName}`,
          data.status,
          data.groupName,
        ]
          .join(" ")
          .toLowerCase()
          .includes(filterText.toLowerCase())
      }
      renderList={(data) => (
        <TransactionTable transactions={data} isLinkView={isLinkView} />
      )}
    />
  );
}
