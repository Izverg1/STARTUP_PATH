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
  channel_scout: '🔍',
  offer_alchemist: '⚗️',
  signal_wrangler: '📊',
  budget_captain: '💰'
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
        'relative w-24 h-24 rounded-lg border cursor-pointer',
        'bg-white border-gray-200 hover:border-gray-300',
        'transition-all duration-90',
        isActive && 'ring-2 ring-pink-500 border-pink-500'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
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
      {/* Status indicator */}
      <div className="absolute -top-1 -right-1 z-10">
        <motion.div
          className={cn(
            'w-3 h-3 rounded-full',
            stateColors[state]
          )}
          animate={stateAnimations[state]}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-full p-2 text-center">
        {/* Icon with state-based animation */}
        <motion.div
          className="text-2xl mb-1"
          animate={state === 'working' ? {
            rotate: [0, 10, -10, 0],
            transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
          } : {}}
        >
          {agentIcons[agentKey] || icon}
        </motion.div>

        {/* Title */}
        <div className="text-xs font-medium text-white leading-tight">
          {title}
        </div>

        {/* Status line */}
        <div className="text-xs text-zinc-400 leading-tight mt-0.5 line-clamp-1">
          {statusLine}
        </div>
      </div>

      {/* Active state accent */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-pink-500/10 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12 }}
        />
      )}
    </motion.div>
  )
}