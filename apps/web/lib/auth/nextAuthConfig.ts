// lib/auth/options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import api from "@/lib/api/axiosInstance";
import { jwtDecode } from "jwt-decode";

export const nextAuthConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "userName", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      authorize: async (credentials) => {
        try {
          const response = await api.post("/auth/login", credentials);

          const { accessToken, refreshToken } = response.data;

          const decodedToken = jwtDecode<{ role?: string; sub?: string; userName?: string }>(accessToken);

          if (!decodedToken?.role || decodedToken.role !== "ADMIN") {
            throw new Error("Access denied, Unauthorized role");
          }

          return {
            id: decodedToken.sub,
            userName: decodedToken.userName ?? "Unknown",
            role: decodedToken.role,
            accessToken,
            refreshToken,
            rememberMe: credentials?.rememberMe == true || false,
          };

        } catch (error: unknown) {
          throw new Error(error.response?.data?.message || error.message || "Login failed");
        }
      }
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
        token.role = user.role;
        token.rememberMe = user.rememberMe ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};