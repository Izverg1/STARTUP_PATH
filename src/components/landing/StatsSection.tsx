'use client'

import { Card } from '@/components/ui/card'
import { TrendingDown, TrendingUp, Zap, DollarSign, Users, Target, Clock, BarChart3 } from 'lucide-react'

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string
  description: string
  trend?: 'up' | 'down' | 'neutral'
  highlight?: boolean
}

function StatCard({ icon: Icon, label, value, description, trend, highlight }: StatCardProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null

  return (
    <Card className={`relative p-6 bg-white border-gray-200 hover:border-blue-300/30 transition-all duration-300 group ${highlight ? 'ring-1 ring-blue-300/20' : ''}`}>
      {/* Highlight glow for important stats */}
      {highlight && (
        <div className="absolute inset-0 bg-blue-50/5 rounded-lg" />
      )}
      
      <div className="relative space-y-4">
        {/* Icon and trend */}
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${highlight ? 'bg-blue-50/20' : 'bg-gray-800'} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${highlight ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
          {TrendIcon && (
            <TrendIcon className={`w-5 h-5 ${trendColors[trend!]}`} />
          )}
        </div>

        {/* Value */}
        <div className="space-y-1">
          <div className={`text-3xl font-bold ${highlight ? 'text-red-500' : 'text-gray-900'}`}>
            {value}
          </div>
          <div className="text-sm font-medium text-gray-300">
            {label}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  )
}

interface StatsSectionProps {
  className?: string
}

export function StatsSection({ className }: StatsSectionProps) {
  const benchmarkStats = [
    {
      icon: Users,
      label: 'Cold Email Reply Rate',
      value: '1-5%',
      description: 'Industry standard for early-stage startups doing founder-led outreach',
      trend: 'down' as const,
      highlight: false
    },
    {
      icon: Target,
      label: 'Google Ads Conversion',
      value: '~7%',
      description: 'Overall conversion rate, but often higher CAC for startups',
      trend: 'neutral' as const,
      highlight: false
    },
    {
      icon: BarChart3,
      label: 'Webinar Attendance',
      value: '35-45%',
      description: 'Of registrants actually attend - a viable growth hack',
      trend: 'up' as const,
      highlight: true
    },
    {
      icon: DollarSign,
      label: 'Target CAC Payback',
      value: '12-18mo',
      description: 'What VCs want to see before Series A funding',
      trend: 'up' as const,
      highlight: true
    }
  ]

  const optimizationStats = [
    {
      icon: Zap,
      label: 'CPQM Reduction',
      value: '15-20%',
      description: 'Blended Cost Per Qualified Meeting improvement through smart allocation',
      trend: 'up' as const,
      highlight: true
    },
    {
      icon: Clock,
      label: 'Experiment Cycle',
      value: '14 days',
      description: 'Rapid iteration cycles using Thompson Sampling for channel optimization',
      trend: 'up' as const,
      highlight: true
    },
    {
      icon: TrendingUp,
      label: 'Runway Extension',
      value: '30%+',
      description: 'Average runway extension through burn rate optimization',
      trend: 'up' as const,
      highlight: true
    },
    {
      icon: Target,
      label: 'PMF Discovery',
      value: '3x faster',
      description: 'Accelerated product-market fit through simulated testing',
      trend: 'up' as const,
      highlight: true
    }
  ]

  return (
    <section className={`py-24 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Industry Benchmarks */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">
              Industry Benchmarks
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Understanding the harsh realities of early-stage distribution and why most founders burn through their runway without reaching PMF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benchmarkStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* SOL:GEN Optimization */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">
              SOL:GEN Optimization
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              How our scientific approach to channel fit simulation helps founders optimize burn rate and accelerate PMF discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {optimizationStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Runway Optimization Example */}
        <div className="bg-gradient-to-br from-[#0066FF]/10 to-transparent rounded-2xl p-8 border border-[#0066FF]/20">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Runway Optimization Example</h3>
              <p className="text-zinc-400">Real impact on your burn rate and qualified meetings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-sm text-zinc-400">Monthly Test Budget</div>
                <div className="text-3xl font-bold text-gray-900">$10k</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-zinc-400">Reallocation Impact</div>
                <div className="text-3xl font-bold text-[#0066FF]">30% shift</div>
                <div className="text-xs text-zinc-500">From $600 CPQM to $300 CPQM channel</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-zinc-400">Blended CPQM Reduction</div>
                <div className="text-3xl font-bold text-green-400">15-20%</div>
                <div className="text-xs text-zinc-500">More qualified meetings per dollar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}