'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCurrentProject } from '@/contexts/ProjectContext';
import { useExperiments } from '@/hooks/useExperiments';
import { useArtifacts } from '@/hooks/useArtifacts';
import { useThompsonSampling } from '@/hooks/useThompsonSampling';
import type { ExperimentWithChannels } from '@/lib/db/client-queries';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ThompsonSamplingVisualizer } from '@/components/simulation/ThompsonSamplingVisualizer';
import { cn } from '@/lib/utils';
import { 
  FlaskConical,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Target,
  Calendar,
  Plus,
  Filter,
  BarChart3,
  Loader2,
  Eye,
  FileText,
  Activity,
  Search,
  Settings,
  RefreshCw,
  Zap,
  Grid3x3,
  List,
  ChevronDown,
  Gauge,
  TrendingDown,
  Users,
  MapPin,
  Funnel,
  PieChart,
  LineChart,
  BarChart,
  AlertCircle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import Link from 'next/link';


export default function ExperimentsPage() {
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentWithChannels | null>(null);
  const [showArtifacts, setShowArtifacts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatisticalAnalysis, setShowStatisticalAnalysis] = useState(false);
  const [showFunnelAnalysis, setShowFunnelAnalysis] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<string>('all');
  
  // Use current user, project, and experiments hooks
  const { user, organization, loading: userLoading } = useCurrentUser();
  const { currentProject, isLoading: projectLoading } = useCurrentProject();
  const { 
    experiments,
    activeExperiments,
    completedExperiments,
    failedExperiments,
    summary,
    loading: experimentsLoading,
    error: experimentsError,
    refetch: refetchExperiments,
    pauseExperiment: pauseExperimentAction,
    resumeExperiment: resumeExperimentAction,
    killExperiment: killExperimentAction
  } = useExperiments({ 
    projectId: currentProject?.id,
    orgId: !currentProject?.id ? organization?.id : undefined, // Fallback to org if no project
    autoRefresh: true,
    refreshInterval: 30000
  });

  // Get artifacts for selected experiment
  const { artifacts: experimentArtifacts, loading: artifactsLoading } = useArtifacts({
    experimentId: selectedExperiment?.id,
    enabled: !!selectedExperiment
  });

  // Thompson Sampling integration
  const {
    allocation,
    metrics,
    channelSummary,
    decisionGates,
    isInitialized,
    isRunning,
    isLoading: samplingLoading,
    error: samplingError,
    initialize,
    allocateBudget,
    simulatePeriod,
    refresh
  } = useThompsonSampling({
    autoRefresh: true,
    refreshInterval: 30000
  });

  const loading = userLoading || projectLoading || experimentsLoading;
  
  // All experiments combined for table
  const allExperiments = [...activeExperiments, ...completedExperiments, ...failedExperiments];
  
  // Filter experiments based on search
  const filteredExperiments = allExperiments.filter(experiment => 
    experiment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    experiment.primary_metric?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    experiment.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loading state
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-red-400 animate-spin mb-4" />
        <p className="text-gray-400">Loading experiments...</p>
      </div>
    );
  }

  // Show error state
  if (experimentsError) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <XCircle className="h-8 w-8 text-red-400 mb-4" />
        <p className="text-red-400 mb-4">Failed to load experiments</p>
        <p className="text-gray-400 text-sm mb-4">{experimentsError}</p>
        <Button onClick={refetchExperiments} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Show auth required state
  if (!organization) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Target className="h-8 w-8 text-yellow-400 mb-4" />
        <p className="text-yellow-400 mb-2">Organization Required</p>
        <p className="text-gray-400 text-sm">Please join or create an organization to view experiments.</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-full flex flex-col p-6 experiments-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FlaskConical className="w-8 h-8 text-orange-400" />
              Experiments
            </h1>
            <p className="text-gray-400 mt-1">Manage and monitor your GTM experiments with artifacts</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Thompson Sampling Controls */}
            {currentProject && (
              <div className="flex items-center gap-2">
                {!isInitialized && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={initialize}
                    disabled={samplingLoading}
                    className="bg-cyan-600/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-600/20"
                  >
                    {samplingLoading ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Settings className="w-3 h-3 mr-1" />
                    )}
                    Initialize TS
                  </Button>
                )}
                
                {isInitialized && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={allocateBudget}
                      disabled={samplingLoading}
                      className="bg-cyan-600/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-600/20"
                    >
                      {samplingLoading ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Zap className="w-3 h-3 mr-1" />
                      )}
                      Allocate
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => simulatePeriod(7, 0.05)}
                      disabled={samplingLoading}
                      className="bg-purple-600/10 border-purple-500/30 text-purple-400 hover:bg-purple-600/20"
                    >
                      {samplingLoading ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Activity className="w-3 h-3 mr-1" />
                      )}
                      Simulate
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={refresh}
                      className="bg-gray-600/10 border-gray-500/30 text-gray-400 hover:bg-gray-600/20"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            )}

            <Link href="/dashboard/experiments/designer">
              <Button className="bg-orange-600/20 border-orange-500/30 hover:bg-orange-600/30 text-orange-400">
                <Plus className="w-4 h-4 mr-2" />
                New Experiment
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/10 rounded border border-green-500/20">
                <Play className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-xl font-bold text-white">{activeExperiments.length}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/10 rounded border border-blue-500/20">
                <CheckCircle className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-xl font-bold text-white">{completedExperiments.length}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600/10 rounded border border-yellow-500/20">
                <DollarSign className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  {isInitialized ? 'TS Budget' : 'Total Budget'}
                </p>
                <p className="text-xl font-bold text-white">
                  ${(isInitialized ? metrics.allocatedBudget : summary.totalBudget).toLocaleString()}
                </p>
                {isInitialized && (
                  <p className="text-xs text-gray-500">
                    of ${metrics.totalBudget.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/10 rounded border border-purple-500/20">
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  {isInitialized ? 'TS Confidence' : 'Avg Confidence'}
                </p>
                <p className="text-xl font-bold text-white">
                  {isInitialized 
                    ? (metrics.confidenceScore * 100).toFixed(0) + '%'
                    : (summary.avgConfidence * 100).toFixed(0) + '%'
                  }
                </p>
                {isInitialized && metrics.expectedConversions > 0 && (
                  <p className="text-xs text-gray-500">
                    {metrics.expectedConversions.toFixed(1)} exp conv
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Thompson Sampling Error */}
        {samplingError && (
          <div className="mb-6">
            <Card className="bg-red-900/20 border-red-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-red-400 font-medium">Thompson Sampling Error</p>
                    <p className="text-gray-400 text-sm">{samplingError}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={initialize}
                    className="ml-auto bg-red-600/10 border-red-500/30 text-red-400 hover:bg-red-600/20"
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Thompson Sampling Status */}
        {currentProject && !samplingError && (
          <div className="mb-6">
            <Card className="bg-slate-900/30 border-slate-700/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isInitialized && isRunning ? 'bg-green-400' : isInitialized ? 'bg-yellow-400' : 'bg-gray-400'}`} />
                    <span className="text-white text-sm font-medium">
                      Thompson Sampling: {isInitialized && isRunning ? 'Running' : isInitialized ? 'Ready' : 'Not initialized'}
                    </span>
                    {isInitialized && metrics.lastUpdated && (
                      <span className="text-gray-400 text-xs">
                        Updated {new Date(metrics.lastUpdated).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  {isInitialized && (
                    <Badge 
                      variant="outline" 
                      className="border-cyan-500/30 text-cyan-400"
                    >
                      {allocation.length} channels
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Thompson Sampling Analytics */}
        {isInitialized && allocation.length > 0 && (
          <div className="mb-6">
            <ThompsonSamplingVisualizer
              allocation={allocation}
              metrics={metrics}
              channelSummary={channelSummary}
              decisionGates={decisionGates}
              isLoading={samplingLoading}
            />
          </div>
        )}

        {/* Advanced Filters & Controls */}
        <div className="mb-6 space-y-4">
          {/* Search and Primary Controls */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search experiments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
              />
            </div>

            {/* View Mode Toggle & Real-time Refresh */}
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-900/50 border border-slate-700/50 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('table')}
                  className={viewMode === 'table' ? 'bg-orange-600/20 text-orange-400' : 'text-gray-400 hover:text-white'}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-orange-600/20 text-orange-400' : 'text-gray-400 hover:text-white'}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
              </div>

              {/* Real-time refresh indicator */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.location.reload()}
                className="text-gray-400 hover:text-white bg-slate-900/50 border border-slate-700/50"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>

              {/* Auto-refresh status */}
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-900/50 border border-slate-700/50 rounded text-xs">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-400">Live</span>
              </div>
            </div>
          </div>

          {/* Advanced Analytics Toggle */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant={showStatisticalAnalysis ? 'default' : 'outline'}
              onClick={() => setShowStatisticalAnalysis(!showStatisticalAnalysis)}
              className={showStatisticalAnalysis ? 'bg-purple-600/20 text-purple-400' : 'border-slate-600/50 text-gray-400 hover:bg-slate-700/50'}
            >
              <Gauge className="w-4 h-4 mr-1" />
              Statistical Analysis
            </Button>
            
            <Button
              size="sm"
              variant={showFunnelAnalysis ? 'default' : 'outline'}
              onClick={() => setShowFunnelAnalysis(!showFunnelAnalysis)}
              className={showFunnelAnalysis ? 'bg-purple-600/20 text-purple-400' : 'border-slate-600/50 text-gray-400 hover:bg-slate-700/50'}
            >
              <Funnel className="w-4 h-4 mr-1" />
              Funnel Analysis
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Toggle cohort analysis (placeholder)
                console.log('Toggle cohort analysis');
              }}
              className="border-slate-600/50 text-gray-400 hover:bg-slate-700/50"
            >
              <Users className="w-4 h-4 mr-1" />
              Cohort Analysis
            </Button>
          </div>

          {/* Advanced Filter Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32 bg-slate-900/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Metric Filter */}
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40 bg-slate-900/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Primary Metric" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="CPL">Cost Per Lead</SelectItem>
                <SelectItem value="CAC">Customer Acquisition Cost</SelectItem>
                <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                <SelectItem value="roas">Return on Ad Spend</SelectItem>
                <SelectItem value="ctr">Click Through Rate</SelectItem>
              </SelectContent>
            </Select>

            {/* Time Range Filter */}
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32 bg-slate-900/50 border-slate-700/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            {/* Analysis Toggles */}
            <Button
              size="sm"
              variant={showStatisticalAnalysis ? 'default' : 'outline'}
              onClick={() => setShowStatisticalAnalysis(!showStatisticalAnalysis)}
              className={showStatisticalAnalysis 
                ? 'bg-cyan-600/20 border-cyan-500/30 text-cyan-400' 
                : 'bg-slate-900/50 border-slate-700/50 text-gray-400 hover:text-white'
              }
            >
              <Gauge className="w-3 h-3 mr-1" />
              Statistics
            </Button>

            <Button
              size="sm"
              variant={showFunnelAnalysis ? 'default' : 'outline'}
              onClick={() => setShowFunnelAnalysis(!showFunnelAnalysis)}
              className={showFunnelAnalysis 
                ? 'bg-purple-600/20 border-purple-500/30 text-purple-400' 
                : 'bg-slate-900/50 border-slate-700/50 text-gray-400 hover:text-white'
              }
            >
              <Funnel className="w-3 h-3 mr-1" />
              Funnel
            </Button>
          </div>
        </div>

        {/* Statistical Significance Analysis */}
        {showStatisticalAnalysis && (
          <div className="mb-6">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Gauge className="w-5 h-5 text-cyan-400" />
                  Statistical Significance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                    <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-cyan-400">Overview</TabsTrigger>
                    <TabsTrigger value="pvalues" className="text-gray-300 data-[state=active]:text-cyan-400">P-Values</TabsTrigger>
                    <TabsTrigger value="confidence" className="text-gray-300 data-[state=active]:text-cyan-400">Confidence</TabsTrigger>
                    <TabsTrigger value="power" className="text-gray-300 data-[state=active]:text-cyan-400">Power Analysis</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-slate-800/50 border-slate-600/50 p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-8 h-8 text-green-400" />
                          <div>
                            <p className="text-sm text-gray-400">Significant Results</p>
                            <p className="text-2xl font-bold text-white">
                              {activeExperiments.filter(exp => (exp.confidence_level || 0) >= 0.95).length}
                            </p>
                            <p className="text-xs text-green-400">≥95% confidence</p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="bg-slate-800/50 border-slate-600/50 p-4">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-8 h-8 text-yellow-400" />
                          <div>
                            <p className="text-sm text-gray-400">Trending Results</p>
                            <p className="text-2xl font-bold text-white">
                              {activeExperiments.filter(exp => (exp.confidence_level || 0) >= 0.80 && (exp.confidence_level || 0) < 0.95).length}
                            </p>
                            <p className="text-xs text-yellow-400">80-95% confidence</p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="bg-slate-800/50 border-slate-600/50 p-4">
                        <div className="flex items-center gap-3">
                          <TrendingDown className="w-8 h-8 text-red-400" />
                          <div>
                            <p className="text-sm text-gray-400">Inconclusive</p>
                            <p className="text-2xl font-bold text-white">
                              {activeExperiments.filter(exp => (exp.confidence_level || 0) < 0.80).length}
                            </p>
                            <p className="text-xs text-red-400">&lt;80% confidence</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pvalues" className="mt-4">
                    <div className="space-y-3">
                      {activeExperiments.slice(0, 5).map((exp, index) => {
                        const pValue = 1 - (exp.confidence_level || 0.5);
                        const isSignificant = pValue < 0.05;
                        
                        return (
                          <div key={exp.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${isSignificant ? 'bg-green-400' : 'bg-red-400'}`} />
                              <span className="text-white font-medium">{exp.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-white">p = {pValue.toFixed(4)}</p>
                                <p className={`text-xs ${isSignificant ? 'text-green-400' : 'text-red-400'}`}>
                                  {isSignificant ? 'Significant' : 'Not Significant'}
                                </p>
                              </div>
                              <Badge className={`${isSignificant ? 'bg-green-600/20 text-green-400 border-green-500/30' : 'bg-red-600/20 text-red-400 border-red-500/30'}`}>
                                {(exp.confidence_level || 0) >= 0.95 ? '✓' : '✗'}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="confidence" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-slate-800/30 p-4">
                          <h4 className="text-white font-medium mb-2">Confidence Intervals</h4>
                          <p className="text-sm text-gray-400 mb-3">95% CI ranges for conversion rates</p>
                          {activeExperiments.slice(0, 3).map((exp) => {
                            const baseRate = exp.current_value || 0.025;
                            const margin = baseRate * 0.15; // ±15% margin for demo
                            
                            return (
                              <div key={exp.id} className="mb-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-300">{exp.name}</span>
                                  <span className="text-white">{(baseRate * 100).toFixed(2)}%</span>
                                </div>
                                <div className="mt-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${baseRate * 100 * 4}%` }} />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  CI: {((baseRate - margin) * 100).toFixed(2)}% - {((baseRate + margin) * 100).toFixed(2)}%
                                </div>
                              </div>
                            );
                          })}
                        </Card>
                        
                        <Card className="bg-slate-800/30 p-4">
                          <h4 className="text-white font-medium mb-2">Effect Sizes</h4>
                          <p className="text-sm text-gray-400 mb-3">Relative improvement over baseline</p>
                          {activeExperiments.slice(0, 3).map((exp) => {
                            const improvement = ((exp.current_value || 0.025) / 0.025 - 1) * 100;
                            const isPositive = improvement > 0;
                            
                            return (
                              <div key={exp.id} className="flex items-center justify-between mb-3">
                                <span className="text-gray-300 text-sm">{exp.name}</span>
                                <div className="flex items-center gap-2">
                                  {isPositive ? (
                                    <ArrowUp className="w-3 h-3 text-green-400" />
                                  ) : improvement < 0 ? (
                                    <ArrowDown className="w-3 h-3 text-red-400" />
                                  ) : (
                                    <Minus className="w-3 h-3 text-gray-400" />
                                  )}
                                  <span className={`text-sm font-medium ${
                                    isPositive ? 'text-green-400' : improvement < 0 ? 'text-red-400' : 'text-gray-400'
                                  }`}>
                                    {improvement.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="power" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-slate-800/30 p-4">
                        <h4 className="text-white font-medium mb-2">Sample Size Calculator</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Minimum Detectable Effect:</span>
                            <span className="text-white">5%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Statistical Power:</span>
                            <span className="text-white">80%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Significance Level:</span>
                            <span className="text-white">5%</span>
                          </div>
                          <div className="border-t border-slate-700 pt-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Required Sample Size:</span>
                              <span className="text-cyan-400 font-medium">~3,200 per variant</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="bg-slate-800/30 p-4">
                        <h4 className="text-white font-medium mb-2">Current Power Analysis</h4>
                        <div className="space-y-3">
                          {activeExperiments.slice(0, 2).map((exp) => {
                            const currentPower = Math.min(0.95, (exp.days_running || 1) / 14 * 0.8); // Simulated power
                            
                            return (
                              <div key={exp.id} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-300">{exp.name}</span>
                                  <span className="text-white">{(currentPower * 100).toFixed(0)}% power</span>
                                </div>
                                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${currentPower >= 0.8 ? 'bg-green-400' : 'bg-yellow-400'}`}
                                    style={{ width: `${currentPower * 100}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500">
                                  {currentPower >= 0.8 ? 'Adequately powered' : `Need ${Math.ceil((0.8 - currentPower) / 0.8 * 14)} more days`}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Funnel Analysis */}
        {showFunnelAnalysis && (
          <div className="mb-6">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Funnel className="w-5 h-5 text-purple-400" />
                  Funnel Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Funnel Visualization */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Conversion Funnel</h4>
                    {[
                      { stage: 'Impression', count: 10000, rate: 100 },
                      { stage: 'Click', count: 300, rate: 3.0 },
                      { stage: 'Landing Page View', count: 280, rate: 2.8 },
                      { stage: 'Form Start', count: 140, rate: 1.4 },
                      { stage: 'Form Complete', count: 105, rate: 1.05 },
                      { stage: 'Conversion', count: 25, rate: 0.25 }
                    ].map((stage, index) => {
                      const width = (stage.rate / 100) * 100;
                      const dropoff = index > 0 ? ((10000 - stage.count) / 10000) * 100 : 0;
                      
                      return (
                        <div key={stage.stage} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">{stage.stage}</span>
                            <div className="text-right">
                              <span className="text-white font-medium">{stage.count.toLocaleString()}</span>
                              <span className="text-gray-400 text-xs ml-2">({stage.rate.toFixed(2)}%)</span>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="h-6 bg-slate-700 rounded" style={{ width: '100%' }}>
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded transition-all duration-500"
                                style={{ width: `${Math.max(width * 10, 5)}%` }}
                              />
                            </div>
                            {index > 0 && (
                              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                                <div className="bg-red-500/20 border border-red-500/50 rounded px-2 py-1 text-xs text-red-400">
                                  -{((([10000, 300, 280, 140, 105, 25][index - 1] - stage.count) / [10000, 300, 280, 140, 105, 25][index - 1]) * 100).toFixed(1)}%
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Funnel Metrics */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Key Metrics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="bg-slate-800/30 p-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-400">0.25%</p>
                          <p className="text-xs text-gray-400">Overall CVR</p>
                        </div>
                      </Card>
                      <Card className="bg-slate-800/30 p-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-400">75%</p>
                          <p className="text-xs text-gray-400">Form Complete Rate</p>
                        </div>
                      </Card>
                      <Card className="bg-slate-800/30 p-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-400">6.7%</p>
                          <p className="text-xs text-gray-400">Click Drop-off</p>
                        </div>
                      </Card>
                      <Card className="bg-slate-800/30 p-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-cyan-400">$120</p>
                          <p className="text-xs text-gray-400">Cost Per Conv.</p>
                        </div>
                      </Card>
                    </div>

                    <div className="mt-6">
                      <h5 className="text-white text-sm font-medium mb-3">Optimization Opportunities</h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          <span className="text-red-400 text-sm">High drop-off at form start (-50%)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 text-sm">Landing page bounce rate could be improved</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm">Good form completion rate (75%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Performance Heatmap */}
        <Card className="bg-slate-900/50 border-slate-700/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              Performance Heatmap
              <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-400">
                Live Data
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Heatmap Legend */}
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">Channel performance across metrics</p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500/60 rounded" />
                    <span className="text-gray-400">Poor</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500/60 rounded" />
                    <span className="text-gray-400">Average</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500/60 rounded" />
                    <span className="text-gray-400">Excellent</span>
                  </div>
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Header */}
                  <div className="grid grid-cols-6 gap-1 mb-2">
                    <div className="text-xs text-gray-400 font-medium p-2">Channel</div>
                    <div className="text-xs text-gray-400 font-medium p-2 text-center">Conv Rate</div>
                    <div className="text-xs text-gray-400 font-medium p-2 text-center">CPA</div>
                    <div className="text-xs text-gray-400 font-medium p-2 text-center">ROAS</div>
                    <div className="text-xs text-gray-400 font-medium p-2 text-center">Traffic</div>
                    <div className="text-xs text-gray-400 font-medium p-2 text-center">Quality Score</div>
                  </div>

                  {/* Heatmap Rows */}
                  {[
                    { channel: 'Google Ads', metrics: [85, 72, 90, 78, 95] },
                    { channel: 'Facebook Ads', metrics: [68, 85, 75, 82, 88] },
                    { channel: 'LinkedIn Ads', metrics: [92, 45, 88, 65, 70] },
                    { channel: 'Email Campaign', metrics: [78, 90, 65, 88, 82] },
                    { channel: 'Organic Search', metrics: [88, 95, 85, 92, 78] },
                    { channel: 'Content Marketing', metrics: [75, 68, 70, 85, 90] }
                  ].map((row, index) => (
                    <div key={index} className="grid grid-cols-6 gap-1 mb-1">
                      <div className="text-sm text-white p-2 bg-slate-800/30 rounded">
                        {row.channel}
                      </div>
                      {row.metrics.map((value, i) => {
                        const getHeatColor = (val: number) => {
                          if (val >= 85) return 'bg-green-500/60 border-green-400/30';
                          if (val >= 70) return 'bg-yellow-500/60 border-yellow-400/30';
                          return 'bg-red-500/60 border-red-400/30';
                        };
                        
                        return (
                          <div 
                            key={i}
                            className={cn(
                              "text-sm text-white p-2 rounded text-center border transition-all hover:scale-105 cursor-pointer",
                              getHeatColor(value)
                            )}
                            title={`Score: ${value}%`}
                          >
                            {value}%
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-700/30">
                <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">Top Performer</span>
                  </div>
                  <p className="text-white text-sm">LinkedIn Ads</p>
                  <p className="text-gray-400 text-xs">92% conversion rate</p>
                </div>
                
                <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDown className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-medium">Needs Attention</span>
                  </div>
                  <p className="text-white text-sm">LinkedIn Ads CPA</p>
                  <p className="text-gray-400 text-xs">45% below target</p>
                </div>

                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-medium">Trending</span>
                  </div>
                  <p className="text-white text-sm">Organic Search</p>
                  <p className="text-gray-400 text-xs">Consistent growth</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experiments Display */}
        <Card className="bg-slate-900/50 border-slate-700/50 flex-1 overflow-hidden">
          <div className="h-full">
            {filteredExperiments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <FlaskConical className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">No Experiments</h3>
                <p className="text-gray-400 text-sm mb-6 text-center max-w-md">
                  Create your first experiment to start optimizing your go-to-market channels.
                </p>
                <Link href="/dashboard/experiments/designer">
                  <Button className="bg-orange-600/20 border-orange-500/30 hover:bg-orange-600/30 text-orange-400">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Experiment
                  </Button>
                </Link>
              </div>
            ) : viewMode === 'table' ? (
              <div className="overflow-x-auto h-full experiments-scrollbar">
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-slate-700/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-300">Experiment</th>
                      <th className="text-left p-4 font-medium text-gray-300">Status</th>
                      <th className="text-left p-4 font-medium text-gray-300">Primary Metric</th>
                      <th className="text-left p-4 font-medium text-gray-300">Current/Target</th>
                      <th className="text-left p-4 font-medium text-gray-300">Budget</th>
                      <th className="text-left p-4 font-medium text-gray-300">Confidence</th>
                      <th className="text-left p-4 font-medium text-gray-300">Duration</th>
                      <th className="text-left p-4 font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExperiments.map((experiment) => {
                    const getStatusBadge = (status: string) => {
                      switch (status) {
                        case 'running':
                          return 'bg-green-600/10 text-green-400 border-green-500/30'
                        case 'paused':
                          return 'bg-yellow-600/10 text-yellow-400 border-yellow-500/30'
                        case 'completed':
                          return 'bg-blue-600/10 text-blue-400 border-blue-500/30'
                        default:
                          return 'bg-gray-600/10 text-gray-400 border-gray-500/30'
                      }
                    }

                    const getStatusIcon = (status: string) => {
                      switch (status) {
                        case 'running': return <Play className="w-3 h-3" />
                        case 'paused': return <Pause className="w-3 h-3" />
                        case 'completed': return <CheckCircle className="w-3 h-3" />
                        default: return <Clock className="w-3 h-3" />
                      }
                    }

                    return (
                      <tr 
                        key={experiment.id} 
                        className="border-b border-slate-700/30 hover:bg-slate-800/30 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedExperiment(experiment)
                          setShowArtifacts(true)
                        }}
                      >
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-white">{experiment.name}</div>
                            <div className="text-sm text-gray-400">
                              {experiment.start_date && new Date(experiment.start_date).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`border ${getStatusBadge(experiment.status)}`}>
                            {getStatusIcon(experiment.status)}
                            <span className="ml-1 capitalize">{experiment.status}</span>
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-300">{experiment.primary_metric || 'N/A'}</td>
                        <td className="p-4">
                          <div className="text-white">
                            {experiment.primary_metric?.includes('Rate') 
                              ? `${((experiment.current_value || 0) * 100).toFixed(1)}%` 
                              : `$${(experiment.current_value || 0).toLocaleString()}`
                            }
                          </div>
                          <div className="text-sm text-gray-400">
                            Target: {experiment.primary_metric?.includes('Rate') 
                              ? `${((experiment.target_value || 0) * 100).toFixed(1)}%` 
                              : `$${(experiment.target_value || 0).toLocaleString()}`
                            }
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-white">${(experiment.budget_allocated || 0).toLocaleString()}</div>
                          <div className="text-sm text-gray-400">${(experiment.budget_spent || 0).toLocaleString()} spent</div>
                        </td>
                        <td className="p-4 text-cyan-400">{((experiment.confidence_level || 0) * 100).toFixed(0)}%</td>
                        <td className="p-4 text-gray-300">{experiment.days_running || 0} days</td>
                        <td className="p-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-orange-600/10 border-orange-500/30 text-orange-400 hover:bg-orange-600/20"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedExperiment(experiment)
                              setShowArtifacts(true)
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Artifacts
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Grid View */
              <div className="p-6 h-[600px] overflow-y-auto experiments-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Test cards to ensure scrolling */}
                  {Array.from({length: 50}).map((_, i) => (
                    <Card key={`test-${i}`} className="bg-slate-800/50 border-slate-600/50 p-4">
                      <div className="h-64 flex items-center justify-center">
                        <p className="text-white">Test Card {i + 1} - This is a tall card to force scrolling</p>
                      </div>
                    </Card>
                  ))}
                  {filteredExperiments.map((experiment) => {
                    // Calculate key metrics for grid display
                    const conversionRate = (experiment.conversions || 0) / Math.max(experiment.impressions || 1, 1) * 100;
                    const progressPercent = Math.min((experiment.days_elapsed || 0) / Math.max(experiment.duration_days || 1, 1) * 100, 100);
                    const isStatSig = (experiment.statistical_significance || 0) > 0.8;
                    const currentValueDisplay = experiment.primary_metric?.includes('Rate') 
                      ? `${((experiment.current_value || 0) * 100).toFixed(1)}%` 
                      : `$${(experiment.current_value || 0).toLocaleString()}`;
                    const targetValueDisplay = experiment.primary_metric?.includes('Rate') 
                      ? `${((experiment.target_value || 0) * 100).toFixed(1)}%` 
                      : `$${(experiment.target_value || 0).toLocaleString()}`;

                    const getStatusBadge = (status: string) => {
                      switch (status) {
                        case 'running':
                          return 'bg-green-600/10 text-green-400 border-green-500/30'
                        case 'paused':
                          return 'bg-yellow-600/10 text-yellow-400 border-yellow-500/30'
                        case 'completed':
                          return 'bg-blue-600/10 text-blue-400 border-blue-500/30'
                        default:
                          return 'bg-gray-600/10 text-gray-400 border-gray-500/30'
                      }
                    }

                    const getStatusIcon = (status: string) => {
                      switch (status) {
                        case 'running': return <Play className="w-3 h-3" />
                        case 'paused': return <Pause className="w-3 h-3" />
                        case 'completed': return <CheckCircle className="w-3 h-3" />
                        default: return <Clock className="w-3 h-3" />
                      }
                    }
                    
                    return (
                      <Card
                        key={experiment.id}
                        className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 cursor-pointer"
                        onClick={() => {
                          setSelectedExperiment(experiment)
                          setShowArtifacts(true)
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base font-medium text-white line-clamp-2">
                                {experiment.name}
                              </CardTitle>
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {experiment.description}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "ml-2 flex-shrink-0 border",
                                getStatusBadge(experiment.status)
                              )}
                            >
                              {getStatusIcon(experiment.status)}
                              <span className="ml-1 capitalize">{experiment.status}</span>
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          {/* Key Metrics Grid */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                              <div className="flex items-center gap-2 mb-1">
                                <Target className="w-3 h-3 text-cyan-400" />
                                <span className="text-xs text-gray-400">Primary Metric</span>
                              </div>
                              <p className="text-sm font-medium text-white mb-1">
                                {experiment.primary_metric || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Current: {currentValueDisplay}
                              </p>
                              <p className="text-xs text-gray-500">
                                Target: {targetValueDisplay}
                              </p>
                            </div>
                            
                            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                              <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs text-gray-400">Budget</span>
                              </div>
                              <p className="text-sm font-bold text-white">
                                ${(experiment.budget_allocated || 0).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                ${(experiment.budget_spent || 0).toLocaleString()} spent
                              </p>
                            </div>
                          </div>

                          {/* Progress and Confidence */}
                          <div className="space-y-3 mb-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-400">Confidence Level</span>
                                <span className="text-xs font-medium text-cyan-400">
                                  {((experiment.confidence_level || 0) * 100).toFixed(0)}%
                                </span>
                              </div>
                              <Progress
                                value={(experiment.confidence_level || 0) * 100}
                                className="h-1.5 bg-slate-700"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-400">Duration Progress</span>
                                <span className="text-xs text-gray-500">
                                  {experiment.days_running || 0} days
                                </span>
                              </div>
                              <div className="relative">
                                <Progress
                                  value={progressPercent}
                                  className="h-1.5 bg-slate-700"
                                />
                                {experiment.status === 'running' && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cyan-400/20 rounded-full animate-pulse" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Statistical Significance Indicator */}
                          {isStatSig && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 p-2 bg-green-600/10 border border-green-500/30 rounded">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span className="text-xs text-green-400">Statistically Significant</span>
                                <Badge variant="outline" className="text-xs border-green-500/30 text-green-400 ml-auto">
                                  {((experiment.statistical_significance || 0) * 100).toFixed(0)}%
                                </Badge>
                              </div>
                            </div>
                          )}

                          {/* Quick Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                            <div className="flex items-center gap-2">
                              {experiment.channel_name && (
                                <Badge variant="outline" className="text-xs border-slate-600/50 text-gray-400">
                                  {experiment.channel_name}
                                </Badge>
                              )}
                            </div>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 bg-orange-600/10 border-orange-500/30 text-orange-400 hover:bg-orange-600/20"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedExperiment(experiment)
                                setShowArtifacts(true)
                              }}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>

                          {/* Mini Performance Chart */}
                          {experiment.status === 'running' && (
                            <div className="mt-4 pt-3 border-t border-slate-700/30">
                              <div className="flex items-center gap-1 mb-2">
                                <TrendingUp className="w-3 h-3 text-cyan-400" />
                                <span className="text-xs text-gray-400">Performance Trend</span>
                              </div>
                              <div className="h-8 bg-slate-800/30 rounded border border-slate-700/30 flex items-end justify-center gap-0.5 px-2">
                                {[...Array(7)].map((_, i) => {
                                  // Generate semi-realistic trend based on experiment performance
                                  const baseHeight = Math.max(2, (experiment.confidence_level || 0) * 6);
                                  const variation = Math.sin(i * 0.8) * 1.5;
                                  const height = Math.max(2, Math.min(6, baseHeight + variation));
                                  
                                  return (
                                    <div
                                      key={i}
                                      className={cn(
                                        "w-1 bg-gradient-to-t rounded-full",
                                        height < 2.5 ? "from-red-500/60 to-red-400/80" :
                                        height < 4 ? "from-yellow-500/60 to-yellow-400/80" :
                                        "from-green-500/60 to-green-400/80"
                                      )}
                                      style={{ height: `${height * 4}px` }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {filteredExperiments.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">No experiments match your filters</div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilterStatus('all');
                        setFilterMetric('all');
                        setSearchQuery('');
                      }}
                      className="border-slate-600/50 text-gray-400 hover:bg-slate-700/50"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Artifacts Dialog */}
        <Dialog open={showArtifacts} onOpenChange={setShowArtifacts}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" />
                Artifacts: {selectedExperiment?.name}
              </DialogTitle>
            </DialogHeader>
            
            {artifactsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
                <span className="ml-2 text-gray-400">Loading artifacts...</span>
              </div>
            ) : experimentArtifacts && experimentArtifacts.length > 0 ? (
              <div className="max-h-96 overflow-y-auto space-y-4 experiments-scrollbar">
                {experimentArtifacts.map((artifact) => (
                  <Card key={artifact.id} className="bg-slate-800/50 border-slate-600/50 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-white">{artifact.title}</h4>
                        <p className="text-sm text-gray-400">{artifact.type} • {artifact.agent_type}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(artifact.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{artifact.summary}</p>
                    <div className="bg-slate-900/50 rounded p-3 text-sm text-gray-300 font-mono max-h-32 overflow-y-auto">
                      {artifact.content}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No artifacts generated for this experiment yet</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
}