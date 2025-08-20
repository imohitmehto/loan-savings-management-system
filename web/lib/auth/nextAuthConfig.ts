import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { authorizeUser } from "./authHelpers";

// Extend NextAuth types in types/next-auth.d.ts as described previously

export const nextAuthConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      authorize: authorizeUser, // modular, testable, secure
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Only assign SAFE fields
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
        session.user.role = token.role;
        session.user.name = token.name;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user.rememberMe = token.rememberMe ?? false;
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
