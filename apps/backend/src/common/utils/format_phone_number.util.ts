import { BadRequestException } from "@nestjs/common";

/**
 * Utility class for handling phone number formatting and validation.
 */
export class FormatPhoneNumberUtil {
  /**
   * Formats a phone number to E.164-style with Indian country code.
   * Accepts local 10-digit numbers or already prefixed 91 numbers.
   * Throws error if input is invalid or unsupported.
   *
   * @param phone - Raw input phone string
   * @returns Formatted phone number like "+919876543210"
   */
  static formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters (spaces, dashes, etc.)
    const digits = phone.replace(/\D/g, "");

    // Case 1: Already starts with "91" and has 12 digits
    if (digits.startsWith("91") && digits.length === 12) {
      return `+${digits}`;
    }

    // Case 2: Local 10-digit Indian number → add +91 prefix
    if (digits.length === 10) {
      return `+91${digits}`;
    }

    // Otherwise, invalid or unsupported format
    throw new BadRequestException("Invalid phone number format");
  }
}
