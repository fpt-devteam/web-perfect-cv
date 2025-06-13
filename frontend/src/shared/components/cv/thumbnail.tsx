import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import workerSrc from 'react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min?url';
import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PdfThumbnailProps {
  file: string | File | Blob;
  width?: number;
  height?: number;
  cvId: string;
}

export const CvPreview: React.FC<PdfThumbnailProps> = ({
  file,
  width = 250,
  height = 350,
  cvId,
}) => {
  const [error, setError] = useState<string | null>(null);

  const fileUrl = file;

  return (
    <Link to="/cvs/$cvId" params={{ cvId }}>
      <div
        className="
        border border-gray-300
        rounded-lg
        overflow-hidden
        shadow
        hover:shadow-lg
        transition
        duration-200
        ease-in-out
        transform
        hover:scale-[1.02]
      "
        style={{ width, height }}
      >
        <Document
          file={fileUrl}
          onLoadError={err => setError(err.message)}
          loading={
            <div className="flex justify-center items-center h-full">
              <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
            </div>
          }
          error={
            <div className="flex justify-center items-center h-full text-red-500 text-sm">
              Failed to load PDF
            </div>
          }
        >
          <Page
            pageNumber={1}
            width={width}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>

        {error && (
          <div className="flex justify-center items-center text-red-500 text-sm">{error}</div>
        )}
      </div>
    </Link>
  );
};

export function CreateCard() {
  return (
    <Link
      to="/cvs/create"
      className="
        flex flex-col items-center justify-center
        border border-gray-300
        rounded-lg
        overflow-hidden
        shadow
        hover:shadow-lg
        transition duration-200 ease-in-out transform hover:scale-[1.02]
        w-[250px]
        h-[350px]
      "
    >
      <Plus className="text-gray-400 w-10 h-10" />
      <span className="text-gray-500 mt-2">Create new resume</span>
    </Link>
  );
}
