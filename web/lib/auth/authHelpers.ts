import api from "@/lib/api/axiosInstance";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
  sub?: string;
  name?: string;
  userName?: string;
}

export async function authorizeUser(credentials: {
  userName?: string;
  password?: string;
  rememberMe?: boolean | string;
}) {
  if (!credentials?.userName || !credentials?.password) {
    return null;
  }

  // Safely coerce rememberMe, as it may be "true"/"false"/undefined/boolean
  const rememberMe =
    credentials.rememberMe === true || credentials.rememberMe === "true";

  try {
    const { data } = await api.post("/auth/login", {
      userName: credentials.userName,
      password: credentials.password,
      rememberMe,
    });

    if (!data?.accessToken || !data?.refreshToken) {
      return null;
    }

    const decodedToken = jwtDecode<DecodedToken>(data.accessToken);

    if (decodedToken.role !== "ADMIN") {
      return null;
    }

    return {
      id: decodedToken.sub ?? "",
      userName: decodedToken.userName ?? "Unknown",
      name: decodedToken.name,
      role: decodedToken.role,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      rememberMe,
    };
  } catch (error) {
    // Only log SAFE messages in development
    if (process.env.NODE_ENV === "development") {
      // Do not log credentials, tokens, or passwords!
      console.error("Login error:", error);
    }
    return null; // never leak internal error messages
  }
}
