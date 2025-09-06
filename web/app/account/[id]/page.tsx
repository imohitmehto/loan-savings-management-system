"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PageLayout,
  CardContainer,
  PageHeader,
} from "@/components/common/layout";
import { fetchAccountById, updateAccountById } from "@/lib/api/accounts";
import AccountForm from "@/components/account/AccountForm/AccountForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { PrimaryButton, SecondaryButton } from "@/components/common/button";
import { Account } from "@/types/Account";

export default function AccountDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = params?.id as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch account data
  useEffect(() => {
    if (!accountId) return;
    setLoading(true);
    fetchAccountById(accountId)
      .then((data) => {
        setAccount(data);
        setLoading(false);
      })
      .catch((error) => {
        setErr(error?.message || "Failed to fetch account");
        setLoading(false);
      });
  }, [accountId]);

  if (loading) return <LoadingSpinner />;
  if (err || !account)
    return <EmptyState message={err ?? "No account found."} />;

  console.log("Account Data:", account);

  // Save handler
  const handleUpdate = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await updateAccountById(accountId, formData);
      setIsEditing(false);
      const refreshed = await fetchAccountById(accountId);
      setAccount(refreshed);
      setSuccess("Account updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
      setError("Failed to update account.");
    } finally {
      setLoading(false);
    }
  };

  // Close account handler
  const handleCloseAccount = async () => {
    if (!confirm("Are you sure you want to close this account?")) return;
    try {
      setLoading(true);
      await updateAccountById(accountId, {
        status: "CLOSED",
        closedAt: new Date().toISOString(),
      });
      const refreshed = await fetchAccountById(accountId);
      setAccount(refreshed);
      setSuccess("Account closed successfully!");
    } catch (err) {
      console.error("Close failed", err);
      setError("Failed to close account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <CardContainer>
        <PageHeader
          title="Account Details"
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

        {/* Status messages */}
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

        {/* Account Form */}
        <AccountForm
          byId={true}
          initialValues={account}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
          loading={loading}
          readOnly={!isEditing}
        />

        {/* ===== User Detail Section ===== */}
        <div className="mt-8 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">User Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>Account Number:</strong> {account.accountNumber}
            </p>
            {/* <p>
              <strong>Balance:</strong> ₹ {account.balance?.toFixed(2) ?? "0.00"}
            </p> */}
            <p>
              <strong>Status:</strong> {account.status}
            </p>
            <p>
              <strong>Opened At:</strong>{" "}
              {new Date(account.openedAt).toLocaleString()}
            </p>
            {account.closedAt && (
              <p>
                <strong>Closed At:</strong>{" "}
                {new Date(account.closedAt).toLocaleString()}
              </p>
            )}
            <p>
              <strong>Role:</strong> {account.user.role}
            </p>

            {/* User details */}
            <p>
              <strong>Username:</strong> {account.user?.userName}
            </p>
            <p>
              <strong>Password (raw):</strong> {account.user?.password}
            </p>
            <p>
              <strong>Verified:</strong>{" "}
              {account.user?.isVerified ? "Yes" : "No"}
            </p>
          </div>

          {/* Close Account Button */}
          {account.status !== "CLOSED" && (
            <div className="mt-6 text-right">
              <PrimaryButton
                label="Close Account"
                onClick={handleCloseAccount}
                className="bg-red-600 hover:bg-red-700"
              />
            </div>
          )}
        </div>
      </CardContainer>
    </PageLayout>
  );
}
