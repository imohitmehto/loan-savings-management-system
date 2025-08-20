import GenericTable from "@/components/common/table/GenericTable";
import TransactionTableRow from "./TransactionTableRow";
import { Transaction } from "@/types/Transaction";

export default function TransactionTable({
  transactions,
  isLinkView,
}: {
  transactions: Transaction[];
  isLinkView?: boolean;
}) {
  const columns = [
    { label: "#" },
    { label: "Account", className: "whitespace-nowrap" },
    { label: "Type" },
    { label: "Amount" },
    { label: "Status" },
    { label: "Created By" },
    { label: "Created At", className: "whitespace-nowrap" },
    { label: "Actions", className: "whitespace-nowrap" },
  ];

  return (
    <GenericTable
      columns={columns}
      data={transactions}
      renderRow={(transaction, index) => (
        <TransactionTableRow
          key={transaction.id}
          transaction={transaction}
          index={index}
          isLinkView={isLinkView}
        />
      )}
    />
  );
}
