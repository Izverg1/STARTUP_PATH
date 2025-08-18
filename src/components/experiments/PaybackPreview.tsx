'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { ICP } from '@/types';

interface Gate {
  id: string;
  name: string;
  metric: string;
  operator: 'gte' | 'lte';
  threshold_value: number;
  benchmark_value?: number;
  is_critical: boolean;
}

interface SelectedChannel {
  type: string;
  name: string;
  allocated_budget: number;
  gates: Gate[];
}

interface PaybackPreviewProps {
  channels: SelectedChannel[];
  maxPaybackMonths: number;
  icp: Partial<ICP>;
}

interface ChannelProjection {
  channel: SelectedChannel;
  projectedLeads: number;
  projectedCAC: number;
  paybackMonths: number;
  confidence: number;
  status: 'excellent' | 'good' | 'warning' | 'poor';
}

// Channel performance models based on industry benchmarks
const channelModels = {
  google_search: {
    baseConversionRate: 0.024,
    baseCPL: 125,
    seasonalityFactor: 1.0,
    scalingEfficiency: 0.95
  },
  linkedin_inmail: {
    baseConversionRate: 0.08,
    baseCPL: 180,
    seasonalityFactor: 0.9,
    scalingEfficiency: 0.85
  },
  webinar: {
    baseConversionRate: 0.12,
    baseCPL: 200,
    seasonalityFactor: 1.1,
    scalingEfficiency: 0.8
  },
  content_marketing: {
    baseConversionRate: 0.028,
    baseCPL: 95,
    seasonalityFactor: 1.0,
    scalingEfficiency: 0.9
  },
  paid_social: {
    baseConversionRate: 0.035,
    baseCPL: 95,
    seasonalityFactor: 1.05,
    scalingEfficiency: 0.88
  }
};

export function PaybackPreview({ channels, maxPaybackMonths, icp }: PaybackPreviewProps) {
  // Calculate ACV from ICP
  const avgACV = icp.acv_range ? 
    (icp.acv_range.min + icp.acv_range.max) / 2 : 
    30000; // default

  const grossMargin = (icp.gross_margin_percent || 70) / 100;
  const avgLTV = avgACV * grossMargin;

  // Project channel performance
  const channelProjections: ChannelProjection[] = channels.map(channel => {
    const model = channelModels[channel.type as keyof typeof channelModels] || channelModels.google_search;
    
    // Apply budget scaling factor (diminishing returns)
    const budgetScale = Math.min(1.0, channel.allocated_budget / 20000);
    const scalingFactor = 0.7 + (0.3 * budgetScale); // 70-100% efficiency based on budget
    
    // Calculate projected metrics
    const effectiveConversionRate = model.baseConversionRate * model.seasonalityFactor * scalingFactor;
    const effectiveCPL = model.baseCPL / scalingFactor;
    
    const projectedLeads = (channel.allocated_budget / effectiveCPL) * effectiveConversionRate;
    const projectedCAC = effectiveCPL / effectiveConversionRate;
    const paybackMonths = (projectedCAC / avgLTV) * 12;
    
    // Calculate confidence based on gates and budget size
    const criticalGates = channel.gates.filter(g => g.is_critical).length;
    const budgetConfidence = Math.min(1.0, channel.allocated_budget / 10000);
    const gateConfidence = Math.max(0.6, 1.0 - (criticalGates * 0.1));
    const confidence = (budgetConfidence + gateConfidence) / 2;
    
    // Determine status
    let status: 'excellent' | 'good' | 'warning' | 'poor';
    if (paybackMonths <= maxPaybackMonths * 0.6) status = 'excellent';
    else if (paybackMonths <= maxPaybackMonths * 0.8) status = 'good';
    else if (paybackMonths <= maxPaybackMonths) status = 'warning';
    else status = 'poor';
    
    return {
      channel,
      projectedLeads,
      projectedCAC,
      paybackMonths,
      confidence,
      status
    };
  });

  // Aggregate metrics
  const totalBudget = channels.reduce((sum, c) => sum + c.allocated_budget, 0);
  const totalProjectedLeads = channelProjections.reduce((sum, p) => sum + p.projectedLeads, 0);
  const blendedCAC = totalBudget / totalProjectedLeads;
  const blendedPayback = (blendedCAC / avgLTV) * 12;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'poor': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart3 className="h-4 w-4" />
          CAC Payback Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Summary */}
        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Blended CAC:</span>
            <span className="font-medium">${blendedCAC.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Blended Payback:</span>
            <span className={`font-medium ${
              blendedPayback <= maxPaybackMonths ? 'text-green-600' : 'text-red-600'
            }`}>
              {blendedPayback.toFixed(1)} months
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Projected Leads:</span>
            <span className="font-medium">{Math.round(totalProjectedLeads)}</span>
          </div>
          
          {/* Payback Progress Bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Payback Timeline</span>
              <span>{maxPaybackMonths} month target</span>
            </div>
            <Progress 
              value={Math.min(100, (blendedPayback / maxPaybackMonths) * 100)} 
              className="h-2"
            />
          </div>
        </div>

        {/* Channel Projections */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Channel Projections</h4>
          {channelProjections.map((projection, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h5 className="font-medium text-sm">{projection.channel.name}</h5>
                  <div className="text-xs text-muted-foreground">
                    ${projection.channel.allocated_budget.toLocaleString()} budget
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(projection.status)}>
                  {getStatusIcon(projection.status)}
                  <span className="ml-1 capitalize">{projection.status}</span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Projected Leads</div>
                  <div className="font-medium">{Math.round(projection.projectedLeads)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">CAC</div>
                  <div className="font-medium">${projection.projectedCAC.toFixed(0)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Payback</div>
                  <div className={`font-medium ${
                    projection.paybackMonths <= maxPaybackMonths ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {projection.paybackMonths.toFixed(1)}mo
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Confidence</div>
                  <div className="font-medium">{(projection.confidence * 100).toFixed(0)}%</div>
                </div>
              </div>
              
              {projection.status === 'poor' && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  Payback exceeds target. Consider reducing budget or adjusting gates.
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Assumptions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="font-medium">Assumptions:</div>
          <div>• Average ACV: ${avgACV.toLocaleString()}</div>
          <div>• Gross Margin: {((icp.gross_margin_percent || 70))}%</div>
          <div>• LTV: ${avgLTV.toLocaleString()}</div>
          <div>• Projections based on industry benchmarks</div>
        </div>

        {/* Recommendations */}
        {channelProjections.some(p => p.status === 'poor') && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-yellow-800 mb-1">Optimization Recommendations:</div>
                <ul className="text-yellow-700 space-y-1">
                  {channelProjections
                    .filter(p => p.status === 'poor')
                    .map((projection, index) => (
                      <li key={index}>
                        • <strong>{projection.channel.name}</strong>: Reduce budget by{' '}
                        {(((projection.paybackMonths - maxPaybackMonths) / projection.paybackMonths) * 100).toFixed(0)}%
                        {' '}or tighten success gates
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Performance Goals */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-900/50 border border-gray-700 rounded">
            <div className="text-gray-400 font-medium">Target CAC</div>
            <div className="text-gray-300">${(avgLTV / maxPaybackMonths * 12).toFixed(0)}</div>
          </div>
          <div className="text-center p-2 bg-gray-900/50 border border-gray-700 rounded">
            <div className="text-gray-400 font-medium">Max Payback</div>
            <div className="text-gray-300">{maxPaybackMonths} months</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}