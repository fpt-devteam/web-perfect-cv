import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const sizeClasses = {
  default: 'h-8 w-8',
  sm: 'h-4 w-4',
  lg: 'h-12 w-12',
};

interface SpinnerProps {
  readonly size?: keyof typeof sizeClasses;
}

export function Spinner({ size = 'lg' }: SpinnerProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
    </div>
  );
}
