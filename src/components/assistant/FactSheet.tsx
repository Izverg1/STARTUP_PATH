"use client";

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle,
  AlertTriangle,
  Info,
  Download,
  Share,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface FactSheetMetric {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

interface FactSheetData {
  title: string;
  metrics: FactSheetMetric[];
  insights: string[];
  recommendations: string[];
  confidence: number;
}

interface FactSheetProps {
  data: FactSheetData;
  className?: string;
}

export function FactSheet({ data, className }: FactSheetProps) {
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="size-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="size-4 text-red-600" />;
      case 'neutral':
      default:
        return <Minus className="size-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
      default:
        return 'text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-blue-600';
    if (confidence >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 70) return 'High';
    if (confidence >= 50) return 'Medium';
    return 'Low';
  };

  const handleExport = () => {
    // Implementation for exporting fact sheet
    console.log('Exporting fact sheet:', data.title);
  };

  const handleShare = () => {
    // Implementation for sharing fact sheet
    console.log('Sharing fact sheet:', data.title);
  };

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{data.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                AI Generated
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="size-3 fill-current" />
                <span className="text-sm text-muted-foreground">
                  Confidence: 
                  <span className={cn('ml-1 font-medium', getConfidenceColor(data.confidence))}>
                    {data.confidence}% ({getConfidenceLabel(data.confidence)})
                  </span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Download className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Metrics Grid */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Info className="size-4" />
            Key Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.metrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="text-lg font-semibold">{metric.value}</div>
                {metric.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {metric.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Insights */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="size-4" />
            Key Insights
          </h4>
          <div className="space-y-2">
            {data.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="size-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Recommendations */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <CheckCircle className="size-4" />
            Recommendations
          </h4>
          <div className="space-y-2">
            {data.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="size-4 text-green-600 mt-0.5 shrink-0" />
                <span>{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Score */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Analysis Confidence</span>
            <span className={cn('text-sm font-medium', getConfidenceColor(data.confidence))}>
              {data.confidence}%
            </span>
          </div>
          <Progress value={data.confidence} className="h-2" />
          <div className="text-xs text-muted-foreground mt-2">
            Based on data quality, sample size, and model certainty
          </div>
        </div>
      </CardContent>
    </Card>
  );
}