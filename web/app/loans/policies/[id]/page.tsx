"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PageLayout,
  CardContainer,
  PageHeader,
} from "@/components/common/layout";
import LoanPolicyForm from "@/components/loan/loan-PolicyForm/LoanPolicyForm";
import {
  fetchLoanPolicyById,
  updateLoanPolicyById,
  deleteLoanPolicyById,
} from "@/lib/api/loanPolicies";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { SecondaryButton } from "@/components/common/button";
import { LoanPolicy } from "@/types/LoanPolicy";
import { CheckIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function ViewLoanPolicyPage() {
  const router = useRouter();
  const { id } = useParams();

  const [policy, setPolicy] = useState<LoanPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadPolicy() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLoanPolicyById(id as string);
        setPolicy(data);
      } catch (err) {
        console.error("Failed to load loan policy:", err);
        setError("Failed to load loan policy details.");
      } finally {
        setLoading(false);
      }
    }

    loadPolicy();
  }, [id]);

  // Toggle active/inactive status
  const handleToggleActive = async () => {
    if (!policy || !id) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("isActive", (!policy.isActive).toString());

      await updateLoanPolicyById(id as string, formData);
      const refreshed = await fetchLoanPolicyById(id as string);
      setPolicy(refreshed);
      const statusText = refreshed.isActive ? "Active" : "Inactive";
      setSuccess(`Loan policy marked as ${statusText}`);

      toast.success(`Loan policy marked as ${statusText}`);
    } catch (err) {
      console.error("Toggle active status failed", err);
      const msg = "Failed to update loan policy status.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Delete loan policy
  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this loan policy?")) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteLoanPolicyById(id as string);
      toast.success("Loan policy deleted successfully.");
      router.push("/loans/policies");
    } catch (err) {
      console.error("Delete failed", err);
      const msg = "Failed to delete loan policy.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <PageLayout>
        <CardContainer>
          <PageHeader title="View Loan Policy" />
          <p className="text-center text-red-600">{error}</p>
        </CardContainer>
      </PageLayout>
    );

  if (!policy)
    return (
      <PageLayout>
        <CardContainer>
          <PageHeader title="View Loan Policy" />
          <p className="text-center text-gray-500">No loan policy found.</p>
        </CardContainer>
      </PageLayout>
    );

  return (
    <PageLayout>
      <CardContainer>
        <PageHeader
          title="View Loan Policy"
          rightContent={
            <div className="flex gap-3 items-center">
              <SecondaryButton onClick={() => router.back()} label="Back" />

              <button
                onClick={handleToggleActive}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 transition ${
                  policy.isActive
                    ? "bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-yellow-300"
                    : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                }`}
                aria-pressed={policy.isActive}
                aria-label={
                  policy.isActive
                    ? "Mark policy as inactive"
                    : "Mark policy as active"
                }
              >
                {policy.isActive ? (
                  <>
                    <XMarkIcon className="h-5 w-5" />
                    Mark Inactive
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5" />
                    Mark Active
                  </>
                )}
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                aria-label="Delete Loan Policy"
                title="Delete Loan Policy"
              >
                <TrashIcon className="h-5 w-5" />
                Delete
              </button>
            </div>
          }
        />

        {success && (
          <div className="mb-4 text-green-600 font-semibold text-center">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 text-red-600 font-semibold text-center">
            {error}
          </div>
        )}

        <LoanPolicyForm
          initialValues={policy}
          readOnly={true}
          submitLabel="Save Changes"
          loading={loading}
        />
      </CardContainer>
    </PageLayout>
  );
}
