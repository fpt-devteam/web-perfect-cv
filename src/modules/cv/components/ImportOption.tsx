import { type ChangeEvent, forwardRef, useEffect, useRef } from 'react';
import { FileUp, X } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn.util';

type ImportOptionsProps = {
  readonly selectedFile?: File;
  readonly onSelectFile: (file: File | undefined) => void;
  readonly isInvalid?: boolean;
};

export const ImportOptions = forwardRef<HTMLDivElement, ImportOptionsProps>(
  ({ selectedFile, onSelectFile, isInvalid }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!selectedFile && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, [selectedFile]);

    const handleBrowseClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      onSelectFile(file ?? undefined);
    };

    const handleRemoveFile = () => {
      onSelectFile(undefined);
    };

    return (
      <div ref={ref} className="space-y-3">
        {/* <button
          disabled
          className="flex items-center gap-2 text-gray-400 font-medium text-sm cursor-not-allowed opacity-50"
          type="button"
        >
          <ExternalLink className="h-4 w-4" />
          IMPORT YOUR CV FROM LINKEDIN
        </button> */}

        <div
          className={cn(
            'rounded-lg border border-dashed bg-gray-50 p-6 text-center transition-colors',
            isInvalid ? 'border-destructive bg-destructive/5' : 'border-gray-200'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center gap-4">
            <FileUp className="h-10 w-10 text-gray-400" aria-hidden="true" />

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Import your existing CV</p>
              <p className="text-xs text-gray-500">
                Upload a PDF version of your CV to speed up the creation process.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button type="button" variant="outline" onClick={handleBrowseClick}>
                Select PDF file
              </Button>
              {selectedFile ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleRemoveFile}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" aria-hidden="true" /> Remove file
                </Button>
              ) : null}
            </div>

            {selectedFile ? (
              <div className="rounded-md bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm">
                {selectedFile.name}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Only PDF files up to 10MB are supported.</p>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 flex items-start gap-1">
          <span className="text-gray-300 font-bold" aria-hidden="true">
            ℹ
          </span>
          <span>This process may take up to 60 seconds. Please keep this page open during the import.</span>
        </p>
      </div>
    );
  }
);

ImportOptions.displayName = 'ImportOptions';
