import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, XCircle, Star } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import type { CriteriaScore } from '@/modules/cv/types/ai-evaluation.types';
import { ScoreBar } from './ScoreBar';

interface CriteriaDetailsProps {
    criteria: CriteriaScore;
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

export function CriteriaDetails({ criteria }: CriteriaDetailsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const scorePercentage = (criteria.score0To5 / 5) * 100;

    return (
        <div className="border rounded-lg p-4 bg-white hover:shadow-sm transition-all duration-200 animate-in fade-in-0 slide-in-from-left-1">
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                            <div className="text-left">
                                <h5 className="font-medium text-gray-900 text-sm">{criteria.criterion}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-sm font-semibold ${getScoreColor(criteria.score0To5)}`}>
                                        {criteria.score0To5}/5
                                    </span>
                                    <Badge variant={getScoreBadgeVariant(criteria.score0To5)} className="text-xs">
                                        Weight: {(criteria.weight0To1 * 100).toFixed(0)}%
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-16">
                                <ScoreBar score={scorePercentage} className="h-1.5" showAnimation={false} />
                            </div>
                            <Star className={`h-4 w-4 ${criteria.score0To5 >= 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        </div>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4 space-y-4 animate-in slide-in-from-top-2 fade-in-0 duration-300">
                    {/* Justification */}
                    <div className="bg-blue-50 rounded-lg p-3">
                        <h6 className="text-sm font-medium text-blue-900 mb-2">AI Analysis</h6>
                        <p className="text-sm text-blue-800 leading-relaxed">{criteria.justification}</p>
                    </div>

                    {/* Evidence Found */}
                    {criteria.evidenceFound.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <h6 className="text-sm font-medium text-green-800">Strengths Identified</h6>
                            </div>
                            <ul className="space-y-1 ml-6">
                                {criteria.evidenceFound.map((evidence, index) => (
                                    <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                        <span>{evidence}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Missing Elements */}
                    {criteria.missingElements.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-orange-600" />
                                <h6 className="text-sm font-medium text-orange-800">Areas for Improvement</h6>
                            </div>
                            <ul className="space-y-1 ml-6">
                                {criteria.missingElements.map((missing, index) => (
                                    <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                        <span>{missing}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
