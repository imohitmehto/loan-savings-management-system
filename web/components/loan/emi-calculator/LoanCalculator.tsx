"use client";

import React, { useState, useEffect } from "react";
import TextField from "@/components/common/fields/TextField";
import SelectField from "@/components/common/fields/SelectField";
import { fetchAllLoanPolicies } from "@/lib/api/loanPolicies";
import {
  InterestOptions,
  TermPeriodOptions,
} from "@/utils/enums/loan-policy-enum";
import { LoanPolicy } from "@/types/LoanPolicy";

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [interestType, setInterestType] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [termPeriod, setTermPeriod] = useState("months");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const [policies, setPolicies] = useState<Partial<LoanPolicy>[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState("");

  useEffect(() => {
    async function fetchPolicies() {
      try {
        const data = await fetchAllLoanPolicies();
        setPolicies(data);
      } catch (error) {
        console.error("Failed to fetch policies:", error);
      }
    }
    fetchPolicies();
  }, []);

  const onPolicyChange = (policyId: string) => {
    setSelectedPolicyId(policyId);
    if (!policyId) {
      setInterestRate("");
      setInterestType("");
      setTermPeriod("months");
      return;
    }
    const policy = policies.find((p) => p.id === policyId);
    if (policy) {
      setInterestRate(policy.interestRate?.toString() ?? "");
      setInterestType(policy.interestType ?? "");
      setTermPeriod(policy.termPeriod ?? "months");
    }
  };

  const onInterestRateChange = (value: string) => {
    setInterestRate(value);
    if (selectedPolicyId) {
      setSelectedPolicyId("");
    }
  };

  const onInterestTypeChange = (value: string) => {
    setInterestType(value);
    if (selectedPolicyId) {
      setSelectedPolicyId("");
    }
  };

  const onTermPeriodChange = (value: string) => {
    setTermPeriod(value || "months");
    if (selectedPolicyId) {
      setSelectedPolicyId("");
    }
  };

  const calculatePayment = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const term = parseFloat(loanTerm);

    if (!(principal > 0 && rate > 0 && term > 0)) {
      setMonthlyPayment(null);
      return;
    }

    let months: number;
    if (termPeriod === "years") {
      months = term * 12;
    } else {
      months = term;
    }

    if (interestType === "fixed") {
      const monthlyRate = rate / 12;
      const payment =
        (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
      setMonthlyPayment(payment);
    } else if (interestType === "variable") {
      const payment = (principal + principal * rate) / months;
      setMonthlyPayment(payment);
    } else {
      setMonthlyPayment(null);
    }
  };

  return (
    <form
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        calculatePayment();
      }}
      noValidate
    >
      <h2 className="text-xl font-semibold text-gray-900">Loan Calculator</h2>

      <TextField
        label="Loan Amount"
        name="loanAmount"
        id="loanAmount"
        type="number"
        inputMode="decimal"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
        required
      />

      <SelectField
        label="Select Policy"
        id="selectPolicy"
        value={selectedPolicyId}
        onChange={(e) => onPolicyChange(e.target.value)}
        options={[
          ...policies.map((policy) => ({
            value: policy.id ?? "",
            label: policy.name ?? "",
          })),
        ]}
      />

      <TextField
        label="Interest Rate (%)"
        name="interestRate"
        id="interestRate"
        type="number"
        inputMode="decimal"
        value={interestRate}
        onChange={(e) => onInterestRateChange(e.target.value)}
        required
      />

      <SelectField
        label="Interest Type"
        id="interestType"
        value={interestType}
        onChange={(e) => onInterestTypeChange(e.target.value)}
        options={InterestOptions}
        required
      />

      <TextField
        label="Loan Term"
        name="loanTerm"
        id="loanTerm"
        type="number"
        inputMode="numeric"
        value={loanTerm}
        onChange={(e) => setLoanTerm(e.target.value)}
        required
      />

      <SelectField
        label="Term Period"
        id="termPeriod"
        value={termPeriod}
        onChange={(e) => onTermPeriodChange(e.target.value)}
        options={TermPeriodOptions}
        required
      />

      <button
        type="submit"
        className="w-full py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700"
      >
        Calculate
      </button>

      {monthlyPayment !== null && (
        <div className="mt-4 p-4 bg-green-50 text-green-800 rounded">
          <p>
            Estimated Monthly Payment:{" "}
            <strong>${monthlyPayment.toFixed(2)}</strong>
          </p>
        </div>
      )}
    </form>
  );
}
