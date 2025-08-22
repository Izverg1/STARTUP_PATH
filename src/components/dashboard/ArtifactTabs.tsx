'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Satellite, Target, BarChart3, TrendingUp, TrendingDown, Clock, Eye, Download, Grid3X3, List, X, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock artifact data organized by engine
const ARTIFACTS = {
  'channel-discovery': [
    {
      id: 'cd-1',
      title: 'LinkedIn Sales Navigator Analysis',
      type: 'benchmark',
      engine: 'Channel Discovery',
      timestamp: '2 min ago',
      metrics: { score: 0.92, cpqm: '$145' },
      status: 'fresh',
      details: {
        summary: 'LinkedIn Sales Navigator shows exceptional performance for B2B SaaS targeting.',
        insights: [
          'Conversion rate 340% higher than industry average',
          'Best performing titles: VP of Sales, Head of Growth, Founder',
          'Optimal outreach: Tuesday-Thursday, 9-11 AM EST'
        ],
        recommendations: [
          'Increase LinkedIn budget allocation by 15%',
          'Test video messages for 20% higher response rates',
          'Focus on Series A-B companies with 50-200 employees'
        ],
        data: {
          'Total Leads': '2,847',
          'Qualified Leads': '456',
          'Conversion Rate': '16.0%',
          'Cost per Lead': '$89',
          'Response Rate': '24.3%'
        }
      }
    },
    {
      id: 'cd-2', 
      title: 'Cold Email Sequence Performance',
      type: 'benchmark',
      engine: 'Channel Discovery',
      timestamp: '15 min ago',
      metrics: { score: 0.87, cpqm: '$89' },
      status: 'updated',
      details: {
        summary: 'Multi-touch email sequences performing above industry benchmarks.',
        insights: [
          'Email #3 shows highest conversion rate (8.4%)',
          'Subject lines with numbers perform 23% better',
          'Personalization increases replies by 67%'
        ],
        recommendations: [
          'Extend sequence to 7 touches for better results',
          'A/B test pain point vs value prop openers',
          'Add social proof elements to email #2'
        ],
        data: {
          'Emails Sent': '8,234',
          'Open Rate': '34.2%',
          'Reply Rate': '12.1%',
          'Meeting Rate': '4.3%',
          'Unsubscribe Rate': '0.8%'
        }
      }
    },
    {
      id: 'cd-3',
      title: 'Industry Events ROI Analysis',
      type: 'benchmark',
      engine: 'Channel Discovery',
      timestamp: '1 hr ago',
      metrics: { score: 0.81, cpqm: '$234' },
      status: 'stable',
      details: {
        summary: 'Industry events provide high-quality leads but at premium cost.',
        insights: [
          'SaaStr events generate 3x higher deal value',
          'Sponsorship ROI: 4.2x investment',
          'Best lead generation: speaking slots vs booth presence'
        ],
        recommendations: [
          'Prioritize 3 major events per quarter',
          'Focus on demo theaters over exhibition booths',
          'Implement pre-event nurture campaigns'
        ],
        data: {
          'Events Attended': '12',
          'Leads Generated': '234',
          'Meetings Scheduled': '89',
          'Deals Closed': '14',
          'Average Deal Size': '$28K'
        }
      }
    }
  ],
  'campaign-optimization': [
    {
      id: 'co-1',
      title: 'Email Subject Line A/B Test',
      type: 'copy',
      engine: 'Campaign Optimization',
      timestamp: '5 min ago',
      metrics: { ctr: '4.2%', lift: '+85%' },
      status: 'fresh',
      details: {
        summary: 'A/B testing reveals optimal subject line patterns for higher engagement.',
        insights: [
          'Question-based subjects outperform statements by 85%',
          'Urgency words decrease opens by 12%',
          'Personalized subjects increase CTR by 23%'
        ],
        recommendations: [
          'Implement question-based subject templates',
          'Test curiosity gaps without false urgency',
          'Use recipient name + company for personalization'
        ],
        data: {
          'Variant A Opens': '34.2%',
          'Variant B Opens': '62.8%',
          'Statistical Significance': '99.2%',
          'Sample Size': '12,847',
          'Winner': 'Variant B'
        }
      }
    },
    {
      id: 'co-2',
      title: 'Landing Page Copy Variants',
      type: 'copy',
      engine: 'Campaign Optimization', 
      timestamp: '30 min ago',
      metrics: { ctr: '3.8%', lift: '+62%' },
      status: 'updated',
      details: {
        summary: 'Landing page optimization shows significant conversion improvements.',
        insights: [
          'Value proposition above fold increases conversions 62%',
          'Social proof placement affects trust by 45%',
          'CTA button color testing reveals 23% performance variance'
        ],
        recommendations: [
          'Move value prop to hero section',
          'Add customer logos below headline',
          'Test red vs green CTA buttons'
        ],
        data: {
          'Control Conversion': '2.3%',
          'Test Conversion': '3.8%',
          'Confidence Level': '96.8%',
          'Traffic Split': '50/50',
          'Test Duration': '14 days'
        }
      }
    }
  ],
  'performance-analytics': [
    {
      id: 'pa-1',
      title: 'Channel Performance Trends',
      type: 'calc',
      engine: 'Performance Analytics',
      timestamp: '1 min ago',
      metrics: { trend: '+12.5%', confidence: '94%' },
      status: 'fresh',
      details: {
        summary: 'Cross-channel performance analysis reveals optimization opportunities.',
        insights: [
          'LinkedIn outperforming all channels with 94% confidence',
          'Email sequences show declining performance after touch 5',
          'Content marketing ROI improved 340% quarter-over-quarter'
        ],
        recommendations: [
          'Reallocate 20% budget from events to LinkedIn',
          'Shorten email sequences to 4-5 touches',
          'Double down on high-performing content types'
        ],
        data: {
          'Channel Count': '8',
          'Performance Variance': '67%',
          'Confidence Score': '94%',
          'Data Points': '45,782',
          'Trend Direction': 'Positive'
        }
      }
    },
    {
      id: 'pa-2',
      title: 'Conversion Rate Analysis',
      type: 'calc',
      engine: 'Performance Analytics',
      timestamp: '8 min ago',
      metrics: { trend: '+8.1%', confidence: '89%' },
      status: 'updated',
      details: {
        summary: 'Funnel analysis identifies key conversion bottlenecks and opportunities.',
        insights: [
          'Demo-to-close rate exceeds industry benchmark by 45%',
          'Lead-to-demo conversion needs optimization',
          'Pricing page abandonment rate concerning at 67%'
        ],
        recommendations: [
          'Implement lead scoring for demo qualification',
          'Add pricing transparency to earlier funnel stages',
          'Test demo scheduling friction reduction'
        ],
        data: {
          'Funnel Stages': '7',
          'Overall Conversion': '8.1%',
          'Industry Benchmark': '7.5%',
          'Biggest Drop-off': 'Pricing Page',
          'Top Performer': 'Demo Close'
        }
      }
    }
  ],
  'budget-allocation': [
    {
      id: 'ba-1',
      title: 'Thompson Sampling Results',
      type: 'alloc',
      engine: 'Budget Allocation',
      timestamp: '3 min ago',
      metrics: { reallocation: '$15K', roas: '+65%' },
      status: 'fresh',
      details: {
        summary: 'Thompson Sampling algorithm optimizes budget allocation for maximum ROAS.',
        insights: [
          'LinkedIn budget increased 35% based on performance data',
          'Event spend reduced 22% due to declining conversion rates',
          'Content marketing allocation doubled for Q4 push'
        ],
        recommendations: [
          'Maintain current allocation weights for 30 days',
          'Monitor LinkedIn saturation metrics closely',
          'Prepare contingency budget for emerging channels'
        ],
        data: {
          'Total Budget': '$145K',
          'Reallocation Amount': '$15K',
          'ROAS Improvement': '+65%',
          'Confidence Level': '92%',
          'Channels Optimized': '6'
        }
      }
    }
  ]
}

