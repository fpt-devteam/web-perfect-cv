import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Brain, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import type { SectionScore, SectionType } from '@/modules/cv/types/ai-evaluation.types';
import { ScoreBar } from './ScoreBar';
import { CriteriaDetails } from './CriteriaDetails';

interface AIEvaluationCardProps {
    sectionScore: SectionScore;
    sectionType: SectionType;
    isLoading?: boolean;
}

function getScoreColor(score: number): string {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    if (score >= 2) return 'text-orange-600';
    return 'text-red-600';
}

function getScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (score >= 4) return 'default';
    if (score >= 3) return 'secondary';
    if (score >= 2) return 'outline';
    return 'destructive';
}

function getScoreLabel(score: number): string {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Good';
    if (score >= 2.5) return 'Fair';
    if (score >= 1.5) return 'Needs Improvement';
    return 'Poor';
}

export function AIEvaluationCard({ sectionScore, sectionType, isLoading }: AIEvaluationCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (isLoading) {
        return (
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
                        <CardTitle className="text-lg">AI Evaluation</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!sectionScore) {
        return (
            <Card className="border-l-4 border-l-gray-300">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-gray-400" />
                        <CardTitle className="text-lg text-gray-600">AI Evaluation</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Info className="h-4 w-4" />
                        <span className="text-sm">No evaluation available for this section yet.</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const { totalScore0To5, criteriaScores } = sectionScore;
    const scorePercentage = (totalScore0To5 / 5) * 100;

    return (
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all duration-300 animate-in slide-in-from-top-2 fade-in-0">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">AI Evaluation</CardTitle>
                    </div>
                    <Badge variant={getScoreBadgeVariant(totalScore0To5)} className="font-semibold">
                        {getScoreLabel(totalScore0To5)}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Overall Score Display */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Overall Score</span>
                        <span className={`text-lg font-bold ${getScoreColor(totalScore0To5)}`}>
                            {totalScore0To5.toFixed(1)}/5.0
                        </span>
                    </div>
                    <ScoreBar score={scorePercentage} className="h-2" />
                    <div className="text-xs text-gray-500">
                        {scorePercentage.toFixed(0)}% of maximum possible score
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-gray-50 rounded-lg p-3 animate-in fade-in-50 duration-500 delay-300">
                    <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                            <span className="font-medium text-gray-700">
                                {criteriaScores.filter(c => c.score0To5 >= 3).length} strengths identified
                            </span>
                        </div>
                    </div>
                    {criteriaScores.some(c => c.score0To5 < 3) && (
                        <div className="flex items-start gap-2 mt-2">
                            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">
                                    {criteriaScores.filter(c => c.score0To5 < 3).length} areas for improvement
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Expandable Details */}
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                            <span className="text-sm font-medium text-blue-600">
                                {isExpanded ? 'Hide Details' : 'View Detailed Analysis'}
                            </span>
                            {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-blue-600" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-blue-600" />
                            )}
                        </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="space-y-4 mt-4">
                        <div className="border-t pt-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Detailed Criteria Analysis</h4>
                            <div className="space-y-4">
                                {criteriaScores.map((criteria, index) => (
                                    <CriteriaDetails key={criteria.id || index} criteria={criteria} />
                                ))}
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}
