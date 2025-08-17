'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  RefreshCw
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function BenchmarksPage() {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 py-6">
        <div className="min-w-[1400px] space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Telemetry Station
          </h1>
          <p className="text-blue-200/70 mt-2">
            Monitor your Startup_Path performance metrics and system health
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Grid */}
      <div className="flex gap-6 pb-4">
        <Card className="bg-green-900/20 border-green-500/30 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-300 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">98.5%</div>
            <p className="text-xs text-green-200/60 mt-1">All systems operational</p>
            <Progress value={98.5} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="bg-blue-900/20 border-blue-500/30 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-300 flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Processing Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">42%</div>
            <p className="text-xs text-blue-200/60 mt-1">CPU utilization</p>
            <Progress value={42} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="bg-purple-900/20 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">2.4TB</div>
            <p className="text-xs text-purple-200/60 mt-1">Of 5TB used</p>
            <Progress value={48} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="bg-cyan-900/20 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-cyan-300 flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Network Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">12ms</div>
            <p className="text-xs text-cyan-200/60 mt-1">Average response time</p>
            <Progress value={88} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Benchmarks */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
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
                  <span className="text-sm text-blue-200">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={
                        metric.status === 'excellent' ? 'text-green-400 border-green-400/30' :
                        metric.status === 'good' ? 'text-blue-400 border-blue-400/30' :
                        'text-yellow-400 border-yellow-400/30'
                      }
                    >
                      {metric.value}%
                    </Badge>
                    <span className="text-xs text-gray-400">
                      Benchmark: {metric.benchmark}%
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={metric.value} className="h-2" />
                  <div 
                    className="absolute top-0 w-0.5 h-2 bg-white/50"
                    style={{ left: `${metric.benchmark}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="flex gap-6 pb-4">
        <div className="min-w-[600px]">
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '2 min ago', event: 'New channel discovered: TikTok Ads', type: 'success' },
                { time: '15 min ago', event: 'Budget reallocation completed', type: 'info' },
                { time: '1 hour ago', event: 'Signal anomaly detected in Google Ads', type: 'warning' },
                { time: '3 hours ago', event: 'Weekly performance report generated', type: 'info' },
                { time: '5 hours ago', event: 'Experiment #42 completed successfully', type: 'success' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    item.type === 'success' ? 'bg-green-400' :
                    item.type === 'warning' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{item.event}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>

        <div className="min-w-[600px]">
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { level: 'warning', message: 'LinkedIn Ads efficiency dropping', action: 'Review' },
                { level: 'info', message: 'New industry benchmark available', action: 'Update' },
                { level: 'success', message: 'All systems running optimally', action: null },
                { level: 'warning', message: 'Budget utilization at 85%', action: 'Adjust' },
                { level: 'info', message: 'Scheduled maintenance in 48 hours', action: 'Prepare' },
              ].map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.level === 'warning' ? 'bg-yellow-400' :
                      alert.level === 'success' ? 'bg-green-400' :
                      'bg-blue-400'
                    }`} />
                    <p className="text-sm text-white">{alert.message}</p>
                  </div>
                  {alert.action && (
                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                      {alert.action}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}