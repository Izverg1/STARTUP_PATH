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
  channel_scout: {
    title: 'Channel Scout',
    description: 'Discovers optimal channels'
  },
  offer_alchemist: {
    title: 'Offer Alchemist', 
    description: 'Creates compelling copy'
  },
  signal_wrangler: {
    title: 'Signal Wrangler',
    description: 'Analyzes performance data'
  },
  budget_captain: {
    title: 'Budget Captain',
    description: 'Optimizes budget allocation'
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
        'bg-zinc-950 border-r border-zinc-800',
        'flex flex-col',
        className
      )}
      style={{ width: theme.layout.agentDock }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="p-4 border-b border-zinc-800"
        variants={itemVariants}
      >
        <div className="text-sm font-semibold text-gray-900">
          Agents
        </div>
        <div className="text-xs text-zinc-400 mt-1">
          {agents.filter(a => a.state === 'working').length} active
        </div>
      </motion.div>

      {/* Agent cards */}
      <div className="flex-1 p-2 space-y-3 overflow-y-auto">
        {agents.map((agent) => (
          <motion.div
            key={agent.key}
            variants={itemVariants}
          >
            <AgentCard
              agentKey={agent.key}
              title={agentDefinitions[agent.key].title}
              icon="" // Using emoji from AgentCard component
              state={agent.state}
              statusLine={agent.statusLine}
              isActive={agent.isActive}
              onClick={() => onAgentClick?.(agent.key)}
            />
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