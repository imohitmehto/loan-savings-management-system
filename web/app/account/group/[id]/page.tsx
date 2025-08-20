"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PageLayout,
  CardContainer,
  PageHeader,
} from "@/components/common/layout";
import {
  fetchAccountGroupById,
  updateAccountGroupById,
} from "@/lib/api/accountGroups";
import AccountGroupForm, {
  AccountGroupFormValues,
} from "@/components/account/AccountGroup/AccountGroupForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { PrimaryButton, SecondaryButton } from "@/components/common/button";

export default function AccountGroupDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id as string;

  const [group, setGroup] = useState<AccountGroupFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch group data
  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    fetchAccountGroupById(groupId)
      .then((data) => {
        setGroup(data);
        setLoading(false);
      })
      .catch((error) => {
        setErr(error?.message || "Failed to fetch account group");
        setLoading(false);
      });
  }, [groupId]);

  if (loading) return <LoadingSpinner />;
  if (err || !group)
    return <EmptyState message={err ?? "No account group found."} />;

  // Save handler
  const handleUpdate = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await updateAccountGroupById(groupId, formData);
      setIsEditing(false);
      const refreshed = await fetchAccountGroupById(groupId);
      setGroup(refreshed);
      setSuccess("Account group updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
      setError("Failed to update group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <CardContainer>
        <PageHeader
          title="Account Group Details"
          rightContent={
            <div className="flex gap-3">
              {!isEditing && (
                <SecondaryButton onClick={() => router.back()} label="Back" />
              )}
              {!isEditing ? (
                <PrimaryButton
                  onClick={() => setIsEditing(true)}
                  label="Edit"
                />
              ) : (
                <SecondaryButton
                  onClick={() => setIsEditing(false)}
                  label="Cancel"
                />
              )}
            </div>
          }
        />

        {/* Status Messages */}
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

        {/* Account Group Form */}
        <AccountGroupForm
          initialValues={group || undefined}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
          loading={loading}
          readOnly={!isEditing}
        />
      </CardContainer>
    </PageLayout>
  );
}
