import type { LoginRequest, AuthenResponse, AccessTokenData, LogoutResponse, LogoutRequest } from "@/modules/auth/types/auth.type";
import { privateApi } from "@/shared/lib/api-client";
import { STORAGE_KEY } from "@/shared/constants/base.constants";
import { mockLoginApiCall } from "@/mock/user";

const logout = async (req: LogoutRequest): Promise<LogoutResponse | null> => {
    // const res = await privateApi.post<LogoutResponse>('/auth/logout', req, {
    //     headers: { 'Content-Type': 'application/json' },
    // });

    console.log("req", req);
    // if (!res.data) {
    //     return null;
    // }

    const res = {
        status: "success",
        message: "Logout successful",
    };

    removeData();

    return res;
};

const login = async (req: LoginRequest): Promise<AuthenResponse | null> => {
    // const res = await publicApi.post<AuthenResponse>('/api/login', req, {
    //     headers: { 'Content-Type': 'application/json' },
    // });

    const res = (await mockLoginApiCall(req)).data;

    if (!res.data) {
        return null;
    }

    saveData(res.data);

    return res;
};

const refresh = async (): Promise<string | null> => {
    try {
        const res = await privateApi.get<AuthenResponse>('/auth/refresh', {
            withCredentials: true,
        });

        if (!res?.data.data?.accessToken) {
            return null;
        }

        return res.data.data.accessToken;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const saveData = (data: AccessTokenData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const getData = (): AccessTokenData | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as AccessTokenData) : null;
};

const removeData = () => {
    localStorage.removeItem(STORAGE_KEY);
};

export const authService = {
    login,
    logout,
    refresh,
    saveData,
    getData,
    removeData
};