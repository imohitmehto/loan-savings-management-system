"use client";

import { useState, useEffect } from "react";
import { fetchProfile } from "@/lib/api/user";

export interface ProfileData {
  name: string;
  role: string;
  avatarUrl?: string;
}

export const useProfile = (): ProfileData => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const data = await fetchProfile();
        setAvatarUrl(data?.account?.photo);
        setName(data?.firstName + " " + data?.lastName);
        setRole(data?.role);
      } catch {
        setAvatarUrl(undefined);
        setName(undefined);
        setRole(undefined);
      }
    }

    fetchUserProfile();
  }, []);

  return {
    name: name ?? "User",
    role: role ?? "Guest",
    avatarUrl,
  };
};
