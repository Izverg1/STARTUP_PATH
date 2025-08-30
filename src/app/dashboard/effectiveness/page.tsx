'use client';

import React, { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCurrentProject } from '@/contexts/ProjectContext';
import { useEffectiveness } from '@/hooks/useEffectiveness';
import type { ChannelPerformance, OptimizationOpportunity } from '@/lib/db/client-queries';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { FunnelChart } from '@/components/dashboard/FunnelChart';
import { FinanceMetrics } from '@/components/dashboard/FinanceMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Filter,
  Download,
  Zap,
  AlertTriangle,
  CheckCircle,
  Loader2,
  XCircle,
  Building2
} from 'lucide-react';

// Mock data for effectiveness analysis
const mockEffectivenessData = {
  overview: {
    overall_efficiency_score: 7.2,
    mer: 3.8,
    roas: 4.2,
    blended_cac: 1850,
    ltv_cac_ratio: 4.5
  },
  channelPerformance: [
    {
      channel: 'Google Ads',
      channel_type: 'paid_search',
      spend: 45000,
      revenue: 189000,
      customers: 89,
      cac: 505,
      roas: 4.2,
      efficiency_score: 8.5,
      trend: 'up'
    },
    {
      channel: 'LinkedIn Ads',
      channel_type: 'paid_social',
      spend: 32000,
      revenue: 128000,
      customers: 56,
      cac: 571,
      roas: 4.0,
      efficiency_score: 7.8,
      trend: 'flat'
    },
    {
      channel: 'Display Network',
      channel_type: 'display',
      spend: 18000,
      revenue: 54000,
      customers: 25,
      cac: 720,
      roas: 3.0,
      efficiency_score: 6.2,
      trend: 'down'
    },
    {
      channel: 'Content Marketing',
      channel_type: 'content',
      spend: 15000,
      revenue: 75000,
      customers: 35,
      cac: 429,
      roas: 5.0,
      efficiency_score: 8.9,
      trend: 'up'
    },
    {
      channel: 'Email Marketing',
      channel_type: 'email',
      spend: 5000,
      revenue: 45000,
      customers: 28,
      cac: 179,
      roas: 9.0,
      efficiency_score: 9.2,
      trend: 'up'
    }
  ],
  timeSeriesData: [
    { month: 'Oct', mer: 3.2, roas: 3.8, efficiency: 6.8, spend: 98000, revenue: 372000 },
    { month: 'Nov', mer: 3.5, roas: 4.0, efficiency: 7.1, spend: 105000, revenue: 420000 },
    { month: 'Dec', mer: 3.6, roas: 4.1, efficiency: 7.0, spend: 110000, revenue: 451000 },
    { month: 'Jan', mer: 3.8, roas: 4.2, efficiency: 7.2, spend: 115000, revenue: 483000 },
  ],
  optimizationOpportunities: [
    {
      type: 'budget_reallocation',
      description: 'Shift 15% budget from Display to Email Marketing',
      potential_impact: 0.18,
      confidence: 0.85,
      effort_required: 'low',
      estimated_roi: 2.4
    },
    {
      type: 'channel_optimization',
      description: 'Improve LinkedIn ad creative performance',
      potential_impact: 0.12,
      confidence: 0.72,
      effort_required: 'medium',
      estimated_roi: 1.8
    },
    {
      type: 'timing_adjustment',
      description: 'Optimize Google Ads bidding schedule',
      potential_impact: 0.08,
      confidence: 0.90,
      effort_required: 'low',
      estimated_roi: 3.1
    }
  ],
  funnelData: {
    stages: [
      {
        name: 'impression' as const,
        order: 1,
        count: 450000,
        conversion_rate: 1.0,
        cost_per_conversion: 0.26,
        status: 'performing' as const
      },
      {
        name: 'click' as const,
        order: 2,
        count: 22500,
        conversion_rate: 0.05,
        cost_per_conversion: 5.11,
        benchmark_conversion_rate: 0.06,
        status: 'underperforming' as const
      },
      {
        name: 'landing_page_view' as const,
        order: 3,
        count: 21150,
        conversion_rate: 0.94,
        cost_per_conversion: 5.44,
        status: 'performing' as const
      },
      {
        name: 'lead' as const,
        order: 4,
        count: 5287,
        conversion_rate: 0.25,
        cost_per_conversion: 21.76,
        benchmark_conversion_rate: 0.30,
        status: 'underperforming' as const
      },
      {
        name: 'qualified_lead' as const,
        order: 5,
        count: 2644,
        conversion_rate: 0.50,
        cost_per_conversion: 43.52,
        status: 'performing' as const
      },
      {
        name: 'opportunity' as const,
        order: 6,
        count: 528,
        conversion_rate: 0.20,
        cost_per_conversion: 217.61,
        benchmark_conversion_rate: 0.25,
        status: 'critical' as const
      },
      {
        name: 'closed_won' as const,
        order: 7,
        count: 158,
        conversion_rate: 0.30,
        cost_per_conversion: 725.32,
        status: 'acceptable' as const
      }
    ],
    overall_conversion_rate: 0.000351,
    drop_off_analysis: {
      highest_drop_stage: 'opportunity' as const,
      drop_rate: 0.80,
      impact_on_pipeline: 185000,
      root_causes: [
        {
          cause: 'Long sales cycle causing prospect fatigue',
          confidence: 0.78,
          impact_score: 8.2,
          actionable: true
        },
        {
          cause: 'Pricing objections not properly addressed',
          confidence: 0.85,
          impact_score: 7.8,
          actionable: true
        }
      ]
    },
    optimization_recommendations: [
      {
        stage: 'opportunity' as const,
        opportunity: 'Implement automated nurture sequence for opportunities',
        potential_improvement: 0.25,
        effort_required: 'medium' as const,
        expected_roi: 4.2
      }
    ]
  }
};

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#f97316', '#8b5cf6'];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

function ChannelPerformanceChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-black border border-red-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          Channel Performance Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="channel" 
                className="text-xs"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'roas') return [value.toFixed(1) + 'x', 'ROAS'];
                  if (name === 'efficiency_score') return [value.toFixed(1) + '/10', 'Efficiency Score'];
                  return [value, name];
                }}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'white'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="roas" fill="#3b82f6" name="ROAS" />
              <Bar dataKey="efficiency_score" fill="#10b981" name="Efficiency Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function SpendAllocationChart({ data }: { data: any[] }) {
  const pieData = data.map((channel, index) => ({
    name: channel.channel,
    value: channel.spend,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Card className="bg-black border border-red-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <PieChartIcon className="h-5 w-5 text-purple-400" />
          Budget Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendAnalysisChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-black border border-red-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="h-5 w-5 text-green-400" />
          Effectiveness Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'mer' || name === 'roas') return [value.toFixed(1) + 'x', name.toUpperCase()];
                  if (name === 'efficiency') return [value.toFixed(1) + '/10', 'Efficiency Score'];
                  return [value, name];
                }}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'white'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey="mer" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="MER"
              />
              <Line 
                type="monotone" 
                dataKey="roas" 
                stroke="#10b981" 
                strokeWidth={2}
                name="ROAS"
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Efficiency Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function OptimizationOpportunities({ opportunities }: { opportunities: any[] }) {
  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low':
        return 'text-green-300 bg-green-900/20 border-green-500/30';
      case 'medium':
        return 'text-yellow-300 bg-yellow-900/20 border-yellow-500/30';
      case 'high':
        return 'text-red-300 bg-red-900/20 border-red-500/30';
      default:
        return 'text-gray-300 bg-gray-900/20 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-black border border-red-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Zap className="h-5 w-5 text-yellow-400" />
          Optimization Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...opportunities]
          .sort((a, b) => b.estimated_roi - a.estimated_roi)
          .map((opportunity, index) => (
            <div key={index} className="border border-red-500/30 bg-zinc-900 rounded-lg p-4 hover:border-red-500/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium capitalize mb-1 text-white">
                    {opportunity.type.replace('_', ' ')}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {opportunity.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline" className={getEffortColor(opportunity.effort_required)}>
                    {opportunity.effort_required} effort
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Potential Impact:</span>
                  <div className="font-semibold text-green-400">
                    +{formatPercentage(opportunity.potential_impact)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Confidence:</span>
                  <div className="font-semibold text-white">
                    {formatPercentage(opportunity.confidence)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Expected ROI:</span>
                  <div className="font-semibold text-blue-400">
                    {opportunity.estimated_roi.toFixed(1)}x
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-red-500/30 flex justify-end">
                <Button size="sm" variant="outline" className="bg-zinc-900 border-yellow-500/30 text-yellow-200 hover:bg-yellow-900/20">
                  Implement
                </Button>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}

export default function EffectivenessPage() {
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Real data hooks
  const { user, organization, loading: userLoading, error: userError, refetch: refetchUser } = useCurrentUser();
  const { currentProject, isLoading: projectLoading } = useCurrentProject();
  const { 
    effectivenessData, 
    loading: effectivenessLoading, 
    error: effectivenessError,
    overview,
    channelPerformance,
    timeSeriesData,
    optimizationOpportunities,
    refetch 
  } = useEffectiveness({ 
    projectId: currentProject?.id,
    orgId: !currentProject?.id ? organization?.id : undefined, // Fallback to org if no project
    autoRefresh: true,
    refreshInterval: 30000
  });

  // Combined loading state
  const loading = userLoading || projectLoading || effectivenessLoading;
  const error = userError || effectivenessError;

  // Organization check - redirect to settings if no organization
  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="text-center space-y-4 max-w-md">
          <Building2 className="h-16 w-16 text-yellow-400 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Organization Required</h2>
            <p className="text-gray-400 mb-6">
              You need to join or create an organization to access effectiveness analytics.
            </p>
            <Button 
              onClick={() => window.location.href = '/dashboard/settings?tab=organization'}
              className="bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-400"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Manage Organization
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
          <p className="text-blue-200">Loading effectiveness analytics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto" />
          <p className="text-red-200">Error loading effectiveness data</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <Button onClick={refetch} variant="outline" className="bg-zinc-900 border-blue-500/30 text-blue-200 hover:bg-blue-900/20">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // No data state - use mock data as fallback for demonstration
  const data = effectivenessData || mockEffectivenessData;

  return (
    <div className="h-full flex flex-col">
      {/* Effectiveness Content with Horizontal Tabs */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
          <TabsList className="bg-slate-900/50 border border-slate-700/50 p-1 m-6 mb-0 shrink-0">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
            >
              📊 Performance Overview
            </TabsTrigger>
            <TabsTrigger 
              value="channels" 
              className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
            >
              📈 Channel Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="funnel" 
              className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
            >
              🔄 Funnel Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="optimization" 
              className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
            >
              ⚡ Optimization
            </TabsTrigger>
          </TabsList>

          {/* Performance Overview Tab */}
          <TabsContent value="overview" className="flex-1 overflow-y-auto effectiveness-scrollbar p-6">
            {/* Header Controls */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Marketing Effectiveness</h2>
                <p className="text-sm text-blue-400 font-medium">Performance Analytics Dashboard</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40 bg-zinc-900 border-red-500/30 text-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="last_7_days">Last 7 days</SelectItem>
                    <SelectItem value="last_30_days">Last 30 days</SelectItem>
                    <SelectItem value="last_90_days">Last 90 days</SelectItem>
                    <SelectItem value="last_12_months">Last 12 months</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="bg-zinc-900 border-blue-500/30 text-blue-200 hover:bg-blue-900/20">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <MetricCard
                title="Efficiency Score"
                value={data.overview.overall_efficiency_score}
                subtitle="Out of 10"
                status="good"
                trend={{
                  direction: 'up',
                  magnitude: 4.2,
                  period_days: 30,
                  statistical_significance: 0.85,
                  volatility: 'low'
                }}
                tooltip="Overall marketing effectiveness score"
              />
              
              <MetricCard
                title="MER"
                value={data.overview.mer}
                subtitle="Marketing Efficiency Ratio"
                status="good"
                trend={{
                  direction: 'up',
                  magnitude: 8.5,
                  period_days: 30,
                  statistical_significance: 0.92,
                  volatility: 'low'
                }}
                tooltip="Revenue generated per dollar spent on marketing"
              />
              
              <MetricCard
                title="ROAS"
                value={data.overview.roas}
                subtitle="Return on Ad Spend"
                status="excellent"
                trend={{
                  direction: 'up',
                  magnitude: 5.2,
                  period_days: 30,
                  statistical_significance: 0.89,
                  volatility: 'medium'
                }}
                tooltip="Revenue returned for every dollar spent on advertising"
              />
              
              <MetricCard
                title="Blended CAC"
                value={data.overview.blended_cac}
                format="currency"
                status="acceptable"
                trend={{
                  direction: 'down',
                  magnitude: 3.1,
                  period_days: 30,
                  statistical_significance: 0.76,
                  volatility: 'low'
                }}
                tooltip="Average cost to acquire a customer across all channels"
              />
              
              <MetricCard
                title="LTV:CAC"
                value={data.overview.ltv_cac_ratio}
                subtitle="Ratio"
                status="excellent"
                trend={{
                  direction: 'up',
                  magnitude: 12.3,
                  period_days: 30,
                  statistical_significance: 0.94,
                  volatility: 'low'
                }}
                tooltip="Lifetime value to customer acquisition cost ratio"
              />
            </div>

            {/* Overview Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TrendAnalysisChart data={data.timeSeriesData} />
              <SpendAllocationChart data={data.channelPerformance} />
            </div>
          </TabsContent>

          {/* Channel Analysis Tab */}
          <TabsContent value="channels" className="flex-1 overflow-y-auto effectiveness-scrollbar p-6">
            <div className="space-y-6">
              <ChannelPerformanceChart data={data.channelPerformance} />
              
              {/* Channel Details Table */}
              <Card className="bg-black border border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Channel Performance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-600/30">
                          <th className="text-left p-2 text-gray-300">Channel</th>
                          <th className="text-right p-2 text-gray-300">Spend</th>
                          <th className="text-right p-2 text-gray-300">Revenue</th>
                          <th className="text-right p-2 text-gray-300">Customers</th>
                          <th className="text-right p-2 text-gray-300">CAC</th>
                          <th className="text-right p-2 text-gray-300">ROAS</th>
                          <th className="text-right p-2 text-gray-300">Efficiency</th>
                          <th className="text-center p-2 text-gray-300">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...data.channelPerformance]
                          .sort((a, b) => b.efficiency_score - a.efficiency_score)
                          .map((channel, index) => (
                            <tr key={index} className="border-b border-gray-700/30 hover:bg-black/20">
                              <td className="p-2 font-medium text-white">{channel.channel}</td>
                              <td className="p-2 text-right text-gray-300">{formatCurrency(channel.spend)}</td>
                              <td className="p-2 text-right text-gray-300">{formatCurrency(channel.revenue)}</td>
                              <td className="p-2 text-right text-gray-300">{channel.customers}</td>
                              <td className="p-2 text-right text-gray-300">{formatCurrency(channel.cac)}</td>
                              <td className="p-2 text-right text-gray-300">{channel.roas.toFixed(1)}x</td>
                              <td className="p-2 text-right">
                                <Badge 
                                  variant="outline"
                                  className={
                                    channel.efficiency_score >= 8 ? 'text-green-300 bg-green-900/20 border-green-500/30' :
                                    channel.efficiency_score >= 6 ? 'text-yellow-300 bg-yellow-900/20 border-yellow-500/30' :
                                    'text-red-300 bg-red-900/20 border-red-500/30'
                                  }
                                >
                                  {channel.efficiency_score.toFixed(1)}/10
                                </Badge>
                              </td>
                              <td className="p-2 text-center">
                                {channel.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-400 mx-auto" />}
                                {channel.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-400 mx-auto" />}
                                {channel.trend === 'flat' && <div className="h-1 w-4 bg-yellow-400 mx-auto" />}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Funnel Analysis Tab */}
          <TabsContent value="funnel" className="flex-1 overflow-y-auto effectiveness-scrollbar p-6">
            <FunnelChart 
              data={data.funnelData || mockEffectivenessData.funnelData}
              title="Conversion Funnel Analysis"
              showDropOffAnalysis={true}
              showOptimizations={true}
            />
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="flex-1 overflow-y-auto effectiveness-scrollbar p-6">
            <OptimizationOpportunities opportunities={data.optimizationOpportunities} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
