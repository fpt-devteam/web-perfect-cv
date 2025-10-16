import { Brain, Target, TrendingUp, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { CVSectionScoresResponse } from '@/modules/cv/types/ai-evaluation.types';

interface OverallScoreCardProps {
    scoreData?: CVSectionScoresResponse;
    isLoading?: boolean;
}

function getScoreGrade(percentage: number): { grade: string; color: string; description: string } {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', description: 'Excellent' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', description: 'Very Good' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600', description: 'Good' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600', description: 'Above Average' };
    if (percentage >= 50) return { grade: 'C+', color: 'text-yellow-600', description: 'Average' };
    if (percentage >= 40) return { grade: 'C', color: 'text-orange-600', description: 'Below Average' };
    return { grade: 'D', color: 'text-red-600', description: 'Needs Improvement' };
}

function getProgressColor(percentage: number): string {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
}

export function OverallScoreCard({ scoreData, isLoading }: OverallScoreCardProps) {
    if (isLoading) {
        return (
            <Card className="border-l-4 border-l-blue-500 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
                        <CardTitle className="text-xl">Overall CV Score</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center space-y-4">
                        <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full animate-pulse flex items-center justify-center">
                            <Clock className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!scoreData) {
        return (
            <Card className="border-l-4 border-l-gray-300 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <Brain className="h-6 w-6 text-gray-400" />
                        <CardTitle className="text-xl text-gray-600">Overall CV Score</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Click "Score My CV" to get your overall assessment</p>
                        <p className="text-sm text-gray-400">
                            Our AI will analyze all sections and provide comprehensive feedback
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const { scorePercentage, totalScore, maxPossibleScore, sectionScores } = scoreData;
    const { grade, color, description } = getScoreGrade(scorePercentage);

    // Calculate section performance
    const strongSections = sectionScores.filter(section =>
        (section.sectionScore.totalScore0To5 / 5) * 100 >= 70
    );
    const weakSections = sectionScores.filter(section =>
        (section.sectionScore.totalScore0To5 / 5) * 100 < 50
    );

    return (
        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 animate-in slide-in-from-top-2 fade-in-0">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Brain className="h-6 w-6 text-blue-600" />
                        <CardTitle className="text-xl">Overall CV Score</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-sm font-semibold">
                        AI Analyzed
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Main Score Display */}
                <div className="text-center space-y-4">
                    <div className="relative w-32 h-32 mx-auto">
                        {/* Circular Progress Background */}
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-gray-200"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={`${2 * Math.PI * 50}`}
                                strokeDashoffset={`${2 * Math.PI * 50 * (1 - scorePercentage / 100)}`}
                                className={`transition-all duration-1000 ease-out ${scorePercentage >= 80 ? 'text-green-500' :
                                    scorePercentage >= 60 ? 'text-blue-500' :
                                        scorePercentage >= 40 ? 'text-yellow-500' : 'text-red-500'
                                    }`}
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* Score Text Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-3xl font-bold ${color}`}>{grade}</span>
                            <span className="text-sm text-gray-600">{scorePercentage.toFixed(0)}%</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className={`text-lg font-semibold ${color}`}>{description}</h3>
                        <p className="text-sm text-gray-600">
                            {totalScore.toFixed(1)} out of {maxPossibleScore} points
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Overall Performance</span>
                        <span className="font-medium">{scorePercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ease-out rounded-full ${getProgressColor(scorePercentage)}`}
                            style={{ width: `${scorePercentage}%` }}
                        />
                    </div>
                </div>

                {/* Section Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Strong Areas</span>
                        </div>
                        <div className="text-2xl font-bold text-green-700 mb-1">
                            {strongSections.length}
                        </div>
                        <div className="text-xs text-green-600">
                            {strongSections.length > 0
                                ? `${strongSections.map(s => s.sectionType).join(', ')}`
                                : 'Focus on improving sections'
                            }
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">Needs Work</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-700 mb-1">
                            {weakSections.length}
                        </div>
                        <div className="text-xs text-orange-600">
                            {weakSections.length > 0
                                ? `${weakSections.map(s => s.sectionType).join(', ')}`
                                : 'All sections performing well!'
                            }
                        </div>
                    </div>
                </div>

                {/* Improvement Suggestion */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-900 mb-1">Next Steps</h4>
                            <p className="text-sm text-blue-800">
                                {scorePercentage >= 80
                                    ? "Excellent work! Fine-tune details and consider adding more specific achievements."
                                    : scorePercentage >= 60
                                        ? "Good foundation! Focus on strengthening weak sections and adding more quantifiable results."
                                        : "Significant improvements needed. Start with the lowest-scoring sections and add more relevant content."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
