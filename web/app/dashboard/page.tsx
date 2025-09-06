"use client";

import { PageLayout, PageHeader } from "@/components/common/layout";
import AccountOverview from "@/components/dashboard/AccountOverview";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import RecentLoans from "@/components/dashboard/RecentLoans";
import FundAllocation from "@/components/dashboard/FundAllocation";

export default function DashboardPage() {
  return (
    <main>
      <PageHeader title="Dashboard" subtitle="Overview of system metrics" />
      <AccountOverview />
      <FundAllocation />
      <RecentTransactions />
      <RecentLoans />
    </main>
  );
}
