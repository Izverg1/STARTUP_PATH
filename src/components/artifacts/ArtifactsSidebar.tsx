'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Artifact, ArtifactType, AgentKey } from '@/types/agents'
import { theme } from '@/config/theme'
import { ChevronDown, ChevronRight, Filter, Clock, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ArtifactsSidebarProps {
  artifacts: Artifact[]
  className?: string
  onArtifactClick?: (artifact: Artifact) => void
}

type FilterType = 'all' | AgentKey | ArtifactType

const agentLabels: Record<AgentKey, string> = {
  channel_discovery_engine: 'Channel Discovery',
  campaign_optimization_engine: 'Campaign Optimization',
  performance_analytics_engine: 'Performance Analytics',
  budget_allocation_engine: 'Budget Allocation'
}

const artifactTypeLabels: Record<ArtifactType, string> = {
  benchmark: 'Benchmark',
  copy: 'Copy',
  calc: 'Calculation',
  alloc: 'Allocation'
}

const artifactIcons: Record<ArtifactType, string> = {
  benchmark: '📊',
  copy: '✍️',
  calc: '🧮',
  alloc: '💰'
}

export function ArtifactsSidebar({
  artifacts,
  className,
  onArtifactClick
}: ArtifactsSidebarProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Sort artifacts by creation time (newest first)
  const sortedArtifacts = [...artifacts].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  // Apply filter
  const filteredArtifacts = sortedArtifacts.filter(artifact => {
    if (filter === 'all') return true
    if (filter in agentLabels) return artifact.agent_key === filter
    if (filter in artifactTypeLabels) return artifact.type === filter
    return true
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      className={cn(
        'fixed right-0 top-0 h-full z-20',
        'bg-zinc-950 border-l border-zinc-800',
        'flex flex-col',
        className
      )}
      style={{ width: theme.layout.artifactsSidebar }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="p-4 border-b border-zinc-800"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-gray-900">
            Artifacts
          </div>
          <Badge variant="secondary" className="text-xs">
            {filteredArtifacts.length}
          </Badge>
        </div>

        {/* Filter controls */}
        <FilterControls
          currentFilter={filter}
          onFilterChange={setFilter}
          artifactCounts={{
            all: artifacts.length,
            channel_discovery_engine: artifacts.filter(a => a.agent_key === 'channel_discovery_engine').length,
            campaign_optimization_engine: artifacts.filter(a => a.agent_key === 'campaign_optimization_engine').length,
            performance_analytics_engine: artifacts.filter(a => a.agent_key === 'performance_analytics_engine').length,
            budget_allocation_engine: artifacts.filter(a => a.agent_key === 'budget_allocation_engine').length,
            benchmark: artifacts.filter(a => a.type === 'benchmark').length,
            copy: artifacts.filter(a => a.type === 'copy').length,
            calc: artifacts.filter(a => a.type === 'calc').length,
            alloc: artifacts.filter(a => a.type === 'alloc').length,
          }}
        />
      </motion.div>

      {/* Artifacts feed */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredArtifacts.map((artifact, index) => (
            <motion.div
              key={artifact.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.02 }}
            >
              <ArtifactItem
                artifact={artifact}
                isExpanded={expandedItems.has(artifact.id)}
                onToggleExpanded={() => toggleExpanded(artifact.id)}
                onClick={() => onArtifactClick?.(artifact)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredArtifacts.length === 0 && (
          <motion.div
            className="p-4 text-center text-zinc-500"
            variants={itemVariants}
          >
            <div className="text-sm">No artifacts found</div>
            <div className="text-xs mt-1">
              {filter !== 'all' && 'Try adjusting your filter'}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function FilterControls({
  currentFilter,
  onFilterChange,
  artifactCounts
}: {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  artifactCounts: Record<string, number>
}) {
  const [showAgentFilters, setShowAgentFilters] = useState(false)
  const [showTypeFilters, setShowTypeFilters] = useState(false)

  return (
    <div className="space-y-2">
      {/* Main filter buttons */}
      <div className="flex gap-1">
        <Button
          variant={currentFilter === 'all' ? 'default' : 'ghost'}
          size="sm"
          className="text-xs"
          onClick={() => onFilterChange('all')}
        >
          All ({artifactCounts.all})
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setShowAgentFilters(!showAgentFilters)}
        >
          <User className="w-3 h-3 mr-1" />
          Agents
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setShowTypeFilters(!showTypeFilters)}
        >
          <Filter className="w-3 h-3 mr-1" />
          Types
        </Button>
      </div>

      {/* Agent filters */}
      <AnimatePresence>
        {showAgentFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-1 pt-1">
              {Object.entries(agentLabels).map(([key, label]) => (
                <Button
                  key={key}
                  variant={currentFilter === key ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => onFilterChange(key as AgentKey)}
                >
                  {label} ({artifactCounts[key] || 0})
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Type filters */}
      <AnimatePresence>
        {showTypeFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-1 pt-1">
              {Object.entries(artifactTypeLabels).map(([key, label]) => (
                <Button
                  key={key}
                  variant={currentFilter === key ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => onFilterChange(key as ArtifactType)}
                >
                  {artifactIcons[key as ArtifactType]} {label.slice(0, 4)}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ArtifactItem({
  artifact,
  isExpanded,
  onToggleExpanded,
  onClick
}: {
  artifact: Artifact
  isExpanded: boolean
  onToggleExpanded: () => void
  onClick: () => void
}) {
  const timeAgo = getTimeAgo(artifact.created_at)
  const confidence = artifact.metadata.confidence_score

  return (
    <div className="border-b border-zinc-800 last:border-b-0">
      {/* Header */}
      <div 
        className="p-3 cursor-pointer hover:bg-gray-50/50 transition-colors duration-90"
        onClick={onClick}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">
                {artifactIcons[artifact.type]}
              </span>
              <div className="text-xs font-medium text-gray-900 truncate">
                {artifact.title}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Badge variant="outline" className="text-xs">
                {agentLabels[artifact.agent_key]}
              </Badge>
              <Clock className="w-3 h-3" />
              {timeAgo}
            </div>

            {confidence !== undefined && (
              <div className="mt-1">
                <Badge 
                  variant={confidence > 0.8 ? 'default' : confidence > 0.6 ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {Math.round(confidence * 100)}% confidence
                </Badge>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpanded()
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 text-xs text-zinc-300">
              {artifact.description && (
                <p className="mb-2">{artifact.description}</p>
              )}
              
              {artifact.content.markdown_body && (
                <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded text-xs">
                  {artifact.content.markdown_body.slice(0, 200)}
                  {artifact.content.markdown_body.length > 200 && '...'}
                </div>
              )}

              <div className="flex flex-wrap gap-1 mt-2">
                {artifact.metadata.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function getTimeAgo(dateString: string): string {
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