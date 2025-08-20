'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import DemoToggle, { DemoIndicator } from '@/components/demo/DemoToggle';
import { 
  Settings, 
  Database, 
  BarChart3, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Info
} from 'lucide-react';
import { useDemoMode, DemoDataUtils } from '@/lib/demo/demo-mode';

export default function AdminPage() {
  const {
    isEnabled: isDemoEnabled,
    state: demoState,
    getCurrentData,
    generateNewData,
    reset: resetDemo
  } = useDemoMode();

  const [demoData, setDemoData] = useState<ReturnType<typeof getCurrentData> | null>(null);
  const [dataValidation, setDataValidation] = useState<ReturnType<typeof DemoDataUtils.validateDemoData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load demo data when component mounts or demo mode changes
  useEffect(() => {
    if (isDemoEnabled) {
      const data = getCurrentData();
      setDemoData(data);
      setDataValidation(DemoDataUtils.validateDemoData(data));
    } else {
      setDemoData(null);
      setDataValidation(null);
    }
  }, [isDemoEnabled, demoState.currentSeed, getCurrentData]);

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate loading
      const newData = generateNewData();
      setDemoData(newData);
      setDataValidation(DemoDataUtils.validateDemoData(newData));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    if (!demoData) return;
    
    const dataStr = JSON.stringify(demoData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `demo-data-${demoState.currentSeed}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetDemo = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      resetDemo();
      if (isDemoEnabled) {
        const data = getCurrentData();
        setDemoData(data);
        setDataValidation(DemoDataUtils.validateDemoData(data));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-sm text-red-400 font-medium">System Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">
            System administration and demo mode controls
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DemoIndicator />
          <Button variant="outline" size="sm" onClick={handleRefreshData} disabled={isLoading} className="bg-black/40 border-gray-500/30 text-gray-300 hover:bg-gray-700/50">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="demo-mode" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demo-mode">Demo Mode</TabsTrigger>
          <TabsTrigger value="data-overview">Data Overview</TabsTrigger>
          <TabsTrigger value="validation">Data Validation</TabsTrigger>
          <TabsTrigger value="system-info">System Info</TabsTrigger>
        </TabsList>

        {/* Demo Mode Tab */}
        <TabsContent value="demo-mode" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demo Toggle */}
            <DemoToggle showSettings={true} />

            {/* Demo Data Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Manage demo datasets and configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleRefreshData}
                    disabled={!isDemoEnabled || isLoading}
                    className="w-full"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    disabled={!isDemoEnabled || !demoData}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <Separator />
                
                <Button
                  variant="destructive"
                  onClick={handleResetDemo}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>

                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing...</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Demo Status Alert */}
          {isDemoEnabled ? (
            <Alert className="bg-black/40 border border-purple-500/20">
              <CheckCircle2 className="h-4 w-4 text-purple-400" />
              <AlertDescription className="text-gray-300">
                Demo mode is active. All data shown in the dashboard is synthetic and deterministic.
                Current dataset was generated on {new Date(demoState.lastGenerated).toLocaleDateString()}.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-black/40 border border-blue-500/20">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-gray-300">
                Live data mode is active. All metrics reflect real performance data from connected sources.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Data Overview Tab */}
        <TabsContent value="data-overview" className="space-y-6">
          {isDemoEnabled && demoData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Experiment Overview */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Experiment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium text-sm">{demoData.experiment.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {demoData.experiment.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ${demoData.experiment.budget_allocated.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Channels Count */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Channels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{demoData.channels.length}</p>
                    <p className="text-xs text-muted-foreground">
                      {demoData.channels.filter(c => c.is_active).length} active
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Gates Count */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Gates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{demoData.gates.length}</p>
                    <p className="text-xs text-muted-foreground">
                      {demoData.gates.filter(g => g.is_critical).length} critical
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Results Count */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{demoData.results.length}</p>
                    <p className="text-xs text-muted-foreground">
                      {demoData.metadata.days} days of data
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {isDemoEnabled 
                  ? "No demo data available. Try generating a new dataset."
                  : "Enable demo mode to view synthetic data overview."
                }
              </AlertDescription>
            </Alert>
          )}

          {/* Channel Performance Preview */}
          {isDemoEnabled && demoData && (
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance Summary</CardTitle>
                <CardDescription>
                  Overview of performance across all demo channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DemoDataUtils.calculateChannelPerformance(demoData.results, demoData.channels)
                    .slice(0, 5)
                    .map((channel, index) => (
                      <div key={channel.channelId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{channel.channelName}</p>
                          <p className="text-xs text-muted-foreground">{channel.channelType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            ${Math.round(channel.costPerLead).toLocaleString()} CPL
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {channel.totalLeads} leads
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Data Validation Tab */}
        <TabsContent value="validation" className="space-y-6">
          {isDemoEnabled && dataValidation ? (
            <div className="space-y-6">
              {/* Validation Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className={`h-5 w-5 ${dataValidation.isValid ? 'text-gray-400' : 'text-gray-400'}`} />
                    Data Validation Status
                  </CardTitle>
                  <CardDescription>
                    Automated checks for data integrity and consistency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Overall Status</span>
                      <Badge variant={dataValidation.isValid ? "default" : "destructive"}>
                        {dataValidation.isValid ? "Valid" : "Issues Found"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{dataValidation.errors.length}</p>
                        <p className="text-sm text-muted-foreground">Errors</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{dataValidation.warnings.length}</p>
                        <p className="text-sm text-muted-foreground">Warnings</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Errors */}
              {dataValidation.errors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Errors</CardTitle>
                    <CardDescription>Critical issues that must be resolved</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {dataValidation.errors.map((error, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Warnings */}
              {dataValidation.warnings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-yellow-600">Warnings</CardTitle>
                    <CardDescription>Potential issues or inconsistencies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {dataValidation.warnings.map((warning, index) => (
                        <Alert key={index} className="border-yellow-200 bg-yellow-50">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-800">{warning}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* All Good */}
              {dataValidation.errors.length === 0 && dataValidation.warnings.length === 0 && (
                <Alert className="bg-black/40 border border-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-gray-300">
                    All validation checks passed. Demo data is consistent and ready for use.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {isDemoEnabled 
                  ? "No validation data available. Try refreshing the data."
                  : "Enable demo mode to run data validation checks."
                }
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* System Info Tab */}
        <TabsContent value="system-info" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demo Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Demo Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={isDemoEnabled ? "default" : "secondary"}>
                      {isDemoEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  {isDemoEnabled && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Seed</span>
                        <span className="text-sm font-mono">{demoState.currentSeed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Budget Multiplier</span>
                        <span className="text-sm">{demoState.customizations.budgetMultiplier}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Noise Level</span>
                        <span className="text-sm">±{Math.round(demoState.customizations.performanceVariance * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Trends Enabled</span>
                        <Badge variant="outline" size="sm">
                          {demoState.customizations.enableTrends ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Environment</span>
                    <Badge variant="outline">Development</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="text-sm">1.0.0-beta</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Data Source</span>
                    <Badge variant="outline">
                      {isDemoEnabled ? "Synthetic" : "Live"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Bottom Spacing */}
      <div className="pb-8"></div>
      </div>
    </div>
  );
}