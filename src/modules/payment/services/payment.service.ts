import { authClient } from '@/modules/auth/services/client.service';
import { PAYMENT_ENDPOINTS } from '../constants/payment-endpoint.constant';
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentInfo,
  PaymentStatusResponse,
  CancelPaymentRequest,
  CancelPaymentResponse,
} from '../types/payment.types';

/**
 * Create a payment link
 */
export const createPayment = async (request: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
  const { data } = await authClient<CreatePaymentResponse>({
    method: 'POST',
    url: PAYMENT_ENDPOINTS.CREATE_PAYMENT,
    data: request,
  });
  return data;
};

/**
 * Get payment information by order code
 */
export const getPaymentInfo = async (orderCode: number): Promise<PaymentInfo> => {
  const { data } = await authClient<PaymentInfo>({
    method: 'GET',
    url: PAYMENT_ENDPOINTS.GET_PAYMENT_INFO(orderCode),
  });
  return data;
};

/**
 * Get payment status by order code
 */
export const getPaymentStatus = async (orderCode: number): Promise<PaymentStatusResponse> => {
  const { data } = await authClient<PaymentStatusResponse>({
    method: 'GET',
    url: PAYMENT_ENDPOINTS.GET_PAYMENT_STATUS(orderCode),
  });
  return data;
};

/**
 * Cancel a payment by order code
 */
export const cancelPayment = async (
  orderCode: number,
  request: CancelPaymentRequest
): Promise<CancelPaymentResponse> => {
  const { data } = await authClient<CancelPaymentResponse>({
    method: 'POST',
    url: PAYMENT_ENDPOINTS.CANCEL_PAYMENT(orderCode),
    data: request,
  });
  return data;
};
