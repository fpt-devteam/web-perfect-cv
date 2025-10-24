import * as React from 'react';
import { cn } from '@/shared/utils/cn.util';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

function Badge({ className, ...props }: Readonly<BadgeProps>) {
  const primaryClasses =
    'border-transparent bg-primary text-primary-foreground hover:bg-primary/80';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        primaryClasses,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
