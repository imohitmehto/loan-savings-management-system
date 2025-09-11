import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { authorizeUser, refreshAccessToken } from './authHelpers';

export const nextAuthConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userName: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'checkbox' },
      },
      authorize: authorizeUser,
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 5 * 60, // Update session every 5 minutes
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in - store tokens with expiry
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          name: user.name,
          role: user.role,
          rememberMe: user.rememberMe ?? false,
          // Set access token expiry (assume 15 minutes from your backend)
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
        };
      }

      // Return previous token if the access token has not expired yet
      // Add 5-minute buffer before expiry to prevent edge cases
      if (Date.now() < Number(token.accessTokenExpires) - 5 * 60 * 1000) {
        return token;
      }

      // Access token has expired, try to refresh it
      try {
        const refreshedToken = await refreshAccessToken(token);
        return refreshedToken;
      } catch (error) {
        console.error('Token refresh failed:', error);
        return {
          ...token,
          error: 'RefreshAccessTokenError',
        };
      }
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
    signIn: '/auth/login',
    error: '/auth/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
