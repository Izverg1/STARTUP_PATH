'use client'

import { motion } from 'framer-motion'
import { AgentCard } from './AgentCard'
import { cn } from '@/lib/utils'
import { AgentKey, AgentState } from '@/types/agents'
import { theme } from '@/config/theme'

interface AgentStatus {
  key: AgentKey
  title: string
  state: AgentState
  statusLine: string
  isActive: boolean
}

interface AgentDockProps {
  agents: AgentStatus[]
  onAgentClick?: (agentKey: AgentKey) => void
  className?: string
}

const agentDefinitions = {
  channel_discovery_engine: {
    title: 'Channel Discovery Engine',
    subtitle: '',
    description: 'Identifies & validates opportunities'
  },
  campaign_optimization_engine: {
    title: 'Campaign Optimization Engine',
    subtitle: '',
    description: 'Optimizes messaging & creative'
  },
  performance_analytics_engine: {
    title: 'Performance Analytics Engine',
    subtitle: '',
    description: 'Real-time monitoring & analysis'
  },
  budget_allocation_engine: {
    title: 'Budget Allocation Engine',
    subtitle: '',
    description: 'Automated spend optimization'
  }
} as const

export function AgentDock({
  agents,
  onAgentClick,
  className
}: AgentDockProps) {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      className={cn(
        'fixed left-0 top-0 h-full z-20',
        'bg-zinc-950/95 backdrop-blur-sm border-r border-zinc-800/60',
        'flex flex-col shadow-2xl',
        className
      )}
      style={{ width: theme.layout.agentDock }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Header */}
      <motion.div
        className="p-4 border-b border-zinc-800/60 bg-gradient-to-r from-zinc-900/50 to-zinc-800/30"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-magenta-500 rounded-full animate-pulse" />
          <div className="text-sm font-bold text-white">
            AI Agents
          </div>
        </div>
        <div className="text-xs text-zinc-400">
          {agents.filter(a => a.state === 'working').length} active • {agents.filter(a => a.state === 'done').length} completed
        </div>
      </motion.div>

      {/* Agent cards with improved spacing */}
      <div className="flex-1 p-3 space-y-4 overflow-y-auto">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.key}
            variants={itemVariants}
            className="relative"
          >
            {/* Agent title above card */}
            <div className="mb-2 px-1">
              <div className="text-xs font-medium text-zinc-300">
                {agentDefinitions[agent.key].title}
              </div>
              <div className="text-xs text-zinc-500">
                {agentDefinitions[agent.key].subtitle}
              </div>
            </div>
            
            <AgentCard
              agentKey={agent.key}
              title={`${agentDefinitions[agent.key].title} ${agentDefinitions[agent.key].subtitle}`}
              icon="" // Using emoji from AgentCard component
              state={agent.state}
              statusLine={agent.statusLine}
              isActive={agent.isActive}
              onClick={() => onAgentClick?.(agent.key)}
            />
            
            {/* Connecting line to next agent (except last) */}
            {index < agents.length - 1 && (
              <div className="absolute left-1/2 -bottom-2 w-px h-4 bg-gradient-to-b from-zinc-600/50 to-transparent" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer with system status */}
      <motion.div
        className="p-3 border-t border-zinc-800"
        variants={itemVariants}
      >
        <SystemStatusIndicator agents={agents} />
      </motion.div>
    </motion.div>
  )
}

function SystemStatusIndicator({ agents }: { agents: AgentStatus[] }) {
  const workingCount = agents.filter(a => a.state === 'working').length
  const blockedCount = agents.filter(a => a.state === 'blocked').length
  const doneCount = agents.filter(a => a.state === 'done').length

  const getSystemStatus = () => {
    if (blockedCount > 0) return { status: 'blocked', color: 'bg-red-500' }
    if (workingCount > 0) return { status: 'working', color: 'bg-blue-500' }
    if (doneCount === agents.length) return { status: 'complete', color: 'bg-green-500' }
    return { status: 'idle', color: 'bg-gray-500' }
  }

  const { status, color } = getSystemStatus()

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={cn('w-2 h-2 rounded-full', color)}
        animate={status === 'working' ? {
          opacity: [1, 0.5, 1],
          transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
        } : {}}
      />
      <div className="text-xs text-zinc-400 capitalize">
        {status}
      </div>
    </div>
  )
}