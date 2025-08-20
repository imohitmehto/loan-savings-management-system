"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PageLayout,
  CardContainer,
  PageHeader,
} from "@/components/common/layout";
import LoanPolicyForm from "@/components/loan/loanPolicyForm/LoanPolicyForm";
import { fetchLoanPolicyById } from "@/lib/api/loanPolicies";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { LoanPolicy } from "@/types/LoanPolicy";

export default function ViewLoanPolicyPage() {
  const router = useRouter();
  const { id } = useParams();

  const [policy, setPolicy] = useState<LoanPolicy | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch loan policy by ID
  useEffect(() => {
    if (!id) return;

    async function loadPolicy() {
      setLoading(true);
      try {
        const data = await fetchLoanPolicyById(id as string);
        setPolicy(data);
      } catch (err) {
        console.error("Failed to load loan policy:", err);
        toast.error("Failed to load loan policy details.");
        router.push("/loan-policy");
      } finally {
        setLoading(false);
      }
    }

    loadPolicy();
  }, [id, router]);

  return (
    <PageLayout>
      <CardContainer>
        <PageHeader title="View Loan Policy" />

        {loading ? (
          <LoadingSpinner />
        ) : policy ? (
          <div className="space-y-6">
            {/* Read-only loan policy form */}
            <LoanPolicyForm initialValues={policy} readOnly />

            {/* Additional read-only info */}
            <div className="bg-gray-50 p-4 rounded-md shadow-sm space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Policy ID:</span>
                <span className="text-gray-900">{policy.id}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">
                  Interest Rate:
                </span>
                <span className="text-gray-900">
                  {policy.interestRate != null
                    ? `${policy.interestRate}%`
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">
                  Minimum Credit Score:
                </span>
                <span className="text-gray-900">{policy.minCreditScore}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">
                  Max Loan Amount:
                </span>
                <span className="text-gray-900">
                  ₹{policy.maxLoanAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Status:</span>
                <span
                  className={`text-gray-900 ${
                    policy.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {policy.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Created At:</span>
                <span className="text-gray-900">
                  {new Date(policy.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Updated At:</span>
                <span className="text-gray-900">
                  {new Date(policy.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No loan policy found.</p>
        )}
      </CardContainer>
    </PageLayout>
  );
}
