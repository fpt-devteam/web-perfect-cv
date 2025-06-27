import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { AuthProviders } from '@/modules/auth/components/AuthProviders';
import { useNotification } from '@/shared/hooks/useNotification';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';
import { Button } from '@/shared/components/ui/button';

const RegisterSchema = zod.object({
  email: zod.string().trim().min(1, 'Email is required').email('Invalid email'),
  password: zod
    .string()
    .trim()
    .min(1, 'Password is required.')
    .min(6, 'Password must be at least 6 characters long.')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
      'Password must contain at least one letter, one number, and one special character.'
    ),
  termsAccepted: zod.boolean().refine(val => val === true, {
    message: 'You must accept the terms of service and privacy policy',
  }),
  subscribeToNewsletter: zod.boolean().optional(),
});

type RegisterFormValues = zod.infer<typeof RegisterSchema>;

export function RegisterForm() {
  const { showSuccess, showError } = useNotification();
  const { registerWithCredentials, resendActivationEmail } = useAuth();
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const [showResendButton, setShowResendButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      termsAccepted: false,
      subscribeToNewsletter: false,
    },
  });

  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);
    await registerWithCredentials.mutateAsync(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          showSuccess('Registration successful. Please check your email to activate your account.');
          setRegisteredEmail(data.email);
          setShowResendButton(true);
          setIsLoading(false);
        },
        onError: error => {
          showError(error as AxiosError<BaseError>);
          setIsLoading(false);
        },
      }
    );
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    await resendActivationEmail.mutateAsync(registeredEmail, {
      onSuccess: () => {
        showSuccess('Activation email has been resent. Please check your inbox.');
        setIsLoading(false);
      },
      onError: error => {
        showError(error as AxiosError<BaseError>);
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
      </div>

      <div className="flex flex-col space-y-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email*"
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
                      placeholder="Password*"
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
              name="termsAccepted"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input
                        type="checkbox"
                        className="h-4 w-4 text-emerald-500 border-gray-300 rounded"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <span className="text-sm text-gray-600">
                      I agree to <button className="text-purple-600">Terms of Service</button> and{' '}
                      <button className="text-purple-600">Privacy policy*</button>
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscribeToNewsletter"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input
                        type="checkbox"
                        className="h-4 w-4 text-emerald-500 border-gray-300 rounded"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <span className="text-sm text-gray-600">
                      Email me tailored resume advice & updates
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full py-3 px-4 cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md transition-colors duration-200 flex items-center justify-center"
            >
              CREATE AN ACCOUNT
            </Button>

            {showResendButton && (
              <Button
                type="button"
                variant="outline"
                onClick={handleResendEmail}
                disabled={isLoading}
                className="w-full py-3 px-4 cursor-pointer border border-emerald-500 text-emerald-500 font-medium rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                RESEND ACTIVATION EMAIL
              </Button>
            )}
            <AuthProviders type="register" />

            <div className="text-center text-sm text-gray-500 mt-4">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
