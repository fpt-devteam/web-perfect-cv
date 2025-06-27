import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';

export function GoogleSignIn() {
  return (
    <button className="flex items-center justify-center p-2 space-x-2 w-full bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition duration-200">
      <FcGoogle size={20} />
      <span className="text-gray-600 font-medium text-sm">Google</span>
    </button>
  );
}

export function LinkedInSignIn() {
  return (
    <button className="flex items-center justify-center p-2 space-x-2 w-full bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition duration-200">
      <FaLinkedin size={20} className="text-[#0077b5]" />
      <span className="text-gray-600 font-medium text-sm">LinkedIn</span>
    </button>
  );
}

export function AuthProviders({ type = 'login' }: Readonly<{ type?: 'login' | 'register' }>) {
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
        <GoogleSignIn />
        <LinkedInSignIn />
      </div>
    </div>
  );
}
