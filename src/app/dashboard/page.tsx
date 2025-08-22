'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tutorial } from '@/components/dashboard/Tutorial'
import { AgentCards } from '@/components/dashboard/AgentCards'
import { ArtifactTabs } from '@/components/dashboard/ArtifactTabs'
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
    <div className="h-full flex flex-col">
      {/* Tutorial Overlay */}
      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}

      {/* Dashboard Content - Optimized for space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ArtifactTabs />
      </div>

      {/* Footer */}
      <div className="px-6 py-2 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            © 2025 <a href="https://iamkarlson.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">KARLSON LLC</a>. All rights reserved.
          </div>
          <div className="text-xs text-gray-500">
            STARTUP_PATH Platform v1.0
          </div>
        </div>
      </div>
    </div>
  )
}