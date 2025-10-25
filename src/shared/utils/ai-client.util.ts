import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AI_API_ENDPOINT } from '@/config/env.config';
import { accessTokenStorage } from '@/modules/auth/services/access-token-storage.service';
import { refreshToken, handleSessionExpired } from '@/modules/auth/services/auth.service';
import { REFRESH_TOKEN_ENDPOINT } from '@/modules/auth/constants/auth.constant';
import type { RefreshTokenResponse } from '@/modules/auth/types/auth.type';

export function createAIClient(baseURL = AI_API_ENDPOINT) {
  const client = axios.create({
    baseURL,
    paramsSerializer: {
      indexes: null, // by default: false
    },
  });

  // State to track ongoing refresh token request
  let refreshTokenPromise: Promise<RefreshTokenResponse | void> | null = null;

  // Request interceptor to attach access token
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // If there's an ongoing refresh, wait for it to complete
      if (refreshTokenPromise) {
        await refreshTokenPromise;
      }

      const accessToken = accessTokenStorage.get();
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }

      return config;
    },
    error => Promise.reject(error)
  );

  // Response interceptor to handle 401 errors and refresh token
  client.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest: InternalAxiosRequestConfig & { _hasRetry?: boolean } = error.config!;

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._hasRetry) {
        // Prevent infinite retry loops
        originalRequest._hasRetry = true;

        // If refresh token endpoint itself fails, session is expired
        if (originalRequest.url?.includes(REFRESH_TOKEN_ENDPOINT)) {
          await handleSessionExpired();
          return Promise.reject(error);
        }

        try {
          // If no ongoing refresh, start one
          if (!refreshTokenPromise) {
            refreshTokenPromise = refreshToken()
              .then(() => {
                refreshTokenPromise = null;
              })
              .catch(async refreshError => {
                refreshTokenPromise = null;
                await handleSessionExpired();
                throw refreshError;
              });
          }

          // Wait for refresh to complete
          await refreshTokenPromise;

          // Retry the original request with new token
          const newAccessToken = accessTokenStorage.get();
          if (newAccessToken && originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          }

          return client(originalRequest);
        } catch {
          // If refresh failed, reject the original error
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

export const aiClient = createAIClient();
