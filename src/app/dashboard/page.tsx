'use client';

import React from 'react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { FunnelChart } from '@/components/dashboard/FunnelChart';
import { FinanceMetrics } from '@/components/dashboard/FinanceMetrics';
import { AllocatorTimeline } from '@/components/dashboard/AllocatorTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Calendar,
  BarChart3,
  PieChart,
  Settings
} from 'lucide-react';
import Link from 'next/link';

// Mock data - in a real app, this would come from your API/database
const mockDashboardData = {
  overview: {
    totalRevenue: 1250000,
    totalRevenueChange: 12.5,
    newCustomers: 89,
    newCustomersChange: -5.2,
    conversionRate: 0.034,
    conversionRateChange: 8.1,
    avgDealSize: 14500,
    avgDealSizeChange: 15.3,
  },
  financialMetrics: {
    cpqm: {
      current_value: 485,
      target_value: 400,
      benchmark_range: {
        industry_median: 550,
        top_quartile: 350,
        bottom_quartile: 750,
        source: 'Industry Report 2024',
        last_updated: '2024-01-15'
      },
      trend: {
        direction: 'down' as const,
        magnitude: -8.5,
        period_days: 30,
        statistical_significance: 0.95,
        volatility: 'low' as const
      },
      breakdown: {
        by_channel: [],
        by_source: [],
        by_period: []
      },
      historical_data: []
    },
    cac: {
      current_value: 1850,
      target_value: 1500,
      benchmark_range: {
        industry_median: 2000,
        top_quartile: 1400,
        bottom_quartile: 2800,
        source: 'Industry Report 2024',
        last_updated: '2024-01-15'
      },
      trend: {
        direction: 'up' as const,
        magnitude: 5.2,
        period_days: 30,
        statistical_significance: 0.88,
        volatility: 'medium' as const
      },
      breakdown: {
        blended_cac: 1850,
        by_channel: [],
        by_cohort: [],
        cost_components: []
      },
      payback_analysis: {
        payback_months: 8.5
      }
    },
    payback: {
      current_months: 8.5,
      target_months: 6.0,
      acceptable_range: {
        preferred_max: 6.0,
        acceptable_max: 9.0,
        current_value: 8.5,
        status: 'acceptable' as const
      },
      trend: {
        direction: 'flat' as const,
        magnitude: 0.8,
        period_days: 30,
        statistical_significance: 0.65,
        volatility: 'low' as const
      },
      breakdown: {
        by_channel: [],
        by_acv_band: [],
        by_customer_segment: []
      },
      risk_factors: [
        {
          factor: 'Rising acquisition costs',
          impact: 'medium' as const,
          description: 'Increased competition driving up ad costs',
          mitigation: 'Optimize targeting and creative rotation'
        },
        {
          factor: 'Longer sales cycles',
          impact: 'low' as const,
          description: 'Enterprise deals taking longer to close',
          mitigation: 'Implement sales acceleration tools'
        }
      ]
    }
  },
  conversionFunnel: {
    stages: [
      {
        name: 'impression' as const,
        order: 1,
        count: 250000,
        conversion_rate: 1.0,
        cost_per_conversion: 0.08,
        status: 'performing' as const
      },
      {
        name: 'click' as const,
        order: 2,
        count: 12500,
        conversion_rate: 0.05,
        cost_per_conversion: 1.60,
        benchmark_conversion_rate: 0.06,
        status: 'underperforming' as const
      },
      {
        name: 'landing_page_view' as const,
        order: 3,
        count: 11800,
        conversion_rate: 0.944,
        cost_per_conversion: 1.69,
        status: 'performing' as const
      },
      {
        name: 'lead' as const,
        order: 4,
        count: 3540,
        conversion_rate: 0.30,
        cost_per_conversion: 5.65,
        benchmark_conversion_rate: 0.35,
        status: 'underperforming' as const
      },
      {
        name: 'qualified_lead' as const,
        order: 5,
        count: 1770,
        conversion_rate: 0.50,
        cost_per_conversion: 11.30,
        status: 'performing' as const
      },
      {
        name: 'meeting_scheduled' as const,
        order: 6,
        count: 885,
        conversion_rate: 0.50,
        cost_per_conversion: 22.60,
        status: 'performing' as const
      },
      {
        name: 'opportunity' as const,
        order: 7,
        count: 265,
        conversion_rate: 0.30,
        cost_per_conversion: 75.47,
        benchmark_conversion_rate: 0.35,
        status: 'critical' as const
      },
      {
        name: 'closed_won' as const,
        order: 8,
        count: 89,
        conversion_rate: 0.336,
        cost_per_conversion: 224.72,
        status: 'performing' as const
      }
    ],
    overall_conversion_rate: 0.000356,
    drop_off_analysis: {
      highest_drop_stage: 'opportunity' as const,
      drop_rate: 0.70,
      impact_on_pipeline: 125000,
      root_causes: [
        {
          cause: 'Unclear value proposition in sales calls',
          confidence: 0.85,
          impact_score: 8.5,
          actionable: true
        },
        {
          cause: 'Long decision-making process',
          confidence: 0.72,
          impact_score: 6.2,
          actionable: false
        },
        {
          cause: 'Pricing concerns',
          confidence: 0.68,
          impact_score: 7.1,
          actionable: true
        }
      ]
    },
    optimization_recommendations: [
      {
        stage: 'opportunity' as const,
        opportunity: 'Improve sales deck and ROI calculator',
        potential_improvement: 0.15,
        effort_required: 'medium' as const,
        expected_roi: 3.2
      },
      {
        stage: 'lead' as const,
        opportunity: 'Implement lead scoring to focus on high-quality leads',
        potential_improvement: 0.10,
        effort_required: 'high' as const,
        expected_roi: 2.8
      }
    ]
  },
  budgetAllocation: [
    {
      date: '2024-01-01',
      total_budget: 85000,
      allocations: [
        {
          channel_id: '1',
          channel_name: 'Google Ads',
          channel_type: 'paid_search' as const,
          amount: 35000,
          percentage: 0.41,
          efficiency_score: 8.2
        },
        {
          channel_id: '2',
          channel_name: 'LinkedIn Ads',
          channel_type: 'paid_social' as const,
          amount: 25000,
          percentage: 0.29,
          efficiency_score: 7.5
        },
        {
          channel_id: '3',
          channel_name: 'Display Network',
          channel_type: 'display' as const,
          amount: 15000,
          percentage: 0.18,
          efficiency_score: 6.8
        },
        {
          channel_id: '4',
          channel_name: 'Content Marketing',
          channel_type: 'content' as const,
          amount: 10000,
          percentage: 0.12,
          efficiency_score: 7.9
        }
      ],
      events: [
        {
          type: 'campaign_launch' as const,
          description: 'Launched Q1 lead generation campaign',
          impact_magnitude: 15
        }
      ]
    },
    {
      date: '2024-01-15',
      total_budget: 90000,
      allocations: [
        {
          channel_id: '1',
          channel_name: 'Google Ads',
          channel_type: 'paid_search' as const,
          amount: 38000,
          percentage: 0.42,
          efficiency_score: 8.4
        },
        {
          channel_id: '2',
          channel_name: 'LinkedIn Ads',
          channel_type: 'paid_social' as const,
          amount: 27000,
          percentage: 0.30,
          efficiency_score: 7.8
        },
        {
          channel_id: '3',
          channel_name: 'Display Network',
          channel_type: 'display' as const,
          amount: 15000,
          percentage: 0.17,
          efficiency_score: 6.5
        },
        {
          channel_id: '4',
          channel_name: 'Content Marketing',
          channel_type: 'content' as const,
          amount: 10000,
          percentage: 0.11,
          efficiency_score: 8.1
        }
      ]
    },
    {
      date: '2024-02-01',
      total_budget: 95000,
      allocations: [
        {
          channel_id: '1',
          channel_name: 'Google Ads',
          channel_type: 'paid_search' as const,
          amount: 40000,
          percentage: 0.42,
          efficiency_score: 8.6
        },
        {
          channel_id: '2',
          channel_name: 'LinkedIn Ads',
          channel_type: 'paid_social' as const,
          amount: 28000,
          percentage: 0.29,
          efficiency_score: 8.0
        },
        {
          channel_id: '3',
          channel_name: 'Display Network',
          channel_type: 'display' as const,
          amount: 17000,
          percentage: 0.18,
          efficiency_score: 6.8
        },
        {
          channel_id: '4',
          channel_name: 'Content Marketing',
          channel_type: 'content' as const,
          amount: 10000,
          percentage: 0.11,
          efficiency_score: 8.3
        }
      ]
    },
    {
      date: '2024-02-15',
      total_budget: 100000,
      forecast: true,
      allocations: [
        {
          channel_id: '1',
          channel_name: 'Google Ads',
          channel_type: 'paid_search' as const,
          amount: 42000,
          percentage: 0.42,
          efficiency_score: 8.8
        },
        {
          channel_id: '2',
          channel_name: 'LinkedIn Ads',
          channel_type: 'paid_social' as const,
          amount: 30000,
          percentage: 0.30,
          efficiency_score: 8.2
        },
        {
          channel_id: '3',
          channel_name: 'Display Network',
          channel_type: 'display' as const,
          amount: 18000,
          percentage: 0.18,
          efficiency_score: 7.0
        },
        {
          channel_id: '4',
          channel_name: 'Content Marketing',
          channel_type: 'content' as const,
          amount: 10000,
          percentage: 0.10,
          efficiency_score: 8.5
        }
      ]
    }
  ]
};

