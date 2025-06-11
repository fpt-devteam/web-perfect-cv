import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { mockGetMeApiCall } from "@/mock/user";
import type { User } from "../types/base.type";


export const useGetMe = () => {
    const [error, setError] = useState<string | null>(null);

    const { mutate, isPending, data, error: mutationError } = useMutation({
        mutationKey: ['getMe'],
        mutationFn: async () => {
            try {
                // const response: User = await privateApi.get('/profile');
                const response = await mockGetMeApiCall();

                if (!response) {
                    return null;
                }

                const user: User = response.data;

                return user;
            } catch (err: any) {
                setError(err.message || 'An unknown error occurred');
                return null;
            }
        },
        onError: (error: any) => {
            setError(error.message || 'Something went wrong');
        },
    });

    return {
        mutate,
        isPending,
        error: error || mutationError?.message || null,
        user: data,
    };
};
