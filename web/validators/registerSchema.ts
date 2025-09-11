'use client';
import * as z from 'zod';

export const registrationSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid phone number'),
  password: z.string().min(6, 'Password too short'),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
