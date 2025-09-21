import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

import { useGetMe } from "@/modules/auth/hooks/useGetMe";
import { refreshToken } from "@/modules/auth/services/auth.service";
import { accessTokenStorage } from "@/modules/auth/services/access-token-storage.service";
import { refreshTokenStorage } from "@/modules/auth/services/refresh-token-storage.service";
import { authAtom } from "@/modules/auth/stores/auth.store";

export enum AuthStatus {
  LOADING = "loading",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

/**
 * Hook to initialize authentication state on app startup
 *
 * This hook:
 * 1. Checks if tokens exist in localStorage
 * 2. If tokens exist, validates them by fetching user data
 * 3. If access token is expired but refresh token exists, attempts refresh
 * 4. Returns the current auth status for routing decisions
 */
export function useAuthInit() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.LOADING);
  const [, setAuth] = useAtom(authAtom);
  const getMe = useGetMe({ enabled: false });
  const { data } = getMe;
  const initAuth = useCallback(async () => {
    try {
      const accessToken = accessTokenStorage.get();
      const refreshTokenValue = refreshTokenStorage.get();

      // No tokens = not authenticated
      if (!accessToken && !refreshTokenValue) {
        console.log("No tokens found, user is not authenticated");
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
        setAuth({ user: undefined, isLoaded: true });
        return;
      }

      // If we have refresh token but no access token, try to refresh
      if (!accessToken && refreshTokenValue) {
        console.log("No access token but refresh token exists, attempting refresh...");
        try {
          await refreshToken();
          // After refresh, try to get user data
          const { data: user } = await getMe.refetch();
          if (user) {
            setAuthStatus(AuthStatus.AUTHENTICATED);
            setAuth({ user, isLoaded: true });
            return;
          }
        } catch (_error) {
          console.error("Failed to refresh token on init:", _error);
          setAuthStatus(AuthStatus.UNAUTHENTICATED);
          setAuth({ user: undefined, isLoaded: true });
          return;
        }
      }

      // If we have access token, validate it by fetching user data
      if (accessToken && !data && !getMe.isFetching) {
        console.log("Access token found, validating...");
        try {
          const { data: user } = await getMe.refetch();
          if (user) {
            setAuth({ user, isLoaded: true });
            console.log("User data fetched successfully");
            setAuthStatus(AuthStatus.AUTHENTICATED);
            return;
          }
        } catch (_error) {
          console.error("Failed to fetch user data, token might be expired");

          // Try to refresh if we have refresh token
          if (refreshTokenValue) {
            console.log("Attempting to refresh expired token...");
            try {
              await refreshToken();
              const { data: user } = await getMe.refetch();
              if (user) {
                setAuth({ user, isLoaded: true });
                setAuthStatus(AuthStatus.AUTHENTICATED);
                return;
              }
            } catch (refreshError) {
              console.error("Refresh failed:", refreshError);
            }
          }

          setAuthStatus(AuthStatus.UNAUTHENTICATED);
          setAuth({ user: undefined, isLoaded: true });
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
      setAuth({ user: undefined, isLoaded: true });
    }
  }, [data, getMe, setAuth]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return authStatus;
}
