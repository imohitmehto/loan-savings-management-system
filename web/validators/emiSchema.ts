"use client";
import { EmiFormData } from "@/types/EmiFormData";

/**
 * Validates EMI form input values.
 * Returns true if all required fields are present and valid.
 */
export function isValidForm(form: Partial<EmiFormData>): boolean {
  if (!form) return false;
  const {
    amount,
    interestRate,
    term,
    interestFrequency,
    interestType,
    termPeriod,
    firstPaymentDate,
    latePaymentPenalty,
  } = form;

  if (typeof amount !== "number" || amount <= 0) return false;
  if (typeof interestRate !== "number" || interestRate < 0) return false;
  if (typeof term !== "number" || term <= 0) return false;
  if (!["DAY", "WEEK", "MONTH", "YEAR"].includes(interestFrequency || ""))
    return false;
  if (
    !["FLAT", "FIXED", "MORTGAGE", "REDUCING", "ONE_TIME"].includes(
      interestType || "",
    )
  )
    return false;
  if (!["DAY", "WEEK", "MONTH", "YEAR"].includes(termPeriod || ""))
    return false;
  if (!firstPaymentDate || isNaN(Date.parse(firstPaymentDate))) return false;
  if (typeof latePaymentPenalty !== "number" || latePaymentPenalty < 0)
    return false;

  return true;
}
