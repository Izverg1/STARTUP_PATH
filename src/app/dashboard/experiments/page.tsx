'use client';

import React, { useState } from 'react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { KillLog } from '@/components/dashboard/KillLog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FlaskConical,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  Plus,
  Filter,
  BarChart3,
  X
} from 'lucide-react';
import Link from 'next/link';

// Mock data for experiments
const mockExperimentsData = {
  active: [
    {
      id: '1',
      name: 'LinkedIn Ad Creative A/B Test',
      channel_type: 'paid_social' as const,
      status: 'running',
      start_date: '2024-01-15',
      estimated_end_date: '2024-02-15',
      days_running: 15,
      budget_allocated: 15000,
      budget_spent: 8500,
      primary_metric: 'CPL',
      current_value: 85,
      target_value: 75,
      confidence_level: 0.78,
      statistical_significance: 0.65,
      variant_performance: [
        { name: 'Control', value: 92, conversion_rate: 0.028, spend: 4200 },
        { name: 'Variant A', value: 78, conversion_rate: 0.035, spend: 4300 }
      ]
    },
    {
      id: '2',
      name: 'Landing Page Headline Test',
      channel_type: 'content' as const,
      status: 'running',
      start_date: '2024-01-20',
      estimated_end_date: '2024-02-20',
      days_running: 10,
      budget_allocated: 5000,
      budget_spent: 2100,
      primary_metric: 'Conversion Rate',
      current_value: 0.042,
      target_value: 0.035,
      confidence_level: 0.95,
      statistical_significance: 0.88,
      variant_performance: [
        { name: 'Original', value: 0.035, conversion_rate: 0.035, spend: 1000 },
        { name: 'New Headline', value: 0.048, conversion_rate: 0.048, spend: 1100 }
      ]
    },
    {
      id: '3',
      name: 'Google Ads Bidding Strategy',
      channel_type: 'paid_search' as const,
      status: 'paused',
      start_date: '2024-01-10',
      estimated_end_date: '2024-02-10',
      days_running: 20,
      budget_allocated: 25000,
      budget_spent: 18500,
      primary_metric: 'CPA',
      current_value: 125,
      target_value: 110,
      confidence_level: 0.82,
      statistical_significance: 0.72,
      variant_performance: [
        { name: 'Manual CPC', value: 135, conversion_rate: 0.024, spend: 9200 },
        { name: 'Target CPA', value: 115, conversion_rate: 0.029, spend: 9300 }
      ]
    }
  ],
  completed: [
    {
      id: '4',
      name: 'Email Subject Line Test',
      channel_type: 'email' as const,
      status: 'completed',
      start_date: '2024-01-01',
      end_date: '2024-01-14',
      duration_days: 14,
      budget_allocated: 2000,
      budget_spent: 2000,
      primary_metric: 'Open Rate',
      final_value: 0.28,
      target_value: 0.25,
      confidence_level: 0.99,
      result: 'success',
      winner: 'Variant B',
      improvement: 0.12
    }
  ],
  failed: [
    {
      id: 'failed-1',
      name: 'Display Retargeting Campaign',
      channel_type: 'display' as const,
      start_date: '2023-12-01',
      end_date: '2023-12-21',
      duration_days: 21,
      total_spend: 8500,
      target_metric: 'CTR',
      target_value: 0.015,
      actual_value: 0.008,
      failure_reason: 'poor_performance' as const,
      failure_category: 'hypothesis_invalid' as const,
      confidence_level: 0.92,
      impact_assessment: {
        financial_loss: 5500,
        opportunity_cost: 3000,
        team_hours_lost: 40,
        reputation_impact: 'low' as const,
        customer_impact: 'none' as const
      },
      lessons_learned: [
        'Display ads perform poorly for our B2B audience',
        'Need better creative assets for retargeting',
        'Consider LinkedIn for retargeting instead'
      ],
      kill_decision_maker: 'Sarah Chen',
      kill_date: '2023-12-21',
      assets_salvaged: ['Creative designs', 'Audience insights']
    },
    {
      id: 'failed-2',
      name: 'TikTok Ads Pilot',
      channel_type: 'paid_social' as const,
      start_date: '2023-11-15',
      end_date: '2023-12-05',
      duration_days: 20,
      total_spend: 12000,
      target_metric: 'Lead Quality Score',
      target_value: 7.5,
      actual_value: 4.2,
      failure_reason: 'low_quality_traffic' as const,
      failure_category: 'market_timing' as const,
      confidence_level: 0.87,
      impact_assessment: {
        financial_loss: 8000,
        opportunity_cost: 4000,
        team_hours_lost: 60,
        reputation_impact: 'none' as const,
        customer_impact: 'low' as const
      },
      lessons_learned: [
        'TikTok audience too young for B2B SaaS',
        'Video content needs significant investment',
        'Focus on LinkedIn and YouTube instead'
      ],
      kill_decision_maker: 'Mike Johnson',
      kill_date: '2023-12-05'
    }
  ]
};

