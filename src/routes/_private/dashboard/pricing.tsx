import { createFileRoute } from '@tanstack/react-router';
import { PackageCard } from '@/modules/payment/components/PackageCard';
import { PaymentModal } from '@/modules/payment/components/PaymentModal';
import { useActivePackages, useCreatePayment } from '@/modules/payment/hooks';
import { Spinner } from '@/shared/components/loading/spinner';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { AlertCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { CreatePaymentResponse } from '@/modules/payment/types/payment.types';

export const Route = createFileRoute('/_private/dashboard/pricing')({
  component: PricingPage,
});

function PricingPage() {
  const { data: packages, isLoading, error } = useActivePackages();
  const createPaymentMutation = useCreatePayment();
  const [paymentData, setPaymentData] = useState<CreatePaymentResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPackage = async (packageId: string) => {
    try {
      const response = await createPaymentMutation.mutateAsync({ packageId });
      setPaymentData(response);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to create payment:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPaymentData(null);
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
            Failed to load packages. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Sort packages by displayOrder (if available) or by price
  const sortedPackages = packages?.sort((a, b) => {
    // If both have displayOrder, use it
    if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
      return a.displayOrder - b.displayOrder;
    }
    // Otherwise sort by price (ascending)
    return a.price - b.price;
  }) || [];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock powerful features to create the perfect CV and land your dream job
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {sortedPackages.map((pkg, index) => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            onSelect={handleSelectPackage}
            isLoading={createPaymentMutation.isPending}
            isPopular={pkg.name.toLowerCase() === 'premium' || index === 1}
          />
        ))}
      </div>

      {/* FAQ or Additional Info */}
      <div className="max-w-3xl mx-auto mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">How does the payment work?</p>
            <p>
              We use PayOS for secure payment processing. You'll be redirected to their platform to
              complete your payment.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">Can I cancel my subscription?</p>
            <p>
              Yes, you can cancel at any time. Your access will continue until the end of your
              billing period.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">Do you offer refunds?</p>
            <p>
              We offer a 7-day money-back guarantee if you're not satisfied with our service.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={isModalOpen} onClose={handleCloseModal} paymentData={paymentData} />
    </div>
  );
}
