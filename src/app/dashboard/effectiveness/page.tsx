'use client';

import React, { useState } from 'react';
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
  CheckCircle
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
    <Card className="bg-black/40 border border-gray-500/30">
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
    <Card className="bg-black/40 border border-gray-500/30">
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
    <Card className="bg-black/40 border border-gray-500/30">
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
    <Card className="bg-black/40 border border-gray-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Zap className="h-5 w-5 text-yellow-400" />
          Optimization Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunities
          .sort((a, b) => b.estimated_roi - a.estimated_roi)
          .map((opportunity, index) => (
            <div key={index} className="border border-gray-600/30 bg-black/20 rounded-lg p-4 hover:border-gray-500/50 transition-colors">
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
              
              <div className="mt-3 pt-3 border-t border-gray-600/30 flex justify-end">
                <Button size="sm" variant="outline" className="bg-black/40 border-yellow-500/20 text-yellow-200 hover:bg-yellow-900/20">
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

  const data = mockEffectivenessData;

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm text-blue-400 font-medium">Marketing Effectiveness</span>
            </div>
            <p className="text-gray-400 text-sm">
              Analyze channel performance, ROI, and optimization opportunities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-black/40 border-gray-500/30 text-gray-300">
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
            <Button variant="outline" size="sm" className="bg-black/40 border-blue-500/20 text-blue-200 hover:bg-blue-900/20">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          Performance Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
      </div>

      {/* Detailed Analytics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          Detailed Analytics
        </h2>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-gray-500/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="channels" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Channels</TabsTrigger>
            <TabsTrigger value="funnel" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Funnel Analysis</TabsTrigger>
            <TabsTrigger value="optimization" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Optimization</TabsTrigger>
          </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TrendAnalysisChart data={data.timeSeriesData} />
            <SpendAllocationChart data={data.channelPerformance} />
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <ChannelPerformanceChart data={data.channelPerformance} />
          
          {/* Channel Details Table */}
          <Card className="bg-black/40 border border-gray-500/30">
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
                    {data.channelPerformance
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
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <FunnelChart 
            data={data.funnelData}
            title="Conversion Funnel Analysis"
            showDropOffAnalysis={true}
            showOptimizations={true}
          />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <OptimizationOpportunities opportunities={data.optimizationOpportunities} />
        </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Spacing */}
      <div className="pb-8"></div>
    </div>
  );
}