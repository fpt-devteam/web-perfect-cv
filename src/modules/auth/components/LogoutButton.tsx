import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useNotification } from '@/shared/hooks/useNotification';
import { Button } from '@/shared/components/ui/button';
import { LogOut } from 'lucide-react';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
export function LogoutButton() {
  const { logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      showSuccess(t('Logged out successfully'));
    } catch (error) {
      showError(error as AxiosError<BaseError>);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button className="cursor-pointer w-full" onClick={handleLogout} disabled={isLoading}>
      <LogOut />
      <span>{t('Logout')}</span>
    </Button>
  );
}
