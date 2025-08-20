'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tutorial } from '@/components/dashboard/Tutorial'
import { AgentCards } from '@/components/dashboard/AgentCards'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Target,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Brain,
  Zap,
  Activity,
  Settings,
  HelpCircle,
  Bell,
  Menu,
  X,
  ArrowUp,
  ArrowDown,
  Gauge
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [liveData, setLiveData] = useState({
    revenue: 1250000,
    customers: 89,
    conversion: 3.4,
    dealSize: 14500
  })

  useEffect(() => {
    // Check if tutorial has been completed
    const tutorialCompleted = localStorage.getItem('tutorialCompleted')
    // Disable auto-tutorial for better dashboard visibility
    // if (!tutorialCompleted) {
    //   setShowTutorial(true)
    // }

    // Simulate live data updates
    const interval = setInterval(() => {
      setLiveData(prev => ({
        revenue: prev.revenue + Math.floor(Math.random() * 5000 - 2000),
        customers: prev.customers + (Math.random() > 0.7 ? 1 : 0),
        conversion: Math.max(0, Math.min(10, prev.conversion + (Math.random() - 0.5) * 0.1)),
        dealSize: prev.dealSize + Math.floor(Math.random() * 500 - 250)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Tutorial Overlay */}
      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}

      {/* Agent Dock - Left Sidebar (96px) */}
      <div className="w-24 bg-black/80 border-r border-red-500/20 p-3 flex flex-col items-center">
        <div className="mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-black/20 rounded-lg flex items-center justify-center border border-red-500/30">
            <Rocket className="w-6 h-6 text-red-400" />
          </div>
        </div>
        
        {/* Professional Agent Cards */}
        <AgentCards layout="vertical" size="small" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Professional Header */}
        <header className="bg-gradient-to-r from-red-900/20 to-black/80 border-b border-red-500/20 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* 4 Engines Vertical Display */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-600/20 to-black/60 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <span className="text-xs text-cyan-300 font-medium">Channel Discovery Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600/20 to-black/60 border border-red-500/30 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                  </div>
                  <span className="text-xs text-red-300 font-medium">Campaign Optimization Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600/20 to-black/60 border border-green-500/30 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <span className="text-xs text-green-300 font-medium">Performance Analytics Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600/20 to-black/60 border border-purple-500/30 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  </div>
                  <span className="text-xs text-gray-300 font-medium">Budget Allocation Engine</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-300 hover:text-red-400 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-px h-8 bg-red-500/30" />
              <div className="text-right">
                <p className="text-sm text-white font-medium">Demo User</p>
                <p className="text-xs text-red-400">user@startuppath.ai</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Live Analytics Bar */}
          <div className="live-analytics mb-6 bg-black/40 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Live Analytics</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-200">Real-time GTM optimization data streams</span>
              </div>
            </div>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Performance Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-black/40 border border-green-500/20 p-4 hover:border-green-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-xs text-green-300 flex items-center gap-1 bg-green-900/20 px-2 py-1 rounded">
                    <ArrowUp className="w-3 h-3" />
                    +12.5%
                  </span>
                </div>
                <p className="text-xs text-gray-300 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(liveData.revenue)}</p>
                <p className="text-xs text-gray-400">Last 30 days</p>
              </Card>

              <Card className="bg-black/40 border border-blue-500/20 p-4 hover:border-blue-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs text-blue-300 flex items-center gap-1 bg-blue-900/20 px-2 py-1 rounded">
                    <ArrowUp className="w-3 h-3" />
                    +5.2%
                  </span>
                </div>
                <p className="text-xs text-gray-300 mb-1">New Customers</p>
                <p className="text-2xl font-bold text-white">{liveData.customers}</p>
                <p className="text-xs text-gray-400">Last 30 days</p>
              </Card>

              <Card className="bg-black/40 border border-cyan-500/20 p-4 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Target className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs text-cyan-300 flex items-center gap-1 bg-cyan-900/20 px-2 py-1 rounded">
                    <ArrowUp className="w-3 h-3" />
                    +8.1%
                  </span>
                </div>
                <p className="text-xs text-gray-300 mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">{liveData.conversion.toFixed(1)}%</p>
                <p className="text-xs text-gray-400">Industry: 3.0%</p>
              </Card>

              <Card className="bg-black/40 border border-purple-500/20 p-4 hover:border-purple-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-xs text-purple-300 flex items-center gap-1 bg-purple-900/20 px-2 py-1 rounded">
                    <ArrowUp className="w-3 h-3" />
                    +15.3%
                  </span>
                </div>
                <p className="text-xs text-gray-300 mb-1">Avg Deal Size</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(liveData.dealSize)}</p>
                <p className="text-xs text-gray-400">YC Avg: $12K</p>
              </Card>
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              GTM Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* CPQM Analysis */}
              <Card className="bg-black/40 border border-red-500/20 p-6 hover:border-red-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    CPQM Analysis
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  </h3>
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Cost Per Qualified Meeting</p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-3xl font-bold text-white">$485</p>
                      <span className="text-sm text-red-300 bg-red-900/20 px-2 py-1 rounded">↓ -8.5%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Current:</span>
                      <span className="text-white font-medium">$485</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Target:</span>
                      <span className="text-green-400 font-medium">$400</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-600">
                    <p className="text-xs text-gray-300 mb-2">Benchmark Range</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">$350-$750</span>
                      <span className="text-xs text-yellow-400">Above target</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* CAC Analysis */}
              <Card className="bg-black/40 border border-blue-500/20 p-6 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    CAC Analysis
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  </h3>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Customer Acquisition Cost</p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-3xl font-bold text-white">$1,850</p>
                      <span className="text-sm text-green-300 bg-green-900/20 px-2 py-1 rounded">↑ 5.2%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Current:</span>
                      <span className="text-white font-medium">$1,850</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Target:</span>
                      <span className="text-green-400 font-medium">$1,500</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-600">
                    <p className="text-xs text-gray-300 mb-2">Payback Analysis</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white font-medium">8.5 months</span>
                      <span className="text-xs text-gray-400">Target: 6.0mo</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payback Period */}
              <Card className="bg-black/40 border border-yellow-500/20 p-6 hover:border-yellow-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Payback Period</h3>
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">CAC Payback</p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-3xl font-bold text-white">8.5mo</p>
                      <span className="text-sm text-yellow-300 bg-yellow-900/20 px-2 py-1 rounded">→ 0.8%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Current:</span>
                      <span className="text-white font-medium">8.5 months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Target:</span>
                      <span className="text-green-400 font-medium">6.0 months</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-600">
                    <p className="text-xs text-gray-300 mb-2">Risk Factors</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                        <span className="text-xs text-gray-300">Rising acquisition costs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full" />
                        <span className="text-xs text-gray-300">Longer sales cycles</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}