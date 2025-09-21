import { createFileRoute } from '@tanstack/react-router';
import { CVPreviewPage } from '@/modules/cv/components/CVPreviewPage';
import { useCVData } from '@/modules/cv/hooks/useCVData';

export const Route = createFileRoute('/_private/dashboard/cvs/$cvId/preview/')({
  component: PreviewComponent,
});

function PreviewComponent() {
  // const { cvId } = Route.useParams();
  // const { data, isLoading: isCVLoading, error: cvError } = useCVData(cvId);
  // console.log('useCVData:', data);

  // if (isCVLoading) {
  //   return <div>Cv Preview Page is loading...</div>;
  // }

  // if (!data) {
  //   return <div>No data available for this CV</div>;
  // }

  // if (cvError) {
  //   return <div>Error loading data: {cvError.message}</div>;
  // }

  // return <CVPreviewPage data={data} />;
}
