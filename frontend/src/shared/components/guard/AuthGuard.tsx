import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRouter } from "@tanstack/react-router";
import { useEffect, type PropsWithChildren } from "react";
import { SpinnerPage } from "../spinnerPage/SpinnerPage";
import type { Role } from "@/shared/types/base.type";
import { useGetMe } from "@/shared/hooks/useGetMe";

type AuthGuardProps = PropsWithChildren<{
    allowedRoles: Role[];
    fallbackRoute: string;
}>;

export function AuthGuard({ children, allowedRoles, fallbackRoute }: AuthGuardProps) {
    const auth = useAuth();
    const router = useRouter();
    const { isPending, user, mutate } = useGetMe();

    useEffect(() => {
        if (auth.isAuthenticated && !user) {
            mutate();
        }
    }, [auth.isAuthenticated, user, mutate]);

    if (isPending) {
        return <SpinnerPage />;
    }

    if (!auth.isAuthenticated) {
        router.navigate({ to: fallbackRoute, replace: true });
        return null;
    }

    if (user && allowedRoles && allowedRoles.length > 0) {
        const authorized = user?.role && allowedRoles.includes(user.role);
        if (!authorized) {
            router.navigate({ to: fallbackRoute, replace: true });
            return null;
        }
    }

    return <>{children}</>;
}