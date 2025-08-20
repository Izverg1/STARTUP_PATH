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

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-sm text-cyan-400 font-medium">YC-Style Benchmarks</span>
            </div>
            <p className="text-gray-400 text-sm">
              Compare your traction metrics against verified data from pre-seed to Series A
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-black/40 border-red-500/20 text-red-200 hover:bg-red-900/20">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="bg-black/40 border-red-500/20 text-red-200 hover:bg-red-900/20">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stage Selector */}
        <div className="flex gap-2">
          {Object.entries(benchmarkData).map(([key, data]) => (
            <Button
              key={key}
              variant={selectedStage === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStage(key)}
              className={selectedStage === key 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-black/40 border-gray-500/30 text-gray-300 hover:bg-gray-700/50"
              }
            >
              {data.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Stage Info */}
      <div className="mb-6">
        <Card className="bg-black/40 border border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{currentData.title}</h3>
                <p className="text-sm text-gray-400">{currentData.range}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300">Based on</div>
                <div className="text-lg font-bold text-white">2,400+ startups</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benchmarks Grid */}
      <div className="space-y-6">
        {/* Group by category */}
        {['Email Marketing', 'Cold Outbound', 'Content Marketing', 'Paid Acquisition', 'Organic Growth', 'Product-Led'].map(category => {
          const categoryMetrics = currentData.metrics.filter(m => m.category === category);
          
          return (
            <div key={category}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                {category}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryMetrics.map((item, index) => {
                  const Icon = item.icon;
                  
                  return (
                    <Card key={index} className={`bg-black/40 border ${getStatusColor(item.status)} hover:border-opacity-50 transition-colors`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-gray-800 rounded-lg">
                              <Icon className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-white text-sm">{item.metric}</h4>
                              <p className="text-xs text-gray-400">{item.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            <Badge variant="outline" className={`text-xs ${getStatusColor(item.status)}`}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Range:</span>
                            <span className="text-white font-medium">{item.value}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Industry Avg:</span>
                            <span className="text-blue-400">{item.industry}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Spacing */}
      <div className="pb-8"></div>
    </div>
  );
}