import { InternalServerErrorException } from "@nestjs/common";
import { randomInt } from "crypto";

export interface OtpOptions {
  length?: number;
  numericOnly?: boolean;
  includeUpperCase?: boolean;
  includeLowerCase?: boolean;
}

export function generateOtp(options?: OtpOptions): string {
  const {
    length = 6,
    numericOnly = true,
    includeUpperCase = false,
    includeLowerCase = false,
  } = options || {};

  try {
    let characters = "0123456789";

    if (!numericOnly) {
      if (includeUpperCase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (includeLowerCase) characters += "abcdefghijklmnopqrstuvwxyz";
    }

    if (!characters.length) {
      throw new Error("No characters configured for OTP generation");
    }

    return Array.from({ length }, () => {
      const index = randomInt(0, characters.length);
      return characters[index];
    }).join("");
  } catch {
    throw new InternalServerErrorException("Failed to generate OTP");
  }
}
