'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { 
  AgentKey, 
  AgentState, 
  AgentStatus, 
  Artifact 
} from '@/types/agents'
import { 
  createAllAgents, 
  ChannelScoutAgent, 
  OfferAlchemistAgent, 
  SignalWranglerAgent, 
  BudgetCaptainAgent 
} from '@/lib/agents'

type AgentInstance = 
  | ChannelScoutAgent 
  | OfferAlchemistAgent 
  | SignalWranglerAgent 
  | BudgetCaptainAgent

interface AgentState {
  agents: Record<AgentKey, AgentInstance>
  statuses: Record<AgentKey, AgentStatus>
  artifacts: Artifact[]
  isInitialized: boolean
}

interface UseAgentsReturn {
  // Agent statuses
  agents: Record<AgentKey, AgentInstance>
  statuses: Record<AgentKey, AgentStatus>
  artifacts: Artifact[]
  
  // Agent actions
  executeAgent: (agentKey: AgentKey, input?: any) => Promise<Artifact[]>
  resetAgent: (agentKey: AgentKey) => void
  resetAllAgents: () => void
  
  // Artifact management
  getArtifactsByAgent: (agentKey: AgentKey) => Artifact[]
  getArtifactsByType: (type: Artifact['type']) => Artifact[]
  clearArtifacts: () => void
  
  // System state
  isAnyAgentWorking: boolean
  getSystemStatus: () => {
    idle: number
    working: number
    blocked: number
    done: number
  }
  
  // Utilities
  canExecuteAgent: (agentKey: AgentKey) => boolean
  isInitialized: boolean
}

export function useAgents(): UseAgentsReturn {
  const [state, setState] = useState<AgentState>({
    agents: {} as Record<AgentKey, AgentInstance>,
    statuses: {} as Record<AgentKey, AgentStatus>,
    artifacts: [],
    isInitialized: false
  })

  const statusUpdateIntervalRef = useRef<NodeJS.Timeout>()

  // Initialize agents
  useEffect(() => {
    const agents = createAllAgents()
    const statuses = Object.fromEntries(
      Object.entries(agents).map(([key, agent]) => [key, agent.status])
    ) as Record<AgentKey, AgentStatus>

    setState(prev => ({
      ...prev,
      agents,
      statuses,
      isInitialized: true
    }))
  }, [])

  // Poll for status updates
  useEffect(() => {
    if (!state.isInitialized) return

    const updateStatuses = () => {
      setState(prev => {
        const newStatuses = Object.fromEntries(
          Object.entries(prev.agents).map(([key, agent]) => [key, agent.status])
        ) as Record<AgentKey, AgentStatus>

        // Only update if statuses have actually changed
        const hasChanged = Object.keys(newStatuses).some(
          key => JSON.stringify(newStatuses[key as AgentKey]) !== JSON.stringify(prev.statuses[key as AgentKey])
        )

        return hasChanged ? { ...prev, statuses: newStatuses } : prev
      })
    }

    // Update immediately
    updateStatuses()

    // Set up polling interval
    statusUpdateIntervalRef.current = setInterval(updateStatuses, 100) // 100ms polling

    return () => {
      if (statusUpdateIntervalRef.current) {
        clearInterval(statusUpdateIntervalRef.current)
      }
    }
  }, [state.isInitialized])

  const executeAgent = useCallback(async (agentKey: AgentKey, input?: any): Promise<Artifact[]> => {
    const agent = state.agents[agentKey]
    if (!agent) {
      throw new Error(`Agent ${agentKey} not found`)
    }

    if (!agent.canExecute()) {
      throw new Error(`Agent ${agentKey} is currently ${agent.state} and cannot execute`)
    }

    try {
      const artifacts = await agent.execute(input)
      
      // Add artifacts to state
      setState(prev => ({
        ...prev,
        artifacts: [...prev.artifacts, ...artifacts].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }))

      return artifacts
    } catch (error) {
      console.error(`Agent ${agentKey} execution failed:`, error)
      throw error
    }
  }, [state.agents])

  const resetAgent = useCallback((agentKey: AgentKey) => {
    const agent = state.agents[agentKey]
    if (agent) {
      agent.reset()
    }
  }, [state.agents])

  const resetAllAgents = useCallback(() => {
    Object.values(state.agents).forEach(agent => agent.reset())
  }, [state.agents])

  const getArtifactsByAgent = useCallback((agentKey: AgentKey): Artifact[] => {
    return state.artifacts.filter(artifact => artifact.agent_key === agentKey)
  }, [state.artifacts])

  const getArtifactsByType = useCallback((type: Artifact['type']): Artifact[] => {
    return state.artifacts.filter(artifact => artifact.type === type)
  }, [state.artifacts])

  const clearArtifacts = useCallback(() => {
    setState(prev => ({ ...prev, artifacts: [] }))
  }, [])

  const canExecuteAgent = useCallback((agentKey: AgentKey): boolean => {
    const agent = state.agents[agentKey]
    return agent ? agent.canExecute() : false
  }, [state.agents])

  const isAnyAgentWorking = Object.values(state.statuses).some(status => status.status === 'working')

  const getSystemStatus = useCallback(() => {
    const statuses = Object.values(state.statuses)
    return {
      idle: statuses.filter(s => s.status === 'idle').length,
      working: statuses.filter(s => s.status === 'working').length,
      blocked: statuses.filter(s => s.status === 'blocked').length,
      done: statuses.filter(s => s.status === 'done').length
    }
  }, [state.statuses])

  return {
    agents: state.agents,
    statuses: state.statuses,
    artifacts: state.artifacts,
    executeAgent,
    resetAgent,
    resetAllAgents,
    getArtifactsByAgent,
    getArtifactsByType,
    clearArtifacts,
    isAnyAgentWorking,
    getSystemStatus,
    canExecuteAgent,
    isInitialized: state.isInitialized
  }
}

