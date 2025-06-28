import { useNotification } from '@/shared/hooks/useNotification';
import { Button } from '@/shared/components/ui/button';
import { LogOut } from 'lucide-react';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';
import { useTranslation } from 'react-i18next';
import { useLogout } from '@/modules/auth/hooks/useLogout';
export function LogoutButton() {
  const logout = useLogout();
  const { showSuccess, showError } = useNotification();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout.mutateAsync(undefined, {
      onSuccess: () => {
        showSuccess(t('Logged out successfully'));
        location.href = '/';
      },
      onError: error => {
        showError(error as AxiosError<BaseError>);
      },
    });
  };

  return (
    <Button className="cursor-pointer w-full" onClick={handleLogout} disabled={logout.isPending}>
      <LogOut />
      <span>{t('Logout')}</span>
    </Button>
  );
}
