import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import type { AuthStore, UserResponse } from '@/modules/auth/types/auth.type';

const user = atom<UserResponse>();
const isLoaded = atom(false);

export const authAtom = atom(
    (get): AuthStore => ({
        user: get(user),
        isLoaded: get(isLoaded),
    }),
    (_get, set, payload: Partial<AuthStore>) => {
        if (payload.user !== undefined) {
            set(user, payload.user);
        }
        if (payload.isLoaded !== undefined) {
            set(isLoaded, payload.isLoaded);
        }
    }
);

export const useAuthStore = () => useAtom(authAtom);
export const useAuthState = () => useAtomValue(authAtom);
export const useSetAuth = () => useSetAtom(authAtom);
