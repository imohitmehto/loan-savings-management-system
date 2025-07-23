import * as crypto from "crypto";

/**
 * Utility class to generate secure temporary passwords.
 */
export class TempPasswordUtil {
  /**
   * Generates a random password using a secure charset.
   *
   * @param length - Desired length of password (default: 12)
   * @returns Secure random string
   */
  static generate(length = 12): string {
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
}
