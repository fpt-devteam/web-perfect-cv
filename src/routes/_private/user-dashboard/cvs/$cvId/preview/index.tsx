import { createFileRoute } from '@tanstack/react-router';
import { CVPreviewPage } from '@/modules/cv/components/CVPreviewPage';

export const Route = createFileRoute('/_private/user-dashboard/cvs/$cvId/preview/')({
  component: PreviewComponent,
});

function PreviewComponent() {
  const { cvId } = Route.useParams();
  return <CVPreviewPage cvId={cvId} />;
}