export default function DashboardPage() {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 py-6">
        <div className="min-w-[1400px] space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Mission Control</h1>
          <p className="text-blue-200/70 mt-2">
            Monitor your Startup_Path orbital metrics and channel performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-6 pb-4">
        <MetricCard
          title="Total Revenue"
          value={mockDashboardData.overview.totalRevenue}
          format="currency"
          trend={{
            direction: mockDashboardData.overview.totalRevenueChange > 0 ? 'up' : 'down',
            magnitude: Math.abs(mockDashboardData.overview.totalRevenueChange),
            period_days: 30,
            statistical_significance: 0.95,
            volatility: 'low'
          }}
          status="good"
          tooltip="Total revenue generated in the selected period"
        />
        
        <MetricCard
          title="New Customers"
          value={mockDashboardData.overview.newCustomers}
          trend={{
            direction: mockDashboardData.overview.newCustomersChange > 0 ? 'up' : 'down',
            magnitude: Math.abs(mockDashboardData.overview.newCustomersChange),
            period_days: 30,
            statistical_significance: 0.88,
            volatility: 'medium'
          }}
          status="concerning"
          tooltip="Number of new customers acquired"
        />
        
        <MetricCard
          title="Conversion Rate"
          value={mockDashboardData.overview.conversionRate}
          format="percentage"
          trend={{
            direction: mockDashboardData.overview.conversionRateChange > 0 ? 'up' : 'down',
            magnitude: Math.abs(mockDashboardData.overview.conversionRateChange),
            period_days: 30,
            statistical_significance: 0.92,
            volatility: 'low'
          }}
          status="excellent"
          tooltip="Percentage of leads that convert to customers"
        />
        
        <MetricCard
          title="Avg Deal Size"
          value={mockDashboardData.overview.avgDealSize}
          format="currency"
          trend={{
            direction: mockDashboardData.overview.avgDealSizeChange > 0 ? 'up' : 'down',
            magnitude: Math.abs(mockDashboardData.overview.avgDealSizeChange),
            period_days: 30,
            statistical_significance: 0.87,
            volatility: 'medium'
          }}
          status="good"
          tooltip="Average revenue per customer"
        />
      </div>

      {/* Financial Metrics */}
      <div className="pb-4">
        <FinanceMetrics
          cpqm={mockDashboardData.financialMetrics.cpqm}
          cac={mockDashboardData.financialMetrics.cac}
          payback={mockDashboardData.financialMetrics.payback}
        />
      </div>

      {/* Charts Row */}
      <div className="flex gap-6 pb-4">
        <div className="min-w-[600px]">
        {/* Conversion Funnel */}
        <FunnelChart 
          data={mockDashboardData.conversionFunnel}
          showDropOffAnalysis={true}
          showOptimizations={true}
        />
        </div>
        
        {/* Quick Actions */}
        <div className="min-w-[500px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Link href="/dashboard/experiments">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Active Experiments
                  <Badge variant="secondary" className="ml-auto">
                    5 running
                  </Badge>
                </Button>
              </Link>
              
              <Link href="/dashboard/effectiveness">
                <Button variant="outline" className="w-full justify-start">
                  <PieChart className="h-4 w-4 mr-2" />
                  Effectiveness Analysis
                  <Badge variant="secondary" className="ml-auto">
                    Updated 2h ago
                  </Badge>
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Channel Performance
                <Badge variant="outline" className="ml-auto text-green-600">
                  +12% this week
                </Badge>
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Budget Optimization
                <Badge variant="outline" className="ml-auto text-orange-600">
                  Action needed
                </Badge>
              </Button>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Recent Alerts</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Conversion rate dropped</p>
                    <p className="text-muted-foreground">Opportunity stage showing 30% decline</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">CPQM improving</p>
                    <p className="text-muted-foreground">8.5% improvement this month</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Budget Allocation Timeline */}
      <AllocatorTimeline 
        data={mockDashboardData.budgetAllocation}
        title="Budget Allocation Timeline"
        showForecast={true}
        showChannelBreakdown={true}
        showEfficiencyScores={true}
      />
        </div>
      </div>
    </div>
  );
}