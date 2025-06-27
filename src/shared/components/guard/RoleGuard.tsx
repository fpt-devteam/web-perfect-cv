import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useNavigate } from '@tanstack/react-router';
import { type PropsWithChildren, useEffect } from 'react';
import { Spinner } from '@/shared/components/loading/Spinner';
import { UserRole } from '@/shared/constants/role.enum';

type RoleGuardProps = PropsWithChildren<{
  requiredRoles?: UserRole[];
  fallbackRoute: string;
}>;

export function RoleGuard({ requiredRoles = [], fallbackRoute, children }: RoleGuardProps) {
  const { user, refetchUserData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      refetchUserData();
    }
  }, [user, refetchUserData]);

  const authorized =
    requiredRoles.length === 0 || (user?.role !== undefined && requiredRoles.includes(user.role));

  useEffect(() => {
    if (user && !authorized) {
      navigate({ to: fallbackRoute, replace: true });
    }
  }, [user, authorized, fallbackRoute, navigate]);

  if (!user || !authorized) {
    return <Spinner size="lg" />;
  }

  return <>{children}</>;
}
