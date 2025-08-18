'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tutorial } from '@/components/dashboard/Tutorial'
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
    if (!tutorialCompleted) {
      setShowTutorial(true)
    }

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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-950 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">GTM Command Center</h1>
              <p className="text-gray-400 mt-1">Real-time optimization matrix • Live channel performance</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-px h-8 bg-gray-800" />
              <div className="text-right">
                <p className="text-sm text-white font-medium">Demo User</p>
                <p className="text-xs text-gray-400">demo@startuply.space</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Live Analytics Bar */}
          <div className="live-analytics mb-6 bg-gray-950 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Live Analytics</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">Real-time GTM optimization data streams here</span>
              </div>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-600 to-red-500 animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="metrics-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-950 border-gray-800 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  +12.5% (30d)
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(liveData.revenue)}</p>
            </Card>

            <Card className="bg-gray-950 border-gray-800 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-xs text-red-500 flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  +5.2% (30d)
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-1">New Customers</p>
              <p className="text-2xl font-bold text-white">{liveData.customers}</p>
            </Card>

            <Card className="bg-gray-950 border-gray-800 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Target className="w-5 h-5 text-cyan-500" />
                </div>
                <span className="text-xs text-cyan-500 flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  +8.1% (30d)
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">{liveData.conversion.toFixed(1)}%</p>
            </Card>

            <Card className="bg-gray-950 border-gray-800 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gray-700/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  +15.3% (30d)
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-1">Avg Deal Size</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(liveData.dealSize)}</p>
            </Card>
          </div>

          {/* Analysis Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CPQM Analysis */}
            <Card className="cpqm-analysis bg-gray-950 border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  CPQM Analysis
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </h3>
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Cost Per Qualified Meeting</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-white">$485</p>
                    <span className="text-sm text-red-500">↓ -8.5%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current:</span>
                    <span className="text-white font-medium">$485</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-200">Target:</span>
                    <span className="text-green-500 font-medium">$400</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-200">Benchmark Range</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-gray-800 rounded h-1">
                      <div className="bg-gray-500 h-1 rounded" style={{ width: '30%' }} />
                    </div>
                    <span className="text-xs text-gray-200">$350-$750</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* CAC Analysis */}
            <Card className="cac-analysis bg-gray-950 border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  CAC Analysis
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Customer Acquisition Cost</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-white">$1,850</p>
                    <span className="text-sm text-green-500">↑ 5.2%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current:</span>
                    <span className="text-white font-medium">$1,850</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-200">Target:</span>
                    <span className="text-green-500 font-medium">$1,500</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-200">Payback Analysis</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-white font-medium">8.5 months</span>
                    <span className="text-xs text-gray-200">Target: 6.0mo</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payback Period */}
            <Card className="bg-gray-950 border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Payback Period</h3>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">CAC Payback</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-white">8.5mo</p>
                    <span className="text-sm text-yellow-500">→ 0.8%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current:</span>
                    <span className="text-white font-medium">8.5 months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-200">Target:</span>
                    <span className="text-green-500 font-medium">6.0 months</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-600 to-orange-500 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-200 mb-2">Risk Factors</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-xs text-gray-200">Rising acquisition costs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full" />
                      <span className="text-xs text-gray-200">Longer sales cycles</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}