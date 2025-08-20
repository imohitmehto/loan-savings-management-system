// validators/loginschema

"use client";
import { z } from "zod";

const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

export const loginSchema = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(usernamePattern, "Invalid username format"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});
