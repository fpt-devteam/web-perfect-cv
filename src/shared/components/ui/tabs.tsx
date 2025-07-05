import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/shared/utils/cn.util';

interface TabsContextType {
  selected: string;
  setSelected: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components cannot be rendered outside the Tabs component');
  }
  return context;
};

export function Tabs(props: {
  children: React.ReactNode;
  className?: string;
  defaultValue?: string;
}) {
  const [selected, setSelected] = React.useState(props.defaultValue || '');

  return (
    <TabsContext.Provider value={{ selected, setSelected }}>
      <div className={cn('', props.className)}>{props.children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList(props: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export const TabsTrigger = (props: {
  children: React.ReactNode;
  className?: string;
  value: string;
}) => {
  const context = useTabsContext();

  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        props.className
      )}
      data-state={context.selected === props.value ? 'active' : 'inactive'}
      to={props.value}
      onClick={() => context.setSelected(props.value)}
    >
      {props.children}
    </Link>
  );
};

export function TabsContent(props: {
  children: React.ReactNode;
  className?: string;
  value: string;
}) {
  const context = useTabsContext();

  if (context.selected !== props.value) {
    return null;
  }

  return (
    <div
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
