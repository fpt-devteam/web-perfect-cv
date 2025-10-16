import { Rocket, Sparkles, Clock } from 'lucide-react';

import { cn } from '@/shared/utils/cn.util';
import { Badge } from '@/shared/components/ui/badge';

type CommingSoonProps = {
  title?: string;
  description?: string;
  featureName?: string;
  className?: string;
  estimatedDate?: string;
};

export default function CommingSoon({
  title = 'Coming Soon',
  description = "We're working hard to bring you something amazing. This feature is currently under development and will be available soon!",
  featureName,
  className,
  estimatedDate,
}: CommingSoonProps) {
  return (
    <div
      className={cn('flex h-full min-h-[500px] items-center justify-center px-4 py-12', className)}
    >
      <div className="w-full max-w-2xl">
        {/* Animated Icon Container */}
        <div className="relative mx-auto mb-8 flex size-24 items-center justify-center">
          {/* Pulsing Background */}
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5" />
          <div className="absolute inset-2 animate-pulse rounded-full bg-primary/10 animation-delay-150" />

          {/* Icon */}
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
            <Rocket className="size-8 text-white" />
          </div>

          {/* Sparkle Decorations */}
          <Sparkles className="absolute -right-2 -top-2 size-5 text-primary/60 animate-pulse" />
          <Sparkles className="absolute -left-1 -bottom-1 size-4 text-primary/40 animate-pulse animation-delay-300" />
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          {/* Badge */}
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              <Clock className="mr-1.5 h-3 w-3" />
              Under Development
            </Badge>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
            {featureName && (
              <>
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {featureName}
                </span>
              </>
            )}
          </h2>

          {/* Description */}
          <p className="mx-auto max-w-xl text-base text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Estimated Date */}
          {estimatedDate && (
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Expected Release:{' '}
                <span className="font-medium text-foreground">{estimatedDate}</span>
              </p>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="pt-6">
            <div className="mx-auto w-full max-w-xs">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-primary to-primary/70" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">We're making great progress...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
