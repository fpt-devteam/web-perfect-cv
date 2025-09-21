import { createFileRoute } from '@tanstack/react-router';
import { CertificationSection } from '@/modules/certification';

export const Route = createFileRoute('/_private/dashboard/cvs/$cvId/certifications/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cvId } = Route.useParams();
  return <CertificationSection cvId={cvId} />;
}
