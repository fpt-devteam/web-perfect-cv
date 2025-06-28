import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { CheckCircle, AlertCircle, Home } from 'lucide-react';
import { useActivateAccount } from '@/modules/auth/hooks/useActivateAccount';

export function ActivationAccount({ token }: Readonly<{ token: string }>) {
  const { mutate: activateAccount, isPending, isSuccess, isError, error } = useActivateAccount();

  useEffect(() => {
    activateAccount(token);
  }, [activateAccount, token]);

  const renderContent = () => {
    if (isPending) return <LoadingState />;
    if (isSuccess) return <SuccessState />;
    if (isError) return <ErrorState message={error.message} />;
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">{renderContent()}</div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Activating Account</h2>
      <p className="text-gray-600">Please wait while we verify your account...</p>
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
      <div className="flex justify-center">
        <Button asChild variant="outline" className="gap-2">
          <Link to="/">
            <Home size={16} />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

function SuccessState() {
  return (
    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-md">
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-2" />
        <div>
          <h3 className="text-emerald-800 font-semibold text-lg">Account Activated</h3>
          <div className="text-emerald-700 mt-2">
            <p>Your account has been successfully activated. You can now log in to your account.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }: Readonly<{ message: string }>) {
  return (
    <div className="bg-red-50 border border-red-200 p-4 rounded-md">
      <div className="flex items">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
        <div>
          <h3 className="text-red-800 font-semibold text-lg">Activation Failed</h3>
          <div className="text-red-700 mt-2">
            <p>{message}</p>
            <p className="mt-2">If you continue to have issues, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
