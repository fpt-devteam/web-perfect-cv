import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import '@/styles/index.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import { InternalServerError } from '@/shared/components/error-pages/InternalServerError';
import { Spinner } from '@/shared/components/loading/Spinner';
import { NotFound } from '@/shared/components/error-pages/NotFound';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { tanstackClient } from '@/config/tanstack-query.config';
import { ROUTE_PENDING_DELAY } from '@/config/app.config';
import { Pending } from './shared/components/loading/Pending';
import { useNotification } from '@/shared/hooks/useNotification';
import { Toaster } from 'sonner';

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    notification: undefined!,
  },
  defaultErrorComponent: () => <InternalServerError />,
  defaultPendingComponent: () => <Spinner size="lg" />,
  defaultNotFoundComponent: () => <NotFound />,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={tanstackClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

export function App() {
  const auth = useAuth();
  const notification = useNotification();
  return (
    <>
      <RouterProvider
        router={router}
        context={{ auth, notification }}
        defaultPendingComponent={Pending}
        defaultPendingMs={ROUTE_PENDING_DELAY}
      />
      <Toaster position="top-right" />
    </>
  );
}
