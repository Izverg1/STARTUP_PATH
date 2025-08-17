'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { CPQMMetric, CACMetric, PaybackMetric, PaybackStatus } from '@/types/dashboard';

interface FinanceMetricsProps {
  cpqm: CPQMMetric;
  cac: CACMetric;
  payback: PaybackMetric;
  className?: string;
}

interface DialGaugeProps {
  value: number;
  max: number;
  min?: number;
  target?: number;
  acceptableMin?: number;
  acceptableMax?: number;
  goodMax?: number;
  title: string;
  format?: 'currency' | 'number' | 'months';
  size?: 'sm' | 'md' | 'lg';
  status?: PaybackStatus | 'good' | 'acceptable' | 'concerning';
  showBands?: boolean;
}

const formatValue = (value: number, format: DialGaugeProps['format'] = 'number'): string => {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'months':
      return `${value.toFixed(1)}mo`;
    default:
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }).format(value);
  }
};

const getStatusColor = (status: DialGaugeProps['status']) => {
  switch (status) {
    case 'excellent':
      return '#10b981'; // emerald-500
    case 'good':
      return '#22c55e'; // green-500
    case 'acceptable':
      return '#eab308'; // yellow-500
    case 'concerning':
      return '#f97316'; // orange-500
    case 'critical':
      return '#ef4444'; // red-500
    default:
      return '#6b7280'; // gray-500
  }
};

const getPaybackStatus = (months: number, target: number, acceptableRange?: { acceptable_max: number }): PaybackStatus => {
  if (months <= target) return 'excellent';
  if (acceptableRange && months <= acceptableRange.acceptable_max) return 'acceptable';
  if (months <= target * 1.5) return 'concerning';
  return 'critical';
};

