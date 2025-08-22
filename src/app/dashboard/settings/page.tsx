'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Bell, 
  Zap, 
  Shield, 
  Palette,
  Database,
  Clock,
  Bot,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Agent Settings
    agentAutomation: 'guided', // guided, automatic, manual
    notificationLevel: 'important', // all, important, critical
    agentInsightFrequency: 'real-time', // real-time, hourly, daily
    
    // Notification Preferences
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    
    // Performance Thresholds
    cpqmThreshold: 200,
    cac_payback_threshold: 12,
    conversionRateThreshold: 0.03,
    
    // Platform Preferences
    theme: 'dark',
    timeZone: 'PST',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY'
  })

  const [hasChanges, setHasChanges] = useState(false)

  const handleSave = () => {
    // TODO: Save settings
    setHasChanges(false)
  }

  const agentSettings = [
    {
      name: 'Channel Discovery Engine',
      icon: '🔍',
      description: 'Channel discovery and recommendation frequency',
      status: 'active',
      lastRun: '2 hours ago',
      settings: {
        frequency: 'daily',
        confidence_threshold: 0.8,
        max_recommendations: 5
      }
    },
    {
      name: 'Campaign Optimization Engine',
      icon: '✨', 
      description: 'Copy generation and A/B testing automation',
      status: 'active',
      lastRun: '30 minutes ago',
      settings: {
        auto_generate: true,
        variant_count: 4,
        tone_preference: 'professional'
      }
    },
    {
      name: 'Performance Analytics Engine',
      icon: '📊',
      description: 'Performance monitoring and anomaly detection',
      status: 'active',
      lastRun: '5 minutes ago',
      settings: {
        monitoring_interval: 'real-time',
        alert_sensitivity: 'medium',
        forecast_horizon: 30
      }
    },
    {
      name: 'Budget Allocation Engine',
      icon: '💰',
      description: 'Budget optimization and allocation strategy',
      status: 'active',
      lastRun: '1 hour ago',
      settings: {
        rebalance_frequency: 'weekly',
        strategy: 'thompson_sampling',
        risk_tolerance: 'medium'
      }
    }
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-1">Configure your platform preferences and agent behavior</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              disabled={!hasChanges}
              className="bg-green-600/20 border-green-500/30 hover:bg-green-600/30 text-green-400 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              variant="outline"
              className="bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20 text-blue-400"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-600/10 rounded-lg border border-purple-500/20">
                  <Bot className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Agent Configuration</h2>
                  <p className="text-gray-400 text-sm">Configure how your AI agents operate and interact</p>
                </div>
              </div>

              <div className="space-y-6">
                {agentSettings.map((agent, index) => (
                  <div key={index} className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/30">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{agent.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{agent.name}</h3>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                agent.status === 'active' 
                                  ? 'border-green-500/30 text-green-400 bg-green-600/10' 
                                  : 'border-gray-600 text-gray-400'
                              }`}
                            >
                              {agent.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">{agent.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Last run: {agent.lastRun}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20 text-blue-400"
                      >
                        Configure
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {Object.entries(agent.settings).map(([key, value]) => (
                        <div key={key} className="bg-slate-900/50 p-2 rounded">
                          <span className="text-gray-400 capitalize">{key.replace('_', ' ')}:</span>
                          <span className="text-white ml-2">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Performance Thresholds */}
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-600/10 rounded-lg border border-orange-500/20">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Performance Thresholds</h2>
                  <p className="text-gray-400 text-sm">Set alert thresholds for key performance metrics</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CPQM Alert Threshold</label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number"
                      value={settings.cpqmThreshold}
                      onChange={(e) => setSettings({...settings, cpqmThreshold: Number(e.target.value)})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                    <span className="text-gray-400 text-sm">USD</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CAC Payback (Months)</label>
                  <Input 
                    type="number"
                    value={settings.cac_payback_threshold}
                    onChange={(e) => setSettings({...settings, cac_payback_threshold: Number(e.target.value)})}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Conversion Rate</label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number"
                      step="0.001"
                      value={settings.conversionRateThreshold}
                      onChange={(e) => setSettings({...settings, conversionRateThreshold: Number(e.target.value)})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                    <span className="text-gray-400 text-sm">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notification Level</label>
                  <Select 
                    value={settings.notificationLevel}
                    onValueChange={(value) => setSettings({...settings, notificationLevel: value})}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="important">Important Only</SelectItem>
                      <SelectItem value="critical">Critical Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          {/* Platform Preferences Sidebar */}
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-600/10 rounded-lg border border-blue-500/20">
                  <Settings className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Platform</h2>
                  <p className="text-gray-400 text-sm">General preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                  <Select 
                    value={settings.theme}
                    onValueChange={(value) => setSettings({...settings, theme: value})}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time Zone</label>
                  <Select 
                    value={settings.timeZone}
                    onValueChange={(value) => setSettings({...settings, timeZone: value})}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PST">Pacific (PST)</SelectItem>
                      <SelectItem value="EST">Eastern (EST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                  <Select 
                    value={settings.currency}
                    onValueChange={(value) => setSettings({...settings, currency: value})}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-600/10 rounded-lg border border-yellow-500/20">
                  <Bell className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Notifications</h2>
                  <p className="text-gray-400 text-sm">Alert preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Email Notifications</p>
                    <p className="text-xs text-gray-400">Receive alerts via email</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Push Notifications</p>
                    <p className="text-xs text-gray-400">Browser notifications</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Weekly Reports</p>
                    <p className="text-xs text-gray-400">Performance summaries</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.weeklyReports}
                      onChange={(e) => setSettings({...settings, weeklyReports: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Data & Privacy */}
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-600/10 rounded-lg border border-green-500/20">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Data & Privacy</h2>
                  <p className="text-gray-400 text-sm">Security settings</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  variant="outline"
                  className="w-full justify-start bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20 text-blue-400"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start bg-orange-600/10 border-orange-500/20 hover:bg-orange-600/20 text-orange-400"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}