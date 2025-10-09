import { authClient } from '@/modules/auth/services/client.service';
import { BILLING_ENDPOINTS } from '../constants/payment-endpoint.constant';
import type { BillingHistory, CreateBillingHistoryRequest } from '../types/payment.types';

/**
 * Get billing history by user ID
 */
export const getBillingHistoryByUserId = async (userId: string): Promise<BillingHistory[]> => {
  const { data } = await authClient<BillingHistory[]>({
    method: 'GET',
    url: BILLING_ENDPOINTS.GET_BY_USER_ID(userId),
  });
  return data;
};

/**
 * Get billing history by ID
 */
export const getBillingHistoryById = async (id: string): Promise<BillingHistory> => {
  const { data } = await authClient<BillingHistory>({
    method: 'GET',
    url: BILLING_ENDPOINTS.GET_BY_ID(id),
  });
  return data;
};

/**
 * Create billing history record
 */
export const createBillingHistory = async (
  request: CreateBillingHistoryRequest
): Promise<BillingHistory> => {
  const { data } = await authClient<BillingHistory>({
    method: 'POST',
    url: BILLING_ENDPOINTS.CREATE_BILLING_HISTORY,
    data: request,
  });
  return data;
};
