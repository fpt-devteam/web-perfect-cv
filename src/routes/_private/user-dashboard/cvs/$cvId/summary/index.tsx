import { CVSummary } from '@/modules/cv/components/CVSummarSectiony';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private/user-dashboard/cvs/$cvId/summary/',
)({
  component: SummarySectionComponent,
})


function SummarySectionComponent() {
  const { cvId } = Route.useParams();
  return <CVSummary cvId={cvId} />;
}