"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PageLayout,
  CardContainer,
  PageHeader,
} from "@/components/common/layout";
import TransactionForm from "@/components/transaction/TransactionForm";
import { fetchTransactionById } from "@/lib/api/transactions";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import toast from "react-hot-toast";

export default function ViewTransactionPage() {
  const router = useRouter();
  const { id } = useParams();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch transaction by ID
  useEffect(() => {
    if (!id) return;

    async function loadTransaction() {
      setLoading(true);
      try {
        const data = await fetchTransactionById(id as string);
        setTransaction(data);
      } catch (err) {
        console.error("Failed to load transaction:", err);
        toast.error("Failed to load transaction details.");
        router.push("/transaction");
      } finally {
        setLoading(false);
      }
    }

    loadTransaction();
  }, [id, router]);

  return (
    <PageLayout>
      <CardContainer>
        <PageHeader title="View Transaction" />

        {loading ? (
          <LoadingSpinner />
        ) : transaction ? (
          <div className="space-y-6">
            <TransactionForm initialValues={transaction} readOnly />

            {/* Additional read-only info that’s not in TransactionForm */}
            <div className="bg-gray-50 p-4 rounded-md shadow-sm space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">
                  Transaction ID:
                </span>
                <span className="text-gray-900">{transaction.id}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Created By:</span>
                <span className="text-gray-900">
                  {transaction.createdBy?.name || transaction.createdById}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Created At:</span>
                <span className="text-gray-900">
                  {new Date(transaction.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No transaction found.</p>
        )}
      </CardContainer>
    </PageLayout>
  );
}
