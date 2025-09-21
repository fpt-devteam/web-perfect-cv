import { CVPreview } from '@/modules/cv/components/CVSections';
import { useCVData } from '@/modules/cv/hooks';
import { Spinner } from '@/shared/components/loading/spinner';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/dashboard/cvs/$cvId/preview/')({
  component: PreviewComponent,
});

function PreviewComponent() {
  const { cvId } = Route.useParams();
  const { data, isLoading: isCVLoading, error: cvError } = useCVData(cvId);
  console.log('useCVData:', data);

  if (isCVLoading) {
    return <Spinner />;
  }

  if (!data) {
    return <div>No data available for this CV</div>;
  }

  if (cvError) {
    return <div>Error loading data: {cvError.message}</div>;
  }

  return <CVPreview cvData={data} />;
}
