'use client';

import React, { useState } from 'react';
import { useCurrentProject } from '@/contexts/ProjectContext';
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
  Minus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Info
} from 'lucide-react';

export default function BenchmarksPage() {
  const [selectedStage, setSelectedStage] = useState('seed');
  const [currentPage, setCurrentPage] = useState(1);
  const { currentProject } = useCurrentProject();
  const [selectedMetric, setSelectedMetric] = useState(null);
  const itemsPerPage = 5;

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

  // Streamlined table component with pagination
  function BenchmarkContent({ data }: { data: typeof benchmarkData.seed }) {
    const totalPages = Math.ceil(data.metrics.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMetrics = data.metrics.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="flex flex-col h-full">
        {/* Compact info bar */}
        <div className="flex items-center justify-between p-3 bg-cyan-950/20 border border-cyan-500/30 rounded mb-4">
          <span className="text-white font-medium">{data.title}</span>
          <span className="text-cyan-400 text-sm">{data.range} • {data.metrics.length} metrics</span>
        </div>

        {/* Dense benchmark table with fixed height */}
        <div className="flex-1 bg-black border border-gray-800 rounded-lg overflow-hidden flex flex-col">
          <table className="w-full">
            <thead className="bg-gray-900/50 border-b border-gray-800">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Metric</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Range</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Industry</th>
                <th className="text-center px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                <th className="w-10 px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {paginatedMetrics.map((item, index) => {
                const Icon = item.icon;
                return (
                  <tr key={startIndex + index} className="hover:bg-gray-900/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-300 text-sm">{item.category.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white text-sm font-medium">{item.metric}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-white text-sm font-mono">{item.value}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-cyan-400 text-sm font-mono">{item.industry}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        {getStatusIcon(item.status)}
                        <span className={`text-xs font-medium ${getStatusColor(item.status).split(' ')[1]}`}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        onClick={() => setSelectedMetric(item)}
                      >
                        <Info className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3 border-t border-gray-800 bg-gray-900/20">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, data.metrics.length)} of {data.metrics.length}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-300 px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Metric Detail Popup */}
        {selectedMetric && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedMetric.metric}</h3>
                  <p className="text-sm text-gray-400">{selectedMetric.category}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMetric(null)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Benchmark Range</span>
                  <div className="text-white font-mono">{selectedMetric.value}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Industry Average</span>
                  <div className="text-cyan-400 font-mono">{selectedMetric.industry}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Performance Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedMetric.status)}
                    <span className={`text-sm font-medium ${getStatusColor(selectedMetric.status).split(' ')[1]}`}>
                      {selectedMetric.status}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <span className="text-xs text-gray-400">
                    Based on data from 2,400+ startups in the {data.range} range
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Compact Header */}
      <div className="shrink-0 bg-black border-b border-cyan-500/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <div>
              <h1 className="text-lg font-semibold text-white">YC Benchmarks</h1>
              <p className="text-xs text-gray-400">Industry traction metrics • 2,400+ startups</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-black border-cyan-500/30 text-cyan-200 hover:bg-cyan-900/20 h-8 px-3">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="bg-black border-cyan-500/30 text-cyan-200 hover:bg-cyan-900/20 h-8 px-3">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Streamlined Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Compact Stage Selector */}
          <div className="flex gap-2 mb-4">
            {Object.entries(benchmarkData).map(([key, data]) => (
              <Button
                key={key}
                variant={selectedStage === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStage(key)}
                className={`h-8 px-3 text-xs ${
                  selectedStage === key 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-black border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/20'
                }`}
              >
                {data.title.split(' ')[0]} {data.range}
              </Button>
            ))}
          </div>

          <BenchmarkContent data={currentData} />
        </div>
      </div>
    </div>
  );
}