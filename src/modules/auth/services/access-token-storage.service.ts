import { ACCESS_TOKEN_KEY } from '@/modules/auth/constants/auth.constant';


export const accessTokenStorage = (function () {
  // Try to load token from localStorage on initialization
  let accessToken: string | null = null;

  // Initialize from localStorage if available
  if (typeof window !== "undefined") {
    try {
      accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Failed to load access token from storage:", error);
    }
  }

  const get = () => {
    // Always return the in-memory token (it's the source of truth)
    return accessToken;
  };

  const set = (token: string) => {
    accessToken = token;
    // Persist to localStorage
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.error("Failed to save access token to storage:", error);
    }
  };

  const clear = () => {
    accessToken = null;
    // Remove from localStorage
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Failed to clear access token from storage:", error);
    }
  };

  return { set, get, clear };
})();

