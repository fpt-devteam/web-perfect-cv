import { useToaster } from '@/shared/hooks/useToaster';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useLogin } from '@/modules/auth/hooks/useLogin';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
            onSuccess: (response) => {
                if (response) {
                    auth.login(response);
                    navigate({ to: "/" });
                    toaster.success("Login successful");
                } else {
                    toaster.error("Login failed");
                }
            },
            onError: (error: Error) => {
                toaster.error(error.message || "Login failed");
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-6 bg-white shadow-md rounded-lg p-6">
                <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-800">Login Page</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Login to see all the cool content in here.
                    </p>
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

                            <button
                                type="submit"
                                className="w-full py-2 px-4 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-600"
                            >
                                {isPending ? 'Loading...' : 'Login'}
                            </button>
                        </fieldset>
                    </form>
                </Form>
            </div>
        </div>
    );
}
