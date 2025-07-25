// profile/useProfile.ts
export interface ProfileData {
  name: string;
  role: string;
  avatarUrl?: string;
}

export const useProfile = (): ProfileData => {
  // Simulated fetch or context; fallback to default
  try {
    // Replace this with real API or context hook
    return {
      name: "Deepak Soni", // fallback
      role: "Administrator",
      avatarUrl: undefined,
    };
  } catch (error) {
    return {
      name: "User",
      role: "Guest",
      avatarUrl: undefined,
    };
  }
};