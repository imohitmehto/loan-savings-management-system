"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PageLayout,
  CardContainer,
  PageHeader,
} from "@/components/common/layout";
import LoanForm from "@/components/loan/loanForm/LoanForm";
import { createLoan } from "@/lib/api/loans";
import toast from "react-hot-toast";

export default function ApplyLoanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    try {
      const res = await createLoan(formData);
      toast.success(res.message || "Loan created successfully!");

      if (res.data?.id) {
        router.push(`/loans/${res.data.id}`);
      } else {
        console.error("No loan ID returned from API:", res);
      }
    } catch (err) {
      console.error("CreateLoanPage error:", err);
      toast.error("Failed to create loan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <CardContainer>
        <PageHeader title="Apply for Loan" />

        <LoanForm
          onSubmit={handleCreate}
          loading={loading}
          submitLabel="Submit Loan Form"
        />
      </CardContainer>
    </PageLayout>
  );
}
