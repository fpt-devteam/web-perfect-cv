import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import type { ReactNode } from '@tanstack/react-router';
import { ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';

function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />;
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props} />;
}

interface CollapsibleFilterProps {
  title: string;
  children: ReactNode;
  handleOnClick: () => void;
  defaultOpen?: boolean;
  className?: string;
}

const CollapsibleFilter: React.FC<CollapsibleFilterProps> = ({
  title,
  children,
  handleOnClick,
  defaultOpen = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <div className="relative">
        <div className="flex items-center justify-between w-full py-3 px-1">
          <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left hover:opacity-70 transition-opacity">
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 text-muted-foreground ${
                isOpen ? 'rotate-0' : '-rotate-90'
              }`}
            />
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          </CollapsibleTrigger>
          <Button
            variant="outline"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              handleOnClick();
            }}
            className="ml-2 h-7 px-2 text-xs gap-1 hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <CollapsibleContent className="pb-3 pl-6 pr-1">
        <div className="space-y-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleFilter };
