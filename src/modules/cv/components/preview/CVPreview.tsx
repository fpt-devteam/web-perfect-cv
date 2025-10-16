import { useState } from 'react';
import { FileText, Eye, BarChart3, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { CVResponse as CVData } from '@/modules/cv/types/cv.types';
import { DownloadPDFButton } from '@/modules/cv/components/preview/DownloadPDFButton';
import { CVPreviewContent } from './CVPreviewContent';
import { OverallScoreCard } from '@/modules/cv/components/scoring';
import { useCVScoring } from '@/modules/cv/hooks/useCVScoring';
import { useCVSectionScores } from '@/modules/cv/hooks/useCVSectionScores';
import { useNotification } from '@/shared/hooks/useNotification';

interface CVPreviewProps {
    cvData: CVData;
}

export function CVPreview({ cvData }: CVPreviewProps) {
    const [activeTab, setActiveTab] = useState('preview');
    const { showSuccess, showError } = useNotification();

    // Get CV ID from cvData
    const cvId = cvData.cvId;

    // Fetch current section scores
    const { data: sectionScores, refetch: refetchScores } = useCVSectionScores(cvId);

    // CV Scoring functionality
    const scoringState = useCVScoring(cvId, {
        onSuccess: () => {
            showSuccess('CV analysis completed successfully!');
            refetchScores(); // Refresh the scores
            setActiveTab('analysis'); // Switch to analysis tab
        },
        onError: (error) => {
            showError(`Analysis failed: ${error.message}`);
        },
    });

    const handleStartScoring = () => {
        scoringState.startScoring();
        setActiveTab('analysis'); // Switch to analysis tab when starting
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="">

                    {/* Action Buttons */}
                    {/* <div className="flex items-center gap-4">
                        <ScoreCVButton
                            onScore={handleStartScoring}
                            scoringState={scoringState}
                        />
                        <DownloadPDFButton cvData={cvData} />
                    </div> */}
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'preview'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Eye className="h-4 w-4" />
                        CV Preview
                    </button>
                    <button
                        onClick={() => setActiveTab('analysis')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'analysis'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <BarChart3 className="h-4 w-4" />
                        AI Analysis
                        {sectionScores && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                                {sectionScores.scorePercentage.toFixed(0)}%
                            </Badge>
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {/* CV Preview Tab */}
                    {activeTab === 'preview' && (
                        <Card className="shadow-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    CV Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="bg-white rounded-lg overflow-hidden">
                                    <CVPreviewContent cvData={cvData} />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* AI Analysis Tab */}
                    {activeTab === 'analysis' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                            {/* Overall Score Card - Takes 2 columns on large screens */}
                            <div className="lg:col-span-2">
                                <OverallScoreCard
                                    scoreData={sectionScores}
                                    isLoading={scoringState.isLoading}
                                />
                            </div>

                            {/* Quick Actions Card */}
                            <div className="space-y-6">
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Sparkles className="h-5 w-5 text-purple-600" />
                                            Quick Actions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => setActiveTab('preview')}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View CV Preview
                                        </Button>

                                        <DownloadPDFButton cvData={cvData} className="w-full" />

                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={handleStartScoring}
                                            disabled={scoringState.isLoading}
                                        >
                                            <BarChart3 className="h-4 w-4 mr-2" />
                                            Re-analyze CV
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Tips Card */}
                                <Card className="shadow-lg border-l-4 border-l-blue-500">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-blue-900">
                                            💡 Pro Tips
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-blue-800">
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                                <span>Review each section's AI feedback for specific improvements</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                                <span>Focus on sections with lower scores first</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                                <span>Re-analyze after making changes to see improvements</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                                <span>Download your CV when you're satisfied with the score</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}