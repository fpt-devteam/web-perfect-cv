import { Input } from '@/shared/components/input/Input';
import { useToaster } from '@/shared/hooks/useToaster';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useLogin } from '@/modules/auth/hooks/useLogin';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/login')({
    component: LoginComponent,
})

export function LoginComponent() {
    const auth = useAuth();
    const toaster = useToaster();
    const navigate = useNavigate();

    const { mutate, isPending } = useLogin();

    const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        const data = new FormData(evt.currentTarget);
        const userNameField = data.get('username');
        const passwordField = data.get('password');

        if (!userNameField || !passwordField) {
            toaster.error("Please fill in username and password");
            return;
        }

        const loginReq = {
            username: String(userNameField),
            password: String(passwordField),
        };

        mutate(loginReq, {
            onSuccess: (data) => {
                if (data) {
                    auth.login(data);
                    navigate({ to: "/" });
                    toaster.success("Login successful");
                }
                else {
                    toaster.error("Login failed");
                }
            },
            onError: (error: any) => {
                toaster.error(error.message || "Login failed");
            },
        });
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md space-y-6 bg-white shadow-md rounded-lg p-6">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-gray-800">Login Page</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            Login to see all the cool content in here.
                        </p>
                    </div>

                    <form onSubmit={onFormSubmit}>
                        <fieldset disabled={isPending} className="space-y-4">
                            <Input label="Username" type="text" />
                            <Input label="Password" type="password" />
                            <button
                                type="submit"
                                className="w-full py-2 px-4 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-600"
                            >
                                {isPending ? 'Loading...' : 'Login'}
                            </button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </>
    );
}
