import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useNavigate } from '@tanstack/react-router';
import { type PropsWithChildren, useEffect } from 'react';
import { UserRole } from '@/shared/constants/role.enum';

type RoleGuardProps = PropsWithChildren<{
  requiredRoles?: UserRole[];
  fallbackRoute: string;
}>;

export function RoleGuard({ requiredRoles = [], fallbackRoute, children }: RoleGuardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAuthorized =
    requiredRoles.length === 0 || (user?.role !== undefined && requiredRoles.includes(user.role));

  useEffect(() => {
    if (!isAuthorized) {
      navigate({ to: fallbackRoute, replace: true });
    }
  }, [isAuthorized, navigate, fallbackRoute]);

  return <>{children}</>;
}
