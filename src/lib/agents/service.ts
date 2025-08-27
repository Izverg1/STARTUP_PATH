// Agent Service for STARTUP_PATH Platform
// Manages agent lifecycle, execution, and database persistence
// Integrates the BaseAgent classes with Supabase backend

import { createClient } from '@/lib/supabase/client'
import { createAllAgents, AgentRegistry } from './index'
import type { 
  BaseAgent 
} from './base'
import type { 
  AgentKey, 
  AgentStatus, 
  AgentExecution, 
  Artifact,
  AgentState 
} from '@/types/agents'
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/types'

// =============================================================================
// Type Definitions
// =============================================================================

type DBAgent = Tables<'SPATH_agents'>
type DBAgentExecution = Tables<'SPATH_agent_executions'>  
type DBArtifact = Tables<'SPATH_artifacts'>
type DBAgentConfiguration = Tables<'SPATH_agent_configurations'>

type AgentInsert = TablesInsert<'SPATH_agents'>
type ExecutionInsert = TablesInsert<'SPATH_agent_executions'>
type ArtifactInsert = TablesInsert<'SPATH_artifacts'>

export interface AgentExecutionResult {
  execution: DBAgentExecution
  artifacts: DBArtifact[]
  success: boolean
  error?: string
}

export interface AgentServiceConfig {
  projectId: string
  maxRetries?: number
  executionTimeout?: number
  enablePersistence?: boolean
}

// =============================================================================
// Agent Service Class
// =============================================================================

export class AgentService {
  private agents: Map<AgentKey, BaseAgent> = new Map()
  private supabase = createClient()
  private config: AgentServiceConfig

  constructor(config: AgentServiceConfig) {
    this.config = {
      maxRetries: 3,
      executionTimeout: 120000, // 2 minutes
      enablePersistence: true,
      ...config
    }
    this.initializeAgents()
  }

  // ==========================================================================
  // Agent Initialization and Management
  // ==========================================================================

  private initializeAgents(): void {
    const agentInstances = createAllAgents()
    Object.entries(agentInstances).forEach(([key, agent]) => {
      this.agents.set(key as AgentKey, agent)
    })
  }

  /**
   * Get agent instance by key
   */
  public getAgent(agentKey: AgentKey): BaseAgent | null {
    return this.agents.get(agentKey) || null
  }

  /**
   * Get all agent instances
   */
  public getAllAgents(): Map<AgentKey, BaseAgent> {
    return new Map(this.agents)
  }

  /**
   * Initialize agents in database for the project
   */
  public async initializeProjectAgents(): Promise<void> {
    if (!this.config.enablePersistence) return

    const agents: AgentInsert[] = Array.from(this.agents.entries()).map(([key, agent]) => ({
      project_id: this.config.projectId,
      agent_key: key,
      status: 'idle',
      status_line: 'Ready',
      capabilities: agent.capabilities as any,
      configuration: {},
      is_active: true
    }))

    const { error } = await this.supabase
      .from('SPATH_agents')
      .upsert(agents, { 
        onConflict: 'project_id,agent_key',
        ignoreDuplicates: false 
      })

    if (error) {
      console.error('Failed to initialize project agents:', error)
      throw new Error(`Failed to initialize agents: ${error.message}`)
    }
  }

  // ==========================================================================
  // Agent Status Management  
  // ==========================================================================

  /**
   * Get agent status from database
   */
  public async getAgentStatus(agentKey: AgentKey): Promise<DBAgent | null> {
    if (!this.config.enablePersistence) return null

    const { data, error } = await this.supabase
      .from('SPATH_agents')
      .select('*')
      .eq('project_id', this.config.projectId)
      .eq('agent_key', agentKey)
      .single()

    if (error) {
      console.error(`Failed to get agent status for ${agentKey}:`, error)
      return null
    }

    return data
  }

