'use client'

import { useState, useCallback, useEffect } from 'react'
import { AgentService } from '@/lib/agents/service'
import { 
  AgentKey, 
  AgentState as AgentStatusType,
  Artifact 
} from '@/types/agents'
import { 
  getProjectAgents, 
  getAgentExecutions, 
  getRecentArtifacts 
} from '@/lib/db/client-queries'

interface AgentStatus {
  id: string
  project_id: string
  agent_key: AgentKey
  status: AgentStatusType
  status_line: string
  last_activity?: string
  is_active: boolean
  capabilities: any[]
}

interface UseAgentServiceReturn {
  // Agent statuses from database
  statuses: Record<AgentKey, AgentStatus>
  artifacts: Artifact[]
  executions: any[]
  
  // Agent actions
  executeAgent: (agentKey: AgentKey, input?: any) => Promise<Artifact[]>
  resetAgent: (agentKey: AgentKey) => Promise<void>
  resetAllAgents: () => Promise<void>
  
  // Artifact management
  getArtifactsByAgent: (agentKey: AgentKey) => Artifact[]
  getArtifactsByType: (type: Artifact['type']) => Artifact[]
  
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
  error: string | null
  loading: boolean
}

interface UseAgentServiceOptions {
  projectId: string
  pollInterval?: number // milliseconds
}

