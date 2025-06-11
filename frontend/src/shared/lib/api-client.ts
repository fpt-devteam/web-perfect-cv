import Axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authService } from '@/modules/auth/services/auth.service';
import { env } from '@/config/env';

const privateApi = Axios.create({
    baseURL: env.API_URL,
});

const publicApi = Axios.create({
    baseURL: env.API_URL,
});

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
    if (config.headers) {
        config.headers.Accept = 'application/json';
    }

    const token = authService.getData()?.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;

    config.withCredentials = true;
    return config;
}

privateApi.interceptors.request.use(authRequestInterceptor);

let refreshing = false;
let queue: ((token: string | null) => void)[] = [];

function notify(token: string | null) {
    queue.forEach((fn) => fn(token));
    queue = [];
    refreshing = false;
}

privateApi.interceptors.response.use(
    // Any status code that lie within the range of 2xx cause this function to trigger
    (response) => {

        return response.data;
    },

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    async (error: AxiosError) => {
        const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const message = (error.response?.data as { message?: string })?.message ?? error.message;

        console.log("Error", message)

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            if (!refreshing) {
                refreshing = true;
                try {
                    const newAT = await authService.refresh();
                    notify(newAT);
                } catch {
                    notify(null);
                }
            }

            return new Promise((resolve, reject) => {
                queue.push((newAT) => {
                    if (!newAT) {
                        const redirectTo = encodeURIComponent(window.location.pathname);
                        window.location.href = `/auth/login?redirectTo=${redirectTo}`;
                        return reject(error);
                    }

                    original.headers?.set('Authorization', `Bearer ${newAT}`);
                    resolve(privateApi(original));
                });
            });
        }

        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    },
);

export { publicApi, privateApi };