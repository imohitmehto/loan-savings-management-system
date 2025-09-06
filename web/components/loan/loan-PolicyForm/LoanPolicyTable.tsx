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
    { label: "Interest Type" },
    { label: "Interest Rate" },
    { label: "Max Loan Amount" },
    { label: "Status" },
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
