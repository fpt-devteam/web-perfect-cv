import { AUTH_PROVIDER } from '@/modules/auth/constants/auth.constant';
import type { UserRole } from '@/shared/constants/role.enum';

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  email: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenRequest = {
  refreshTokenHash: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AuthClientState = {
  refreshToken: Promise<RefreshTokenResponse | null> | null;
};

export type UserResponse = {
  id: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
};

export type LogoutRequest = {
  refreshToken: string;
};

export type AuthStore = {
  user: UserResponse | undefined;
  isLoaded: boolean;
};

export type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];
