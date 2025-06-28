import { Button } from '@/shared/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';
import { useGetLoginLink } from '@/modules/auth/hooks/useGetLoginLink';
import { AUTH_PROVIDER } from '@/modules/auth/constants/auth.constant';
import { useNotification } from '@/shared/hooks/useNotification';

export function GoogleSignIn({ onClick }: Readonly<{ onClick: () => void }>) {
  return (
    <Button
      variant="outline"
      className="flex items-center justify-center p-2 space-x-2 w-full bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition duration-200"
      onClick={onClick}
    >
      <FcGoogle size={24} />
      <span className="text-gray-600 font-medium text-sm">Google</span>
    </Button>
  );
}

export function LinkedInSignIn() {
  return (
    <Button
      variant="outline"
      className="flex items-center justify-center p-2 space-x-2 w-full bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition duration-200"
    >
      <FaLinkedin size={24} className="text-[#0077b5]" />
      <span className="text-gray-600 font-medium text-sm">LinkedIn</span>
    </Button>
  );
}

export function AuthProviders({ type = 'login' }: Readonly<{ type?: 'login' | 'register' }>) {
  const getLoginLink = useGetLoginLink(AUTH_PROVIDER.Google, { enabled: false });
  const { showError } = useNotification();
  const handleGoogleSignInClick = async () => {
    const { data } = await getLoginLink.refetch();
    if (!data?.url) {
      showError('Failed to get login link');
    }
    window.location.href = data!.url;
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="flex justify-center text-sm">
          <span className="px-2 text-gray-500">
            {type === 'login' ? 'or use your email' : 'or sign up with'}
          </span>
        </div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <GoogleSignIn onClick={handleGoogleSignInClick} />
        <LinkedInSignIn />
      </div>
    </div>
  );
}
