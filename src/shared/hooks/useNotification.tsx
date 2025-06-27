import { toast } from 'sonner';
import { isString } from 'lodash';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';
import { CheckCircle, Info, Warning, XCircle } from '@phosphor-icons/react';

export function useNotification() {
  const showError = (error: AxiosError<BaseError> | string) => {
    const content = isString(error) ? error : error?.response?.data?.message;
    toast.error(content ?? 'Something went wrong', {
      duration: 4000,
      icon: (
        <XCircle size={20} className="text-red-500" weight="fill" onClick={() => toast.dismiss()} />
      ),
    });
  };

  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 3000,
      icon: (
        <CheckCircle
          size={20}
          className="text-green-500"
          weight="fill"
          onClick={() => toast.dismiss()}
        />
      ),
    });
  };

  const showWarning = (message: string) => {
    toast(message, {
      duration: 4000,
      icon: (
        <Warning
          size={20}
          className="text-yellow-500"
          weight="fill"
          onClick={() => toast.dismiss()}
        />
      ),
      style: {
        borderLeft: '4px solid #f59e0b',
      },
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      duration: 3000,
      icon: (
        <Info size={20} className="text-blue-500" weight="fill" onClick={() => toast.dismiss()} />
      ),
      style: {
        borderLeft: '4px solid #0ea5e9',
      },
    });
  };

  return { showError, showSuccess, showWarning, showInfo };
}
