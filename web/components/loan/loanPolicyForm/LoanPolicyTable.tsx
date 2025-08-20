"use client";

import GenericTable from "@/components/common/table/GenericTable";
import LoanPolicyTableRow from "./LoanPolicyTableRow";
import { LoanPolicy } from "@/types/LoanPolicy";

export default function LoanPolicyTable({
  policies,
  isLinkView,
}: {
  policies: LoanPolicy[];
  isLinkView?: boolean;
}) {
  const columns = [
    { label: "#" },
    { label: "Name", className: "whitespace-nowrap" },
    { label: "Description" },
    { label: "Interest Rate" },
    { label: "Min Credit Score" },
    { label: "Max Loan Amount" },
    { label: "Status" },
    { label: "Created At", className: "whitespace-nowrap" },
    { label: "Actions", className: "whitespace-nowrap" },
  ];

  return (
    <GenericTable
      columns={columns}
      data={policies}
      renderRow={(policy, index) => (
        <LoanPolicyTableRow
          key={policy.id}
          policy={policy}
          index={index}
          isLinkView={isLinkView}
        />
      )}
    />
  );
}
