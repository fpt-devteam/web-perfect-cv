import { ExternalLink, FileUp } from 'lucide-react';

export function ImportOptions() {
  return (
    <>
      <button
        disabled
        className="flex items-center gap-2 text-gray-400 font-medium text-sm cursor-not-allowed opacity-50"
      >
        <ExternalLink className="h-4 w-4" />
        IMPORT YOUR CV FROM LINKEDIN
      </button>

      <div className="flex flex-col gap-2">
        <button
          disabled
          className="flex items-center gap-2 text-gray-400 font-medium text-sm cursor-not-allowed opacity-50"
        >
          <FileUp className="h-4 w-4" /> IMPORT YOUR EXISTING CV
        </button>
        <div className="border border-dashed border-gray-200 rounded-md p-3 text-center bg-gray-50">
          <p className="text-sm text-gray-400">Upload PDF, DOCx CV file</p>
        </div>
        <p className="text-xs text-gray-400 flex items-start gap-1">
          <span className="text-gray-300 font-bold" aria-hidden="true">
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
