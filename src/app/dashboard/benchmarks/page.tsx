'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  DollarSign,
  Mail,
  MessageSquare,
  Target,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

export default function BenchmarksPage() {
  const [selectedStage, setSelectedStage] = useState('seed');

  const benchmarkData = {
    seed: {
      title: 'Pre-Seed / Seed Stage',
      range: '$0-$2M ARR',
      metrics: [
        { category: 'Email Marketing', metric: 'Open Rate', value: '22-28%', industry: '24%', status: 'good', icon: Mail },
        { category: 'Email Marketing', metric: 'Click Rate', value: '2.5-4%', industry: '3.1%', status: 'average', icon: Target },
        { category: 'Cold Outbound', metric: 'Reply Rate', value: '1-5%', industry: '2.8%', status: 'good', icon: MessageSquare },
        { category: 'Cold Outbound', metric: 'Meeting Rate', value: '0.5-2%', industry: '1.2%', status: 'average', icon: Users },
        { category: 'Content Marketing', metric: 'Conversion Rate', value: '1-3%', industry: '2.1%', status: 'good', icon: TrendingUp },
        { category: 'Paid Acquisition', metric: 'CAC', value: '$800-$2,000', industry: '$1,200', status: 'good', icon: DollarSign },
        { category: 'Organic Growth', metric: 'Monthly Growth', value: '10-25%', industry: '15%', status: 'excellent', icon: BarChart3 },
        { category: 'Product-Led', metric: 'Trial to Paid', value: '15-25%', industry: '18%', status: 'good', icon: Target }
      ]
    },
    series_a: {
      title: 'Series A Stage',
      range: '$2M-$10M ARR',
      metrics: [
        { category: 'Email Marketing', metric: 'Open Rate', value: '20-25%', industry: '22%', status: 'good', icon: Mail },
        { category: 'Email Marketing', metric: 'Click Rate', value: '3-5%', industry: '4.2%', status: 'average', icon: Target },
        { category: 'Cold Outbound', metric: 'Reply Rate', value: '2-8%', industry: '4.5%', status: 'good', icon: MessageSquare },
        { category: 'Cold Outbound', metric: 'Meeting Rate', value: '1-3%', industry: '2.1%', status: 'average', icon: Users },
        { category: 'Content Marketing', metric: 'Conversion Rate', value: '2-4%', industry: '3.2%', status: 'good', icon: TrendingUp },
        { category: 'Paid Acquisition', metric: 'CAC', value: '$1,200-$3,500', industry: '$2,100', status: 'average', icon: DollarSign },
        { category: 'Organic Growth', metric: 'Monthly Growth', value: '8-20%', industry: '12%', status: 'good', icon: BarChart3 },
        { category: 'Product-Led', metric: 'Trial to Paid', value: '18-30%', industry: '22%', status: 'good', icon: Target }
      ]
    },
    growth: {
      title: 'Growth Stage',
      range: '$10M+ ARR',
      metrics: [
        { category: 'Email Marketing', metric: 'Open Rate', value: '18-23%', industry: '20%', status: 'average', icon: Mail },
        { category: 'Email Marketing', metric: 'Click Rate', value: '3.5-6%', industry: '4.8%', status: 'good', icon: Target },
        { category: 'Cold Outbound', metric: 'Reply Rate', value: '3-12%', industry: '6.2%', status: 'excellent', icon: MessageSquare },
        { category: 'Cold Outbound', metric: 'Meeting Rate', value: '1.5-4%', industry: '2.8%', status: 'good', icon: Users },
        { category: 'Content Marketing', metric: 'Conversion Rate', value: '3-6%', industry: '4.1%', status: 'good', icon: TrendingUp },
        { category: 'Paid Acquisition', metric: 'CAC', value: '$2,000-$8,000', industry: '$4,200', status: 'average', icon: DollarSign },
        { category: 'Organic Growth', metric: 'Monthly Growth', value: '5-15%', industry: '8%', status: 'good', icon: BarChart3 },
        { category: 'Product-Led', metric: 'Trial to Paid', value: '20-35%', industry: '25%', status: 'good', icon: Target }
      ]
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <ArrowUp className="w-3 h-3 text-green-400" />;
      case 'good': return <ArrowUp className="w-3 h-3 text-blue-400" />;
      case 'average': return <Minus className="w-3 h-3 text-yellow-400" />;
      case 'poor': return <ArrowDown className="w-3 h-3 text-red-400" />;
      default: return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'border-green-500/30 text-green-400';
      case 'good': return 'border-blue-500/30 text-blue-400';
      case 'average': return 'border-yellow-500/30 text-yellow-400';
      case 'poor': return 'border-red-500/30 text-red-400';
      default: return 'border-gray-500/30 text-gray-400';
    }
  };

  const currentData = benchmarkData[selectedStage as keyof typeof benchmarkData];

  // Component to render benchmark content for each stage
  function BenchmarkContent({ data }: { data: typeof benchmarkData.seed }) {
    return (
      <div className="space-y-6">
        {/* Stage Info */}
        <Card className="bg-black border border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{data.title}</h3>
                <p className="text-sm text-gray-400">{data.range}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300">Based on</div>
                <div className="text-lg font-bold text-white">2,400+ startups</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benchmarks Grid by Category */}
        {['Email Marketing', 'Cold Outbound', 'Content Marketing', 'Paid Acquisition', 'Organic Growth', 'Product-Led'].map(category => {
          const categoryMetrics = data.metrics.filter(m => m.category === category);
          
          return (
            <div key={category}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                {category}
              </h3>
              
              <div className="space-y-2">
                {categoryMetrics.map((item, index) => {
                  const Icon = item.icon;
                  
                  return (
                    <div key={index} className={`bg-black/50 border-l-4 ${getStatusColor(item.status).replace('border-', 'border-l-').replace('/30', '')} border-r border-t border-b border-gray-800/50 hover:bg-black/70 transition-all duration-200 rounded-r-lg`}>
                      <div className="px-4 py-3 flex items-center justify-between">
                        {/* Left side - Metric info */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-1.5 bg-zinc-800/50 rounded-md">
                            <Icon className="h-3.5 w-3.5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm truncate">{item.metric}</h4>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                        </div>

                        {/* Center - Values */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center min-w-0">
                            <div className="text-xs text-gray-400">Range</div>
                            <div className="text-white font-medium">{item.value}</div>
                          </div>
                          <div className="text-center min-w-0">
                            <div className="text-xs text-gray-400">Industry</div>
                            <div className="text-cyan-400 font-medium">{item.industry}</div>
                          </div>
                        </div>

                        {/* Right side - Status */}
                        <div className="flex items-center gap-2 ml-4">
                          {getStatusIcon(item.status)}
                          <Badge variant="outline" className={`text-xs px-2 py-1 ${getStatusColor(item.status)} border-current`}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Benchmarks Content with Horizontal Tabs */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <Tabs value={selectedStage} onValueChange={setSelectedStage} className="flex-1 flex flex-col">
          <TabsList className="bg-zinc-800 border-2 border-zinc-500 p-1 m-6 mb-0 shrink-0 shadow-xl">
            <TabsTrigger 
              value="seed" 
              className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
            >
              🌱 Pre-Seed / Seed
            </TabsTrigger>
            <TabsTrigger 
              value="series_a" 
              className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
            >
              🚀 Series A
            </TabsTrigger>
            <TabsTrigger 
              value="growth" 
              className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
            >
              📈 Growth Stage
            </TabsTrigger>
          </TabsList>

          {/* Pre-Seed / Seed Tab */}
          <TabsContent value="seed" className="flex-1 overflow-y-auto p-6">
            {/* Header Controls */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">YC-Style Benchmarks</h2>
                <p className="text-sm text-cyan-400 font-medium">Industry Traction Metrics</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="bg-zinc-900 border-cyan-500/30 text-cyan-200 hover:bg-cyan-900/20">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="bg-zinc-900 border-cyan-500/30 text-cyan-200 hover:bg-cyan-900/20">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <BenchmarkContent data={benchmarkData.seed} />
          </TabsContent>

          {/* Series A Tab */}
          <TabsContent value="series_a" className="flex-1 overflow-y-auto p-6">
            <BenchmarkContent data={benchmarkData.series_a} />
          </TabsContent>

          {/* Growth Stage Tab */}
          <TabsContent value="growth" className="flex-1 overflow-y-auto p-6">
            <BenchmarkContent data={benchmarkData.growth} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}