import { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from 'react-pdf';
import workerSrc from 'react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min?url';
import { Link } from "@tanstack/react-router";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PdfThumbnailProps {
  file: string | File | Blob;
  width?: number;
  height?: number;
  cvId: string;
}

export const CvPreview: React.FC<PdfThumbnailProps> = ({ file, width = 200, height = 300, cvId }) => {
  const [error, setError] = useState<string | null>(null);

  const fileUrl = file;

  return (
    <Link
      to="/cvs/$cvId"
      params={{ cvId }}
    >
      <div
        className="
        w-[200px]
        h-[300px]
        border border-gray-300
        rounded-lg
        overflow-hidden
        bg-white
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
          onLoadError={(err) => setError(err.message)}
          loading={<div className="flex justify-center items-center h-full text-gray-400 text-sm">Loading PDF...</div>}
          error={<div className="flex justify-center items-center h-full text-red-500 text-sm">Failed to load PDF</div>}
        >
          <Page
            pageNumber={1}
            width={width}
            height={height}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>

        {error && (
          <div className="flex justify-center items-center text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>
    </Link >
  );
};
