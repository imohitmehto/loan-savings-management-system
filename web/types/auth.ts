"use client";
export type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginInput = {
  userName: string;
  password: string;
  accessToken: string;
  refreshToken: string;
};
