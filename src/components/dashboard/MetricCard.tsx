'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { MetricTrend, TrendDirection } from '@/types/dashboard';

interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  trend?: MetricTrend;
  target?: string | number;
  status?: 'excellent' | 'good' | 'acceptable' | 'concerning' | 'critical';
  subtitle?: string;
  tooltip?: string;
  format?: 'number' | 'currency' | 'percentage';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const formatValue = (value: string | number, format: MetricCardProps['format'] = 'number'): string => {
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'percentage':
      return `${(value * 100).toFixed(1)}%`;
    default:
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
  }
};

const getTrendIcon = (direction: TrendDirection) => {
  switch (direction) {
    case 'up':
      return <TrendingUp className="h-4 w-4" />;
    case 'down':
      return <TrendingDown className="h-4 w-4" />;
    default:
      return <Minus className="h-4 w-4" />;
  }
};

const getStatusColor = (status: MetricCardProps['status']) => {
  switch (status) {
    case 'excellent':
      return 'bg-emerald-900/20 border-emerald-500/30 backdrop-blur-sm';
    case 'good':
      return 'bg-green-900/20 border-green-500/30 backdrop-blur-sm';
    case 'acceptable':
      return 'bg-yellow-900/20 border-yellow-500/30 backdrop-blur-sm';
    case 'concerning':
      return 'bg-orange-900/20 border-orange-500/30 backdrop-blur-sm';
    case 'critical':
      return 'bg-red-900/20 border-red-500/30 backdrop-blur-sm';
    default:
      return 'bg-gray-900/20 border-gray-500/30 backdrop-blur-sm';
  }
};

const getTrendColor = (direction: TrendDirection, isGoodTrendUp: boolean = true) => {
  const isPositiveTrend = isGoodTrendUp ? direction === 'up' : direction === 'down';
  
  switch (direction) {
    case 'up':
      return isPositiveTrend ? 'text-green-600' : 'text-red-600';
    case 'down':
      return isPositiveTrend ? 'text-gray-400' : 'text-gray-400';
    default:
      return 'text-gray-500';
  }
};

export function MetricCard({
  title,
  value,
  previousValue,
  trend,
  target,
  status,
  subtitle,
  tooltip,
  format = 'number',
  className,
  size = 'md',
}: MetricCardProps) {
  const formattedValue = formatValue(value, format);
  const formattedTarget = target ? formatValue(target, format) : undefined;
  const formattedPreviousValue = previousValue ? formatValue(previousValue, format) : undefined;
  
  // Determine if trend direction is good for this metric (some metrics are better when down)
  const isReverseTrendMetric = title.toLowerCase().includes('cost') || 
                              title.toLowerCase().includes('cac') || 
                              title.toLowerCase().includes('payback');
  const isGoodTrendUp = !isReverseTrendMetric;

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const titleSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const valueSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  return (
    <TooltipProvider>
      <Card className={cn('relative overflow-hidden', getStatusColor(status), className)}>
        <CardHeader className={cn('pb-2', sizeClasses[size])}>
          <div className="flex items-center justify-between">
            <CardTitle className={cn('font-medium text-blue-200/70', titleSizeClasses[size])}>
              <div className="flex items-center gap-2">
                {title}
                {tooltip && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 cursor-help text-blue-300/50" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </CardTitle>
            {status && (
              <Badge variant="outline" className={cn(
                'text-xs border-white/20',
                status === 'excellent' && 'text-emerald-400 bg-emerald-400/10',
                status === 'good' && 'text-green-400 bg-green-400/10',
                status === 'acceptable' && 'text-yellow-400 bg-yellow-400/10',
                status === 'concerning' && 'text-orange-400 bg-orange-400/10',
                status === 'critical' && 'text-red-400 bg-red-400/10'
              )}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className={cn('pt-0', sizeClasses[size])}>
          <div className="space-y-2">
            <div className={cn(
              'font-bold tracking-tight',
              valueSizeClasses[size],
              status === 'excellent' && 'text-emerald-400',
              status === 'good' && 'text-green-400',
              status === 'acceptable' && 'text-yellow-400',
              status === 'concerning' && 'text-orange-400',
              status === 'critical' && 'text-red-400',
              !status && 'text-white'
            )}>
              {formattedValue}
            </div>
            
            {subtitle && (
              <p className="text-sm text-blue-200/60">{subtitle}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              {trend && (
                <div className={cn('flex items-center gap-1', getTrendColor(trend.direction, isGoodTrendUp))}>
                  {getTrendIcon(trend.direction)}
                  <span>
                    {trend.magnitude > 0 && '+'}
                    {trend.magnitude.toFixed(1)}%
                  </span>
                  <span className="text-blue-200/50">
                    ({trend.period_days}d)
                  </span>
                </div>
              )}
              
              {formattedTarget && (
                <div className="flex items-center gap-1 text-blue-200/50">
                  <span>Target: {formattedTarget}</span>
                </div>
              )}
              
              {formattedPreviousValue && !trend && (
                <div className="flex items-center gap-1 text-blue-200/50">
                  <span>Previous: {formattedPreviousValue}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}