const ENGINES = [
  { key: 'channel-discovery', name: 'Channel Discovery', icon: Satellite, color: 'cyan' },
  { key: 'campaign-optimization', name: 'Campaign Optimization', icon: Target, color: 'red' },
  { key: 'performance-analytics', name: 'Performance Analytics', icon: BarChart3, color: 'green' },
  { key: 'budget-allocation', name: 'Budget Allocation', icon: TrendingUp, color: 'purple' }
]

// Detailed Artifact Modal Component
function ArtifactDetailModal({ artifact }: { artifact: any }) {
  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black border-red-500/30">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3 text-xl">
          <span className="text-2xl">{getTypeIcon(artifact.type)}</span>
          <div>
            <h2 className="text-white">{artifact.title}</h2>
            <p className="text-sm text-zinc-400 font-normal">{artifact.engine} • {artifact.timestamp}</p>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-red-400" />
              Executive Summary
            </h3>
            <p className="text-gray-300 leading-relaxed">{artifact.details.summary}</p>
          </div>

          {/* Key Insights */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Key Insights
            </h3>
            <ul className="space-y-2">
              {artifact.details.insights.map((insight: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Recommendations
            </h3>
            <ul className="space-y-2">
              {artifact.details.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Data Metrics */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Data Points
          </h3>
          <Card className="bg-zinc-900 border-zinc-700 p-4">
            <div className="space-y-3">
              {Object.entries(artifact.details.data).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">{key}</span>
                  <span className="text-sm font-mono text-white">{String(value)}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="mt-4 space-y-2">
            <Button className="w-full bg-red-600 hover:bg-red-700" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800" size="sm">
              <Maximize2 className="w-4 h-4 mr-2" />
              View in Analytics
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

// Helper function for artifact type icons
function getTypeIcon(type: string) {
  switch (type) {
    case 'benchmark': return '📊'
    case 'copy': return '✏️'
    case 'calc': return '🧮'
    case 'alloc': return '💰'
    default: return '📄'
  }
}

// Enhanced Artifact Card with Modal
function ArtifactCard({ artifact, isCompact = false }: { artifact: any; isCompact?: boolean }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fresh': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'updated': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  if (isCompact) {
    return (
      <Dialog>
        <Card className="bg-black border-red-500/30 p-3 hover:border-red-500/50 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-lg shrink-0">{getTypeIcon(artifact.type)}</span>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-white truncate">{artifact.title}</h4>
                <p className="text-xs text-zinc-400">{artifact.engine}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                {Object.entries(artifact.metrics).slice(0, 1).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-white font-mono">{String(value)}</span>
                  </div>
                ))}
                <Badge className={cn('text-xs', getStatusColor(artifact.status))}>
                  {artifact.status}
                </Badge>
              </div>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-auto w-auto">
                  <Eye className="w-4 h-4 text-zinc-400 hover:text-white" />
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </Card>
        <ArtifactDetailModal artifact={artifact} />
      </Dialog>
    )
  }

  return (
    <Dialog>
      <Card className="bg-black border-red-500/30 p-4 hover:border-red-500/50 transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTypeIcon(artifact.type)}</span>
            <div>
              <h4 className="text-sm font-semibold text-white">{artifact.title}</h4>
              <p className="text-xs text-zinc-400">{artifact.engine}</p>
            </div>
          </div>
          <Badge className={cn('text-xs', getStatusColor(artifact.status))}>
            {artifact.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {Object.entries(artifact.metrics).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="text-zinc-400">{key}:</span>
                <span className="text-white font-mono ml-1">{String(value)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-zinc-500" />
            <span className="text-xs text-zinc-500">{artifact.timestamp}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800">
          <DialogTrigger asChild>
            <button className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors">
              <Eye className="w-3 h-3" />
              View Details
            </button>
          </DialogTrigger>
          <button className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </Card>
      <ArtifactDetailModal artifact={artifact} />
    </Dialog>
  )
}

export function ArtifactTabs() {
  const [activeTab, setActiveTab] = useState('overview')
  const [viewMode, setViewMode] = useState<'auto' | 'cards' | 'list'>('auto')
  const [containerHeight, setContainerHeight] = useState(0)
  const [realArtifacts, setRealArtifacts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Load real artifacts from database
  const loadArtifacts = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      
      console.log('🔍 Loading artifacts from Supabase...')
      console.log('- Supabase client created:', !!supabase)
      
      // Query artifacts from the database
      const { data: artifacts, error } = await supabase
        .from('sg_artifacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      
      console.log('📊 Query result:')
      console.log('- Data:', artifacts)
      console.log('- Error:', error)
      
      if (error) {
        console.error('Error loading artifacts from database:')
        console.error('- Message:', error.message || 'No message')
        console.error('- Code:', error.code || 'No code')
        console.error('- Details:', error.details || 'No details')
        console.error('- Hint:', error.hint || 'No hint')
        console.error('- Full error object:', error)
        console.error('- Error keys:', Object.keys(error))
        setRealArtifacts([])
      } else {
        setRealArtifacts(artifacts || [])
      }
    } catch (error) {
      console.error('Error loading artifacts (unexpected):')
      console.error('- Error:', error)
      console.error('- Error type:', typeof error)
      console.error('- Error constructor:', error?.constructor?.name)
      if (error instanceof Error) {
        console.error('- Message:', error.message)
        console.error('- Stack:', error.stack)
      }
      // Fallback to mock data if real data fails
      setRealArtifacts([])
    } finally {
      setIsLoading(false)
    }
  }

  const getAllArtifacts = () => {
    // Use real artifacts if available, otherwise fall back to mock data
    if (realArtifacts.length > 0) {
      return realArtifacts.map(artifact => ({
        id: artifact.id,
        title: artifact.title,
        type: artifact.type,
        engine: artifact.agent_key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        timestamp: getTimeAgo(artifact.created_at),
        metrics: artifact.json_meta?.metrics || { confidence: artifact.json_meta?.confidence || 'N/A' },
        status: artifact.is_current ? 'fresh' : 'updated',
        details: {
          summary: artifact.md_body ? artifact.md_body.slice(0, 200) + '...' : 'No description available',
          insights: artifact.json_meta?.insights || [
            'Data analysis completed',
            'Performance metrics calculated',
            'Optimization opportunities identified'
          ],
          recommendations: artifact.json_meta?.recommendations || [
            'Review current performance',
            'Consider optimization strategies',
            'Monitor ongoing results'
          ],
          data: artifact.json_meta || {}
        }
      }))
    }
    
    // Fallback to mock data
    return Object.values(ARTIFACTS).flat().sort((a, b) => {
      const timeA = a.timestamp.includes('min') ? parseInt(a.timestamp) : 
                    a.timestamp.includes('hr') ? parseInt(a.timestamp) * 60 : 0
      const timeB = b.timestamp.includes('min') ? parseInt(b.timestamp) : 
                    b.timestamp.includes('hr') ? parseInt(b.timestamp) * 60 : 0
      return timeA - timeB
    })
  }

  // Helper function for time formatting (from ArtifactsSidebar.tsx)
  const getTimeAgo = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Load artifacts on mount
  useEffect(() => {
    loadArtifacts()
  }, [])

  // Responsive layout logic
  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }

    updateContainerHeight()
    window.addEventListener('resize', updateContainerHeight)
    return () => window.removeEventListener('resize', updateContainerHeight)
  }, [activeTab])

  const getOptimalLayout = () => {
    if (viewMode !== 'auto') return viewMode
    
    const artifactCount = getAllArtifacts().length
    if (artifactCount === 0) return 'cards'
    
    // Get viewport dimensions
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    
    // Calculate available space (accounting for sidebar, header, tabs, controls)
    const availableWidth = Math.max(800, viewportWidth - 320) // 320px for sidebar + padding
    const availableHeight = Math.max(400, viewportHeight - 200) // 200px for header + tabs + controls
    
    // Card dimensions
    const minCardWidth = 300
    const cardHeight = 160 // Standard card height
    const gap = 16
    
    // Calculate grid layout
    const maxCardsPerRow = Math.floor((availableWidth + gap) / (minCardWidth + gap))
    const actualCardsPerRow = Math.max(1, Math.min(maxCardsPerRow, 4)) // Max 4 columns
    const requiredRows = Math.ceil(artifactCount / actualCardsPerRow)
    const totalGridHeight = requiredRows * cardHeight + (requiredRows - 1) * gap
    
    // Use list view if:
    // 1. Cards would be too cramped (less than 2 per row and more than 4 artifacts)
    // 2. Grid would exceed available height by more than 20%
    // 3. Cards would be too narrow (less than minCardWidth)
    const shouldUseList = (
      (actualCardsPerRow < 2 && artifactCount > 4) ||
      totalGridHeight > availableHeight * 1.2 ||
      (availableWidth / actualCardsPerRow - gap) < minCardWidth
    )
    
    return shouldUseList ? 'list' : 'cards'
  }

  const shouldUseListView = getOptimalLayout() === 'list'

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="bg-zinc-800 border-2 border-zinc-500 p-1 mb-6 shrink-0 shadow-xl">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
          >
            📊 Overview
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
          >
            📈 Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="artifacts" 
            className="data-[state=active]:bg-magenta-500/20 data-[state=active]:text-magenta-300 text-zinc-400"
          >
            🤖 AI Artifacts
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Performance Metrics */}
        <TabsContent value="overview" className="flex-1 overflow-y-auto p-6">
          {/* Performance Metrics Grid - No duplicate headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-black border border-green-500/30 p-4 hover:border-green-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-xs text-green-300 flex items-center gap-1 bg-green-900/20 px-2 py-1 rounded">
                    ↑ +12.5%
                  </span>
                </div>
                <p className="text-xs text-gray-300 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-white">$1,250K</p>
                <p className="text-xs text-gray-400">Last 30 days</p>
              </Card>

              <Card className="bg-black border border-blue-500/30 p-4 hover:border-blue-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs text-blue-300 flex items-center gap-1 bg-blue-900/20 px-2 py-1 rounded">
                    ↑ +5.2%
                  </span>
                </div>
                <p className="text-xs text-gray-300 mb-1">New Customers</p>
                <p className="text-2xl font-bold text-white">89</p>
                <p className="text-xs text-gray-400">Last 30 days</p>
              </Card>

              <Card className="bg-black border border-cyan-500/30 p-4 hover:border-cyan-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs text-cyan-300 flex items-center gap-1 bg-cyan-900/20 px-2 py-1 rounded">
                    ↑ +8.1%
                  </span>
                </div>
                <p className="text-xs text-gray-300 mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">3.4%</p>
                <p className="text-xs text-gray-400">Industry: 3.0%</p>
              </Card>

              <Card className="bg-black border border-purple-500/30 p-4 hover:border-purple-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-xs text-purple-300 flex items-center gap-1 bg-purple-900/20 px-2 py-1 rounded">
                    ↑ +15.3%
                  </span>
                </div>
                <p className="text-xs text-gray-300 mb-1">Avg Deal Size</p>
                <p className="text-2xl font-bold text-white">$14.5K</p>
                <p className="text-xs text-gray-400">YC Avg: $12K</p>
              </Card>
            </div>
        </TabsContent>

        {/* Analytics Tab - Deep GTM Analysis */}
        <TabsContent value="analytics" className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CPQM Analysis */}
            <Card className="bg-black border border-red-500/30 p-6 hover:border-red-500/50 transition-colors">
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
              </div>
            </Card>

            {/* CAC Analysis */}
            <Card className="bg-black border border-blue-500/30 p-6 hover:border-blue-500/50 transition-colors">
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
              </div>
            </Card>

            {/* Payback Period */}
            <Card className="bg-black border border-yellow-500/30 p-6 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Payback Period</h3>
                <TrendingUp className="w-5 h-5 text-yellow-400" />
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
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* AI Artifacts Tab - Engine Outputs */}
        <TabsContent value="artifacts" className="flex-1 overflow-hidden" ref={containerRef}>
          {/* View Mode Controls */}
          <div className="flex items-center justify-between mb-4 px-6">
            <div>
              <h2 className="text-lg font-semibold text-white">AI Artifacts</h2>
              <p className="text-sm text-zinc-400">
                {isLoading ? 'Loading...' : realArtifacts.length > 0 ? 
                  `${getAllArtifacts().length} artifacts generated` : 
                  `${getAllArtifacts().length} demo artifacts • No database connection`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">View:</span>
              <Button
                variant={viewMode === 'auto' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('auto')}
                className={cn(
                  "h-7 px-2 text-xs",
                  viewMode === 'auto' 
                    ? 'bg-magenta-500/20 text-magenta-300 border-magenta-500/50' 
                    : 'border-zinc-600 text-zinc-400 hover:text-white'
                )}
                title={viewMode === 'auto' ? `Auto-detected: ${shouldUseListView ? 'List' : 'Cards'}` : 'Automatic layout switching'}
              >
                Auto {viewMode === 'auto' && (
                  <span className="ml-1 text-xs opacity-70">
                    ({shouldUseListView ? 'List' : 'Cards'})
                  </span>
                )}
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className={cn(
                  "h-7 px-2 text-xs",
                  viewMode === 'cards' 
                    ? 'bg-magenta-500/20 text-magenta-300 border-magenta-500/50' 
                    : 'border-zinc-600 text-zinc-400 hover:text-white'
                )}
              >
                <Grid3X3 className="w-3 h-3 mr-1" />
                Cards
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-7 px-2 text-xs",
                  viewMode === 'list' 
                    ? 'bg-magenta-500/20 text-magenta-300 border-magenta-500/50' 
                    : 'border-zinc-600 text-zinc-400 hover:text-white'
                )}
              >
                <List className="w-3 h-3 mr-1" />
                List
              </Button>
            </div>
          </div>

          {/* Dynamic Layout */}
          <div className="flex-1 overflow-y-auto px-6">
            {isLoading ? (
              /* Loading State */
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-magenta-500 mx-auto mb-3"></div>
                  <p className="text-sm text-zinc-400">Loading artifacts...</p>
                </div>
              </div>
            ) : getAllArtifacts().length === 0 ? (
              /* Empty State */
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <div className="text-4xl mb-3">🤖</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Showing Demo Artifacts</h3>
                  <p className="text-sm text-zinc-400 mb-4 max-w-md">
                    You're viewing sample artifacts to demonstrate how AI agents generate performance analyses, 
                    copy optimizations, and budget allocations. Real artifacts would appear here when connected to a live project.
                  </p>
                  <Button 
                    onClick={loadArtifacts}
                    className="bg-magenta-500/20 text-magenta-300 border-magenta-500/50 hover:bg-magenta-500/30"
                  >
                    Try Refresh
                  </Button>
                </div>
              </div>
            ) : shouldUseListView ? (
              /* List View */
              <div className="space-y-2">
                {getAllArtifacts().map((artifact) => (
                  <ArtifactCard key={artifact.id} artifact={artifact} isCompact={true} />
                ))}
              </div>
            ) : (
              /* Card Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {getAllArtifacts().map((artifact) => (
                  <ArtifactCard key={artifact.id} artifact={artifact} isCompact={false} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}