  /**
   * Update agent status in database
   */
  public async updateAgentStatus(
    agentKey: AgentKey, 
    status: AgentState, 
    statusLine?: string
  ): Promise<void> {
    if (!this.config.enablePersistence) return

    const updates: TablesUpdate<'SPATH_agents'> = {
      status,
      status_line: statusLine || this.getDefaultStatusLine(status),
      last_activity: new Date().toISOString()
    }

    const { error } = await this.supabase
      .from('SPATH_agents')
      .update(updates)
      .eq('project_id', this.config.projectId)
      .eq('agent_key', agentKey)

    if (error) {
      console.error(`Failed to update agent status for ${agentKey}:`, error)
    }

    // Also update in-memory agent
    const agent = this.agents.get(agentKey)
    if (agent) {
      (agent as any).setState(status, statusLine)
    }
  }

  private getDefaultStatusLine(status: AgentState): string {
    const statusLines: Record<AgentState, string> = {
      idle: 'Ready',
      working: 'Processing...',
      blocked: 'Waiting for data',
      done: 'Complete'
    }
    return statusLines[status] || 'Unknown status'
  }

  /**
   * Get all agent statuses for the project
   */
  public async getAllAgentStatuses(): Promise<DBAgent[]> {
    if (!this.config.enablePersistence) return []

    const { data, error } = await this.supabase
      .from('SPATH_agents')
      .select('*')
      .eq('project_id', this.config.projectId)
      .order('agent_key')

    if (error) {
      console.error('Failed to get all agent statuses:', error)
      return []
    }

    return data || []
  }

  // ==========================================================================
  // Agent Execution
  // ==========================================================================

