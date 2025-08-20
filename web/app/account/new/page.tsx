"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PageLayout,
  CardContainer,
  PageHeader,
} from "@/components/common/layout";
import AccountForm from "@/components/account/AccountForm/AccountForm";
import { createAccount } from "@/lib/api/accounts";
import toast from "react-hot-toast";

export default function CreateAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    try {
      const res = await createAccount(formData);
      toast.success(res.message || "Account created successfully!");
      if (res.data?.id) {
        router.push(`/account/${res.data.id}`);
      } else {
        console.error("No account ID returned from API:", res);
      }
    } catch (err) {
      console.error("CreateAccountPage error:", err);
      toast.error("Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <CardContainer>
        <PageHeader title="Create New Account" />

        <AccountForm
          onSubmit={handleCreate}
          loading={loading}
          submitLabel="Create Account"
        />
      </CardContainer>
    </PageLayout>
  );
}
