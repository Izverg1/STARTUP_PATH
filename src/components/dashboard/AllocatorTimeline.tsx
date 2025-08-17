'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Brush
} from 'recharts';
import { CalendarDays, TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetAllocation {
  date: string;
  total_budget: number;
  allocations: ChannelAllocation[];
  forecast?: boolean;
  events?: AllocationEvent[];
}

interface ChannelAllocation {
  channel_id: string;
  channel_name: string;
  channel_type: 'paid_search' | 'paid_social' | 'display' | 'email' | 'content' | 'events' | 'partnerships';
  amount: number;
  percentage: number;
  efficiency_score?: number;
  roi_prediction?: number;
}

interface AllocationEvent {
  type: 'budget_increase' | 'channel_launch' | 'experiment_start' | 'campaign_launch' | 'optimization';
  description: string;
  impact_magnitude?: number;
}

interface AllocatorTimelineProps {
  data: BudgetAllocation[];
  title?: string;
  className?: string;
  showForecast?: boolean;
  showChannelBreakdown?: boolean;
  showEfficiencyScores?: boolean;
}

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

const getChannelColor = (channelType: ChannelAllocation['channel_type']): string => {
  const colors = {
    paid_search: '#3b82f6', // blue
    paid_social: '#f59e0b', // amber
    display: '#10b981', // emerald
    email: '#8b5cf6', // violet
    content: '#f97316', // orange
    events: '#ef4444', // red
    partnerships: '#06b6d4', // cyan
  };
  return colors[channelType] || '#6b7280';
};

const getChannelIcon = (channelType: ChannelAllocation['channel_type']) => {
  switch (channelType) {
    case 'paid_search':
    case 'paid_social':
    case 'display':
      return <DollarSign className="h-4 w-4" />;
    case 'email':
    case 'content':
      return <Users className="h-4 w-4" />;
    case 'events':
    case 'partnerships':
      return <Target className="h-4 w-4" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

function ChannelBreakdownChart({ data }: { data: BudgetAllocation[] }) {
  // Transform data for stacked area chart
  const chartData = data.map(item => {
    const result: any = {
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total: item.total_budget,
      forecast: item.forecast || false,
    };
    
    item.allocations.forEach(allocation => {
      result[allocation.channel_name] = allocation.amount;
    });
    
    return result;
  });
  
  // Get all unique channel names
  const channels = Array.from(
    new Set(data.flatMap(item => item.allocations.map(a => a.channel_name)))
  );
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            formatter={(value: number, name: string) => [formatCurrency(value), name]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          
          {channels.map((channel, index) => {
            const allocation = data.flatMap(d => d.allocations).find(a => a.channel_name === channel);
            const color = allocation ? getChannelColor(allocation.channel_type) : '#6b7280';
            
            return (
              <Area
                key={channel}
                type="monotone"
                dataKey={channel}
                stackId="1"
                stroke={color}
                fill={color}
                fillOpacity={0.6}
              />
            );
          })}
          
          <Brush 
            dataKey="date" 
            height={30} 
            stroke="#8884d8"
            fontSize={10}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function BudgetTrendChart({ data }: { data: BudgetAllocation[] }) {
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    budget: item.total_budget,
    forecast: item.forecast || false,
    events: item.events || [],
  }));
  
  const actualData = chartData.filter(d => !d.forecast);
  const forecastData = chartData.filter(d => d.forecast);
  const forecastStartIndex = actualData.length - 1;
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            formatter={(value: number, name: string) => [formatCurrency(value), name]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          
          {/* Actual budget line */}
          <Line
            type="monotone"
            dataKey="budget"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            name="Actual Budget"
            connectNulls={false}
          />
          
          {/* Reference line for forecast start */}
          {forecastData.length > 0 && (
            <ReferenceLine 
              x={chartData[forecastStartIndex]?.date} 
              stroke="#6b7280" 
              strokeDasharray="2 2"
              label={{ value: "Forecast", position: "top" }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function AllocationSummary({ allocation }: { allocation: BudgetAllocation }) {
  const sortedAllocations = allocation.allocations.sort((a, b) => b.amount - a.amount);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          {new Date(allocation.date).toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </h4>
        <div className="text-right">
          <div className="text-lg font-semibold">{formatCurrency(allocation.total_budget)}</div>
          {allocation.forecast && (
            <Badge variant="outline" className="text-xs">
              Forecast
            </Badge>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        {sortedAllocations.map((channel, index) => (
          <div key={channel.channel_id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getChannelColor(channel.channel_type) }}
              />
              <div className="flex items-center gap-2">
                {getChannelIcon(channel.channel_type)}
                <span className="text-sm font-medium">{channel.channel_name}</span>
              </div>
            </div>
            
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{formatCurrency(channel.amount)}</span>
                <Badge variant="outline" className="text-xs">
                  {formatPercentage(channel.percentage)}
                </Badge>
              </div>
              
              {channel.efficiency_score && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>Efficiency: {channel.efficiency_score.toFixed(1)}/10</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {allocation.events && allocation.events.length > 0 && (
        <div className="border-t pt-3">
          <h5 className="text-sm font-medium mb-2">Events</h5>
          <div className="space-y-1">
            {allocation.events.map((event, index) => (
              <div key={index} className="text-xs bg-blue-50 rounded p-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{event.type.replace('_', ' ')}</span>
                  {event.impact_magnitude && (
                    <Badge variant="outline" className="text-xs">
                      {event.impact_magnitude > 0 ? '+' : ''}{event.impact_magnitude}%
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AllocatorTimeline({
  data,
  title = 'Budget Allocation Timeline',
  className,
  showForecast = true,
  showChannelBreakdown = true,
  showEfficiencyScores = true,
}: AllocatorTimelineProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<'trend' | 'breakdown'>('trend');
  
  const selectedAllocation = selectedDate 
    ? data.find(d => d.date === selectedDate)
    : data[data.length - 1];
    
  const forecastData = data.filter(d => d.forecast);
  const actualData = data.filter(d => !d.forecast);
  
  return (
    <TooltipProvider>
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={view === 'trend' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('trend')}
              >
                Trend
              </Button>
              <Button
                variant={view === 'breakdown' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('breakdown')}
              >
                Breakdown
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>{actualData.length} actual periods</span>
            </div>
            {forecastData.length > 0 && showForecast && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                <span>{forecastData.length} forecast periods</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Chart */}
          <div className="space-y-4">
            {view === 'trend' ? (
              <BudgetTrendChart data={data} />
            ) : (
              showChannelBreakdown && <ChannelBreakdownChart data={data} />
            )}
          </div>
          
          {/* Date Selector */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Period Details</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {data.slice(-8).map((allocation) => (
                <Button
                  key={allocation.date}
                  variant={selectedDate === allocation.date ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDate(allocation.date)}
                  className={cn(
                    'text-xs',
                    allocation.forecast && 'border-dashed'
                  )}
                >
                  {new Date(allocation.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  {allocation.forecast && (
                    <span className="ml-1 text-gray-500">*</span>
                  )}
                </Button>
              ))}
            </div>
            
            {/* Selected Period Summary */}
            {selectedAllocation && (
              <div className="bg-gray-50 rounded-lg p-4">
                <AllocationSummary allocation={selectedAllocation} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}