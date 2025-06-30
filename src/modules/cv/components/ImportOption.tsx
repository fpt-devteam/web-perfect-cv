import { ExternalLink, FileUp } from 'lucide-react';

export function ImportOptions() {
  return (
    <>
      <button className="flex items-center gap-2 text-primary font-medium text-sm">
        <ExternalLink className="h-4 w-4" />
        IMPORT YOUR CV FROM LINKEDIN
      </button>

      <div className="flex flex-col gap-2">
        <button className="flex items-center gap-2 text-primary font-medium text-sm">
          <FileUp className="h-4 w-4" /> IMPORT YOUR EXISTING CV
        </button>
        <div className="border border-dashed border-gray-300 rounded-md p-3 text-center">
          <p className="text-sm text-gray-500">Upload PDF, DOCx CV file</p>
        </div>
        <p className="text-xs text-gray-500 flex items-start gap-1">
          <span className="text-gray-400 font-bold" aria-hidden="true">
            ℹ
          </span>
          <span>
            This process may take up to 60 seconds. Please be patient and keep this page open.
          </span>
        </p>
      </div>
    </>
  );
}
