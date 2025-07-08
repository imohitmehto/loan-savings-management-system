import { InternalServerErrorException } from "@nestjs/common";
import { randomInt } from "crypto";

export interface OtpOptions {
  length?: number;
  numericOnly?: boolean;
  includeUpperCase?: boolean;
  includeLowerCase?: boolean;
}

export class OtpGenerator {
  static generate(options?: OtpOptions): string {
    const {
      length = 6,
      numericOnly = true,
      includeUpperCase = false,
      includeLowerCase = false,
    } = options || {};

    try {
      let characters = "";

      if (numericOnly) {
        characters = "0123456789";
      } else {
        characters = "0123456789";
        if (includeUpperCase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeLowerCase) characters += "abcdefghijklmnopqrstuvwxyz";
      }

      if (!characters.length) {
        throw new Error("No characters configured for OTP generation");
      }

      const otpChars: string[] = [];

      for (let i = 0; i < length; i++) {
        const index = randomInt(0, characters.length);
        otpChars.push(characters[index]);
      }

      return otpChars.join("");
    } catch (error) {
      console.error("OTP generation failed:", error);
      throw new InternalServerErrorException("Failed to generate OTP");
    }
  }
}
