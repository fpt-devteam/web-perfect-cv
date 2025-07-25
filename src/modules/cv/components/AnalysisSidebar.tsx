import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
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
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/utils/cn.util';
import type { AnalysisData, ImprovementSuggestion } from '../types/analysis.types';
import { useAnalyzeCV, useApplySuggestion } from '../hooks/useAnalysis';

interface AnalysisSidebarProps {
  analysisData: AnalysisData;
  cvId: string;
  isLoading?: boolean;
  onAnalyze?: () => void;
}

export function AnalysisSidebar({
  analysisData,
  cvId,
  isLoading = false,
  onAnalyze,
}: AnalysisSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const analyzeMutation = useAnalyzeCV();
  const applySuggestionMutation = useApplySuggestion();

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleAnalyze = () => {
    // Note: This is a simplified version for the sidebar. 
    // A complete implementation would need cvData and userPreferences
    analyzeMutation.mutate({
      cvId,
      userId: '', // TODO: Get actual userId from auth context
      reason: 'User requested analysis from preview page',
      cvData: {} as any, // TODO: Get actual CV data
      userPreferences: {} as any, // TODO: Get actual user preferences
    });
    onAnalyze?.();
  };

  const handleApplySuggestion = (suggestionId: string) => {
    applySuggestionMutation.mutate({
      analysisId: analysisData.analysisId,
      suggestionId,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const { analysis } = analysisData;

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">CV Analysis</h2>
          <Button
            onClick={handleAnalyze}
            disabled={analyzeMutation.isPending}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={cn('h-4 w-4', analyzeMutation.isPending && 'animate-spin')} />
            Analyze
          </Button>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Score</span>
            <span className={cn('text-2xl font-bold', getScoreColor(analysis.overallScore))}>
              {analysis.overallScore}/100
            </span>
          </div>
          <Progress value={analysis.overallScore} className="h-2" />
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Section Scores */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection('sections')}>
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Section Scores
              </div>
              {expandedSections.has('sections') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CardTitle>
          </CardHeader>
          {expandedSections.has('sections') && (
            <CardContent className="space-y-3">
              {Object.entries(analysis.sectionAnalysis).map(([section, data]) => (
                <div key={section} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{section}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-sm font-medium', getScoreColor(data.score))}>
                      {data.score}/100
                    </span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${data.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Improvement Suggestions */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection('suggestions')}>
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Improvement Suggestions ({analysis.improvementSuggestions.length})
              </div>
              {expandedSections.has('suggestions') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CardTitle>
          </CardHeader>
          {expandedSections.has('suggestions') && (
            <CardContent className="space-y-3">
              {analysis.improvementSuggestions.map((suggestion: ImprovementSuggestion) => (
                <div key={suggestion.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={cn('text-xs', getPriorityColor(suggestion.priority))}>
                          {suggestion.priority}
                        </Badge>
                        <span className="text-xs text-gray-500 capitalize">
                          {suggestion.section}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{suggestion.suggestion}</p>
                      <p className="text-xs text-gray-600 mt-1">{suggestion.explanation}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleApplySuggestion(suggestion.id)}
                      disabled={applySuggestionMutation.isPending}
                      className="shrink-0"
                    >
                      <CheckSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Industry Specific Advice */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection('industry')}>
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Industry Advice
              </div>
              {expandedSections.has('industry') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CardTitle>
          </CardHeader>
          {expandedSections.has('industry') && (
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Target Industry</h4>
                <p className="text-sm text-gray-600">
                  {analysis.industrySpecificAdvice.targetIndustry}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Relevance Score: {analysis.industrySpecificAdvice.relevanceScore}/100
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recommended Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {analysis.industrySpecificAdvice.recommendedSkills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Industry Trends</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {analysis.industrySpecificAdvice.industryTrends.map((trend, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="h-3 w-3 mt-0.5 text-green-600" />
                      {trend}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Market Demand</h4>
                <p className="text-sm text-gray-600">
                  {analysis.industrySpecificAdvice.marketDemand}
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* ATS Compatibility */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection('ats')}>
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                ATS Compatibility
              </div>
              {expandedSections.has('ats') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CardTitle>
          </CardHeader>
          {expandedSections.has('ats') && (
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ATS Score</span>
                <span
                  className={cn(
                    'text-sm font-medium',
                    getScoreColor(analysis.atsCompatibility.score)
                  )}
                >
                  {analysis.atsCompatibility.score}/100
                </span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Issues Found</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {analysis.atsCompatibility.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 mt-0.5 text-orange-600" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {analysis.atsCompatibility.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 mt-0.5 text-green-600" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Keyword Density</span>
                  <p className="font-medium">{analysis.atsCompatibility.keywordDensity}%</p>
                </div>
                <div>
                  <span className="text-gray-600">Scanability</span>
                  <p className="font-medium">{analysis.atsCompatibility.scanability}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection('metadata')}>
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Analysis Details
              </div>
              {expandedSections.has('metadata') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CardTitle>
          </CardHeader>
          {expandedSections.has('metadata') && (
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Time</span>
                <span>{(analysisData.metadata.processingTime / 1000).toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Model</span>
                <span>{analysisData.metadata.modelInfo.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tokens Used</span>
                <span>{analysisData.metadata.modelInfo.tokensUsed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Version</span>
                <span>{analysisData.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span>{new Date(analysisData.metadata.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
