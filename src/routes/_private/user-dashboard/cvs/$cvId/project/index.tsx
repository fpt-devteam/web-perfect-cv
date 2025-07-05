import { createFileRoute } from '@tanstack/react-router';
import { CVProjectSection } from '@/modules/cv/components/CVProjectSection';

export const Route = createFileRoute('/_private/user-dashboard/cvs/$cvId/project/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cvId } = Route.useParams();
  return <CVProjectSection cvId={cvId} />;
}
