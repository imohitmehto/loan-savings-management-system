"use client";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchAllLoans } from "@/lib/api/loans";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorState from "../common/ErrorState";

export default function RecentLoans() {
  const { data: loans, loading, error } = useFetchData(fetchAllLoans);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="bg-white p-6 rounded shadow overflow-auto">
      <h2 className="font-semibold text-lg mb-3">Recent Loans</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-2">Loan No.</th>
            <th className="text-left p-2">Borrower</th>
            <th className="text-left p-2">Principal</th>
          </tr>
        </thead>
        <tbody>
          {loans?.slice(0, 5).map((loan) => (
            <tr key={loan.id}>
              <td className="p-2">{loan.loanNumber}</td>
              <td className="p-2">
                {loan.user?.firstName} {loan.user?.lastName}
              </td>
              <td className="p-2">₹{loan.principal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
