import { createFileRoute } from '@tanstack/react-router';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';

export const Route = createFileRoute('/_auth/register')({
  component: RegisterComponent,
});

export function RegisterComponent() {
  return <RegisterForm />;
}
