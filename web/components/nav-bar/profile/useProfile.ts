// profile/useProfile.ts
"use client";
import { useSession } from "next-auth/react";

export interface ProfileData {
  name: string;
  role: string;
  avatarUrl?: string;
}

export const useProfile = (): ProfileData => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return {
      name: "Loading...",
      role: "",
      avatarUrl: undefined,
    };
  }

  return {
    name: session?.user?.name ?? "User",
    role: session?.user?.role ?? "Guest",
    avatarUrl: session?.user?.image,
  };
};
