import { useAtom } from 'jotai';

import {
  // getAuthRedirectUrl,
  loginWithCredentials as loginWithCredentialsService,
  logout as logoutService,
  registerWithCredentials as registerWithCredentialsService,
  resendActivationEmail as resendActivationEmailService,
  activateAccount as activateAccountService,
} from '@/modules/auth/services/auth.service';
import { authAtom } from '@/modules/auth/stores/auth.store';
import type { LoginRequest } from '@/modules/auth/types/auth.type';
import { useGetMe } from '@/shared/hooks/useGetMe';
import { useMutation } from '@tanstack/react-query';

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);

  const getMe = useGetMe();

  const isAuthenticated = async () => {
    if (auth.isLoaded) return !!auth.user;

    return !!(await refetchUserData());
  };

  // const redirectWithProvider = async (provider: AuthProvider) => {
  //   const { url } = await getAuthRedirectUrl(provider);
  //   window.location.href = url;
  // };

  // const loginWithProvider = async (info: { provider: AuthProvider; code: string }) => {
  //   const { provider, code } = info;
  //   await loginWithProvider(provider, code).catch(showError);
  //   return refetchUserData();
  // };

  const loginWithCredentials = async (request: LoginRequest) => {
    await loginWithCredentialsService(request);
    return refetchUserData();
  };

  const logout = async () => {
    await logoutService();
    setAuth({ user: undefined });
  };

  const refetchUserData = async () => {
    const { data } = await getMe.refetch();
    setAuth({ user: data });
    return data;
  };

  // register - resend activation email - activate account
  const registerWithCredentials = useMutation({
    mutationFn: registerWithCredentialsService,
  });

  const resendActivationEmail = useMutation({
    mutationFn: resendActivationEmailService,
  });

  const activateAccount = useMutation({
    mutationFn: activateAccountService,
  });

  return {
    ...auth,
    isAuthenticated,
    loginWithCredentials,
    logout,
    refetchUserData,
    registerWithCredentials,
    resendActivationEmail,
    activateAccount,
  };
}
