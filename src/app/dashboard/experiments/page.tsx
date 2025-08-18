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
  BarChart3
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <FlaskConical className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg leading-tight">{experiment.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
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
            <Badge variant="outline" className={getStatusColor(experiment.status)}>
              {getStatusIcon(experiment.status)}
              <span className="ml-1 capitalize">{experiment.status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Primary Metric */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Primary Metric: {experiment.primary_metric}</span>
            <Badge variant="outline" className="text-xs">
              {(experiment.confidence_level * 100).toFixed(0)}% confidence
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground">
                {type === 'active' ? 'Current' : 'Final'} Value
              </span>
              <div className="text-lg font-semibold">
                {formatMetricValue(
                  type === 'active' ? experiment.current_value : experiment.final_value, 
                  experiment.primary_metric
                )}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Target Value</span>
              <div className="text-lg font-semibold">
                {formatMetricValue(experiment.target_value, experiment.primary_metric)}
              </div>
            </div>
          </div>
          
          {type === 'completed' && experiment.result && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Result:</span>
                <div className="flex items-center gap-2">
                  {experiment.result === 'success' ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Success
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Failed
                    </Badge>
                  )}
                </div>
              </div>
              {experiment.winner && (
                <div className="text-sm text-muted-foreground mt-1">
                  Winner: {experiment.winner} (+{(experiment.improvement * 100).toFixed(1)}%)
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Budget Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-xs text-muted-foreground mb-1">Budget</div>
            <div className="font-semibold">
              ${type === 'active' ? experiment.budget_allocated.toLocaleString() : experiment.budget_spent.toLocaleString()}
            </div>
            {type === 'active' && (
              <div className="text-xs text-muted-foreground">
                ${experiment.budget_spent.toLocaleString()} spent
              </div>
            )}
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-xs text-muted-foreground mb-1">
              {type === 'active' ? 'Statistical Sig.' : 'Duration'}
            </div>
            <div className="font-semibold">
              {type === 'active' 
                ? `${(experiment.statistical_significance * 100).toFixed(0)}%`
                : `${experiment.duration_days} days`
              }
            </div>
          </div>
        </div>
        
        {/* Variant Performance for Active */}
        {type === 'active' && experiment.variant_performance && (
          <div>
            <h4 className="font-medium mb-2">Variant Performance</h4>
            <div className="space-y-2">
              {experiment.variant_performance.map((variant: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{variant.name}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{formatMetricValue(variant.value, experiment.primary_metric)}</span>
                    <span className="text-muted-foreground">${variant.spend.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          {type === 'active' && (
            <>
              {experiment.status === 'running' ? (
                <Button variant="outline" size="sm">
                  <Pause className="h-3 w-3 mr-1" />
                  Pause
                </Button>
              ) : (
                <Button variant="outline" size="sm">
                  <Play className="h-3 w-3 mr-1" />
                  Resume
                </Button>
              )}
              <Button variant="outline" size="sm" className="text-gray-300 border-gray-700 hover:bg-gray-800">
                <XCircle className="h-3 w-3 mr-1" />
                Kill
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" className="ml-auto">
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
  
  // Calculate summary stats
  const activeExperiments = mockExperimentsData.active;
  const runningCount = activeExperiments.filter(e => e.status === 'running').length;
  const totalBudget = activeExperiments.reduce((sum, e) => sum + e.budget_allocated, 0);
  const totalSpent = activeExperiments.reduce((sum, e) => sum + e.budget_spent, 0);
  const avgConfidence = activeExperiments.reduce((sum, e) => sum + e.confidence_level, 0) / activeExperiments.length;

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 py-6">
        <div className="min-w-[1200px] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FlaskConical className="h-8 w-8 text-gray-400" />
            Experiments
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage your marketing experiments and A/B tests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Link href="/dashboard/experiments/designer">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Experiment
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Experiments"
          value={activeExperiments.length}
          subtitle={`${runningCount} running`}
          status="good"
          tooltip="Number of currently active experiments"
        />
        
        <MetricCard
          title="Total Budget"
          value={totalBudget}
          format="currency"
          subtitle={`$${totalSpent.toLocaleString()} spent`}
          status="acceptable"
          tooltip="Total budget allocated to active experiments"
        />
        
        <MetricCard
          title="Avg Confidence"
          value={avgConfidence}
          format="percentage"
          status="good"
          tooltip="Average statistical confidence across active experiments"
        />
        
        <MetricCard
          title="Success Rate"
          value={0.67}
          format="percentage"
          trend={{
            direction: 'up',
            magnitude: 8.3,
            period_days: 30,
            statistical_significance: 0.85,
            volatility: 'low'
          }}
          status="excellent"
          tooltip="Percentage of experiments that achieve their targets"
        />
      </div>

      {/* Experiments Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Active ({activeExperiments.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({mockExperimentsData.completed.length})
          </TabsTrigger>
          <TabsTrigger value="failed" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Failed ({mockExperimentsData.failed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {mockExperimentsData.active.map(experiment => (
              <ExperimentCard
                key={experiment.id}
                experiment={experiment}
                type="active"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {mockExperimentsData.completed.map(experiment => (
              <ExperimentCard
                key={experiment.id}
                experiment={experiment}
                type="completed"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="failed" className="space-y-6">
          <KillLog 
            experiments={mockExperimentsData.failed}
            title="Failed Experiments"
            showFilters={true}
            showLessonsLearned={true}
          />
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  );
}