interface ExperimentCardProps {
  experiment: any;
  type: 'active' | 'completed';
}

function ExperimentCard({ experiment, type }: ExperimentCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="h-4 w-4 text-green-600" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'paused':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'completed':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const formatMetricValue = (value: number, metric: string) => {
    if (metric.toLowerCase().includes('rate') || metric.toLowerCase().includes('ctr')) {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (metric.toLowerCase().includes('cost') || metric.toLowerCase().includes('cpa') || metric.toLowerCase().includes('cpl')) {
      return `$${value.toFixed(0)}`;
    }
    return value.toString();
  };

  return (
    <Card className="bg-gray-800 border-gray-600 hover:border-gray-500 transition-all h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <FlaskConical className="h-5 w-5 text-cyan-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg leading-tight text-white">{experiment.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                <Calendar className="h-3 w-3" />
                <span>{experiment.start_date}</span>
                {type === 'active' && (
                  <>
                    <span>•</span>
                    <span>{experiment.days_running} days running</span>
                  </>
                )}
                {type === 'completed' && (
                  <>
                    <span>→</span>
                    <span>{experiment.end_date}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={experiment.status === 'running' ? 'text-green-300 border-green-600' : experiment.status === 'paused' ? 'text-yellow-300 border-yellow-600' : 'text-blue-300 border-blue-600'}>
              {getStatusIcon(experiment.status)}
              <span className="ml-1 capitalize">{experiment.status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Primary Metric */}
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-200">Primary Metric: {experiment.primary_metric}</span>
            <Badge variant="outline" className="text-xs text-cyan-300 border-cyan-600">
              {(experiment.confidence_level * 100).toFixed(0)}% confidence
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-400">
                {type === 'active' ? 'Current' : 'Final'} Value
              </span>
              <div className="text-lg font-semibold text-white">
                {formatMetricValue(
                  type === 'active' ? experiment.current_value : experiment.final_value, 
                  experiment.primary_metric
                )}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Target Value</span>
              <div className="text-lg font-semibold text-white">
                {formatMetricValue(experiment.target_value, experiment.primary_metric)}
              </div>
            </div>
          </div>
          
          {type === 'completed' && experiment.result && (
            <div className="mt-3 pt-3 border-t border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-200">Result:</span>
                <div className="flex items-center gap-2">
                  {experiment.result === 'success' ? (
                    <Badge className="bg-green-600 text-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Success
                    </Badge>
                  ) : (
                    <Badge className="bg-red-600 text-red-100">
                      <XCircle className="h-3 w-3 mr-1" />
                      Failed
                    </Badge>
                  )}
                </div>
              </div>
              {experiment.winner && (
                <div className="text-sm text-gray-400 mt-1">
                  Winner: {experiment.winner} (+{(experiment.improvement * 100).toFixed(1)}%)
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Budget Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-700 rounded-lg border border-gray-600">
            <div className="text-xs text-gray-400 mb-1">Budget</div>
            <div className="font-semibold text-white">
              ${type === 'active' ? experiment.budget_allocated.toLocaleString() : experiment.budget_spent.toLocaleString()}
            </div>
            {type === 'active' && (
              <div className="text-xs text-gray-400">
                ${experiment.budget_spent.toLocaleString()} spent
              </div>
            )}
          </div>
          
          <div className="text-center p-3 bg-gray-700 rounded-lg border border-gray-600">
            <div className="text-xs text-gray-400 mb-1">
              {type === 'active' ? 'Statistical Sig.' : 'Duration'}
            </div>
            <div className="font-semibold text-white">
              {type === 'active' 
                ? `${(experiment.statistical_significance * 100).toFixed(0)}%`
                : `${experiment.duration_days} days`
              }
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-600">
          {type === 'active' && (
            <>
              {experiment.status === 'running' ? (
                <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600">
                  <Pause className="h-3 w-3 mr-1" />
                  Pause
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600">
                  <Play className="h-3 w-3 mr-1" />
                  Resume
                </Button>
              )}
              <Button variant="outline" size="sm" className="bg-gray-700 border-red-600 text-red-400 hover:bg-red-900">
                <XCircle className="h-3 w-3 mr-1" />
                Kill
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" className="ml-auto bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600">
            <BarChart3 className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExperimentsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Calculate summary stats
  const activeExperiments = mockExperimentsData.active;
  const runningCount = activeExperiments.filter(e => e.status === 'running').length;
  const totalBudget = activeExperiments.reduce((sum, e) => sum + e.budget_allocated, 0);
  const totalSpent = activeExperiments.reduce((sum, e) => sum + e.budget_spent, 0);
  const avgConfidence = activeExperiments.reduce((sum, e) => sum + e.confidence_level, 0) / activeExperiments.length;

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-sm text-cyan-400 font-medium">Experiment Lab</span>
            </div>
            <p className="text-gray-400 text-sm">
              Thompson Sampling allocation with deterministic seeding for optimal channel validation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowTutorial(true)}
              className="bg-black/40 border-gray-500/30 text-gray-300 hover:bg-gray-700/50"
            >
              <Play className="h-4 w-4 mr-2" />
              Tutorial
            </Button>
            <Button variant="outline" size="sm" className="bg-black/40 border-gray-500/30 text-gray-300 hover:bg-gray-700/50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Link href="/dashboard/experiments/designer">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Design Experiment
              </Button>
            </Link>
          </div>
        </div>
        
        {/* System Status */}
        <div className="flex items-center gap-6 text-sm p-3 bg-black/40 border border-gray-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400">Thompson Sampling Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-red-400" />
            <span className="text-red-400">Deterministic Seeding</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <span className="text-cyan-400">Real-time Optimization</span>
          </div>
        </div>
      </div>

      </div>

      {/* Value Proposition */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          Platform Benefits
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-black/40 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <h3 className="text-white font-medium">Reduce CAC by 35%</h3>
            </div>
            <p className="text-gray-300 text-sm">Intelligent budget allocation across channels with real-time optimization</p>
          </div>
          <div className="bg-black/40 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-red-400" />
              <h3 className="text-white font-medium">99.7% Statistical Accuracy</h3>
            </div>
            <p className="text-gray-300 text-sm">Thompson Sampling ensures optimal exploration vs exploitation balance</p>
          </div>
          <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-cyan-400" />
              <h3 className="text-white font-medium">2x Faster Validation</h3>
            </div>
            <p className="text-gray-300 text-sm">Deterministic seeding eliminates variance and accelerates insights</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          Performance Overview
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-black/40 border border-green-500/20 rounded-lg p-4 hover:border-green-500/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Play className="h-4 w-4 text-green-400" />
              <div className="text-sm text-green-300">Active Experiments</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{activeExperiments.length}</div>
            <div className="text-xs text-gray-400">{runningCount} running live</div>
          </div>
          
          <div className="bg-black/40 border border-yellow-500/20 rounded-lg p-4 hover:border-yellow-500/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              <div className="text-sm text-yellow-300">Total Budget</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">${totalBudget.toLocaleString()}</div>
            <div className="text-xs text-gray-400">${totalSpent.toLocaleString()} allocated</div>
          </div>
          
          <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-cyan-400" />
              <div className="text-sm text-cyan-300">Avg Confidence</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{(avgConfidence * 100).toFixed(0)}%</div>
            <div className="text-xs text-gray-400">Statistical significance</div>
          </div>
          
          <div className="bg-black/40 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <div className="text-sm text-blue-300">Success Rate</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">67.0%</div>
            <div className="text-xs text-blue-400">↗ +8.3% (30d)</div>
          </div>
        </div>
      </div>

      {/* Experiments */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          Experiments Management
        </h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-gray-500/30">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Active ({activeExperiments.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Completed ({mockExperimentsData.completed.length})
            </TabsTrigger>
            <TabsTrigger 
              value="failed" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Failed ({mockExperimentsData.failed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockExperimentsData.active.map(experiment => (
                <div key={experiment.id} className="bg-black/40 border border-gray-500/30 rounded-lg p-4 hover:border-gray-400/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">{experiment.name}</h3>
                    <Badge className={experiment.status === 'running' ? 'bg-green-600/80 text-green-100 border-green-500/30' : 'bg-yellow-600/80 text-yellow-100 border-yellow-500/30'}>
                      {experiment.status === 'running' ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
                      {experiment.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-black/20 p-3 rounded-lg border border-gray-600/30">
                      <div className="text-gray-400 text-sm mb-1">Current {experiment.primary_metric}</div>
                      <div className="text-white font-bold text-lg">
                        {experiment.primary_metric.includes('Rate') ? `${(experiment.current_value * 100).toFixed(1)}%` : `$${experiment.current_value}`}
                      </div>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg border border-gray-600/30">
                      <div className="text-gray-400 text-sm mb-1">Target</div>
                      <div className="text-green-400 font-bold text-lg">
                        {experiment.primary_metric.includes('Rate') ? `${(experiment.target_value * 100).toFixed(1)}%` : `$${experiment.target_value}`}
                      </div>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg border border-gray-600/30">
                      <div className="text-gray-400 text-sm mb-1">Budget</div>
                      <div className="text-white font-bold text-sm">${experiment.budget_allocated.toLocaleString()}</div>
                      <div className="text-gray-500 text-xs">${experiment.budget_spent.toLocaleString()} spent</div>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg border border-gray-600/30">
                      <div className="text-gray-400 text-sm mb-1">Confidence</div>
                      <div className="text-cyan-400 font-bold text-sm">{(experiment.confidence_level * 100).toFixed(0)}%</div>
                      <div className="text-gray-500 text-xs">Statistical sig.</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-black/40 border-gray-500/30 text-gray-300 hover:bg-gray-700/50 text-xs flex-1">
                      {experiment.status === 'running' ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Resume
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" className="bg-black/40 border-gray-500/30 text-gray-300 hover:bg-gray-700/50 text-xs flex-1">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
              </div>
            </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockExperimentsData.completed.map(experiment => (
                <div key={experiment.id} className="bg-black/40 border border-gray-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold text-base">{experiment.name}</h3>
                    <Badge className="bg-blue-600 text-blue-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="bg-black/20 p-2 rounded border border-gray-600/30">
                      <div className="text-gray-400 text-xs">Final {experiment.primary_metric}</div>
                      <div className="text-white font-semibold">
                        {experiment.primary_metric.includes('Rate') ? `${(experiment.final_value * 100).toFixed(1)}%` : `$${experiment.final_value}`}
                      </div>
                    </div>
                    <div className="bg-black/20 p-2 rounded border border-gray-600/30">
                      <div className="text-gray-400 text-xs">Result</div>
                      <div className="text-green-400 font-semibold">Success</div>
                    </div>
                    <div className="bg-black/20 p-2 rounded border border-gray-600/30">
                      <div className="text-gray-400 text-xs">Duration</div>
                      <div className="text-white font-semibold">{experiment.duration_days} days</div>
                    </div>
                    <div className="bg-black/20 p-2 rounded border border-gray-600/30">
                      <div className="text-gray-400 text-xs">Improvement</div>
                      <div className="text-green-400 font-semibold">+{(experiment.improvement * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-black/40 border-gray-500/30 text-gray-300 hover:bg-gray-700/50 text-xs flex-1">
                      View Report
                    </Button>
                    <Button size="sm" variant="outline" className="bg-black/40 border-gray-500/30 text-gray-300 hover:bg-gray-700/50 text-xs flex-1">
                      Clone
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="failed" className="space-y-4">
            <div className="space-y-4">
              {mockExperimentsData.failed.map((experiment, index) => (
                <div key={index} className="bg-black/40 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{experiment.name}</h4>
                    <Badge className="bg-red-600 text-red-100">Failed</Badge>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    {experiment.start_date} → {experiment.end_date} • ${experiment.total_spend.toLocaleString()} spent
                  </div>
                  <div className="text-sm text-red-400">
                    Target: {experiment.target_value} • Actual: {experiment.actual_value}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Reason: {experiment.failure_reason.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Spacing */}
      <div className="pb-8"></div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 border border-red-500/30 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                  <FlaskConical className="h-5 w-5 text-red-400" />
                </div>
                GTM Experiment Lab Tutorial
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowTutorial(false)}
                className="bg-black/40 border-red-500/30 text-red-200 hover:bg-red-900/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Why Use Experiment Lab?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <DollarSign className="h-3 w-3 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Reduce CAC by 35%</p>
                      <p className="text-gray-300 text-sm">Thompson Sampling ensures optimal budget allocation across channels</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Target className="h-3 w-3 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">99.7% Statistical Accuracy</p>
                      <p className="text-gray-300 text-sm">Deterministic seeding eliminates variance and accelerates insights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="h-3 w-3 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">2x Faster Validation</p>
                      <p className="text-gray-300 text-sm">Real-time optimization accelerates learning and decision making</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">How to Get Started</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-red-400 font-bold text-sm">1</div>
                    <div>
                      <p className="text-white font-medium">Design Your Experiment</p>
                      <p className="text-gray-300 text-sm">Click "Design Experiment" to configure channels, budgets, and success metrics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-red-400 font-bold text-sm">2</div>
                    <div>
                      <p className="text-white font-medium">Set Success Gates</p>
                      <p className="text-gray-300 text-sm">Define pass/fail thresholds to automatically optimize budget allocation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-red-400 font-bold text-sm">3</div>
                    <div>
                      <p className="text-white font-medium">Monitor & Optimize</p>
                      <p className="text-gray-300 text-sm">Watch real-time performance and let Thompson Sampling optimize automatically</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-red-500/30 pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Pro Tip: Start with 2-3 channels and $5k budget for fastest validation
                </div>
                <Button 
                  onClick={() => setShowTutorial(false)}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}