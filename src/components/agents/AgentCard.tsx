'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AgentKey, AgentState } from '@/types/agents'
import { theme } from '@/config/theme'

interface AgentCardProps {
  agentKey: AgentKey
  title: string
  icon: string
  state: AgentState
  statusLine: string
  isActive?: boolean
  onClick?: () => void
}

const agentIcons: Record<AgentKey, string> = {
  channel_discovery_engine: '🔍',
  campaign_optimization_engine: '⚗️',
  performance_analytics_engine: '📊',
  budget_allocation_engine: '💰'
}

const stateColors = {
  idle: 'bg-gray-600',
  working: 'bg-blue-500',
  blocked: 'bg-red-500',
  done: 'bg-green-500'
} as const

const stateAnimations = {
  idle: {
    scale: [1, 1.02, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  },
  working: {
    rotate: [0, 180, 360],
    transition: { duration: 2, repeat: Infinity, ease: 'linear' }
  },
  blocked: {
    x: [-1, 1, -1, 0],
    transition: { duration: 0.3, repeat: Infinity, repeatDelay: 2 }
  },
  done: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.6, ease: 'easeOut' }
  }
} as const

export function AgentCard({
  agentKey,
  title,
  icon,
  state,
  statusLine,
  isActive = false,
  onClick
}: AgentCardProps) {
  return (
    <motion.div
      className={cn(
        'relative w-28 h-28 rounded-xl border cursor-pointer overflow-hidden',
        'bg-zinc-900/90 border-zinc-700/50 hover:border-zinc-600',
        'backdrop-blur-sm transition-all duration-300',
        'hover:shadow-lg hover:shadow-magenta-500/10',
        isActive && 'ring-2 ring-magenta-500 border-magenta-500/70 shadow-lg shadow-magenta-500/25'
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${title} agent - ${state}: ${statusLine}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      {/* Status indicator - Modern pill design */}
      <div className="absolute top-2 right-2 z-10">
        <motion.div
          className={cn(
            'w-3 h-3 rounded-full border-2 border-zinc-800',
            stateColors[state]
          )}
          animate={stateAnimations[state]}
        />
      </div>

      {/* Modern overlay */}
      <div className="absolute inset-0 bg-zinc-800/20" />
      
      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center h-full p-3 text-center">
        {/* Icon with enhanced state-based animation */}
        <motion.div
          className="text-3xl mb-2 relative"
          animate={state === 'working' ? {
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
            transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          } : {}}
        >
          {agentIcons[agentKey] || icon}
          {/* Subtle glow effect for working state */}
          {state === 'working' && (
            <motion.div
              className="absolute inset-0 text-3xl opacity-30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {agentIcons[agentKey] || icon}
            </motion.div>
          )}
        </motion.div>

        {/* Title with improved typography */}
        <div className="text-xs font-semibold text-white leading-tight mb-1">
          {title}
        </div>

        {/* Status line with better contrast */}
        <div className="text-xs text-zinc-300 leading-tight line-clamp-2 px-1">
          {statusLine}
        </div>
      </div>

      {/* Enhanced active state with magenta accent */}
      {isActive && (
        <>
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-magenta-500/15 via-magenta-400/10 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="absolute inset-0 rounded-xl border border-magenta-500/30"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </>
      )}

      {/* Hover state enhancement */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-t from-zinc-700/20 to-transparent opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
}