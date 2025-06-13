import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import { AuthProvider } from '@/modules/auth/stores/auth.stores';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { NotFound } from '@/shared/components/feedback/NotFound';
import { InternalServerError } from '@/shared/components/feedback/InternalServerError';
import { Toaster } from 'react-hot-toast';
import { SpinnerPage } from '@/shared/components/spinnerPage/SpinnerPage';

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
  defaultErrorComponent: () => <InternalServerError />,
  defaultPendingComponent: () => <SpinnerPage />,
  defaultNotFoundComponent: () => <NotFound />,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
      <Toaster position="top-right" reverseOrder={false}></Toaster>
    </AuthProvider>
  );
}

export default App;
