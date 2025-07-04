import React, { useState, Suspense } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2, AlertCircle, FileText, Eye } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { HarvardCVDocument } from './HarvardCVDocument';
import { CVHTMLPreview } from './CVHTMLPreview';
import type { CVData } from '../types/cv.types';

interface CVPDFViewerProps {
  cvData: CVData | null;
  isLoading?: boolean;
  error?: string | null;
}

export const CVPDFViewer: React.FC<CVPDFViewerProps> = ({
  cvData,
  isLoading = false,
  error = null,
}) => {
  const [viewMode, setViewMode] = useState<'pdf' | 'html'>('pdf');

  const handleViewModeChange = (mode: 'pdf' | 'html') => {
    setViewMode(mode);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="shadow-lg border-gray-200">
        <CardContent className="p-0">
          <div
            className="w-full bg-white rounded-lg border border-gray-200 flex items-center justify-center"
            style={{ height: '842px' }}
          >
            <div className="text-center text-gray-500">
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-spin" />
              <p className="text-lg font-medium text-gray-800">Loading CV...</p>
              <p className="text-sm text-gray-600">Please wait while we fetch your CV data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="shadow-lg border-gray-200">
        <CardContent className="p-0">
          <div
            className="w-full bg-white rounded-lg border border-gray-200 flex items-center justify-center"
            style={{ height: '842px' }}
          >
            <div className="text-center text-red-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <p className="text-lg font-medium text-red-800">Error Loading CV</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!cvData) {
    return (
      <Card className="shadow-lg border-gray-200">
        <CardContent className="p-0">
          <div
            className="w-full bg-white rounded-lg border border-gray-200 flex items-center justify-center"
            style={{ height: '842px' }}
          >
            <div className="text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-800">No CV Data</p>
              <p className="text-sm text-gray-600">CV data is not available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-gray-200 bg-white">
      <CardContent className="p-0">
        <div className="relative">
          {/* Header Controls */}
          <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-center">
            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white/95 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-gray-200">
              <Button
                size="sm"
                variant={viewMode === 'pdf' ? 'default' : 'ghost'}
                onClick={() => handleViewModeChange('pdf')}
                className={`gap-2 transition-all duration-200 rounded-lg px-4 py-2 ${
                  viewMode === 'pdf'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-4 w-4" />
                PDF View
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'html' ? 'default' : 'ghost'}
                onClick={() => handleViewModeChange('html')}
                className={`gap-2 transition-all duration-200 rounded-lg px-4 py-2 ${
                  viewMode === 'html'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Eye className="h-4 w-4" />
                HTML Preview
              </Button>
            </div>

            {/* Download Button */}
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
                  fileName={`${cvData.Title || 'CV'}_${new Date().toISOString().split('T')[0]}.pdf`}
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
                            // The PDFDownloadLink handles the download automatically
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
          </div>

          {/* Content Area */}
          <div className="pt-20 pb-8 px-8 bg-gradient-to-b from-gray-50 to-white min-h-[600px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-gray-600 font-medium">Loading CV...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="text-red-500 text-center p-6 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-semibold mb-2">Error Loading CV</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : (
              <div className="w-full">
                {viewMode === 'pdf' ? (
                  <div className="flex justify-center">
                    <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
                      <Suspense
                        fallback={
                          <div className="flex items-center justify-center h-96 bg-gray-50">
                            <div className="text-center space-y-4">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                              <p className="text-gray-600 font-medium">Loading PDF...</p>
                            </div>
                          </div>
                        }
                      >
                        <PDFViewer
                          width="100%"
                          height="800"
                          className="rounded-lg"
                          showToolbar={false}
                        >
                          <HarvardCVDocument cvData={cvData} />
                        </PDFViewer>
                      </Suspense>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="w-full max-w-4xl">
                      <CVHTMLPreview cvData={cvData} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
