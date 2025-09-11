export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string | null;
    isVerified: boolean;
    lastLogin: Date | null;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterResponse {
  name: string;
  email: string;
  role?: string;
  isVerified: boolean;
}
