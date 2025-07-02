import { createFileRoute } from '@tanstack/react-router';
import { CVContactForm } from '@/modules/cv/components/CVContactForm';

export const Route = createFileRoute('/_private/user-dashboard/cvs/$cvId/contact/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cvId } = Route.useParams();
  return <CVContactForm cvId={cvId} />;
}
