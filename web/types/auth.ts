//types/auth.ts

"use client";
export type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginFormData = {
  userName: string;
  password: string;
};
