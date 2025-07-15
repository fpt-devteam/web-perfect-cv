import { createFileRoute } from '@tanstack/react-router';
import { CVContactSection } from '@/modules/cv/components/contact/CVContactSection';

export const Route = createFileRoute('/_private/user-dashboard/cvs/$cvId/contact/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cvId } = Route.useParams();
  return <CVContactSection cvId={cvId} />;
}
