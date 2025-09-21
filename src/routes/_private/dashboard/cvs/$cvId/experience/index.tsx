import { ExperienceSection } from '@/modules/cv/components/experience/CVExperienceSection';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/dashboard/cvs/$cvId/experience/')({
  component: ExperienceSectionComponent,
});

function ExperienceSectionComponent() {
  const { cvId } = Route.useParams();
  return <ExperienceSection cvId={cvId} />;
}
