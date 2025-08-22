'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Play,
  Pause,
  Archive,
  Eye,
  Edit,
  Trash2,
  Rocket,
  BarChart3,
  FlaskConical,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Demo projects data - this would come from database in real implementation
  const projects = [
    {
      id: 'proj-001',
      name: 'Q1 Growth Campaign',
      description: 'Multi-channel growth strategy targeting enterprise SaaS customers',
      status: 'active',
      progress: 75,
      budget: 50000,
      spent: 32500,
      channels: ['LinkedIn Ads', 'Google Ads', 'Cold Email', 'Content Marketing'],
      experiments: 12,
      activeCampaigns: 8,
      team: ['John Doe', 'Sarah Chen', 'Mike Johnson'],
      createdAt: '2024-01-15',
      lastActivity: '2024-01-20',
      metrics: {
        cpqm: 185,
        cac: 420,
        conversionRate: 0.034,
        roi: 2.8
      },
      engines: {
        channelDiscovery: 'active',
        campaignOptimization: 'active',
        performanceAnalytics: 'active',
        budgetAllocation: 'active'
      }
    },
    {
      id: 'proj-002',
      name: 'Product Launch Beta',
      description: 'Testing new feature launch across select customer segments',
      status: 'planning',
      progress: 25,
      budget: 25000,
      spent: 3200,
      channels: ['Email Marketing', 'In-App Messaging', 'Partner Networks'],
      experiments: 4,
      activeCampaigns: 2,
      team: ['Sarah Chen', 'Alex Park'],
      createdAt: '2024-01-10',
      lastActivity: '2024-01-19',
      metrics: {
        cpqm: 0,
        cac: 0,
        conversionRate: 0,
        roi: 0
      },
      engines: {
        channelDiscovery: 'idle',
        campaignOptimization: 'active',
        performanceAnalytics: 'idle',
        budgetAllocation: 'idle'
      }
    },
    {
      id: 'proj-003',
      name: 'Customer Retention Drive',
      description: 'Reducing churn through targeted engagement campaigns',
      status: 'completed',
      progress: 100,
      budget: 15000,
      spent: 14750,
      channels: ['Email', 'SMS', 'In-App'],
      experiments: 8,
      activeCampaigns: 0,
      team: ['Mike Johnson', 'Lisa Wong'],
      createdAt: '2023-12-01',
      lastActivity: '2024-01-05',
      metrics: {
        cpqm: 95,
        cac: 280,
        conversionRate: 0.068,
        roi: 4.2
      },
      engines: {
        channelDiscovery: 'completed',
        campaignOptimization: 'completed',
        performanceAnalytics: 'completed',
        budgetAllocation: 'completed'
      }
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-green-500/30 text-green-400 bg-green-600/10'
      case 'planning':
        return 'border-blue-500/30 text-blue-400 bg-blue-600/10'
      case 'completed':
        return 'border-gray-500/30 text-gray-400 bg-gray-600/10'
      case 'paused':
        return 'border-yellow-500/30 text-yellow-400 bg-yellow-600/10'
      default:
        return 'border-gray-500/30 text-gray-400 bg-gray-600/10'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return Play
      case 'planning':
        return Clock
      case 'completed':
        return CheckCircle
      case 'paused':
        return Pause
      default:
        return AlertTriangle
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || project.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    planning: projects.filter(p => p.status === 'planning').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="text-gray-400 mt-1">Manage your GTM projects and campaigns</p>
          </div>
          <Button 
            className="bg-blue-600/20 border-blue-500/30 hover:bg-blue-600/30 text-blue-400"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Projects</p>
                <p className="text-xl font-bold text-white">{projectStats.total}</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/10 rounded-lg border border-green-500/20">
                <Play className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-xl font-bold text-white">{projectStats.active}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/10 rounded-lg border border-purple-500/20">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Budget</p>
                <p className="text-xl font-bold text-white">${(projectStats.totalBudget / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600/10 rounded-lg border border-orange-500/20">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Budget Used</p>
                <p className="text-xl font-bold text-white">{((projectStats.totalSpent / projectStats.totalBudget) * 100).toFixed(0)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'active', 'planning', 'completed', 'paused'].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className={
                  selectedFilter === filter
                    ? 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                    : 'bg-slate-800/50 border-slate-600 text-gray-300 hover:bg-slate-800/70'
                }
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const StatusIcon = getStatusIcon(project.status)
            
            return (
              <Card key={project.id} className="bg-slate-900/50 border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-200">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white text-lg">{project.name}</h3>
                      <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Budget Info */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Budget</p>
                    <p className="text-sm font-medium text-white">${(project.budget / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Spent</p>
                    <p className="text-sm font-medium text-white">${(project.spent / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Remaining</p>
                    <p className="text-sm font-medium text-white">${((project.budget - project.spent) / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                {/* Channels */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Channels ({project.channels.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {project.channels.slice(0, 3).map((channel, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {channel}
                      </Badge>
                    ))}
                    {project.channels.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        +{project.channels.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Engine Status */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">AI Engines</p>
                  <div className="flex gap-2">
                    <div className={`w-2 h-2 rounded-full ${project.engines.channelDiscovery === 'active' ? 'bg-green-400' : 'bg-gray-600'}`} title="Channel Discovery Engine" />
                    <div className={`w-2 h-2 rounded-full ${project.engines.campaignOptimization === 'active' ? 'bg-green-400' : 'bg-gray-600'}`} title="Campaign Optimization Engine" />
                    <div className={`w-2 h-2 rounded-full ${project.engines.performanceAnalytics === 'active' ? 'bg-green-400' : 'bg-gray-600'}`} title="Performance Analytics Engine" />
                    <div className={`w-2 h-2 rounded-full ${project.engines.budgetAllocation === 'active' ? 'bg-green-400' : 'bg-gray-600'}`} title="Budget Allocation Engine" />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-800/30 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-gray-400">Experiments</span>
                    </div>
                    <p className="text-sm font-medium text-white">{project.experiments}</p>
                  </div>
                  <div className="bg-slate-800/30 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <Target className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-gray-400">Campaigns</span>
                    </div>
                    <p className="text-sm font-medium text-white">{project.activeCampaigns}</p>
                  </div>
                </div>

                {/* Key Metrics (if available) */}
                {project.status === 'active' || project.status === 'completed' ? (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Key Metrics</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">CPQM:</span>
                        <span className="text-white ml-1">${project.metrics.cpqm}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">CAC:</span>
                        <span className="text-white ml-1">${project.metrics.cac}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Conv Rate:</span>
                        <span className="text-white ml-1">{(project.metrics.conversionRate * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">ROI:</span>
                        <span className="text-white ml-1">{project.metrics.roi.toFixed(1)}x</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600/20 border-blue-500/30 hover:bg-blue-600/30 text-blue-400"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-slate-800/50 border-slate-600 text-gray-300 hover:bg-slate-800/70"
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Analytics
                  </Button>
                </div>

                {/* Last Activity */}
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Last activity: {new Date(project.lastActivity).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-500">{project.team.length}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <Card className="bg-slate-900/50 border-slate-700/50 p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No projects found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filters.'
                : 'Create your first project to get started with STARTUP_PATH.'
              }
            </p>
            {!searchQuery && selectedFilter === 'all' && (
              <Button className="bg-blue-600/20 border-blue-500/30 hover:bg-blue-600/30 text-blue-400">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            )}
          </Card>
        )}
      </div>
    </MainLayout>
  )
}