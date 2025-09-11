import api from '@/lib/api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role?: string;
  sub?: string;
  name?: string;
  userName?: string;
  exp?: number;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
}

export async function authorizeUser(credentials: {
  userName?: string;
  password?: string;
  rememberMe?: boolean | string;
}) {
  if (!credentials?.userName || !credentials?.password) {
    return null;
  }

  const rememberMe =
    credentials.rememberMe === true || credentials.rememberMe === 'true';

  try {
    const { data } = await api.post('/auth/login', {
      userName: credentials.userName,
      password: credentials.password,
      rememberMe,
    });

    if (!data?.accessToken || !data?.refreshToken) {
      return null;
    }

    const decodedToken = jwtDecode<DecodedToken>(data.accessToken);

    if (decodedToken.role !== 'ADMIN') {
      return null;
    }

    return {
      id: decodedToken.sub ?? '',
      userName: decodedToken.userName ?? 'Unknown',
      name: decodedToken.name,
      role: decodedToken.role,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      rememberMe,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Login error:', error);
    }
    return null;
  }
}

export async function refreshAccessToken(token: any) {
  try {
    // Create a new axios instance to avoid circular dependency
    const refreshApi = require('axios').create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
      timeout: 10000,
    });

    const response = await refreshApi.post('/auth/refresh', {
      refreshToken: token.refreshToken,
    });

    const { accessToken, refreshToken, expiresIn } = response.data;

    if (!accessToken) {
      throw new Error('No access token received from refresh endpoint');
    }

    return {
      ...token,
      accessToken,
      refreshToken: refreshToken || token.refreshToken, // Use new refresh token if provided
      accessTokenExpires: Date.now() + (expiresIn || 15 * 60) * 1000, // Default to 15 minutes
    };
  } catch (error) {
    console.error('Refresh token error:', error);

    // Return token with error flag - this will trigger logout
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
