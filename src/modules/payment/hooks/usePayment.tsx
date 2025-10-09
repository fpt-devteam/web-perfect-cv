import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '@/shared/hooks/useNotification';
import { AxiosError } from 'axios';
import {
  createPayment,
  getPaymentInfo,
  getPaymentStatus,
  cancelPayment,
} from '../services/payment.service';
import type { CreatePaymentRequest, CancelPaymentRequest } from '../types/payment.types';

/**
 * Hook to create a payment link
 */
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: (request: CreatePaymentRequest) => createPayment(request),
    onSuccess: () => {
      showSuccess('Payment link created successfully!');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      showError(error?.response?.data?.message || 'Failed to create payment link');
    },
  });
};

/**
 * Hook to get payment information
 */
export const usePaymentInfo = (orderCode: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['payment-info', orderCode],
    queryFn: () => getPaymentInfo(orderCode),
    enabled: enabled && !!orderCode,
    retry: 3,
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to get payment status (lighter than full payment info)
 */
export const usePaymentStatus = (orderCode: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['payment-status', orderCode],
    queryFn: () => getPaymentStatus(orderCode),
    enabled: enabled && !!orderCode,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Poll every 5 seconds if status is PENDING
      return status === 'PENDING' ? 5000 : false;
    },
    retry: 3,
    staleTime: 5 * 1000, // 5 seconds
  });
};

/**
 * Hook to cancel a payment
 */
export const useCancelPayment = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: ({ orderCode, request }: { orderCode: number; request: CancelPaymentRequest }) =>
      cancelPayment(orderCode, request),
    onSuccess: (_, variables) => {
      showSuccess('Payment cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['payment-info', variables.orderCode] });
      queryClient.invalidateQueries({ queryKey: ['payment-status', variables.orderCode] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      showError(error?.response?.data?.message || 'Failed to cancel payment');
    },
  });
};