export function useAgentService({ 
  projectId, 
  pollInterval = 2000 
}: UseAgentServiceOptions): UseAgentServiceReturn {
  const [statuses, setStatuses] = useState<Record<AgentKey, AgentStatus>>({} as Record<AgentKey, AgentStatus>)
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [executions, setExecutions] = useState<any[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize AgentService
  const agentService = AgentService.getInstance()

  // Load initial data and set up polling
  useEffect(() => {
    if (!projectId) return

    let intervalId: NodeJS.Timeout

    const loadData = async () => {
      try {
        setError(null)
        
        // Initialize agents for project if needed
        await agentService.initializeProject(projectId)
        
        // Load current agent statuses
        const agents = await getProjectAgents(projectId)
        const statusMap = agents.reduce((acc, agent) => {
          acc[agent.agent_key as AgentKey] = {
            id: agent.id,
            project_id: agent.project_id,
            agent_key: agent.agent_key as AgentKey,
            status: agent.status as AgentStatusType,
            status_line: agent.status_line,
            last_activity: agent.last_activity,
            is_active: agent.is_active,
            capabilities: agent.capabilities || []
          }
          return acc
        }, {} as Record<AgentKey, AgentStatus>)
        
        setStatuses(statusMap)
        
        // Load recent artifacts
        const recentArtifacts = await getRecentArtifacts(projectId, 50)
        setArtifacts(recentArtifacts)
        
        // Load recent executions
        const recentExecutions = await getAgentExecutions(projectId, 20)
        setExecutions(recentExecutions)
        
        if (!isInitialized) {
          setIsInitialized(true)
        }
      } catch (err) {
        console.error('Failed to load agent data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load agent data')
      }
    }

    // Load data immediately
    loadData()

    // Set up polling interval
    intervalId = setInterval(loadData, pollInterval)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [projectId, pollInterval, isInitialized, agentService])

  const executeAgent = useCallback(async (agentKey: AgentKey, input?: any): Promise<Artifact[]> => {
    if (!projectId) {
      throw new Error('Project ID is required')
    }

    setLoading(true)
    setError(null)
    
    try {
      const result = await agentService.executeAgent(agentKey, projectId, input || {})
      
      if (result.success) {
        // Refresh data to get updated status
        const agents = await getProjectAgents(projectId)
        const statusMap = agents.reduce((acc, agent) => {
          acc[agent.agent_key as AgentKey] = {
            id: agent.id,
            project_id: agent.project_id,
            agent_key: agent.agent_key as AgentKey,
            status: agent.status as AgentStatusType,
            status_line: agent.status_line,
            last_activity: agent.last_activity,
            is_active: agent.is_active,
            capabilities: agent.capabilities || []
          }
          return acc
        }, {} as Record<AgentKey, AgentStatus>)
        setStatuses(statusMap)
        
        // Refresh artifacts
        const recentArtifacts = await getRecentArtifacts(projectId, 50)
        setArtifacts(recentArtifacts)
        
        return result.artifacts || []
      } else {
        throw new Error(result.error || 'Agent execution failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Agent execution failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [projectId, agentService])

  const resetAgent = useCallback(async (agentKey: AgentKey): Promise<void> => {
    if (!projectId) return
    
    try {
      await agentService.resetAgent(agentKey, projectId)
      
      // Refresh status
      const agents = await getProjectAgents(projectId)
      const statusMap = agents.reduce((acc, agent) => {
        acc[agent.agent_key as AgentKey] = {
          id: agent.id,
          project_id: agent.project_id,
          agent_key: agent.agent_key as AgentKey,
          status: agent.status as AgentStatusType,
          status_line: agent.status_line,
          last_activity: agent.last_activity,
          is_active: agent.is_active,
          capabilities: agent.capabilities || []
        }
        return acc
      }, {} as Record<AgentKey, AgentStatus>)
      setStatuses(statusMap)
    } catch (err) {
      console.error(`Failed to reset agent ${agentKey}:`, err)
      setError(err instanceof Error ? err.message : 'Failed to reset agent')
    }
  }, [projectId, agentService])

  const resetAllAgents = useCallback(async (): Promise<void> => {
    if (!projectId) return
    
    try {
      const agentKeys: AgentKey[] = [
        'channel_discovery_engine',
        'campaign_optimization_engine', 
        'performance_analytics_engine',
        'budget_allocation_engine'
      ]
      
      await Promise.all(agentKeys.map(key => agentService.resetAgent(key, projectId)))
      
      // Refresh all statuses
      const agents = await getProjectAgents(projectId)
      const statusMap = agents.reduce((acc, agent) => {
        acc[agent.agent_key as AgentKey] = {
          id: agent.id,
          project_id: agent.project_id,
          agent_key: agent.agent_key as AgentKey,
          status: agent.status as AgentStatusType,
          status_line: agent.status_line,
          last_activity: agent.last_activity,
          is_active: agent.is_active,
          capabilities: agent.capabilities || []
        }
        return acc
      }, {} as Record<AgentKey, AgentStatus>)
      setStatuses(statusMap)
    } catch (err) {
      console.error('Failed to reset all agents:', err)
      setError(err instanceof Error ? err.message : 'Failed to reset agents')
    }
  }, [projectId, agentService])

  const getArtifactsByAgent = useCallback((agentKey: AgentKey): Artifact[] => {
    return artifacts.filter(artifact => artifact.agent_key === agentKey)
  }, [artifacts])

  const getArtifactsByType = useCallback((type: Artifact['type']): Artifact[] => {
    return artifacts.filter(artifact => artifact.type === type)
  }, [artifacts])

  const canExecuteAgent = useCallback((agentKey: AgentKey): boolean => {
    const status = statuses[agentKey]
    return status ? status.status === 'idle' : false
  }, [statuses])

  const isAnyAgentWorking = Object.values(statuses).some(status => status.status === 'working')

  const getSystemStatus = useCallback(() => {
    const statusValues = Object.values(statuses)
    return {
      idle: statusValues.filter(s => s.status === 'idle').length,
      working: statusValues.filter(s => s.status === 'working').length,
      blocked: statusValues.filter(s => s.status === 'blocked').length,
      done: statusValues.filter(s => s.status === 'done').length
    }
  }, [statuses])

  return {
    statuses,
    artifacts,
    executions,
    executeAgent,
    resetAgent,
    resetAllAgents,
    getArtifactsByAgent,
    getArtifactsByType,
    isAnyAgentWorking,
    getSystemStatus,
    canExecuteAgent,
    isInitialized,
    error,
    loading
  }
}

// Hook for getting current user's project ID
export function useCurrentProject() {
  const [projectId, setProjectId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For demo purposes, we'll use a hardcoded project ID
    // In a real app, this would come from user context or URL params
    const demoProjectId = 'demo-project-id'
    setProjectId(demoProjectId)
    setLoading(false)
  }, [])

  return { projectId, loading }
}