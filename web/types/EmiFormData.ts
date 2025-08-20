"use client";
export interface EmiFormData {
  amount: number;
  interestRate: number;
  interestFrequency: "DAY" | "WEEK" | "MONTH" | "YEAR";
  interestType: "FLAT" | "FIXED" | "MORTGAGE" | "REDUCING" | "ONE_TIME";
  term: number;
  termPeriod: "DAY" | "WEEK" | "MONTH" | "YEAR";
  firstPaymentDate: string;
  latePaymentPenalty: number;
}
