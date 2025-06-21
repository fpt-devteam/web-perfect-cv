import { useToaster } from '@/shared/hooks/use-toaster';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useLogin } from '@/modules/auth/hooks/use-login';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FcGoogle } from 'react-icons/fc';

export const Route = createFileRoute('/auth/login')({
  component: LoginComponent,
});

const LoginSchema = zod.object({
  username: zod.string().trim().min(1, 'Username is required').email('Invalid email'),
  password: zod.string().trim().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = zod.infer<typeof LoginSchema>;

export function LoginComponent() {
  const auth = useAuth();
  const toaster = useToaster();
  const navigate = useNavigate();

  const { mutate, isPending } = useLogin();

  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginForm) => {
    mutate(data, {
      onSuccess: response => {
        if (response) {
          auth.login(response);
          navigate({ to: '/' });
          toaster.success('Login successful');
        } else {
          toaster.error('Login failed');
        }
      },
      onError: (error: Error) => {
        toaster.error(error.message || 'Login failed');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 bg-white shadow-md rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800">Login Page</h3>
          <p className="text-sm text-gray-500 mt-2">Login to see all the cool content in here.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isPending} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-3">
                <Input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  defaultChecked
                />
                <Label className="text-sm text-gray-600">Remember me</Label>

                <div className="ml-auto text-sm text-gray-500">
                  <a
                    href="/api/auth/forgot-password"
                    className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-600"
              >
                {isPending ? 'Loading...' : 'Login'}
              </button>
            </fieldset>
          </form>
        </Form>
        <div className="text-center text-sm text-gray-500 space-y-4">
          <GoogleSignIn />

          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Don't have an account?{' '}
              <a
                href="/api/auth/register"
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign up
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const GoogleSignIn: React.FC = () => {
  return (
    <div id="gSignInWrapper" className="text-center text-sm text-gray-500">
      <div
        id="customBtn"
        className="flex items-center justify-center p-2 space-x-2 w-full bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-200 transition duration-200"
      >
        <FcGoogle size={24} />
        <span className="buttonText text-gray-600 font-semibold text-sm">Continue with Google</span>
      </div>
    </div>
  );
};
