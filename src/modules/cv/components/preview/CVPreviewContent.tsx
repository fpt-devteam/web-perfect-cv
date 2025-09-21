import { Suspense } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { HarvardCVDocument } from '@/modules/cv/components/preview/HarvardCVDocument';
import type { CVResponse as CVData } from '@/modules/cv/types/cv.types';
import { DownloadPDFButton } from './DownloadPDFButton';

interface CVPreviewContentProps {
  cvData: CVData;
}


export function CVPreviewContent({ cvData }: CVPreviewContentProps) {
  return (
    <div className="w-full">
      <div className="flex justify-center">

        <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden">
          {/* <DownloadPDFButton cvData={cvData} /> */}
          <PDFViewer
            width="100%"
            className="rounded-lg scrollbar-hide"
            showToolbar={false}
            style={{
              border: 'none',
              overflow: 'hidden',
              minHeight: '100vh',

            }}
          >
            <HarvardCVDocument cvData={cvData} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}