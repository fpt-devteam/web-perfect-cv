import {
  LOGIN_ENDPOINT,
  REGISTER_ENDPOINT,
  RESEND_ACTIVATION_EMAIL_ENDPOINT,
  ACTIVATE_ACCOUNT_ENDPOINT,
  REFRESH_TOKEN_ENDPOINT,
  ERROR_NO_REFRESH_TOKEN_FOUND,
  LOGOUT_ENDPOINT,
  GET_LOGIN_LINK_ENDPOINT,
} from '@/modules/auth/constants/auth.constant';
import { accessTokenStorage } from '@/modules/auth/services/access-token-storage.service';
import { refreshTokenStorage } from '@/modules/auth/services/refresh-token-storage.service';
import type {
  AuthProvider,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
} from '@/modules/auth/types/auth.type';
import { baseClient } from '@/shared/utils/api-client.util';
import { redirect } from '@tanstack/react-router';
import { authClient } from '@/modules/auth/services/client.service';
export async function registerWithCredentials(request: RegisterRequest) {
  const { data } = await baseClient<RegisterResponse>({
    method: 'POST',
    url: REGISTER_ENDPOINT,
    data: request,
  });
  return data;
}

export async function resendActivationEmail(email: string) {
  const { data } = await baseClient<string>({
    method: 'POST',
    url: RESEND_ACTIVATION_EMAIL_ENDPOINT,
    data: {
      email,
    },
  });

  return data;
}

export async function activateAccount(token: string) {
  const { data } = await baseClient<string>({
    method: 'PUT',
    url: `${ACTIVATE_ACCOUNT_ENDPOINT}/${token}`,
  });

  return data;
}

export async function getLoginLink(provider: AuthProvider) {
  const { data } = await baseClient<string>({
    method: 'GET',
    url: `${GET_LOGIN_LINK_ENDPOINT}/${provider}`,
  });

  return { url: data };
}

export async function loginWithProvider(provider: AuthProvider, code: string) {
  console.log('in auth service', provider, code);
  const { data } = await baseClient<LoginResponse>({
    method: 'POST',
    url: `${LOGIN_ENDPOINT}/${provider}`,
    data: { code },
  });

  accessTokenStorage.set(data.accessToken);
  refreshTokenStorage.set(data.refreshToken);

  return data;
}

export async function loginWithCredentials(request: LoginRequest) {
  const { data } = await baseClient<LoginResponse>({
    method: 'POST',
    url: LOGIN_ENDPOINT,
    data: request,
  });

  accessTokenStorage.set(data.accessToken);
  refreshTokenStorage.set(data.refreshToken);

  return data;
}

export async function refreshToken() {
  try {
    const refreshToken = refreshTokenStorage.get();
    if (!refreshToken) {
      throw new Error(ERROR_NO_REFRESH_TOKEN_FOUND);
    }
    const requestData: RefreshTokenRequest = {
      refreshTokenHash: refreshToken,
    };

    const { data } = await baseClient<RefreshTokenResponse>({
      method: 'POST',
      url: REFRESH_TOKEN_ENDPOINT,
      data: requestData,
    });

    accessTokenStorage.set(data.accessToken);
    refreshTokenStorage.set(data.refreshToken);

    return data;
  } catch (error) {
    handleSessionExpired();
    console.error(error);
    throw redirect({ to: '/' });
  }
}

export async function logout() {
  try {
    const refreshToken = refreshTokenStorage.get();
    if (!refreshToken) {
      throw new Error(ERROR_NO_REFRESH_TOKEN_FOUND);
    }
    const requestData: LogoutRequest = { refreshToken };
    await authClient({
      method: 'POST',
      url: LOGOUT_ENDPOINT,
      headers: { Authorization: `Bearer ${accessTokenStorage.get()}` },
      data: requestData,
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    handleSessionExpired();
  }
}

export function handleSessionExpired() {
  sessionStorage.clear();
  accessTokenStorage.clear();
  refreshTokenStorage.clear();
}
