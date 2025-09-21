import { CVSummarySection as CVSummary } from '@/modules/summary';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/dashboard/cvs/$cvId/summary/')({
  component: SummarySectionComponent,
});

function SummarySectionComponent() {
  const { cvId } = Route.useParams();
  return <CVSummary cvId={cvId} />;
}
