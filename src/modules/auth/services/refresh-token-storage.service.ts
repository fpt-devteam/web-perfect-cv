import { REFRESH_TOKEN_KEY } from '@/modules/auth/constants/auth.constant';

export const refreshTokenStorage = (function () {
  const get = function () {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  };

  const set = function (token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  };

  const clear = function () {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  return {
    get,
    set,
    clear,
  };
})();
