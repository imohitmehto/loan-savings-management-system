// src/utils/formatIndianCurrency.ts

/**
 * Format a number into Indian numbering system (e.g. 1000000 -> "10,00,000")
 * Keeps only digits from input.
 */
export const formatIndianCurrency = (value: string): string => {
  if (!value) return "";
  const num = value.replace(/\D/g, ""); // keep only digits
  if (!num) return "";
  return num.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
};
