'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  BarChart3, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import type { AllocationResult } from '@/lib/simulation/thompson-sampling';
import type { SimulationMetrics } from '@/lib/simulation/simulation-service';

interface ThompsonSamplingVisualizerProps {
  allocation: AllocationResult[];
  metrics: SimulationMetrics;
  channelSummary: Array<{
    id: string;
    name: string;
    type: string;
    totalConversions: number;
    totalImpressions: number;
    totalBudget: number;
    conversionRate: number;
    alpha: number;
    beta: number;
  }>;
  decisionGates?: Array<{
    channelId: string;
    gate: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }>;
  isLoading?: boolean;
}

export function ThompsonSamplingVisualizer({
  allocation,
  metrics,
  channelSummary,
  decisionGates = [],
  isLoading = false
}: ThompsonSamplingVisualizerProps) {
  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            Thompson Sampling Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-400">Loading Thompson Sampling data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!allocation.length) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="w-5 h-5 text-gray-400" />
            Thompson Sampling Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-400">No allocation data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort allocation by budget allocation
  const sortedAllocation = [...allocation].sort((a, b) => b.allocatedBudget - a.allocatedBudget);
  const topPerformer = sortedAllocation[0];

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-600/10 rounded border border-cyan-500/20">
              <DollarSign className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Allocated Budget</p>
              <p className="text-xl font-bold text-white">
                ${metrics.allocatedBudget.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                of ${metrics.totalBudget.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/10 rounded border border-green-500/20">
              <Target className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Expected Conversions</p>
              <p className="text-xl font-bold text-white">
                {metrics.expectedConversions.toFixed(1)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/10 rounded border border-purple-500/20">
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Confidence Score</p>
              <p className="text-xl font-bold text-white">
                {(metrics.confidenceScore * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/10 rounded border border-orange-500/20">
              <TrendingUp className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Top Performer</p>
              <p className="text-lg font-bold text-white truncate">
                {topPerformer.channelId.replace(/[-_]/g, ' ')}
              </p>
              <p className="text-xs text-gray-500">
                ${topPerformer.allocatedBudget.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Budget Allocation Visualization */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Budget Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedAllocation.map((result) => {
              const percentage = (result.allocatedBudget / metrics.totalBudget) * 100;
              const confidence = result.confidenceInterval.confidence;
              
              return (
                <div key={result.channelId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-white">
                        {result.channelId.replace(/[-_]/g, ' ')}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`border-${confidence > 0.8 ? 'green' : confidence > 0.6 ? 'yellow' : 'red'}-500/30 text-${confidence > 0.8 ? 'green' : confidence > 0.6 ? 'yellow' : 'red'}-400`}
                      >
                        {(confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        ${result.allocatedBudget.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={percentage} 
                      className="h-2 bg-slate-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        {(result.expectedConversionRate * 100).toFixed(2)}% conv rate
                      </span>
                      <span>
                        CI: {(result.confidenceInterval.lower * 100).toFixed(1)}% - {(result.confidenceInterval.upper * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Decision Gates */}
      {decisionGates.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Decision Gates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {decisionGates.map((gate, index) => {
                const getIcon = (status: string) => {
                  switch (status) {
                    case 'pass':
                      return <CheckCircle2 className="w-4 h-4 text-green-400" />;
                    case 'warning':
                      return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
                    case 'fail':
                      return <AlertTriangle className="w-4 h-4 text-red-400" />;
                    default:
                      return <Clock className="w-4 h-4 text-gray-400" />;
                  }
                };

                const getBgColor = (status: string) => {
                  switch (status) {
                    case 'pass':
                      return 'bg-green-900/20 border-green-500/30';
                    case 'warning':
                      return 'bg-yellow-900/20 border-yellow-500/30';
                    case 'fail':
                      return 'bg-red-900/20 border-red-500/30';
                    default:
                      return 'bg-gray-900/20 border-gray-500/30';
                  }
                };

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${getBgColor(gate.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(gate.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">
                            {gate.channelId.replace(/[-_]/g, ' ')}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {gate.gate}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300">{gate.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Channel Performance Summary */}
      {channelSummary.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-cyan-400" />
              Channel Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left p-2 font-medium text-gray-300">Channel</th>
                    <th className="text-right p-2 font-medium text-gray-300">Conv Rate</th>
                    <th className="text-right p-2 font-medium text-gray-300">Conversions</th>
                    <th className="text-right p-2 font-medium text-gray-300">Impressions</th>
                    <th className="text-right p-2 font-medium text-gray-300">Budget</th>
                    <th className="text-right p-2 font-medium text-gray-300">Alpha/Beta</th>
                  </tr>
                </thead>
                <tbody>
                  {channelSummary.map((channel) => (
                    <tr key={channel.id} className="border-b border-slate-700/30">
                      <td className="p-2 font-medium text-white">
                        {channel.name}
                      </td>
                      <td className="p-2 text-right text-white">
                        {(channel.conversionRate * 100).toFixed(2)}%
                      </td>
                      <td className="p-2 text-right text-gray-300">
                        {channel.totalConversions.toLocaleString()}
                      </td>
                      <td className="p-2 text-right text-gray-300">
                        {channel.totalImpressions.toLocaleString()}
                      </td>
                      <td className="p-2 text-right text-white">
                        ${channel.totalBudget.toLocaleString()}
                      </td>
                      <td className="p-2 text-right text-gray-400 font-mono text-xs">
                        {channel.alpha.toFixed(1)}/{channel.beta.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}