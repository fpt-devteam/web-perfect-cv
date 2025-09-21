import { createFileRoute } from '@tanstack/react-router';
import { CVSkillSection } from '@/modules/cv/components/CVSkillSection';

export const Route = createFileRoute('/_private/dashboard/cvs/$cvId/skills/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cvId } = Route.useParams();

  return <CVSkillSection cvId={cvId} />;
}
