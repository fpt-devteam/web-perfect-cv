import { createFileRoute } from '@tanstack/react-router'
import { CVEducationSection } from '@/modules/cv/components/CVEducationSection';

export const Route = createFileRoute(
  '/_private/user-dashboard/cvs/$cvId/education/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { cvId } = Route.useParams();
  return <CVEducationSection cvId={cvId} />
}
