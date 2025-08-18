'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Activity,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Database,
  Cpu,
  Wifi,
  Zap,
  Download,
  RefreshCw,
  Monitor,
  Settings,
  Bell
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function BenchmarksPage() {
  return (
    <div className="h-screen overflow-hidden flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Telemetry Station
          </h1>
          <p className="text-blue-200/70 mt-2">
            Monitor your Startup_Path performance metrics and system health
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-600">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 text-gray-300">
            <Monitor className="h-4 w-4 mr-2" />
            System Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-gray-700 text-gray-300">
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-gray-700 text-gray-300">
            <Zap className="h-4 w-4 mr-2" />
            Activity Feed
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-gray-700 text-gray-300">
            <Bell className="h-4 w-4 mr-2" />
            Alerts & Status
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          
          {/* System Overview Tab */}
          <TabsContent value="overview" className="h-full overflow-y-auto space-y-6 mt-6">
            {/* System Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-300 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">98.5%</div>
                  <p className="text-xs text-gray-300 mt-1">All systems operational</p>
                  <Progress value={98.5} className="mt-2 h-1" />
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-blue-300 flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Processing Power
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">42%</div>
                  <p className="text-xs text-gray-300 mt-1">CPU utilization</p>
                  <Progress value={42} className="mt-2 h-1" />
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-300 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Data Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">2.4TB</div>
                  <p className="text-xs text-gray-300 mt-1">Of 5TB used</p>
                  <Progress value={48} className="mt-2 h-1" />
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-cyan-300 flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    Network Latency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-400">12ms</div>
                  <p className="text-xs text-gray-300 mt-1">Average response time</p>
                  <Progress value={88} className="mt-2 h-1" />
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <p className="text-sm text-gray-300">System Uptime</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">847K</div>
                    <p className="text-sm text-gray-300">Data Points Processed</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">99.9%</div>
                    <p className="text-sm text-gray-300">Accuracy Rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="h-full overflow-y-auto space-y-6 mt-6">
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Performance Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Channel Discovery Speed', value: 94, benchmark: 85, status: 'excellent' },
                    { name: 'Offer Generation Quality', value: 87, benchmark: 80, status: 'good' },
                    { name: 'Budget Optimization Accuracy', value: 92, benchmark: 75, status: 'excellent' },
                    { name: 'Signal Processing Rate', value: 78, benchmark: 70, status: 'good' },
                    { name: 'Prediction Accuracy', value: 83, benchmark: 85, status: 'acceptable' },
                  ].map((metric, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-200">{metric.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={
                              metric.status === 'excellent' ? 'text-green-300 border-green-600' :
                              metric.status === 'good' ? 'text-blue-300 border-blue-600' :
                              'text-yellow-300 border-yellow-600'
                            }
                          >
                            {metric.value}%
                          </Badge>
                          <span className="text-xs text-gray-400">
                            Target: {metric.benchmark}%
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={metric.value} className="h-2" />
                        <div 
                          className="absolute top-0 w-0.5 h-2 bg-white/70"
                          style={{ left: `${metric.benchmark}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Response Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">API Calls</span>
                      <span className="text-sm font-medium text-white">125ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Database Query</span>
                      <span className="text-sm font-medium text-white">42ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">ML Model</span>
                      <span className="text-sm font-medium text-white">89ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Resource Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Memory</span>
                      <span className="text-sm font-medium text-white">68%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Network I/O</span>
                      <span className="text-sm font-medium text-white">34%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Disk Usage</span>
                      <span className="text-sm font-medium text-white">45%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Feed Tab */}
          <TabsContent value="activity" className="h-full overflow-y-auto space-y-6 mt-6">
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Recent Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: '2 min ago', event: 'New channel discovered: TikTok Ads', type: 'success' },
                    { time: '15 min ago', event: 'Budget reallocation completed', type: 'info' },
                    { time: '1 hour ago', event: 'Signal anomaly detected in Google Ads', type: 'warning' },
                    { time: '3 hours ago', event: 'Weekly performance report generated', type: 'info' },
                    { time: '5 hours ago', event: 'Experiment #42 completed successfully', type: 'success' },
                    { time: '8 hours ago', event: 'LinkedIn campaign optimization started', type: 'info' },
                    { time: '12 hours ago', event: 'Data backup completed', type: 'success' },
                    { time: '1 day ago', event: 'Monthly report generated', type: 'info' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-700 border border-gray-600">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        item.type === 'success' ? 'bg-green-400' :
                        item.type === 'warning' ? 'bg-yellow-400' :
                        'bg-blue-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{item.event}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts & Status Tab */}
          <TabsContent value="alerts" className="h-full overflow-y-auto space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Active Alerts */}
              <Card className="bg-gray-800 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-400" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { level: 'warning', message: 'LinkedIn Ads efficiency dropping', action: 'Review', priority: 'high' },
                      { level: 'warning', message: 'Budget utilization at 85%', action: 'Adjust', priority: 'medium' },
                      { level: 'info', message: 'New industry benchmark available', action: 'Update', priority: 'low' },
                      { level: 'info', message: 'Scheduled maintenance in 48 hours', action: 'Prepare', priority: 'low' },
                    ].map((alert, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-700 border border-gray-600">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            alert.level === 'warning' ? 'bg-yellow-400' :
                            alert.level === 'success' ? 'bg-green-400' :
                            'bg-blue-400'
                          }`} />
                          <div>
                            <p className="text-sm text-white font-medium">{alert.message}</p>
                            <p className="text-xs text-gray-400">Priority: {alert.priority}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500">
                          {alert.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="bg-gray-800 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-400" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { service: 'API Gateway', status: 'online', uptime: '99.9%' },
                      { service: 'Database', status: 'online', uptime: '99.8%' },
                      { service: 'ML Pipeline', status: 'online', uptime: '98.5%' },
                      { service: 'Analytics Engine', status: 'maintenance', uptime: '97.2%' },
                      { service: 'Data Storage', status: 'online', uptime: '99.7%' },
                    ].map((service, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-700 border border-gray-600">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            service.status === 'online' ? 'bg-green-400' :
                            service.status === 'maintenance' ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`} />
                          <div>
                            <p className="text-sm text-white font-medium">{service.service}</p>
                            <p className="text-xs text-gray-400">Uptime: {service.uptime}</p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            service.status === 'online' ? 'text-green-300 border-green-600' :
                            service.status === 'maintenance' ? 'text-yellow-300 border-yellow-600' :
                            'text-red-300 border-red-600'
                          }
                        >
                          {service.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}