// Specialized hooks for individual agents
export function useChannelScout() {
  const { agents, statuses, executeAgent, resetAgent, getArtifactsByAgent } = useAgents()
  
  return {
    agent: agents.channel_scout as ChannelScoutAgent,
    status: statuses.channel_scout,
    artifacts: getArtifactsByAgent('channel_scout'),
    execute: (input?: any) => executeAgent('channel_scout', input),
    reset: () => resetAgent('channel_scout'),
    
    // Specialized methods
    getChannelRecommendations: async (criteria: {
      vertical: string
      budget_range: [number, number]
      target_audience: string
    }) => {
      const agent = agents.channel_scout as ChannelScoutAgent
      return agent.getChannelRecommendations(criteria)
    },
    
    analyzeChannel: async (channelName: string) => {
      const agent = agents.channel_scout as ChannelScoutAgent
      return agent.analyzeChannel(channelName)
    }
  }
}

export function useOfferAlchemist() {
  const { agents, statuses, executeAgent, resetAgent, getArtifactsByAgent } = useAgents()
  
  return {
    agent: agents.offer_alchemist as OfferAlchemistAgent,
    status: statuses.offer_alchemist,
    artifacts: getArtifactsByAgent('offer_alchemist'),
    execute: (input?: any) => executeAgent('offer_alchemist', input),
    reset: () => resetAgent('offer_alchemist'),
    
    // Specialized methods
    generateCopy: async (params: {
      channel_type: string
      copy_type: 'subject_line' | 'body' | 'cta' | 'headline' | 'description'
      target_audience: string
      tone?: 'professional' | 'casual' | 'urgent' | 'consultative' | 'friendly'
      variant_count?: number
    }) => {
      const agent = agents.offer_alchemist as OfferAlchemistAgent
      return agent.generateCopy(params)
    },
    
    optimizeCopy: async (
      originalCopy: string,
      performanceData: { 
        conversion_rate: number
        engagement_rate: number
        click_rate?: number 
      }
    ) => {
      const agent = agents.offer_alchemist as OfferAlchemistAgent
      return agent.optimizeCopy(originalCopy, performanceData)
    }
  }
}

