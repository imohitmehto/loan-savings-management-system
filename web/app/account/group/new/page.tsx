"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GroupForm from "@/components/account/AccountGroup/AccountGroupForm";
import { createAccountGroup } from "@/lib/api/accountGroups";
export default function CreateAccountGroupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** Handles form submission */
  async function handleCreate(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await createAccountGroup(formData);
      setSuccess("Account group created successfully!");
      router.push(`/group/new/${res.id}`);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create account group.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 lg:p-10 bg-white rounded-2xl shadow transition-all">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Create New Account Group
        </h1>

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

        <GroupForm
          onSubmit={handleCreate}
          loading={loading}
          submitLabel="Create Group"
        />
      </div>
    </main>
  );
}
