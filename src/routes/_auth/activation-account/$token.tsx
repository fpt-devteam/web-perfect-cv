import { createFileRoute } from '@tanstack/react-router';
import { ActivationAccount } from '@/modules/auth/components/ActivationAccount';

export const Route = createFileRoute('/_auth/activation-account/$token')({
  component: IndexRouteComponent,
});

export function IndexRouteComponent() {
  return <ActivationAccount token={Route.useParams().token} />;
}
