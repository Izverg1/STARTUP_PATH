'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConversionFunnel, FunnelStage, StageStatus } from '@/types/dashboard';

interface FunnelChartProps {
  data: ConversionFunnel;
  title?: string;
  className?: string;
  showDropOffAnalysis?: boolean;
  showOptimizations?: boolean;
}

const getStatusColor = (status: StageStatus) => {
  switch (status) {
    case 'performing':
      return 'bg-green-500';
    case 'underperforming':
      return 'bg-yellow-500';
    case 'critical':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

const getStatusBadgeColor = (status: StageStatus) => {
  switch (status) {
    case 'performing':
      return 'text-green-700 bg-green-100 border-green-200';
    case 'underperforming':
      return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    case 'critical':
      return 'text-red-700 bg-red-100 border-red-200';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-200';
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatPercentage = (rate: number): string => {
  return `${(rate * 100).toFixed(1)}%`;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function FunnelStageComponent({ stage, nextStage, maxWidth }: { 
  stage: FunnelStage; 
  nextStage?: FunnelStage;
  maxWidth: number;
}) {
  const width = maxWidth > 0 ? (stage.count / maxWidth) * 100 : 0;
  const dropRate = nextStage ? 1 - (nextStage.count / stage.count) : 0;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize">
                  {stage.name.replace('_', ' ')}
                </span>
                <Badge variant="outline" className={getStatusBadgeColor(stage.status)}>
                  {stage.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatNumber(stage.count)}
              </div>
            </div>
            
            <div className="relative">
              <div className="h-8 bg-gray-200 rounded-md overflow-hidden">
                <div
                  className={cn('h-full transition-all duration-300', getStatusColor(stage.status))}
                  style={{ width: `${width}%` }}
                />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-between px-3 text-sm">
                <span className="text-gray-900 font-medium mix-blend-difference">
                  {formatPercentage(stage.conversion_rate)}
                </span>
                <span className="text-gray-900 font-medium mix-blend-difference">
                  {formatCurrency(stage.cost_per_conversion)}
                </span>
              </div>
            </div>
            
            {nextStage && dropRate > 0.3 && (
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <TrendingDown className="h-3 w-3" />
                <span>{formatPercentage(dropRate)} drop-off</span>
                {dropRate > 0.5 && <AlertTriangle className="h-3 w-3" />}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-xs">
            <p><strong>{stage.name.replace('_', ' ')}</strong></p>
            <p>Count: {formatNumber(stage.count)}</p>
            <p>Conversion Rate: {formatPercentage(stage.conversion_rate)}</p>
            <p>Cost per Conversion: {formatCurrency(stage.cost_per_conversion)}</p>
            {stage.benchmark_conversion_rate && (
              <p>Benchmark: {formatPercentage(stage.benchmark_conversion_rate)}</p>
            )}
            {nextStage && (
              <p>Drop-off to next: {formatPercentage(dropRate)}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function FunnelChart({ 
  data, 
  title = 'Conversion Funnel', 
  className,
  showDropOffAnalysis = true,
  showOptimizations = true 
}: FunnelChartProps) {
  const sortedStages = data.stages.sort((a, b) => a.order - b.order);
  const maxCount = Math.max(...sortedStages.map(stage => stage.count));
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>{formatPercentage(data.overall_conversion_rate)} overall</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Funnel Stages */}
        <div className="space-y-4">
          {sortedStages.map((stage, index) => {
            const nextStage = sortedStages[index + 1];
            return (
              <FunnelStageComponent
                key={stage.name}
                stage={stage}
                nextStage={nextStage}
                maxWidth={maxCount}
              />
            );
          })}
        </div>
        
        {/* Drop-off Analysis */}
        {showDropOffAnalysis && data.drop_off_analysis && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Drop-off Analysis
            </h4>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-sm font-medium">Highest Drop Stage:</span>
                  <p className="text-lg capitalize">
                    {data.drop_off_analysis.highest_drop_stage.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Drop Rate:</span>
                  <p className="text-lg text-orange-700">
                    {formatPercentage(data.drop_off_analysis.drop_rate)}
                  </p>
                </div>
              </div>
              
              {data.drop_off_analysis.root_causes.length > 0 && (
                <div>
                  <span className="text-sm font-medium block mb-2">Root Causes:</span>
                  <div className="space-y-1">
                    {data.drop_off_analysis.root_causes
                      .sort((a, b) => b.confidence - a.confidence)
                      .slice(0, 3)
                      .map((cause, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{cause.cause}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {formatPercentage(cause.confidence)} confidence
                            </Badge>
                            {cause.actionable && (
                              <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                                Actionable
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Optimization Recommendations */}
        {showOptimizations && data.optimization_recommendations && data.optimization_recommendations.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Optimization Opportunities
            </h4>
            <div className="space-y-3">
              {data.optimization_recommendations
                .sort((a, b) => b.expected_roi - a.expected_roi)
                .slice(0, 3)
                .map((opt, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium capitalize">
                            {opt.stage.replace('_', ' ')}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'text-xs',
                              opt.effort_required === 'low' && 'text-green-700 bg-green-100',
                              opt.effort_required === 'medium' && 'text-yellow-700 bg-yellow-100',
                              opt.effort_required === 'high' && 'text-red-700 bg-red-100'
                            )}
                          >
                            {opt.effort_required} effort
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{opt.opportunity}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>+{formatPercentage(opt.potential_improvement)} improvement</span>
                          <span>{opt.expected_roi}x ROI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}