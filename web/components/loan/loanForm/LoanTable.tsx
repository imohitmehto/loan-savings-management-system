"use client";

import GenericTable from "@/components/common/table/GenericTable";
import LoanTableRow from "./LoanTableRow";
import { Loan } from "@/types/Loan";

export default function LoanTable({
  loans,
  isLinkView,
}: {
  loans: Loan[];
  isLinkView?: boolean;
}) {
  const columns = [
    { label: "#" },
    { label: "Loan Number", className: "whitespace-nowrap" },
    { label: "Borrower", className: "whitespace-nowrap" },
    { label: "Loan Type" },
    { label: "Principal" },
    { label: "Interest Rate" },
    { label: "EMI Amount" },
    { label: "Status" },
    { label: "Start Date", className: "whitespace-nowrap" },
    { label: "End Date", className: "whitespace-nowrap" },
    { label: "Actions", className: "whitespace-nowrap" },
  ];

  return (
    <GenericTable
      columns={columns}
      data={loans}
      renderRow={(loan, index) => (
        <LoanTableRow
          key={loan.id}
          loan={loan}
          index={index}
          isLinkView={isLinkView}
        />
      )}
    />
  );
}