export function useSignalWrangler() {
  const { agents, statuses, executeAgent, resetAgent, getArtifactsByAgent } = useAgents()
  
  return {
    agent: agents.signal_wrangler as SignalWranglerAgent,
    status: statuses.signal_wrangler,
    artifacts: getArtifactsByAgent('signal_wrangler'),
    execute: (input?: any) => executeAgent('signal_wrangler', input),
    reset: () => resetAgent('signal_wrangler'),
    
    // Specialized methods
    calculateMetric: async (
      metricType: 'cpqm' | 'cac' | 'ltv' | 'roi' | 'mer',
      data: any
    ) => {
      const agent = agents.signal_wrangler as SignalWranglerAgent
      return agent.calculateMetric(metricType, data)
    },
    
    monitorPerformance: async (
      metrics: Array<{ name: string; value: number; timestamp: string }>
    ) => {
      const agent = agents.signal_wrangler as SignalWranglerAgent
      return agent.monitorPerformance(metrics)
    }
  }
}

export function useBudgetCaptain() {
  const { agents, statuses, executeAgent, resetAgent, getArtifactsByAgent } = useAgents()
  
  return {
    agent: agents.budget_captain as BudgetCaptainAgent,
    status: statuses.budget_captain,
    artifacts: getArtifactsByAgent('budget_captain'),
    execute: (input?: any) => executeAgent('budget_captain', input),
    reset: () => resetAgent('budget_captain'),
    
    // Specialized methods
    optimizeBudget: async (params: {
      total_budget: number
      strategy?: 'thompson_sampling' | 'epsilon_greedy' | 'ucb' | 'manual'
      channels?: Array<{ id: string; name: string; performance_data: any }>
      constraints?: any
    }) => {
      const agent = agents.budget_captain as BudgetCaptainAgent
      return agent.optimizeBudget(params)
    },
    
    rebalanceAllocation: async (
      currentAllocation: any[],
      performanceChanges: Array<{ channel_id: string; performance_delta: number }>
    ) => {
      const agent = agents.budget_captain as BudgetCaptainAgent
      return agent.rebalanceAllocation(currentAllocation, performanceChanges)
    },
    
    simulateScenarios: async (
      baseAllocation: any[],
      scenarios: Array<{
        name: string
        changes: Array<{ channel_id: string; weight_change: number }>
      }>
    ) => {
      const agent = agents.budget_captain as BudgetCaptainAgent
      return agent.simulateScenarios(baseAllocation, scenarios)
    }
  }
}

// Demo hook for testing purposes
export function useAgentsDemo() {
  const { 
    executeAgent, 
    resetAllAgents, 
    statuses, 
    artifacts, 
    getSystemStatus 
  } = useAgents()

  const runDemo = useCallback(async () => {
    console.log('Starting agents demo...')
    
    try {
      // Reset all agents first
      resetAllAgents()
      
      // Wait a bit for reset
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Execute Channel Scout
      console.log('Executing Channel Scout...')
      await executeAgent('channel_scout', {
        vertical: 'SaaS',
        target_audience: 'B2B Decision Makers',
        budget_range: [20000, 50000]
      })
      
      // Execute Offer Alchemist
      console.log('Executing Offer Alchemist...')
      await executeAgent('offer_alchemist', {
        channel_type: 'email',
        copy_type: 'subject_line',
        target_audience: 'Enterprise CTOs',
        tone: 'professional'
      })
      
      // Execute Signal Wrangler
      console.log('Executing Signal Wrangler...')
      await executeAgent('signal_wrangler', {
        metric_type: 'cpqm',
        time_period: '30d'
      })
      
      // Execute Budget Captain
      console.log('Executing Budget Captain...')
      await executeAgent('budget_captain', {
        total_budget: 50000,
        strategy: 'thompson_sampling'
      })
      
      console.log('Demo completed!')
    } catch (error) {
      console.error('Demo failed:', error)
    }
  }, [executeAgent, resetAllAgents])

  return {
    runDemo,
    statuses,
    artifacts,
    systemStatus: getSystemStatus()
  }
}