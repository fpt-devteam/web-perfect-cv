import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '@/shared/hooks/useNotification';
import { AxiosError } from 'axios';
import {
  getBillingHistoryByUserId,
  getBillingHistoryById,
  createBillingHistory,
} from '../services/billing.service';
import type { CreateBillingHistoryRequest } from '../types/payment.types';

/**
 * Hook to get billing history by user ID
 */
export const useBillingHistory = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['billing-history', userId],
    queryFn: () => getBillingHistoryByUserId(userId),
    enabled: enabled && !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to get a specific billing history record by ID
 */
export const useBillingHistoryById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['billing-history', 'detail', id],
    queryFn: () => getBillingHistoryById(id),
    enabled: enabled && !!id,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to create a billing history record
 * Note: This is typically used by webhooks, not frontend
 */
export const useCreateBillingHistory = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: (request: CreateBillingHistoryRequest) => createBillingHistory(request),
    onSuccess: (_, variables) => {
      showSuccess('Billing record created');
      queryClient.invalidateQueries({ queryKey: ['billing-history', variables.userId] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      showError(error?.response?.data?.message || 'Failed to create billing record');
    },
  });
};