  /**
   * Execute an agent with full database persistence
   */
  public async executeAgent(
    agentKey: AgentKey,
    input?: any,
    triggerType: 'manual' | 'scheduled' | 'rule_triggered' = 'manual'
  ): Promise<AgentExecutionResult> {
    const agent = this.agents.get(agentKey)
    if (!agent) {
      throw new Error(`Agent ${agentKey} not found`)
    }

    // Create execution record
    const executionId = await this.createExecutionRecord(agentKey, input, triggerType)
    
    try {
      // Update agent status to working
      await this.updateAgentStatus(agentKey, 'working', 'Starting execution...')

      // Execute the agent
      const startTime = Date.now()
      const artifacts = await agent.execute(input)
      const duration = Date.now() - startTime

      // Persist artifacts to database
      const persistedArtifacts = await this.persistArtifacts(artifacts, executionId, agentKey)

      // Update execution record with success
      const execution = await this.completeExecution(executionId, {
        status: 'completed',
        duration_ms: duration,
        artifacts_created: persistedArtifacts.map(a => a.id),
        output_data: { artifacts_count: artifacts.length } as any
      })

      // Update agent status to done
      await this.updateAgentStatus(agentKey, 'done', `Created ${artifacts.length} artifact(s)`)

      return {
        execution,
        artifacts: persistedArtifacts,
        success: true
      }

    } catch (error) {
      // Handle execution failure
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      await this.completeExecution(executionId, {
        status: 'failed',
        errors: [{ type: 'execution_error', message: errorMessage }] as any
      })

      await this.updateAgentStatus(agentKey, 'blocked', errorMessage)

      return {
        execution: await this.getExecution(executionId),
        artifacts: [],
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Execute multiple agents concurrently
   */
  public async executeMultipleAgents(
    requests: Array<{ agentKey: AgentKey; input?: any; triggerType?: 'manual' | 'scheduled' | 'rule_triggered' }>
  ): Promise<AgentExecutionResult[]> {
    const executions = await Promise.allSettled(
      requests.map(req => this.executeAgent(req.agentKey, req.input, req.triggerType))
    )

    return executions.map(result => 
      result.status === 'fulfilled' 
        ? result.value 
        : {
            execution: {} as DBAgentExecution,
            artifacts: [],
            success: false,
            error: result.reason?.message || 'Unknown error'
          }
    )
  }

  // ==========================================================================
  // Execution Management
  // ==========================================================================

  private async createExecutionRecord(
    agentKey: AgentKey,
    input: any,
    triggerType: 'manual' | 'scheduled' | 'rule_triggered'
  ): Promise<string> {
    if (!this.config.enablePersistence) return `mock-execution-${Date.now()}`

    const agentRecord = await this.getAgentStatus(agentKey)
    if (!agentRecord) {
      throw new Error(`Agent ${agentKey} not found in database`)
    }

    const execution: ExecutionInsert = {
      agent_id: agentRecord.id,
      agent_key: agentKey,
      trigger_type: triggerType,
      trigger_data: input || {},
      input_parameters: input || {},
      start_time: new Date().toISOString(),
      timeout_ms: this.config.executionTimeout,
      status: 'running',
      artifacts_created: [],
      output_data: {},
      performance_metrics: {
        cpu_time_ms: 0,
        memory_usage_mb: 0,
        api_calls_made: 0,
        data_points_processed: 0
      } as any,
      errors: [],
      retry_count: 0,
      max_retries: this.config.maxRetries
    }

    const { data, error } = await this.supabase
      .from('SPATH_agent_executions')
      .insert(execution)
      .select('id')
      .single()

    if (error) {
      console.error('Failed to create execution record:', error)
      throw new Error(`Failed to create execution record: ${error.message}`)
    }

    return data.id
  }

  private async completeExecution(
    executionId: string,
    updates: {
      status: 'completed' | 'failed' | 'timeout' | 'cancelled'
      duration_ms?: number
      artifacts_created?: string[]
      output_data?: any
      errors?: any[]
    }
  ): Promise<DBAgentExecution> {
    if (!this.config.enablePersistence) {
      return {} as DBAgentExecution
    }

    const { data, error } = await this.supabase
      .from('SPATH_agent_executions')
      .update({
        ...updates,
        end_time: new Date().toISOString()
      })
      .eq('id', executionId)
      .select()
      .single()

    if (error) {
      console.error('Failed to complete execution:', error)
      throw new Error(`Failed to complete execution: ${error.message}`)
    }

    return data
  }

  private async getExecution(executionId: string): Promise<DBAgentExecution> {
    const { data, error } = await this.supabase
      .from('SPATH_agent_executions')
      .select('*')
      .eq('id', executionId)
      .single()

    if (error) {
      console.error('Failed to get execution:', error)
      throw new Error(`Failed to get execution: ${error.message}`)
    }

    return data
  }

  // ==========================================================================
  // Artifact Management
  // ==========================================================================

  private async persistArtifacts(
    artifacts: Artifact[],
    executionId: string,
    agentKey: AgentKey
  ): Promise<DBArtifact[]> {
    if (!this.config.enablePersistence || artifacts.length === 0) return []

    const artifactInserts: ArtifactInsert[] = artifacts.map(artifact => ({
      id: artifact.id,
      agent_key: agentKey,
      execution_id: executionId,
      project_id: this.config.projectId,
      type: artifact.type,
      title: artifact.title,
      content: artifact.content as any,
      metadata: artifact.metadata as any,
      version: artifact.version,
      is_active: artifact.is_active
    }))

    const { data, error } = await this.supabase
      .from('SPATH_artifacts')
      .insert(artifactInserts)
      .select()

    if (error) {
      console.error('Failed to persist artifacts:', error)
      throw new Error(`Failed to persist artifacts: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get artifacts for an agent
   */
  public async getAgentArtifacts(
    agentKey: AgentKey,
    limit: number = 50
  ): Promise<DBArtifact[]> {
    if (!this.config.enablePersistence) return []

    const { data, error } = await this.supabase
      .from('SPATH_artifacts')
      .select('*')
      .eq('project_id', this.config.projectId)
      .eq('agent_key', agentKey)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error(`Failed to get artifacts for ${agentKey}:`, error)
      return []
    }

    return data || []
  }

  /**
   * Get recent artifacts across all agents
   */
  public async getRecentArtifacts(limit: number = 20): Promise<DBArtifact[]> {
    if (!this.config.enablePersistence) return []

    const { data, error } = await this.supabase
      .from('SPATH_artifacts')
      .select('*')
      .eq('project_id', this.config.projectId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Failed to get recent artifacts:', error)
      return []
    }

    return data || []
  }

  // ==========================================================================
  // Agent Performance and Analytics
  // ==========================================================================

  /**
   * Get execution history for an agent
   */
  public async getAgentExecutionHistory(
    agentKey: AgentKey,
    limit: number = 50
  ): Promise<DBAgentExecution[]> {
    if (!this.config.enablePersistence) return []

    const { data, error } = await this.supabase
      .from('SPATH_agent_executions')
      .select('*')
      .eq('agent_key', agentKey)
      .order('start_time', { ascending: false })
      .limit(limit)

    if (error) {
      console.error(`Failed to get execution history for ${agentKey}:`, error)
      return []
    }

    return data || []
  }

  /**
   * Get agent performance metrics
   */
  public async getAgentPerformanceMetrics(agentKey: AgentKey): Promise<{
    total_executions: number
    successful_executions: number
    failed_executions: number
    avg_duration_ms: number
    artifacts_created: number
    success_rate: number
  }> {
    if (!this.config.enablePersistence) {
      return {
        total_executions: 0,
        successful_executions: 0,
        failed_executions: 0,
        avg_duration_ms: 0,
        artifacts_created: 0,
        success_rate: 0
      }
    }

    // Get execution statistics
    const { data: executions, error: execError } = await this.supabase
      .from('SPATH_agent_executions')
      .select('status, duration_ms, artifacts_created')
      .eq('agent_key', agentKey)

    if (execError) {
      console.error(`Failed to get performance metrics for ${agentKey}:`, execError)
      return {
        total_executions: 0,
        successful_executions: 0,
        failed_executions: 0,
        avg_duration_ms: 0,
        artifacts_created: 0,
        success_rate: 0
      }
    }

    const total = executions?.length || 0
    const successful = executions?.filter(e => e.status === 'completed').length || 0
    const failed = executions?.filter(e => e.status === 'failed').length || 0
    const avgDuration = executions?.length 
      ? executions.reduce((sum, e) => sum + (e.duration_ms || 0), 0) / executions.length
      : 0
    const artifactsCreated = executions?.reduce((sum, e) => sum + (e.artifacts_created?.length || 0), 0) || 0

    return {
      total_executions: total,
      successful_executions: successful,
      failed_executions: failed,
      avg_duration_ms: avgDuration,
      artifacts_created: artifactsCreated,
      success_rate: total > 0 ? successful / total : 0
    }
  }

  // ==========================================================================
  // Utility Methods
  // ==========================================================================

  /**
   * Check if an agent can execute (not currently running)
   */
  public async canAgentExecute(agentKey: AgentKey): Promise<boolean> {
    const status = await this.getAgentStatus(agentKey)
    return status?.status === 'idle' || status?.status === 'done' || false
  }

  /**
   * Reset all agents to idle state
   */
  public async resetAllAgents(): Promise<void> {
    const agentKeys = Array.from(this.agents.keys())
    await Promise.all(
      agentKeys.map(key => this.updateAgentStatus(key, 'idle'))
    )
  }

  /**
   * Health check for agent service
   */
  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy'
    agents: Record<AgentKey, boolean>
    database_connected: boolean
    error?: string
  }> {
    try {
      // Check database connection
      const { error: dbError } = await this.supabase
        .from('SPATH_agents')
        .select('id')
        .limit(1)

      const databaseConnected = !dbError

      // Check agent availability
      const agentStatuses: Record<string, boolean> = {}
      for (const [key, agent] of this.agents.entries()) {
        agentStatuses[key] = agent.canExecute()
      }

      const allAgentsHealthy = Object.values(agentStatuses).every(Boolean)

      return {
        status: databaseConnected && allAgentsHealthy ? 'healthy' : 'unhealthy',
        agents: agentStatuses as Record<AgentKey, boolean>,
        database_connected: databaseConnected,
        error: dbError?.message
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        agents: {} as Record<AgentKey, boolean>,
        database_connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// =============================================================================
// Factory Functions
// =============================================================================

/**
 * Create an AgentService instance for a project
 */
export function createAgentService(projectId: string, config?: Partial<AgentServiceConfig>): AgentService {
  return new AgentService({
    projectId,
    ...config
  })
}

/**
 * Global agent service singleton (useful for API routes)
 */
let globalAgentService: AgentService | null = null

export function getGlobalAgentService(projectId?: string): AgentService {
  if (!globalAgentService && projectId) {
    globalAgentService = createAgentService(projectId)
  }
  
  if (!globalAgentService) {
    throw new Error('Agent service not initialized. Provide projectId on first call.')
  }
  
  return globalAgentService
}