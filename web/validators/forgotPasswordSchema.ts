"use client";
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  userName: z.string().min(2, "Username is required"),
  email: z.string().email("Enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
