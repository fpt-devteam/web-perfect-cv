export const AUTH_PROVIDER = {
  Google: 'google',
} as const;

export const REFRESH_TOKEN_ENDPOINT = '/api/auth/refresh-token';
export const LOGIN_ENDPOINT = '/api/auth/login';
export const LOGOUT_ENDPOINT = '/api/auth/logout';
export const REGISTER_ENDPOINT = '/api/auth/register';
export const RESEND_ACTIVATION_EMAIL_ENDPOINT = '/api/auth/resend-activation-email';
export const ACTIVATE_ACCOUNT_ENDPOINT = '/api/auth/activation-account';
export const GET_LOGIN_LINK_ENDPOINT = '/api/auth/login-link';
export const GET_ME_ENDPOINT = '/api/users/me';

export const ERROR_NO_ACCESS_TOKEN_FOUND = 'No access token found!';
export const ERROR_NO_REFRESH_TOKEN_FOUND = 'No refresh token found!';

export const ACCESS_TOKEN_KEY = 'access-token';
export const REFRESH_TOKEN_KEY = 'refresh-token';
