export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';

export type Package = {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  durationDays?: number;
  features?: string[];
  isActive: boolean;
  displayOrder?: number;
  numCredits: number;
  totalPurchases: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePaymentRequest = {
  packageId: string;
};

export type CreatePaymentResponse = {
  checkoutUrl: string;
  qrCode: string;
  orderCode: number;
  createdAt: string;
  paymentLinkId?: string;
  amount?: number;
  currency?: string;
  description?: string;
};

export type PaymentInfo = {
  orderCode: number;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  status: PaymentStatus;
  createdAt: string;
  transactionDateTime: string;
  description: string;
  accountNumber: string;
  reference: string;
  counterAccountBankId: string;
  counterAccountBankName: string;
  counterAccountName: string;
  counterAccountNumber: string;
  virtualAccountName: string;
  virtualAccountNumber: string;
};

export type PaymentStatusResponse = {
  orderCode: number;
  status: PaymentStatus;
  amount: number;
  createdAt: string;
  transactionDateTime: string;
};

export type CancelPaymentRequest = {
  cancellationReason: string;
};

export type CancelPaymentResponse = {
  orderCode: number;
  status: PaymentStatus;
  cancelledAt: string;
};

export type BillingHistory = {
  id: string;
  userId: string;
  packageId: string;
  packageName: string;
  amount: number;
  currency: string;
  orderCode: number;
  status: PaymentStatus;
  paymentMethod: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBillingHistoryRequest = {
  userId: string;
  packageId: string;
  amount: number;
  currency: string;
  orderCode: number;
  status: PaymentStatus;
  paymentMethod: string;
  transactionDate: string;
};
