"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PageLayout,
  CardContainer,
  PageHeader,
} from "@/components/common/layout";
import TransactionForm from "@/components/transaction/TransactionForm";
import { createTransaction } from "@/lib/api/transactions";
import toast from "react-hot-toast";

export default function CreateTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    try {
      const res = await createTransaction(formData);
      toast.success(res.message || "Transaction created successfully!");

      if (res.data?.id) {
        router.push(`/transaction/${res.data.id}`);
      } else {
        console.error("No transaction ID returned from API:", res);
      }
    } catch (err) {
      console.error("CreateTransactionPage error:", err);
      toast.error("Failed to create transaction.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <CardContainer>
        <PageHeader title="Create New Transaction" />

        <TransactionForm
          onSubmit={handleCreate}
          loading={loading}
          submitLabel="Create Transaction"
        />
      </CardContainer>
    </PageLayout>
  );
}
