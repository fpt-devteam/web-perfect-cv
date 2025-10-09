import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { ExternalLink, Copy, CheckCircle, CreditCard, Shield, Clock } from 'lucide-react';
import { useState } from 'react';
import type { CreatePaymentResponse } from '../types/payment.types';

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  paymentData: CreatePaymentResponse | null;
};

export function PaymentModal({ isOpen, onClose, paymentData }: PaymentModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyOrderCode = () => {
    if (paymentData?.orderCode) {
      navigator.clipboard.writeText(paymentData.orderCode.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenCheckout = () => {
    if (paymentData?.checkoutUrl) {
      window.open(paymentData.checkoutUrl, '_blank');
    }
  };

  if (!paymentData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Your Payment</DialogTitle>
          <DialogDescription>
            Click the button below to proceed to PayOS secure payment gateway
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Security Information */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">Secure Payment</p>
              <p className="text-xs text-blue-700">
                Your payment is processed securely through PayOS with bank-level encryption
              </p>
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <div className="space-y-3">
            {paymentData.amount && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-semibold">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: paymentData.currency || 'VND',
                  }).format(paymentData.amount)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Order Code</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{paymentData.orderCode}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyOrderCode}
                  className="h-8 w-8 p-0"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {paymentData.createdAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Created At</span>
                <span className="text-sm">
                  {new Date(paymentData.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
            )}

            {paymentData.description && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">Description</span>
                <span className="text-sm text-right max-w-[200px]">{paymentData.description}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button onClick={handleOpenCheckout} className="w-full h-12" size="lg">
              <CreditCard className="h-5 w-5 mr-2" />
              Proceed to Payment
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full">
              Cancel
            </Button>
          </div>

          {/* Payment Instructions */}
          <div className="space-y-2 pt-2">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Payment link is valid for 15 minutes
              </p>
            </div>
            <div className="flex items-start gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                You'll be redirected to PayOS in a new window
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
