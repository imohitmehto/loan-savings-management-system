import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import api from "@/lib/api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const nextAuthConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      authorize: async (credentials) => {
        if (!credentials?.userName || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        try {
          const { data } = await api.post("/auth/login", {
            userName: credentials.userName,
            password: credentials.password,
            rememberMe: credentials.rememberMe || false,
          });

          if (!data?.accessToken || !data?.refreshToken) {
            throw new Error("Invalid response from authentication server");
          }

          const decodedToken = jwtDecode<{
            role?: string;
            sub?: string;
            name?: string;
            userName?: string;
          }>(data.accessToken);

          if (decodedToken.role !== "ADMIN") {
            throw new Error("Access denied: Unauthorized role");
          }

          return {
            id: decodedToken.sub ?? "",
            userName: decodedToken.userName ?? "Unknown",
            name: decodedToken.name,
            role: decodedToken.role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            rememberMe: !!credentials.rememberMe,
          };
        } catch (error: unknown) {
          // Server/log detail but send generic message to user
          if (process.env.NODE_ENV === "development") {
            console.error("Login error:", error);
          }
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Login failed");
          }
          if (error instanceof Error) {
            throw new Error(error.message || "Login failed");
          }
          throw new Error("Login failed");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.name = user.name;
        token.role = user.role;
        token.rememberMe = user.rememberMe ?? false;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
