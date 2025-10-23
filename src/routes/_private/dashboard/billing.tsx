import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useBillingHistory } from '@/modules/payment/hooks';
import { BillingHistoryTable } from '@/modules/payment/components/BillingHistoryTable';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Spinner } from '@/shared/components/loading/spinner';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { AlertCircle, CreditCard, ArrowLeft, ExternalLink } from 'lucide-react';

export const Route = createFileRoute('/_private/dashboard/billing')({
  component: BillingPage,
});

function BillingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: billingHistory, isLoading, error } = useBillingHistory(user?.id || '', !!user?.id);

  const handleViewDetails = (orderCode: number) => {
    navigate({ to: '/dashboard/payment-status', search: { orderCode: orderCode.toString() } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load billing history. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Use totalCredit from user profile for total spend, fallback to calculated value
  const totalSpent =
    user?.totalCredit ||
    billingHistory?.reduce((sum, record) => {
      return record.status === 'PAID' ? sum + record.amount : sum;
    }, 0) ||
    0;

  const paidTransactions = billingHistory?.filter(record => record.status === 'PAID').length || 0;

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Billing History</h1>
          </div>
          <p className="text-muted-foreground">View and manage your payment history and invoices</p>
        </div>
        <Button onClick={() => navigate({ to: '/dashboard/pricing' })} variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Plans
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Credits</CardDescription>
            <CardTitle className="text-2xl">
              {new Intl.NumberFormat('vi-VN', {}).format(totalSpent)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-2xl">{billingHistory?.length || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Used Credits</CardDescription>
            <CardTitle className="text-2xl">{user?.usedCredit || paidTransactions}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Billing History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>A complete list of all your payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <BillingHistoryTable
            billingHistory={billingHistory || []}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="flex justify-start">
        <Button onClick={() => navigate({ to: '/dashboard/cvs' })} variant="ghost">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
