import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { BillingHistory, PaymentStatus } from '../types/payment.types';

type BillingHistoryTableProps = {
  billingHistory: BillingHistory[];
  onViewDetails?: (orderCode: number) => void;
};

const getStatusBadgeVariant = (status: PaymentStatus) => {
  switch (status) {
    case 'PAID':
      return 'default';
    case 'PENDING':
      return 'secondary';
    case 'CANCELLED':
      return 'destructive';
    case 'EXPIRED':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status: PaymentStatus) => {
  const labels: Record<PaymentStatus, string> = {
    PAID: 'Paid',
    PENDING: 'Pending',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired',
  };
  return labels[status] || status;
};

export function BillingHistoryTable({ billingHistory, onViewDetails }: BillingHistoryTableProps) {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price);
    }
    return `${currency} ${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  if (billingHistory.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No billing history found</p>
        <p className="text-sm mt-2">Your payment history will appear here</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            {/* <TableHead>Package</TableHead> */}
            <TableHead>Order Code</TableHead>
            <TableHead>Amount</TableHead>
            {/* <TableHead>Payment Method</TableHead> */}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {billingHistory.map(record => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">
                {formatDate(record.transactionDate || record.createdAt)}
              </TableCell>
              {/* <TableCell>{record.packageName}</TableCell> */}
              <TableCell>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{record.id}</code>
              </TableCell>
              <TableCell className="font-semibold">{formatPrice(record.amount, 'VND')}</TableCell>
              {/* <TableCell>
                <span className="text-sm text-muted-foreground">{record.paymentMethod}</span>
              </TableCell> */}
              <TableCell>
                <Badge variant={getStatusBadgeVariant(record.status)}>
                  {getStatusLabel(record.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onViewDetails && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(record.orderCode)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" disabled>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
