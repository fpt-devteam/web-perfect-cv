import {
    useMemo,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import type {
    AuthenResponse,
    AuthContextType,
    AccessTokenData
} from "@/modules/auth/types/auth.type";
import { createContext } from "react";
import { authService } from "../services/auth.service";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
    const [data, setData] = useState<AccessTokenData | null>(authService.getData());

    const isAuthenticated = !!data;

    const login = useCallback(async (data: AuthenResponse) => {
        setData(data.data);
    }, [])

    const logout = useCallback(async () => {
        setData(null);
    }, []);

    const value = useMemo<AuthContextType>(() => ({
        isAuthenticated,
        data,
        login,
        logout,
    }),
        [isAuthenticated, data, login, logout]);

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
}
