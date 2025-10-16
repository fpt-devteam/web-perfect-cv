import { useState } from 'react';
import { Brain, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { OverallScoreCard } from './OverallScoreCard';
import { ScoreCVButton } from './ScoreCVButton';
import { JobStatus, type CVScoringState } from '@/modules/cv/types/job.types';
import { SectionType, type CVSectionScoresResponse } from '@/modules/cv/types/ai-evaluation.types';

// Demo data for different scoring states
const demoScoreData: CVSectionScoresResponse = {
    cvId: 'demo-cv-id',
    sectionScores: [
        {
            id: 'demo-contact',
            cvId: 'demo-cv-id',
            sectionType: SectionType.Contact,
            sectionScore: {
                criteriaScores: [
                    {
                        id: 'contact.professional_presentation',
                        criterion: 'Professional Presentation',
                        score0To5: 4,
                        weight0To1: 0.5,
                        justification: 'Contact details are well-organized and professional.',
                        evidenceFound: ['Professional email', 'LinkedIn profile', 'Phone number'],
                        missingElements: ['Professional website or portfolio']
                    }
                ],
                totalScore0To5: 4.0,
                weight0To1: 0.05
            }
        },
        {
            id: 'demo-experience',
            cvId: 'demo-cv-id',
            sectionType: SectionType.Experience,
            sectionScore: {
                criteriaScores: [
                    {
                        id: 'exp.relevance',
                        criterion: 'Technical Relevance',
                        score0To5: 3,
                        weight0To1: 0.5,
                        justification: 'Good technical background but could be more specific.',
                        evidenceFound: ['Backend development', 'Team collaboration'],
                        missingElements: ['Specific technologies', 'Quantified achievements']
                    }
                ],
                totalScore0To5: 3.0,
                weight0To1: 0.1
            }
        }
    ],
    totalScore: 3.5,
    maxPossibleScore: 5.0,
    scorePercentage: 70.0
};

const scoringStates = {
    idle: {
        isScoring: false,
        jobId: null,
        job: null,
        error: null,
    } as CVScoringState,

    queued: {
        isScoring: true,
        jobId: 'demo-job-1',
        job: {
            id: 'demo-job-1',
            type: 'ScoreCV',
            status: JobStatus.Queued,
            createdAt: new Date().toISOString(),
            startedAt: null,
            completedAt: null,
            inputJson: { CvId: 'demo-cv-id', UserId: 'demo-user-id' },
            outputJson: null,
            errorCode: null,
            errorMessage: null,
        },
        error: null,
    } as CVScoringState,

    running: {
        isScoring: true,
        jobId: 'demo-job-2',
        job: {
            id: 'demo-job-2',
            type: 'ScoreCV',
            status: JobStatus.Running,
            createdAt: new Date().toISOString(),
            startedAt: new Date().toISOString(),
            completedAt: null,
            inputJson: { CvId: 'demo-cv-id', UserId: 'demo-user-id' },
            outputJson: null,
            errorCode: null,
            errorMessage: null,
        },
        error: null,
    } as CVScoringState,

    completed: {
        isScoring: false,
        jobId: 'demo-job-3',
        job: {
            id: 'demo-job-3',
            type: 'ScoreCV',
            status: JobStatus.Succeeded,
            createdAt: new Date().toISOString(),
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            inputJson: { CvId: 'demo-cv-id', UserId: 'demo-user-id' },
            outputJson: demoScoreData,
            errorCode: null,
            errorMessage: null,
        },
        error: null,
    } as CVScoringState,

    failed: {
        isScoring: false,
        jobId: 'demo-job-4',
        job: {
            id: 'demo-job-4',
            type: 'ScoreCV',
            status: JobStatus.Failed,
            createdAt: new Date().toISOString(),
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            inputJson: { CvId: 'demo-cv-id', UserId: 'demo-user-id' },
            outputJson: null,
            errorCode: 'ANALYSIS_ERROR',
            errorMessage: 'Failed to analyze CV content',
        },
        error: 'Analysis failed due to insufficient content',
    } as CVScoringState,
};

/**
 * Demo component showcasing the CV Scoring system
 */
export function CVScoringDemo() {
    const [currentState, setCurrentState] = useState<keyof typeof scoringStates>('idle');
    const [showScoreData, setShowScoreData] = useState(false);

    const handleStateChange = (state: keyof typeof scoringStates) => {
        setCurrentState(state);
        setShowScoreData(state === 'completed');
    };

    const handleScore = () => {
        // Simulate scoring flow
        setCurrentState('queued');
        setTimeout(() => setCurrentState('running'), 1000);
        setTimeout(() => {
            setCurrentState('completed');
            setShowScoreData(true);
        }, 3000);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
                    <Brain className="h-10 w-10 text-blue-600" />
                    CV Scoring System Demo
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Experience our advanced AI-powered CV analysis system with real-time scoring,
                    detailed feedback, and comprehensive evaluation across all sections.
                </p>
            </div>

            {/* State Controls */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Play className="h-5 w-5" />
                        Demo Controls
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(scoringStates).map(([key]) => (
                            <Button
                                key={key}
                                variant={currentState === key ? 'default' : 'outline'}
                                onClick={() => handleStateChange(key as keyof typeof scoringStates)}
                                className="capitalize"
                            >
                                {key === 'idle' && <Clock className="h-4 w-4 mr-2" />}
                                {key === 'queued' && <Clock className="h-4 w-4 mr-2" />}
                                {key === 'running' && <Brain className="h-4 w-4 mr-2" />}
                                {key === 'completed' && <CheckCircle className="h-4 w-4 mr-2" />}
                                {key === 'failed' && <AlertCircle className="h-4 w-4 mr-2" />}
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Button>
                        ))}
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Current State:</h4>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                                {currentState}
                            </Badge>
                            <span className="text-sm text-gray-600">
                                {currentState === 'idle' && 'Ready to start CV analysis'}
                                {currentState === 'queued' && 'Analysis request queued'}
                                {currentState === 'running' && 'AI analyzing CV content...'}
                                {currentState === 'completed' && 'Analysis completed successfully'}
                                {currentState === 'failed' && 'Analysis encountered an error'}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Scoring Components Demo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Score Button Demo */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Score CV Button</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ScoreCVButton
                            onScore={handleScore}
                            scoringState={scoringStates[currentState]}
                        />
                    </CardContent>
                </Card>

                {/* Overall Score Card Demo */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Overall Score Display</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <OverallScoreCard
                            scoreData={showScoreData ? demoScoreData : undefined}
                            isLoading={currentState === 'running' || currentState === 'queued'}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Features Showcase */}
            <Card className="shadow-lg border-l-4 border-l-green-500">
                <CardHeader>
                    <CardTitle className="text-green-900">🚀 Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Scoring Process</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Asynchronous job processing with real-time status updates</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Automatic polling until job completion (success/failure)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Comprehensive error handling and user feedback</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Automatic cache invalidation and score refresh</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">User Experience</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Beautiful animated progress indicators</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Circular progress bars with color-coded scoring</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Grade-based scoring system (A+ to D)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Actionable insights and improvement suggestions</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* API Integration Info */}
            <Card className="shadow-lg border-l-4 border-l-purple-500">
                <CardHeader>
                    <CardTitle className="text-purple-900">🔌 API Integration</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Endpoints Used:</h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">POST</Badge>
                                    <code className="text-sm">/api/jobs/score-cv</code>
                                    <span className="text-sm text-gray-600">- Initiate CV scoring</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">GET</Badge>
                                    <code className="text-sm">/api/jobs/{'{jobId}'}/result</code>
                                    <span className="text-sm text-gray-600">- Poll job status</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">GET</Badge>
                                    <code className="text-sm">/api/cvs/{'{cvId}'}/section-scores</code>
                                    <span className="text-sm text-gray-600">- Get updated scores</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Job Status Flow:</h4>
                            <div className="flex items-center gap-2 text-sm">
                                <Badge variant="outline">Queued</Badge>
                                <span>→</span>
                                <Badge variant="outline">Running</Badge>
                                <span>→</span>
                                <Badge variant="default">Succeeded</Badge>
                                <span>/</span>
                                <Badge variant="destructive">Failed</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
