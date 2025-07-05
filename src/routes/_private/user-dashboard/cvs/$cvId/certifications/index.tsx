import { createFileRoute } from '@tanstack/react-router';
import { CVCertificationSection } from '@/modules/cv/components/CVCertificationSection';

export const Route = createFileRoute('/_private/user-dashboard/cvs/$cvId/certifications/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cvId } = Route.useParams();
  return <CVCertificationSection cvId={cvId} />;
}
