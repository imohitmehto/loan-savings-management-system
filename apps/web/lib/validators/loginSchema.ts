import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password is required"),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});