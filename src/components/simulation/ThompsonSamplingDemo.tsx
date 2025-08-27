'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FlaskConical,
  Zap,
  Target,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Play,
  Pause,
  BarChart3,
  PieChart,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { useThompsonSampling } from '@/hooks/useThompsonSampling';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#f97316', '#8b5cf6', '#ef4444'];

interface DemoProps {
  className?: string;
}

export function ThompsonSamplingDemo({ className = '' }: DemoProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('startup-mvp-launch');
  const [seed, setSeed] = useState(12345);
  const [running, setRunning] = useState(false);
  const [autoRun, setAutoRun] = useState(false);
  const [customBudget, setCustomBudget] = useState([10000]);
  
  const {
    runDeterministicSimulation,
    simulationResult,
    getAvailableScenarios,
    getWhatIfParameters,
    loading,
    error
  } = useThompsonSampling();

  const scenarios = getAvailableScenarios();

  // Auto-run simulation when scenario or seed changes
  useEffect(() => {
    if (autoRun && selectedScenario && !running) {
      runSimulation();
    }
  }, [selectedScenario, seed, autoRun]);

  const runSimulation = async () => {
    if (running) return;
    
    setRunning(true);
    try {
      await runDeterministicSimulation(selectedScenario, seed);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setRunning(false);
    }
  };

  const runWithSeedVariation = async () => {
    const newSeed = seed + Math.floor(Math.random() * 1000);
    setSeed(newSeed);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getScenarioIcon = (category: string) => {
    switch (category) {
      case 'startup': return <FlaskConical className="h-4 w-4" />;
      case 'growth': return <TrendingUp className="h-4 w-4" />;
      case 'scale': return <BarChart3 className="h-4 w-4" />;
      case 'optimization': return <Target className="h-4 w-4" />;
      case 'crisis': return <Zap className="h-4 w-4" />;
      default: return <FlaskConical className="h-4 w-4" />;
    }
  };

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario);

  // Prepare allocation chart data
  const allocationChartData = simulationResult?.allocations.map((allocation, index) => ({
    channel: allocation.channelId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    budget: allocation.allocatedBudget,
    expectedRate: (allocation.expectedConversionRate * 100).toFixed(2),
    confidence: (allocation.confidenceInterval.confidence * 100).toFixed(1),
    color: COLORS[index % COLORS.length]
  })) || [];

  // Prepare time series data from day-by-day results
  const timeSeriesData = simulationResult?.dayByDayResults.map(day => ({
    day: day.day,
    totalConversions: day.channelResults.reduce((sum, ch) => sum + ch.conversions, 0),
    totalCost: day.channelResults.reduce((sum, ch) => sum + ch.cost, 0),
    ...day.channelResults.reduce((acc, ch) => {
      const channelName = ch.channelId.replace(/-/g, '_');
      acc[`${channelName}_conversions`] = ch.conversions;
      acc[`${channelName}_cost`] = ch.cost;
      return acc;
    }, {} as Record<string, number>)
  })) || [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Demo Header */}
      <Card className="bg-black border border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-yellow-400" />
            Thompson Sampling Allocator Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">
              Experience deterministic budget allocation scenarios with repeatable results
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-300 bg-green-900/20 border-green-500/30">
                Deterministic
              </Badge>
              <Badge variant="outline" className="text-blue-300 bg-blue-900/20 border-blue-500/30">
                Seed: {seed}
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scenario
              </label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger className="bg-zinc-900 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {scenarios.map(scenario => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      <div className="flex items-center gap-2">
                        {getScenarioIcon(scenario.category)}
                        {scenario.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Random Seed
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value) || 12345)}
                  className="flex-1 px-3 py-2 bg-zinc-900 border border-gray-600 rounded text-white text-sm"
                  placeholder="12345"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={runWithSeedVariation}
                  className="bg-zinc-900 border-gray-600 hover:bg-zinc-800"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Auto Run
              </label>
              <Button
                size="sm"
                variant={autoRun ? "default" : "outline"}
                onClick={() => setAutoRun(!autoRun)}
                className={autoRun ? "bg-green-600 hover:bg-green-700" : "bg-zinc-900 border-gray-600 hover:bg-zinc-800"}
              >
                {autoRun ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                {autoRun ? 'Auto' : 'Manual'}
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Run Simulation
              </label>
              <Button
                onClick={runSimulation}
                disabled={running || loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {running || loading ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Play className="h-3 w-3 mr-1" />
                )}
                {running || loading ? 'Running...' : 'Run'}
              </Button>
            </div>
          </div>

          {/* Scenario Info */}
          {selectedScenarioData && (
            <div className="bg-zinc-900 rounded-lg p-4 border border-gray-700 mb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getScenarioIcon(selectedScenarioData.category)}
                  <h3 className="font-medium text-white">{selectedScenarioData.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {selectedScenarioData.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {selectedScenarioData.difficulty}
                  </Badge>
                </div>
                <div className="text-sm text-gray-400">
                  ~{selectedScenarioData.estimatedDuration} min
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-3">{selectedScenarioData.description}</p>
              <div>
                <div className="text-xs font-medium text-gray-400 mb-1">Learning Objectives:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedScenarioData.learningObjectives.map((objective, index) => (
                    <div key={index} className="text-xs bg-blue-900/20 text-blue-300 px-2 py-1 rounded">
                      {objective}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4">
              <div className="text-red-400 text-sm">Error: {error}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {simulationResult && (
        <Tabs defaultValue="allocation" className="space-y-6">
          <TabsList className="bg-zinc-800 border border-zinc-700">
            <TabsTrigger value="allocation" className="data-[state=active]:bg-red-600/20 data-[state=active]:text-red-300">
              Budget Allocation
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-red-600/20 data-[state=active]:text-red-300">
              Performance Timeline
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-red-600/20 data-[state=active]:text-red-300">
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Budget Allocation Tab */}
          <TabsContent value="allocation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Allocation Bar Chart */}
              <Card className="bg-black border border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Budget Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={allocationChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="channel" 
                          className="text-xs"
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            name === 'budget' ? formatCurrency(value) : value,
                            name === 'budget' ? 'Budget' : name
                          ]}
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #4b5563',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: 'white'
                          }}
                        />
                        <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Allocation Pie Chart */}
              <Card className="bg-black border border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <PieChart className="h-5 w-5 text-purple-400" />
                    Budget Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <RechartsPieChart
                          data={allocationChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ channel, budget }) => `${channel}: ${formatCurrency(budget)}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="budget"
                        >
                          {allocationChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Allocation Details Table */}
            <Card className="bg-black border border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white">Allocation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600/30">
                        <th className="text-left p-3 text-gray-300">Channel</th>
                        <th className="text-right p-3 text-gray-300">Budget</th>
                        <th className="text-right p-3 text-gray-300">Expected Conv. Rate</th>
                        <th className="text-right p-3 text-gray-300">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocationChartData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-700/30 hover:bg-gray-900/20">
                          <td className="p-3 font-medium text-white">{row.channel}</td>
                          <td className="p-3 text-right text-gray-300">{formatCurrency(row.budget)}</td>
                          <td className="p-3 text-right text-gray-300">{row.expectedRate}%</td>
                          <td className="p-3 text-right">
                            <Badge variant="outline" className="text-blue-300 bg-blue-900/20 border-blue-500/30">
                              {row.confidence}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Timeline Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-black border border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Performance Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="day" 
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #4b5563',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: 'white'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="totalConversions" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Total Conversions"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalCost" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        name="Total Cost"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-black border border-red-500/30">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-400">
                    {simulationResult.projectedOutcome.totalConversions}
                  </div>
                  <div className="text-sm text-gray-400">Total Conversions</div>
                </CardContent>
              </Card>
              
              <Card className="bg-black border border-red-500/30">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-400">
                    {formatCurrency(simulationResult.projectedOutcome.totalCost)}
                  </div>
                  <div className="text-sm text-gray-400">Total Cost</div>
                </CardContent>
              </Card>
              
              <Card className="bg-black border border-red-500/30">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-400">
                    {simulationResult.projectedOutcome.roi.toFixed(1)}x
                  </div>
                  <div className="text-sm text-gray-400">ROI</div>
                </CardContent>
              </Card>
              
              <Card className="bg-black border border-red-500/30">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-400">
                    {simulationResult.projectedOutcome.riskScore.toFixed(1)}/10
                  </div>
                  <div className="text-sm text-gray-400">Risk Score</div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Insights */}
            <Card className="bg-black border border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white">Algorithm Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-300 mb-2">Top Performing Channel</div>
                    <div className="text-lg font-bold text-green-400">
                      {allocationChartData[0]?.channel}
                    </div>
                    <div className="text-sm text-gray-400">
                      ${allocationChartData[0]?.budget.toLocaleString()} allocated
                    </div>
                  </div>
                  
                  <div className="bg-zinc-900 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-300 mb-2">Average Confidence</div>
                    <div className="text-lg font-bold text-blue-400">
                      {allocationChartData.reduce((sum, item) => sum + parseFloat(item.confidence), 0) / allocationChartData.length || 0}%
                    </div>
                    <div className="text-sm text-gray-400">
                      Statistical confidence level
                    </div>
                  </div>
                </div>
                
                <div className="bg-zinc-900 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-300 mb-2">Deterministic Results</div>
                  <div className="text-sm text-gray-400">
                    This simulation uses seed {seed} to generate consistent, repeatable results. 
                    The same scenario with the same seed will always produce identical allocations and outcomes,
                    making it perfect for testing, demonstrations, and algorithm validation.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}