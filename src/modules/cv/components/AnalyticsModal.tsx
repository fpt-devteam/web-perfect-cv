import { useState } from 'react';
import {
  BarChart3,
  Target,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  Lightbulb,
  RefreshCw,
  CheckSquare,
  Award,
  Zap,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/utils/cn.util';
import type { AnalysisData, ImprovementSuggestion } from '../types/analysis.types';
import { useApplySuggestion } from '../hooks/useAnalysis';

interface AnalyticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysisData: AnalysisData;
  isLoading?: boolean;
}

export function AnalyticsModal({
  open,
  onOpenChange,
  analysisData,
  isLoading = false,
}: AnalyticsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'suggestions' | 'industry' | 'ats'>(
    'overview'
  );
  const applySuggestionMutation = useApplySuggestion();

  const handleApplySuggestion = (suggestionId: string) => {
    applySuggestionMutation.mutate({
      analysisId: analysisData.analysisId,
      suggestionId,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return TrendingUp;
    if (score >= 80) return TrendingUp;
    if (score >= 70) return Minus;
    if (score >= 60) return TrendingDown;
    return TrendingDown;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-6xl !w-[90vw] h-[85vh] overflow-hidden">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
              <p className="text-gray-600">Analyzing your CV...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { analysis } = analysisData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-7xl !w-[95vw] h-[90vh] overflow-hidden p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              CV Analytics Dashboard
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar Navigation */}
          <div className="w-64 border-r bg-gray-50 p-4 shrink-0">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
                { id: 'industry', label: 'Industry Advice', icon: Target },
                { id: 'ats', label: 'ATS Score', icon: Users },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() =>
                    setActiveTab(id as 'overview' | 'suggestions' | 'industry' | 'ats')
                  }
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm',
                    activeTab === id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <Card className="border-2 border-blue-100">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Overall CV Score</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Based on comprehensive analysis
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={cn(
                              'text-4xl font-bold mb-1',
                              getScoreColor(analysis.overallScore)
                            )}
                          >
                            {analysis.overallScore}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            {(() => {
                              const ScoreIcon = getScoreIcon(analysis.overallScore);
                              return (
                                <ScoreIcon
                                  className={cn('h-4 w-4', getScoreColor(analysis.overallScore))}
                                />
                              );
                            })()}
                            <span className={getScoreColor(analysis.overallScore)}>
                              {getScoreLabel(analysis.overallScore)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Progress value={analysis.overallScore} className="h-3 mb-2" />
                      <p className="text-sm text-gray-500">
                        Your CV is performing better than {analysis.overallScore}% of CVs
                      </p>
                    </CardContent>
                  </Card>

                  {/* Section Breakdown */}
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(analysis.sectionAnalysis).map(([section, data]) => (
                      <Card key={section} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900 capitalize">
                              {section}
                            </h4>
                            <span className={cn('text-lg font-bold', getScoreColor(data.score))}>
                              {data.score}
                            </span>
                          </div>
                          <Progress value={data.score} className="h-2 mb-2" />
                          <p className="text-xs text-gray-600">{data.feedback}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Improvement Suggestions ({analysis.improvementSuggestions.length})
                    </h3>
                    <Badge variant="secondary" className="text-xs px-2 py-1">
                      {' '}
                      {
                        analysis.improvementSuggestions.filter(s => s.priority === 'high').length
                      }{' '}
                      High Priority
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {analysis.improvementSuggestions.map((suggestion: ImprovementSuggestion) => (
                      <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  className={cn(
                                    'text-xs font-medium px-2 py-1',
                                    getPriorityColor(suggestion.priority)
                                  )}
                                >
                                  {suggestion.priority.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">
                                  {suggestion.section}
                                </span>
                                <Badge variant="outline" className="text-xs px-2 py-1">
                                  {suggestion.category}
                                </Badge>
                              </div>
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                {suggestion.suggestion}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">{suggestion.explanation}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Impact:</span>
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    'text-xs px-2 py-1',
                                    suggestion.estimatedImpact === 'high' &&
                                      'bg-green-100 text-green-700',
                                    suggestion.estimatedImpact === 'medium' &&
                                      'bg-yellow-100 text-yellow-700',
                                    suggestion.estimatedImpact === 'low' &&
                                      'bg-gray-100 text-gray-700'
                                  )}
                                >
                                  {suggestion.estimatedImpact} impact
                                </Badge>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApplySuggestion(suggestion.id)}
                              disabled={applySuggestionMutation.isPending}
                              className="shrink-0 gap-2"
                            >
                              <CheckSquare className="h-4 w-4" />
                              Apply
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'industry' && (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {analysis.industrySpecificAdvice.targetIndustry} Industry
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Tailored advice for your target industry
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                      <Award className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">
                        {analysis.industrySpecificAdvice.relevanceScore}% Industry Match
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Zap className="h-5 w-5 text-yellow-600" />
                          Recommended Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {analysis.industrySpecificAdvice.recommendedSkills.map(skill => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 text-xs px-2 py-1"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          Industry Trends
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {analysis.industrySpecificAdvice.industryTrends.map((trend, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <TrendingUp className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
                              <span className="text-sm text-gray-700">{trend}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Market Demand</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {analysis.industrySpecificAdvice.marketDemand}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'ats' && (
                <div className="space-y-6">
                  <Card className="border-2 border-purple-100">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            ATS Compatibility Score
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Applicant Tracking System optimization
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={cn(
                              'text-4xl font-bold mb-1',
                              getScoreColor(analysis.atsCompatibility.score)
                            )}
                          >
                            {analysis.atsCompatibility.score}
                          </div>
                          <div className="text-sm text-gray-500">ATS Score</div>
                        </div>
                      </div>
                      <Progress value={analysis.atsCompatibility.score} className="h-3 mb-2" />
                      <p className="text-sm text-gray-500">
                        Your CV is{' '}
                        {analysis.atsCompatibility.score >= 80
                          ? 'well-optimized'
                          : 'needs optimization'}{' '}
                        for ATS systems
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base text-red-700">
                          <AlertCircle className="h-5 w-5" />
                          Issues Found ({analysis.atsCompatibility.issues.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {analysis.atsCompatibility.issues.map((issue, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <AlertCircle className="h-4 w-4 mt-0.5 text-red-600 shrink-0" />
                              <span className="text-sm text-gray-700">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base text-green-700">
                          <CheckCircle className="h-5 w-5" />
                          Recommendations ({analysis.atsCompatibility.recommendations.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {analysis.atsCompatibility.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
                              <span className="text-sm text-gray-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {analysis.atsCompatibility.keywordDensity}%
                          </div>
                          <div className="text-sm text-gray-600">Keyword Density</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-xl font-medium text-green-600 mb-1">
                            {analysis.atsCompatibility.scanability}
                          </div>
                          <div className="text-sm text-gray-600">Scanability</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-gray-50 text-center shrink-0">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Processed in {(analysisData.metadata.processingTime / 1000).toFixed(1)}s
            </div>
            <div>•</div>
            <div>Model: {analysisData.metadata.modelInfo.model}</div>
            <div>•</div>
            <div>Version {analysisData.version}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
