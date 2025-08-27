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
  ChannelDiscoveryEngineAgent, 
  CampaignOptimizationEngineAgent, 
  PerformanceAnalyticsEngineAgent, 
  BudgetAllocationEngineAgent 
} from '@/lib/agents'

type AgentInstance = 
  | ChannelDiscoveryEngineAgent 
  | CampaignOptimizationEngineAgent 
  | PerformanceAnalyticsEngineAgent 
  | BudgetAllocationEngineAgent

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
    statusUpdateIntervalRef.current = setInterval(updateStatuses, 2000) // 2s polling (reduced from 100ms)

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
export function useChannelDiscoveryEngine() {
  const { agents, statuses, executeAgent, resetAgent, getArtifactsByAgent } = useAgents()
  
  return {
    agent: agents.channel_discovery_engine as ChannelDiscoveryEngineAgent,
    status: statuses.channel_discovery_engine,
    artifacts: getArtifactsByAgent('channel_discovery_engine'),
    execute: (input?: any) => executeAgent('channel_discovery_engine', input),
    reset: () => resetAgent('channel_discovery_engine'),
    
    // Specialized methods
    getChannelRecommendations: async (criteria: {
      vertical: string
      budget_range: [number, number]
      target_audience: string
    }) => {
      const agent = agents.channel_discovery_engine as ChannelDiscoveryEngineAgent
      return agent.getChannelRecommendations(criteria)
    },
    
    analyzeChannel: async (channelName: string) => {
      const agent = agents.channel_discovery_engine as ChannelDiscoveryEngineAgent
      return agent.analyzeChannel(channelName)
    }
  }
}

export function useCampaignOptimizationEngine() {
  const { agents, statuses, executeAgent, resetAgent, getArtifactsByAgent } = useAgents()
  
  return {
    agent: agents.campaign_optimization_engine as CampaignOptimizationEngineAgent,
    status: statuses.campaign_optimization_engine,
    artifacts: getArtifactsByAgent('campaign_optimization_engine'),
    execute: (input?: any) => executeAgent('campaign_optimization_engine', input),
    reset: () => resetAgent('campaign_optimization_engine'),
    
    // Specialized methods
    generateCopy: async (params: {
      channel_type: string
      copy_type: 'subject_line' | 'body' | 'cta' | 'headline' | 'description'
      target_audience: string
      tone?: 'professional' | 'casual' | 'urgent' | 'consultative' | 'friendly'
      variant_count?: number
    }) => {
      const agent = agents.campaign_optimization_engine as CampaignOptimizationEngineAgent
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
      const agent = agents.campaign_optimization_engine as CampaignOptimizationEngineAgent
      return agent.optimizeCopy(originalCopy, performanceData)
    }
  }
}

export function usePerformanceAnalyticsEngine() {
  const { agents, statuses, executeAgent, resetAgent, getArtifactsByAgent } = useAgents()
  
  return {
    agent: agents.performance_analytics_engine as PerformanceAnalyticsEngineAgent,
    status: statuses.performance_analytics_engine,
    artifacts: getArtifactsByAgent('performance_analytics_engine'),
    execute: (input?: any) => executeAgent('performance_analytics_engine', input),
    reset: () => resetAgent('performance_analytics_engine'),
    
    // Specialized methods
    calculateMetric: async (
      metricType: 'cpqm' | 'cac' | 'ltv' | 'roi' | 'mer',
      data: any
    ) => {
      const agent = agents.performance_analytics_engine as PerformanceAnalyticsEngineAgent
      return agent.calculateMetric(metricType, data)
    },
    
    monitorPerformance: async (
      metrics: Array<{ name: string; value: number; timestamp: string }>
    ) => {
      const agent = agents.performance_analytics_engine as PerformanceAnalyticsEngineAgent
      return agent.monitorPerformance(metrics)
    }
  }
}

export function useBudgetAllocationEngine() {
  const { agents, statuses, executeAgent, resetAgent, getArtifactsByAgent } = useAgents()
  
  return {
    agent: agents.budget_allocation_engine as BudgetAllocationEngineAgent,
    status: statuses.budget_allocation_engine,
    artifacts: getArtifactsByAgent('budget_allocation_engine'),
    execute: (input?: any) => executeAgent('budget_allocation_engine', input),
    reset: () => resetAgent('budget_allocation_engine'),
    
    // Specialized methods
    optimizeBudget: async (params: {
      total_budget: number
      strategy?: 'thompson_sampling' | 'epsilon_greedy' | 'ucb' | 'manual'
      channels?: Array<{ id: string; name: string; performance_data: any }>
      constraints?: any
    }) => {
      const agent = agents.budget_allocation_engine as BudgetAllocationEngineAgent
      return agent.optimizeBudget(params)
    },
    
    rebalanceAllocation: async (
      currentAllocation: any[],
      performanceChanges: Array<{ channel_id: string; performance_delta: number }>
    ) => {
      const agent = agents.budget_allocation_engine as BudgetAllocationEngineAgent
      return agent.rebalanceAllocation(currentAllocation, performanceChanges)
    },
    
    simulateScenarios: async (
      baseAllocation: any[],
      scenarios: Array<{
        name: string
        changes: Array<{ channel_id: string; weight_change: number }>
      }>
    ) => {
      const agent = agents.budget_allocation_engine as BudgetAllocationEngineAgent
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
      
      // Execute Channel Agent
      console.log('Executing Channel Agent...')
      await executeAgent('channel_discovery_engine', {
        vertical: 'SaaS',
        target_audience: 'B2B Decision Makers',
        budget_range: [20000, 50000]
      })
      
      // Execute Campaign Agent
      console.log('Executing Campaign Agent...')
      await executeAgent('campaign_optimization_engine', {
        channel_type: 'email',
        copy_type: 'subject_line',
        target_audience: 'Enterprise CTOs',
        tone: 'professional'
      })
      
      // Execute Analytics Agent
      console.log('Executing Analytics Agent...')
      await executeAgent('performance_analytics_engine', {
        metric_type: 'cpqm',
        time_period: '30d'
      })
      
      // Execute Finance Agent
      console.log('Executing Finance Agent...')
      await executeAgent('budget_allocation_engine', {
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