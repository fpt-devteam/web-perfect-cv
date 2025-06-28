// import { useAtom } from 'jotai';

// import {
//   getOAuthLoginLink,
//   loginWithCredentials as loginWithCredentialsService,
//   loginWithProvider as loginWithProviderService,
//   logout as logoutService,
//   registerWithCredentials as registerWithCredentialsService,
//   resendActivationEmail as resendActivationEmailService,
//   activateAccount as activateAccountService,
// } from '@/modules/auth/services/auth.service';
// import { authAtom } from '@/modules/auth/stores/auth.store';
// import type { AuthProvider, LoginRequest } from '@/modules/auth/types/auth.type';
// import { useGetMe } from '@/shared/hooks/useGetMe';
// import { useMutation } from '@tanstack/react-query';
// import { useNotification } from '@/shared/hooks/useNotification';
// import { accessTokenStorage } from '../services/access-token-storage.service';

// export function useAuth() {
//   const [auth, setAuth] = useAtom(authAtom);
//   const { showError } = useNotification();

//   const getMe = useGetMe();

//   const isAuthenticated = async () => {
//     if (auth.isLoaded) return !!auth.user;

//     return !!(await refetchUserData());
//   };

//   const redirectWithProvider = async (provider: AuthProvider) => {
//     const { url } = await getOAuthLoginLink(provider);
//     window.location.href = url;
//   };

//   const loginWithProvider = async (info: { provider: AuthProvider; code: string }) => {
//     const { provider, code } = info;
//     await loginWithProviderService(provider, code).catch(showError);
//     return refetchUserData();
//   };

//   const loginWithCredentials = async (request: LoginRequest) => {
//     await loginWithCredentialsService(request);
//     return refetchUserData();
//   };

//   const logout = async () => {
//     await logoutService();
//     setAuth({ user: undefined });
//   };

//   const refetchUserData = async () => {
//     console.log('access token in refetchUserData', accessTokenStorage.get());
//     const { data } = await getMe.refetch();
//     console.log('data in refetchUserData', data);
//     setAuth({ user: data });
//     return data;
//   };

//   // register - resend activation email - activate account
//   const registerWithCredentials = useMutation({
//     mutationFn: registerWithCredentialsService,
//   });

//   const resendActivationEmail = useMutation({
//     mutationFn: resendActivationEmailService,
//   });

//   const activateAccount = useMutation({
//     mutationFn: activateAccountService,
//   });

//   return {
//     ...auth,
//     isAuthenticated,
//     loginWithCredentials,
//     logout,
//     refetchUserData,
//     registerWithCredentials,
//     resendActivationEmail,
//     activateAccount,
//     redirectWithProvider,
//     loginWithProvider,
//   };
// }
import { atom, useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

import { getMe } from '@/modules/auth/hooks/useGetMe';
import type { UserResponse } from '@/modules/auth/types/auth.type';
import { refreshToken } from '@/modules/auth/services/auth.service';
import { accessTokenStorage } from '@/modules/auth/services/access-token-storage.service';

const atomLoaded = atom(false);
const atomUser = atom<UserResponse>();

export function useAuth() {
  const [isLoaded, setIsLoaded] = useAtom(atomLoaded);
  const [isSyncing, setIsSyncing] = useState(false);
  const [user, setUser] = useAtom(atomUser);

  const syncUserInfo = useCallback(async () => {
    if (isSyncing) return;

    try {
      setIsSyncing(true);
      setIsLoaded(false);
      const accessToken = accessTokenStorage.get();
      if (!accessToken) await refreshToken();
      const me = await getMe();
      setUser(me);
      return me;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSyncing(false);
      setIsLoaded(true);
    }
  }, [setIsSyncing, setIsLoaded, setUser, isSyncing]);

  const clear = useCallback(() => {
    setUser(undefined);
    setIsLoaded(false);
  }, [setIsLoaded, setUser]);

  const getCurrentUser = useCallback(async () => {
    if (isLoaded) return user;
    return await syncUserInfo();
  }, [isLoaded, syncUserInfo, user]);

  useEffect(() => {
    console.log('atom user updated:', user);
    console.log('atom isLoaded updated:', isLoaded);
  }, [user, isLoaded]);

  return { isLoaded, user, syncUserInfo, clear, getCurrentUser };
}
