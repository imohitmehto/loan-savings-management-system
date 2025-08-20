"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PageLayout,
  CardContainer,
  PageHeader,
} from "@/components/common/layout";
import LoanForm from "@/components/loan/loanForm/LoanForm";
import { fetchLoanById } from "@/lib/api/loans";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { Loan } from "@/types/Loan";

export default function ViewLoanPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch loan by ID
  useEffect(() => {
    if (!id) return;

    async function loadLoan() {
      setLoading(true);
      try {
        const data = await fetchLoanById(id as string);
        setLoan(data);
      } catch (err) {
        console.error("Failed to load loan:", err);
        toast.error("Failed to load loan details.");
        router.push("/loan");
      } finally {
        setLoading(false);
      }
    }

    loadLoan();
  }, [id, router]);

  return (
    <PageLayout>
      <CardContainer>
        <PageHeader title="View Loan" />

        {loading ? (
          <LoadingSpinner />
        ) : loan ? (
          <div className="space-y-6">
            {/* Read-only loan form */}
            <LoanForm initialValues={loan} readOnly />

            {/* Additional read-only info */}
            <div className="bg-gray-50 p-4 rounded-md shadow-sm space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Loan ID:</span>
                <span className="text-gray-900">{loan.id}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Borrower:</span>
                <span className="text-gray-900">
                  {loan.user
                    ? `${loan.user.firstName || ""} ${loan.user.lastName || ""}`
                    : loan.userId}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Loan Type:</span>
                <span className="text-gray-900">
                  {loan.loanType?.name || loan.loanTypeId}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Policy:</span>
                <span className="text-gray-900">
                  {loan.policy?.name || loan.policyId}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Created At:</span>
                <span className="text-gray-900">
                  {new Date(loan.startDate).toLocaleDateString()} -{" "}
                  {new Date(loan.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Status:</span>
                <span className="text-gray-900">{loan.status}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No loan found.</p>
        )}
      </CardContainer>
    </PageLayout>
  );
}
