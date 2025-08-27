'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { 
  Building2, 
  Target,
  DollarSign,
  Play,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Activity,
  Settings,
  ExternalLink,
  FlaskConical,
  BarChart3,
  TrendingUp,
  Shield,
  Users,
  Bot
} from 'lucide-react'
import Link from 'next/link'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useCurrentProject } from '@/contexts/ProjectContext'
import { useExperiments } from '@/hooks/useExperiments'
import { WelcomeGuide } from '@/components/onboarding/WelcomeGuide'

export default function CommandCenterPage() {
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false)

  // Show welcome guide for new users
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('startup-path-welcome-seen')
    if (!hasSeenGuide) {
      const timer = setTimeout(() => {
        setShowWelcomeGuide(true)
      }, 1000) // Show after 1 second
      return () => clearTimeout(timer)
    }
  }, [])

  const handleCloseWelcomeGuide = () => {
    setShowWelcomeGuide(false)
    localStorage.setItem('startup-path-welcome-seen', 'true')
  }
  
  // Use current user, project, and experiments hooks
  const { user, organization, loading: userLoading } = useCurrentUser()
  const { currentProject, isLoading: projectLoading } = useCurrentProject()
  const { 
    experiments,
    activeExperiments,
    completedExperiments,
    summary,
    loading: experimentsLoading,
    error: experimentsError,
    refetch: refetchExperiments
  } = useExperiments({ 
    projectId: currentProject?.id,
    orgId: !currentProject?.id ? organization?.id : undefined, // Fallback to org if no project
    autoRefresh: true,
    refreshInterval: 30000
  })

  const loading = userLoading || projectLoading || experimentsLoading
  


  // Loading state
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading Command Center...
        </div>
      </div>
    )
  }

  // Authentication check - redirect to login if no user
  if (!user) {
    window.location.href = '/login'
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          Redirecting to login...
        </div>
      </div>
    )
  }

  // Project/experiments loading state (after auth is confirmed)
  if (projectLoading || experimentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading projects and experiments...
        </div>
      </div>
    )
  }

  // Error state
  if (experimentsError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">Failed to load experiments</p>
          <Button onClick={refetchExperiments} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // No organization state
  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Building2 className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
          <p className="text-yellow-400 mb-2">Organization Required</p>
          <p className="text-gray-400 text-sm">Please join or create an organization to manage experiments.</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-sm font-medium uppercase tracking-wide">Project Case:</span>
                <span className="text-white/70 text-sm">{currentProject?.name || 'All Projects'}</span>
              </div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-400" />
                {currentProject ? `${currentProject.name} Dashboard` : 'Project Overview'}
              </h1>
              <p className="text-gray-400">
                {currentProject 
                  ? `Track market traction and GTM performance for ${currentProject.name}. All experiments, agents, and insights roll up to this project.`
                  : 'Project-based case management system for tracking startup market traction and GTM performance.'
                }
              </p>
            </div>
          </div>
          
          <Link href="/dashboard/experiments">
            <Button className="bg-orange-600/20 border-orange-500/30 hover:bg-orange-600/30 text-orange-400">
              <FlaskConical className="w-4 h-4 mr-2" />
              Manage Experiments
            </Button>
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/10 rounded border border-green-500/20">
                <Play className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Experiments</p>
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
                <p className="text-sm text-gray-400">Total Budget</p>
                <p className="text-xl font-bold text-white">${summary.totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/10 rounded border border-purple-500/20">
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-xl font-bold text-white">
                  {experiments.length > 0 
                    ? Math.round((completedExperiments.length / experiments.length) * 100)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-900/50 border-slate-700/50 mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/dashboard/experiments">
                  <Card className="bg-slate-800/50 border-slate-700/50 p-4 hover:bg-slate-800/70 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-600/10 rounded border border-orange-500/20 group-hover:bg-orange-600/20 transition-colors">
                        <FlaskConical className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Manage Experiments</p>
                        <p className="text-gray-400 text-sm">Design and run A/B tests</p>
                      </div>
                    </div>
                  </Card>
                </Link>
                
                <Link href="/dashboard/effectiveness">
                  <Card className="bg-slate-800/50 border-slate-700/50 p-4 hover:bg-slate-800/70 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-600/10 rounded border border-cyan-500/20 group-hover:bg-cyan-600/20 transition-colors">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">View Performance</p>
                        <p className="text-gray-400 text-sm">CAC, LTV, and payback metrics</p>
                      </div>
                    </div>
                  </Card>
                </Link>
                
                <Link href="/dashboard/benchmarks">
                  <Card className="bg-slate-800/50 border-slate-700/50 p-4 hover:bg-slate-800/70 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600/10 rounded border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Analytics Dashboard</p>
                        <p className="text-gray-400 text-sm">Deep-dive into YC benchmarks</p>
                      </div>
                    </div>
                  </Card>
                </Link>
                
                <Link href="/dashboard/rules">
                  <Card className="bg-slate-800/50 border-slate-700/50 p-4 hover:bg-slate-800/70 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-600/10 rounded border border-green-500/20 group-hover:bg-green-600/20 transition-colors">
                        <Shield className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Business Rules</p>
                        <p className="text-gray-400 text-sm">Automated budget & bidding rules</p>
                      </div>
                    </div>
                  </Card>
                </Link>
                
                <Link href="/dashboard/collaboration">
                  <Card className="bg-slate-800/50 border-slate-700/50 p-4 hover:bg-slate-800/70 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-600/10 rounded border border-purple-500/20 group-hover:bg-purple-600/20 transition-colors">
                        <Users className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Team Collaboration</p>
                        <p className="text-gray-400 text-sm">Share insights & decision logs</p>
                      </div>
                    </div>
                  </Card>
                </Link>
                
                <Link href="/dashboard/assistant">
                  <Card className="bg-slate-800/50 border-slate-700/50 p-4 hover:bg-slate-800/70 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-600/10 rounded border border-red-500/20 group-hover:bg-red-600/20 transition-colors">
                        <Bot className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">GTM Assistant</p>
                        <p className="text-gray-400 text-sm">AI-powered strategic advice</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            
            {experiments.length === 0 && currentProject && (
              <div className="col-span-full mt-6 p-6 bg-slate-800/30 border border-slate-700/30 rounded-lg text-center">
                <FlaskConical className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="text-white font-medium mb-2">Ready to Start Tracking Traction?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Your project "{currentProject.name}" is set up. Create your first experiment to start validating GTM channels and tracking market traction.
                </p>
                <Button 
                  onClick={() => setShowWelcomeGuide(true)}
                  variant="outline"
                  className="bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20 text-blue-400"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Getting Started Guide
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Welcome Guide for New Users */}
        <WelcomeGuide 
          isOpen={showWelcomeGuide} 
          onClose={handleCloseWelcomeGuide} 
        />
        
        {/* Force scrollable content to test red scrollbar */}
        <div className="mt-8 space-y-4">
          {Array.from({length: 50}, (_, i) => (
            <div key={i} className="p-4 bg-slate-900/30 border border-slate-700/40 rounded-lg">
              <h3 className="text-white font-medium mb-2">Test Content Block {i + 1}</h3>
              <p className="text-gray-400 text-sm">This is test content to force scrolling and verify the red scrollbar appears correctly on the dashboard page.</p>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  )
}