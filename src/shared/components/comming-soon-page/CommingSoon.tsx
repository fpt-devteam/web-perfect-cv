import { Rocket } from 'lucide-react';

import { cn } from '@/shared/utils/cn.util';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

type CommingSoonProps = {
  title?: string;
  description?: string;
  featureName?: string;
  className?: string;
};

export default function CommingSoon({
  title = 'Coming soon',
  description = "We're polishing this feature to make it great. Thanks for your patience!",
  featureName,
  className,
}: CommingSoonProps) {
  return (
    <div
      className={cn('flex h-full min-h-[360px] items-center justify-center px-4 py-10', className)}
    >
      <Card className="w-full max-w-xl border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Rocket className="size-6" />
          </div>
          <CardTitle className="text-2xl">
            {title} {featureName && <span className="text-primary">· {featureName}</span>}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
