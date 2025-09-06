"use client";

import GenericList from "@/components/common/table/GenericList";
import { fetchAllLoanPolicies } from "@/lib/api/loanPolicies";
import LoanPolicyTable from "./LoanPolicyTable";
import { LoanPolicy } from "@/types/LoanPolicy";

export default function LoanPolicyList({
  isLinkView = false,
}: {
  isLinkView?: boolean;
}) {
  return (
    <GenericList<LoanPolicy>
      fetchData={fetchAllLoanPolicies}
      filterFunction={(data, filterText) =>
        [
          data.name, // Policy name
          data.description || "", // Description
          data.interestRate ? `${data.interestRate}` : "", // Interest rate
          data.maxAmount.toString(), // Maximum loan amount
          data.isActive ? "active" : "inactive", // Status
        ]
          .join(" ")
          .toLowerCase()
          .includes(filterText.toLowerCase())
      }
      renderList={(data) => (
        <LoanPolicyTable policies={data} isLinkView={isLinkView} />
      )}
    />
  );
}
