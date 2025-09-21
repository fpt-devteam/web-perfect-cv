import { createFileRoute } from '@tanstack/react-router';
import { SkillSection } from '@/modules/skill';

export const Route = createFileRoute('/_private/dashboard/cvs/$cvId/skills/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cvId } = Route.useParams();

  return <SkillSection cvId={cvId} />;
}
