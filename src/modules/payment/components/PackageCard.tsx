import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import type { Package } from '../types/payment.types';

type PackageCardProps = {
  package: Package;
  onSelect: (packageId: string) => void;
  isLoading?: boolean;
  isPopular?: boolean;
};

export function PackageCard({ package: pkg, onSelect, isLoading, isPopular }: PackageCardProps) {
  const formatPrice = (price: number, currency?: string) => {
    const curr = currency || 'VND';
    if (curr === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price);
    }
    return `${curr} ${price.toLocaleString()}`;
  };

  // Generate default features based on numCredits if features are not provided
  const features = pkg.features && pkg.features.length > 0
    ? pkg.features
    : [
        `${pkg.numCredits} AI-powered CV analysis credits`,
        'Detailed feedback and suggestions',
        'ATS-friendly CV optimization',
        'Export in multiple formats',
        'Priority email support',
      ];

  return (
    <Card
      className={`relative overflow-hidden transition-all hover:shadow-lg ${
        isPopular ? 'border-2 border-primary shadow-md' : ''
      }`}
    >
      {isPopular && (
        <Badge className="absolute top-4 right-4 bg-primary text-white">
          <Sparkles className="h-3 w-3 mr-1" />
          Popular
        </Badge>
      )}

      <CardHeader className="space-y-4">
        <div>
          <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
          {pkg.description && (
            <CardDescription className="mt-2">{pkg.description}</CardDescription>
          )}
          {!pkg.description && (
            <CardDescription className="mt-2">
              {pkg.numCredits} credits for CV analysis and optimization
            </CardDescription>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{formatPrice(pkg.price, pkg.currency)}</span>
          {pkg.durationDays && (
            <span className="text-muted-foreground">/ {pkg.durationDays} days</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Button
          onClick={() => onSelect(pkg.id)}
          disabled={isLoading}
          className="w-full"
          variant={isPopular ? 'default' : 'outline'}
          size="lg"
        >
          {isLoading ? 'Processing...' : 'Get Started'}
        </Button>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">What's included:</p>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
