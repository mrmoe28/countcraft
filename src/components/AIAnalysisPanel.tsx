'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Zap, Target, Lightbulb, TrendingUp, Users } from 'lucide-react';

interface AIAnalysisData {
  genre: string;
  energyLevel: number;
  musicalPhrases: Array<{
    startTime: number;
    endTime: number;
    intensity: number;
    suggestedCounts: number[];
  }>;
  beatPattern: {
    primary: number[];
    secondary: number[];
    accents: number[];
  };
  technicalInsights: {
    tempoStability: number;
    rhythmComplexity: number;
    dynamicRange: number;
    recommendedDifficulty: string;
  };
}

interface ChoreographyInsights {
  recommendations: string[];
  countSuggestions: Array<{
    measure: number;
    count: number;
    suggestion: string;
    intensity: number;
  }>;
  difficultyAssessment: string;
}

interface AIAnalysisPanelProps {
  aiAnalysis: AIAnalysisData;
  choreographyInsights: ChoreographyInsights;
}

export default function AIAnalysisPanel({ aiAnalysis, choreographyInsights }: AIAnalysisPanelProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnergyColor = (level: number) => {
    if (level >= 8) return 'text-red-600';
    if (level >= 6) return 'text-orange-600';
    if (level >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Music Analysis Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Music Analysis
          </CardTitle>
          <CardDescription>
            AI-powered analysis of your audio file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Genre</label>
              <Badge variant="outline" className="mt-1">
                {aiAnalysis.genre}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Difficulty</label>
              <Badge className={`mt-1 ${getDifficultyColor(aiAnalysis.technicalInsights.recommendedDifficulty)}`}>
                {aiAnalysis.technicalInsights.recommendedDifficulty}
              </Badge>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Energy Level: {aiAnalysis.energyLevel}/10
            </label>
            <Progress value={aiAnalysis.energyLevel * 10} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Technical Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Technical Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Tempo Stability</label>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={aiAnalysis.technicalInsights.tempoStability * 10} className="flex-1 h-2" />
                <span className="text-sm text-gray-600">{aiAnalysis.technicalInsights.tempoStability}/10</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Rhythm Complexity</label>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={aiAnalysis.technicalInsights.rhythmComplexity * 10} className="flex-1 h-2" />
                <span className="text-sm text-gray-600">{aiAnalysis.technicalInsights.rhythmComplexity}/10</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Dynamic Range</label>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={aiAnalysis.technicalInsights.dynamicRange * 10} className="flex-1 h-2" />
                <span className="text-sm text-gray-600">{aiAnalysis.technicalInsights.dynamicRange}/10</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beat Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Beat Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Primary Rhythm</label>
            <div className="flex gap-1">
              {aiAnalysis.beatPattern.primary.map((beat, index) => (
                <Badge key={index} variant="default" className="w-8 h-8 flex items-center justify-center">
                  {beat}
                </Badge>
              ))}
            </div>
          </div>
          
          {aiAnalysis.beatPattern.accents.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Accent Points</label>
              <div className="flex gap-1">
                {aiAnalysis.beatPattern.accents.map((accent, index) => (
                  <Badge key={index} variant="destructive" className="w-8 h-8 flex items-center justify-center">
                    {accent}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Choreography Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Choreography Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">AI Recommendations</label>
            <ul className="space-y-2">
              {choreographyInsights.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Difficulty Assessment</label>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              {choreographyInsights.difficultyAssessment}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Count Suggestions */}
      {choreographyInsights.countSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Count-by-Count Suggestions
            </CardTitle>
            <CardDescription>
              AI-generated suggestions for specific counts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {choreographyInsights.countSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="outline" className="w-12 text-center">
                    {suggestion.measure}.{suggestion.count}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{suggestion.suggestion}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{suggestion.intensity}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
