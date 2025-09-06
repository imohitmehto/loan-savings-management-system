"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PageLayout,
  CardContainer,
  PageHeader,
} from "@/components/common/layout";
import LoanPolicyForm from "@/components/loan/loan-PolicyForm/LoanPolicyForm";
import { createLoanPolicy } from "@/lib/api/loanPolicies";
import toast from "react-hot-toast";

export default function CreateLoanPolicyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    try {
      const res = await createLoanPolicy(formData);
      toast.success(res.message || "Loan Policy created successfully!");
      if (res?.id) {
        router.push(`/loans/policies/${res.id}`);
      } else {
        console.error("No loan policy ID returned from API:", res);
      }
    } catch (err) {
      console.error("CreateLoanPolicyPage error:", err);
      toast.error("Failed to create loan policy.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <CardContainer>
        <PageHeader title="Create New Loan Policy" />

        <LoanPolicyForm
          onSubmit={handleCreate}
          loading={loading}
          submitLabel="Create Loan Policy"
        />
      </CardContainer>
    </PageLayout>
  );
}
