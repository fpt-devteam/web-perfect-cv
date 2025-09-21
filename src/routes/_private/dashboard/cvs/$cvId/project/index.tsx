import { createFileRoute } from '@tanstack/react-router';
import { ProjectSection } from '@/modules/project';

export const Route = createFileRoute('/_private/dashboard/cvs/$cvId/project/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cvId } = Route.useParams();
  return <ProjectSection cvId={cvId} />;
}
