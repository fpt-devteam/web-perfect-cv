import { useNotification } from '@/shared/hooks/useNotification';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { AuthProviders } from '@/modules/auth/components/AuthProviders';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';
import { useLoginWithCredential } from '@/modules/auth/hooks/useLoginWithCredential';
const LoginSchema = zod.object({
  email: zod.string().trim().min(1, 'Email is required').email('Invalid email'),
  password: zod.string().trim(),
});

type LoginFormValues = zod.infer<typeof LoginSchema>;

export function LoginForm() {
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const loginWithCredential = useLoginWithCredential();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    await loginWithCredential.mutateAsync(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          showSuccess('Login successful');
          navigate({ to: '/user-dashboard/cvs' });
        },
        onError: error => {
          showError(error as AxiosError<BaseError>);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Sign in your account</h2>
      </div>
      <div className="flex flex-col space-y-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Your Email"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      {...field}
                    />
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
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-purple-600 hover:underline">
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md transition-colors duration-200"
            >
              Sign In
            </Button>
          </form>
        </Form>
      </div>
      <AuthProviders type="login" />
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>
          First time here?{' '}
          <Link to="/register" className="text-purple-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
