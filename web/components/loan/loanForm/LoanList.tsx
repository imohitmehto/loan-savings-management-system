"use client";

import GenericList from "@/components/common/table/GenericList";
import { fetchAllLoans } from "@/lib/api/loans";
import LoanTable from "./LoanTable";
import { Loan } from "@/types/Loan";

export default function LoanList({
  isLinkView = false,
}: {
  isLinkView?: boolean;
}) {
  return (
    <GenericList<Loan>
      fetchData={fetchAllLoans}
      filterFunction={(data, filterText) =>
        [
          data.loanNumber, // example field
          `${data.user.firstName} ${data.user.lastName}`, // borrower name
          data.status,
          data.loanType,
        ]
          .join(" ")
          .toLowerCase()
          .includes(filterText.toLowerCase())
      }
      renderList={(data) => <LoanTable loans={data} isLinkView={isLinkView} />}
    />
  );
}
