import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      rememberMe?: boolean;
    };
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    rememberMe?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    name?: string;
    role?: string;
    rememberMe?: boolean;
  }
}
