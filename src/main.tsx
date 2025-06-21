import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/styles/index.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import { InternalServerError } from '@/shared/components/error-pages/internal-server-error';
import { Spinner } from '@/shared/components/loading/spinner';
import { NotFound } from '@/shared/components/error-pages/not-found';
import { useAuth } from './modules/auth/hooks/use-auth';
import { AuthProvider } from './modules/auth/stores/auth.stores';
import { Toaster } from 'react-hot-toast';
const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
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
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

export function App() {
  return (
    <AuthProvider>
      <InnerApp />
      <Toaster position="top-right" reverseOrder={false}></Toaster>
    </AuthProvider>
  );
}
