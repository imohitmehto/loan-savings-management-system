"use client";

import React from "react";
import NavigationButton from "@/components/common/button/NavigationButton";
import { LoanCalculator } from "@/components/loan/emi-calculator/LoanCalculator";

export default function LoanCalculatorPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8 lg:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight"
              tabIndex={-1}
            >
              Loan Calculator
            </h1>
            <p className="mt-1 text-sm sm:text-base lg:text-lg text-gray-600 max-w-xl">
              Calculate your estimated loan monthly payment.
            </p>
          </div>
          <NavigationButton route="/loans" label="&#8592; All Loans" />
        </header>

        <section
          className="bg-white shadow-md rounded-lg p-4 sm:p-6 lg:p-8 transition-opacity duration-500 animate-fade-in overflow-auto"
          aria-label="Loan Calculator Section"
        >
          <LoanCalculator />
        </section>
      </div>
    </main>
  );
}
