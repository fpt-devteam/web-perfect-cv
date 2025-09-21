import { useAtom } from "jotai";

import { useGetMe } from "@/modules/auth/hooks/useGetMe";
import { authAtom } from "@/modules/auth/stores/auth.store";

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);

  const getMe = useGetMe({ enabled: false });

  const isAuthenticated = async () => {
    if (auth.isLoaded) return !!auth.user;

    console.log("get me in useAuth");
    const user = (await getMe.refetch()).data;
    setAuth({ user });

    return !!user;
  };

  const clear = async () => {
    setAuth({ user: undefined, isLoaded: true });
  };

  return Object.assign(auth, {
    isAuthenticated,
    clear,
  });
}
