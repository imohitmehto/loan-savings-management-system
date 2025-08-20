"use client";
import { PageLayout } from "@/components/common/layout";
import { EmiCalculator } from "@/components/emi-calculator/EmiCalculator";

export default function LoanCalculatorPage() {
  return (
    <PageLayout>
      <EmiCalculator />
    </PageLayout>
  );
}
