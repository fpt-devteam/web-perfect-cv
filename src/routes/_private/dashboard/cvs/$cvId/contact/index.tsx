import { createFileRoute } from '@tanstack/react-router';
import { CVContactSection } from '@/modules/contact';

export const Route = createFileRoute('/_private/dashboard/cvs/$cvId/contact/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cvId } = Route.useParams();
  return <CVContactSection cvId={cvId} />;
}
