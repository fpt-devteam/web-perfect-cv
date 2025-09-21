import { createFileRoute } from '@tanstack/react-router';
import { EducationSection } from '@/modules/education';

export const Route = createFileRoute('/_private/dashboard/cvs/$cvId/education/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cvId } = Route.useParams();
  return <EducationSection cvId={cvId} />;
}
