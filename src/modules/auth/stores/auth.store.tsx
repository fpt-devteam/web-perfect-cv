import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import type { AuthStore, UserResponse } from '@/modules/auth/types/auth.type';

const user = atom<UserResponse>();
const isLoaded = atom(false);

export const authAtom = atom(
  (get): AuthStore => ({
    user: get(user),
    isLoaded: get(isLoaded),
  }),
  (_get, set, payload: Partial<Omit<AuthStore, 'isLoaded'>>) => {
    if (payload.user) {
      set(user, payload.user);
      set(isLoaded, true);
    }
  }
);

export const useAuthStore = () => useAtom(authAtom);
export const useAuthState = () => useAtomValue(authAtom);
export const useSetAuth = () => useSetAtom(authAtom);
