"use client";

import { PageLayout, PageHeader } from "@/components/common/layout";
import AccountsOverview from "@/components/dashboard/AccountsOverview";
import AccountGroupsOverview from "@/components/dashboard/AccountGroupsOverview";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import RecentLoans from "@/components/dashboard/RecentLoans";
import SalesAnalyticsChart from "@/components/dashboard/SalesAnalyticsChart";
import LoanAnalyticsChart from "@/components/dashboard/LoanAnalyticsChart";

export default function DashboardPage() {
  return (
    <PageLayout>
      <PageHeader title="Dashboard" subtitle="Overview of system metrics" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top summaries */}
        <AccountsOverview />
        <AccountGroupsOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Analytics */}
        <SalesAnalyticsChart />
        <LoanAnalyticsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tables */}
        <RecentTransactions />
        <RecentLoans />
      </div>
    </PageLayout>
  );
}
