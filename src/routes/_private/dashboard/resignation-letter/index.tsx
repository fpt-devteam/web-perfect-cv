import CommingSoon from '@/shared/components/comming-soon-page/CommingSoon';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/dashboard/resignation-letter/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CommingSoon />;
}
