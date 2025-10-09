// Payment endpoints
export const PAYMENT_ENDPOINTS = {
  CREATE_PAYMENT: '/api/payment/create-payment',
  GET_PAYMENT_INFO: (orderCode: number) => `/api/payment/payment-info/${orderCode}`,
  CANCEL_PAYMENT: (orderCode: number) => `/api/payment/payment/${orderCode}/cancel`,
  GET_PAYMENT_STATUS: (orderCode: number) => `/api/payment/status/${orderCode}`,
  PAYMENT_WEBHOOK: '/api/payment/receive-hook',
} as const;

// Package endpoints
export const PACKAGE_ENDPOINTS = {
  GET_ACTIVE_PACKAGES: '/api/packages/active',
  GET_PACKAGE_BY_ID: (id: string) => `/api/packages/${id}`,
  GET_PACKAGE_BY_NAME: (name: string) => `/api/packages/by-name/${name}`,
} as const;

// Billing history endpoints
export const BILLING_ENDPOINTS = {
  GET_BY_USER_ID: (userId: string) => `/api/billing-histories/user/${userId}`,
  GET_BY_ID: (id: string) => `/api/billing-histories/${id}`,
  CREATE_BILLING_HISTORY: '/api/billing-histories',
} as const;
