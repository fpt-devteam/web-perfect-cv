import { Suspense } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { HarvardCVDocument } from '@/modules/cv/components/preview/HarvardCVDocument';
import type { CVResponse as CVData } from '@/modules/cv/types/cv.types';

interface DownloadPDFButtonProps {
  cvData: CVData;
}

export function DownloadPDFButton({ cvData }: DownloadPDFButtonProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-gray-200">
      <Suspense
        fallback={
          <Button
            disabled
            size="sm"
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2"
          >
            <Download className="h-4 w-4" />
            Generating...
          </Button>
        }
      >
        <PDFDownloadLink
          document={<HarvardCVDocument cvData={cvData} />}
          fileName={`${cvData.title || 'CV'}_${new Date().toISOString().split('T')[0]}.pdf`}
          className="inline-flex"
        >
          {({ blob, url, loading, error }) => {
            if (loading) {
              return (
                <Button
                  disabled
                  size="sm"
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2"
                >
                  <Download className="h-4 w-4 animate-pulse" />
                  Generating...
                </Button>
              );
            }

            if (error) {
              console.error('PDF Download Error:', error);
              return (
                <Button
                  disabled
                  size="sm"
                  variant="destructive"
                  className="gap-2 px-4 py-2"
                >
                  <Download className="h-4 w-4" />
                  Error
                </Button>
              );
            }

            return (
              <Button
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 transition-all duration-200"
                onClick={e => {
                  try {
                    console.log('PDF Download clicked', { blob, url, loading, error });
                  } catch (err) {
                    console.error('Download click error:', err);
                    e.preventDefault();
                  }
                }}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            );
          }}
        </PDFDownloadLink>
      </Suspense>
    </div>
  );
}