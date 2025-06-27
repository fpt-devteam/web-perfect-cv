// export const accessTokenStorage = (function () {
//   let accessToken: string | null = null;

//   const get = () => accessToken;
//   const set = (token: string) => (accessToken = token);
//   const clear = () => (accessToken = null);

//   return { set, get, clear };
// })();
import { ACCESS_TOKEN_KEY } from '@/modules/auth/constants/auth.constant';

export const accessTokenStorage = (function () {
  const get = function () {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  };

  const set = function (token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  };

  const clear = function () {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  };

  return {
    get,
    set,
    clear,
  };
})();
