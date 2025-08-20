"use client";
import { z } from "zod";
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^[0-9]{6}$/, "OTP must be 6 digits"),
});
export type OTPInput = z.infer<typeof otpSchema>;
