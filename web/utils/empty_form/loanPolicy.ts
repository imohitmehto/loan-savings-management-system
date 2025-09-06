import { LoanPolicy } from "@/types/LoanPolicy";
import { FeeType, InterestType, TermPeriod } from "../enums/loan-policy-enum";

export const emptyForm: Partial<LoanPolicy> = {
  name: "",
  description: null,
  minAmount: 0,
  maxAmount: 0,
  interestType: InterestType.FIXED, // or some default from enum
  interestRate: 0,
  termPeriod: TermPeriod.MONTHS, // or some default from enum
  maxTerm: 0,
  applicationFeeType: FeeType.FLAT, // default
  applicationFee: 0,
  processingFeeType: FeeType.FLAT,
  processingFee: 0,
  latePaymentPenaltiesType: FeeType.FLAT,
  latePaymentPenalties: 0,
  rules: [""],
  isActive: true,
};