function DialGauge({
  value,
  max,
  min = 0,
  target,
  acceptableMin,
  acceptableMax,
  goodMax,
  title,
  format = 'number',
  size = 'md',
  status,
  showBands = true,
}: DialGaugeProps) {
  const normalizedValue = Math.max(min, Math.min(max, value));
  const percentage = ((normalizedValue - min) / (max - min)) * 100;
  
  // Create gauge data for the pie chart
  const gaugeData = [
    { name: 'filled', value: percentage },
    { name: 'empty', value: 100 - percentage },
  ];
  
  // Calculate band positions
  const getBandData = () => {
    if (!showBands) return [];
    
    const bands = [];
    
    if (goodMax) {
      const goodPercentage = Math.min(100, ((goodMax - min) / (max - min)) * 100);
      bands.push({ name: 'good', value: goodPercentage, color: '#22c55e' });
    }
    
    if (acceptableMax) {
      const acceptableStart = goodMax || min;
      const acceptablePercentage = Math.min(100, ((acceptableMax - acceptableStart) / (max - min)) * 100);
      bands.push({ name: 'acceptable', value: acceptablePercentage, color: '#eab308' });
    }
    
    const remainingPercentage = 100 - bands.reduce((sum, band) => sum + band.value, 0);
    if (remainingPercentage > 0) {
      bands.push({ name: 'concerning', value: remainingPercentage, color: '#ef4444' });
    }
    
    return bands;
  };
  
  const sizeConfig = {
    sm: { width: 120, height: 60, cx: 60, cy: 60, radius: 50 },
    md: { width: 160, height: 80, cx: 80, cy: 80, radius: 70 },
    lg: { width: 200, height: 100, cx: 100, cy: 100, radius: 90 },
  };
  
  const config = sizeConfig[size];
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <ResponsiveContainer width={config.width} height={config.height}>
          <PieChart>
            {/* Background bands */}
            {showBands && (
              <Pie
                data={getBandData()}
                cx={config.cx}
                cy={config.cy}
                startAngle={180}
                endAngle={0}
                innerRadius={config.radius - 10}
                outerRadius={config.radius}
                fill="#e5e7eb"
                dataKey="value"
                stroke="none"
              >
                {getBandData().map((entry, index) => (
                  <Cell key={`band-${index}`} fill={entry.color} fillOpacity={0.3} />
                ))}
              </Pie>
            )}
            
            {/* Main gauge */}
            <Pie
              data={gaugeData}
              cx={config.cx}
              cy={config.cy}
              startAngle={180}
              endAngle={0}
              innerRadius={config.radius - 15}
              outerRadius={config.radius - 5}
              fill={getStatusColor(status)}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={getStatusColor(status)} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn(
            'font-bold text-center',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg'
          )}>
            {formatValue(value, format)}
          </div>
          {target && (
            <div className={cn(
              'text-muted-foreground text-center',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-xs',
              size === 'lg' && 'text-sm'
            )}>
              Target: {formatValue(target, format)}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <h4 className={cn(
          'font-medium',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg'
        )}>
          {title}
        </h4>
        {status && (
          <Badge 
            variant="outline" 
            className={cn(
              'mt-1 text-xs',
              status === 'excellent' && 'text-emerald-700 bg-emerald-100',
              status === 'good' && 'text-green-700 bg-green-100',
              status === 'acceptable' && 'text-yellow-700 bg-yellow-100',
              status === 'concerning' && 'text-orange-700 bg-orange-100',
              status === 'critical' && 'text-red-700 bg-red-100'
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )}
      </div>
    </div>
  );
}

function MetricSummary({ 
  title, 
  current, 
  target, 
  trend, 
  format, 
  children 
}: {
  title: string;
  current: number;
  target: number;
  trend?: { direction: 'up' | 'down' | 'flat'; magnitude: number };
  format: 'currency' | 'number' | 'months';
  children?: React.ReactNode;
}) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : 
                   trend?.direction === 'down' ? TrendingDown : null;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {trend && TrendIcon && (
          <div className={cn(
            'flex items-center gap-1 text-sm',
            trend.direction === 'up' && 'text-green-600',
            trend.direction === 'down' && 'text-red-600',
            trend.direction === 'flat' && 'text-gray-600'
          )}>
            <TrendIcon className="h-4 w-4" />
            <span>{trend.magnitude.toFixed(1)}%</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-blue-200/60">Current:</span>
          <p className="text-lg font-semibold text-white">{formatValue(current, format)}</p>
        </div>
        <div>
          <span className="text-blue-200/60">Target:</span>
          <p className="text-lg font-semibold text-white">{formatValue(target, format)}</p>
        </div>
      </div>
      
      {children}
    </div>
  );
}

export function FinanceMetrics({ cpqm, cac, payback, className }: FinanceMetricsProps) {
  const paybackStatus = getPaybackStatus(
    payback.current_months, 
    payback.target_months, 
    payback.acceptable_range
  );
  
  return (
    <TooltipProvider>
      <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6', className)}>
        {/* CPQM Card */}
        <Card className="bg-purple-900/20 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-purple-400">
              CPQM Analysis
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-help text-purple-300/50" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Cost Per Qualified Meeting - measures the efficiency of your lead generation efforts
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MetricSummary
              title="Cost Per Qualified Meeting"
              current={cpqm.current_value}
              target={cpqm.target_value}
              trend={cpqm.trend}
              format="currency"
            >
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-purple-300">Benchmark Range</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-purple-200">
                    <span>Industry Median:</span>
                    <span>{formatValue(cpqm.benchmark_range.industry_median, 'currency')}</span>
                  </div>
                  <div className="flex justify-between text-purple-200">
                    <span>Top Quartile:</span>
                    <span>{formatValue(cpqm.benchmark_range.top_quartile, 'currency')}</span>
                  </div>
                </div>
              </div>
            </MetricSummary>
            
            <div className="flex justify-center">
              <DialGauge
                value={cpqm.current_value}
                target={cpqm.target_value}
                max={cpqm.benchmark_range.industry_median * 2}
                goodMax={cpqm.benchmark_range.top_quartile}
                acceptableMax={cpqm.benchmark_range.industry_median}
                title="CPQM"
                format="currency"
                size="md"
                status={cpqm.current_value <= cpqm.benchmark_range.top_quartile ? 'excellent' :
                       cpqm.current_value <= cpqm.benchmark_range.industry_median ? 'good' : 'concerning'}
              />
            </div>
          </CardContent>
        </Card>

        {/* CAC Card */}
        <Card className="bg-blue-900/20 border-blue-500/30 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-blue-400">
              CAC Analysis
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-help text-blue-300/50" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Customer Acquisition Cost - the total cost of acquiring a new customer
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MetricSummary
              title="Customer Acquisition Cost"
              current={cac.current_value}
              target={cac.target_value}
              trend={cac.trend}
              format="currency"
            >
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-300">Payback Analysis</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-blue-200">
                    <span>Blended CAC:</span>
                    <span>{formatValue(cac.breakdown.blended_cac, 'currency')}</span>
                  </div>
                  <div className="flex justify-between text-blue-200">
                    <span>Payback Months:</span>
                    <span>{cac.payback_analysis.payback_months?.toFixed(1) || 'N/A'}mo</span>
                  </div>
                </div>
              </div>
            </MetricSummary>
            
            <div className="flex justify-center">
              <DialGauge
                value={cac.current_value}
                target={cac.target_value}
                max={cac.benchmark_range.industry_median * 2}
                goodMax={cac.benchmark_range.top_quartile}
                acceptableMax={cac.benchmark_range.industry_median}
                title="CAC"
                format="currency"
                size="md"
                status={cac.current_value <= cac.benchmark_range.top_quartile ? 'excellent' :
                       cac.current_value <= cac.benchmark_range.industry_median ? 'good' : 'concerning'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payback Card */}
        <Card className="bg-cyan-900/20 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-cyan-400">
              Payback Period
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-help text-cyan-300/50" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Time it takes to recover the customer acquisition cost through customer revenue
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MetricSummary
              title="CAC Payback Period"
              current={payback.current_months}
              target={payback.target_months}
              trend={payback.trend}
              format="months"
            >
              <div className={cn(
                'rounded-lg p-3 text-sm',
                paybackStatus === 'excellent' && 'bg-emerald-50 border border-emerald-200',
                paybackStatus === 'good' && 'bg-green-50 border border-green-200',
                paybackStatus === 'acceptable' && 'bg-yellow-50 border border-yellow-200',
                paybackStatus === 'concerning' && 'bg-orange-50 border border-orange-200',
                paybackStatus === 'critical' && 'bg-red-50 border border-red-200'
              )}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium flex items-center gap-1">
                    Status: {paybackStatus}
                    {paybackStatus === 'critical' && <AlertTriangle className="h-4 w-4" />}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Acceptable Max:</span>
                    <span>{payback.acceptable_range.acceptable_max}mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preferred Max:</span>
                    <span>{payback.acceptable_range.preferred_max}mo</span>
                  </div>
                </div>
              </div>
            </MetricSummary>
            
            <div className="flex justify-center">
              <DialGauge
                value={payback.current_months}
                target={payback.target_months}
                max={Math.max(payback.acceptable_range.acceptable_max * 1.5, payback.current_months * 1.2)}
                goodMax={payback.acceptable_range.preferred_max}
                acceptableMax={payback.acceptable_range.acceptable_max}
                title="Payback"
                format="months"
                size="md"
                status={paybackStatus}
                showBands={true}
              />
            </div>
            
            {payback.risk_factors && payback.risk_factors.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 text-sm">Risk Factors</h4>
                <div className="space-y-2">
                  {payback.risk_factors.slice(0, 2).map((risk, index) => (
                    <div key={index} className="text-xs bg-gray-50 rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{risk.factor}</span>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-xs',
                            risk.impact === 'high' && 'text-red-700 bg-red-100',
                            risk.impact === 'medium' && 'text-orange-700 bg-orange-100',
                            risk.impact === 'low' && 'text-yellow-700 bg-yellow-100'
                          )}
                        >
                          {risk.impact}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{risk.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}