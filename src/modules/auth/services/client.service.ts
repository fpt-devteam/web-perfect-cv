import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import {
  ERROR_NO_ACCESS_TOKEN_FOUND,
  REFRESH_TOKEN_ENDPOINT,
} from '@/modules/auth/constants/auth.constant';
import { handleSessionExpired, refreshToken } from '@/modules/auth/services/auth.service';
import { accessTokenStorage } from '@/modules/auth/services/access-token-storage.service';
import type { AuthClientState } from '@/modules/auth/types/auth.type';
import { createBaseClient } from '@/shared/utils/api-client.util';
import qs from 'qs';

/**
 * TOKEN REFRESH SYNCHRONIZATION MECHANISM:
 *
 * When multiple API calls receive 401 responses (token expired):
 * 1. The FIRST 401 response triggers a refresh token call and stores the promise in state.refreshToken
 * 2. All SUBSEQUENT 401 responses check if state.refreshToken exists
 * 3. If it exists, they wait for the same promise instead of making new refresh calls
 * 4. Once refresh completes (success or failure), all waiting requests proceed
 * 5. On success: All requests retry with the new token
 * 6. On failure: All requests fail and user is logged out
 *
 * This ensures only ONE refresh token call happens even with 100+ concurrent 401 responses
 */

// --------- REQUESTS INTERCEPTORS ---------
async function attachAccessToken(config: InternalAxiosRequestConfig, state: AuthClientState) {
  // If there's an ongoing refresh, wait for it to complete
  if (state.refreshToken) {
    await state.refreshToken;
  }
  const accessToken = accessTokenStorage.get();

  if (!accessToken) {
    console.error(ERROR_NO_ACCESS_TOKEN_FOUND);
    throw new Error(ERROR_NO_ACCESS_TOKEN_FOUND);
  }

  config.headers['Authorization'] = `Bearer ${accessToken}`;
}

// --------- RESPONSE INTERCEPTORS ---------
async function handleError401(error: AxiosError | AxiosResponse, client: AxiosInstance, state: AuthClientState) {
  const originalRequest: InternalAxiosRequestConfig & { _hasRetry?: boolean } = error.config!;

  // If the refresh token endpoint itself fails, session is expired
  if (originalRequest.url === REFRESH_TOKEN_ENDPOINT) {
    console.log("Refresh token failed, session expired");
    await handleSessionExpired();
    return Promise.reject(error);
  }

  // Prevent infinite retry loops
  if (originalRequest._hasRetry) {
    console.log("Request already retried, rejecting");
    return Promise.reject(error);
  }

  console.log(`Got 401 error for ${originalRequest.url}, attempting to refresh token`);

  // Mark request as retried to prevent infinite loops
  originalRequest._hasRetry = true;

  // CRITICAL: Only ONE refresh call should happen even if multiple requests get 401
  // All concurrent 401 responses will wait for the same refresh promise
  if (!state.refreshToken) {
    console.log("Starting new token refresh...");
    state.refreshToken = refreshToken()
      .then((result) => {
        console.log("Token refresh successful");
        // Clear the promise after successful refresh
        state.refreshToken = null;
        return result;
      })
      .catch(async (refreshError) => {
        console.error("Token refresh failed, forcing logout:", refreshError);
        // Clear the promise and force logout
        state.refreshToken = null;
        await handleSessionExpired();
        throw refreshError;
      });
  } else {
    console.log("Waiting for existing token refresh to complete...");
  }

  try {
    // Wait for the refresh to complete (either new or existing)
    await state.refreshToken;

    // After successful refresh, retry the original request with new token
    console.log(`Retrying original request to ${originalRequest.url} with new token`);
    return client(originalRequest);
  } catch (_refreshError) {
    // If refresh failed, reject the original error
    return Promise.reject(error);
  }
}

// -----------------------------------------
function createAuthClient() {
  const client = createBaseClient();
  const state: AuthClientState = { refreshToken: null };

  client.interceptors.request.use(
    async (config) => {
      await attachAccessToken(config, state);
      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      switch (error.response?.status) {
        case 401:
          return handleError401(error, client, state);

        case 400:
        case 403:
        default:
          return Promise.reject(error);
      }
    },
  );

  return client;
}

export const authClient = createAuthClient();

function createPublicClient() {
  const client = createBaseClient();
  const state: AuthClientState = { refreshToken: null };
  client.defaults.paramsSerializer = {
    serialize: params => qs.stringify(params, { encode: false, allowDots: true }),
  };
  client.interceptors.response.use(
    response => response,
    error => {
      switch (error.response?.status) {
        case 401:
          return handleError401(error, client, state);

        case 400:
        case 403:
        default:
          return Promise.reject(error);
      }
    }
  );

  return client;
}

export const publicClient = createPublicClient();
