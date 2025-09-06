import { BadRequestException } from "@nestjs/common";

/**
 * Formats a phone number to E.164-style with Indian country code.
 * Accepts local 10-digit numbers or already prefixed 91 numbers.
 * Throws error if input is invalid or unsupported.
 *
 * @param phone - Raw input phone string
 * @returns Formatted phone number like "+919876543210"
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("91") && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  throw new BadRequestException("Invalid phone number format");
}
