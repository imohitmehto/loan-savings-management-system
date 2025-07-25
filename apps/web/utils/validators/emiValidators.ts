import { EmiFormData } from '@/types/EmiFormData';

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

  // Basic checks
  if (!amount || amount <= 0) return false;
  if (interestRate === undefined || interestRate < 0) return false;
  if (!term || term <= 0) return false;
  if (!interestFrequency) return false;
  if (!interestType) return false;
  if (!termPeriod) return false;
  if (!firstPaymentDate || isNaN(Date.parse(firstPaymentDate))) return false;
  if (latePaymentPenalty === undefined || latePaymentPenalty < 0) return false;

  return true;
}