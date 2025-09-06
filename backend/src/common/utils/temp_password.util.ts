import * as crypto from "crypto";

/**
 * Generates a random password using a secure charset.
 *
 * @param length - Desired length of password (default: 12)
 * @returns Secure random string
 */
export function generateTempPassword(length = 10): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
  const charsetLength = charset.length;

  const buffer = crypto.randomBytes(length);
  let password = "";

  for (let i = 0; i < length; i++) {
    const index = buffer[i] % charsetLength;
    password += charset.charAt(index);
  }

  return password;
}
