import type { CVResponse as CVData } from '@/modules/cv/types/cv.types';
import { DownloadPDFButton } from '@/modules/cv/components/preview/DownloadPDFButton';
import { CVPreviewContent } from './CVPreviewContent';

interface CVPreviewProps {
    cvData: CVData;
}

export function CVPreview({ cvData }: CVPreviewProps) {
    return (
        <div className="min-h-screen mt-8 w-full bg-white relative overflow-hidden bg-gray-50">
            <div className="absolute top-0 left-6 z-10">
            </div>
            <CVPreviewContent cvData={cvData} />
        </div>
    );
}