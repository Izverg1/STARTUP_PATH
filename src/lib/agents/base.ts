import { 
  Agent, 
  AgentKey, 
  AgentState, 
  AgentStatus, 
  Artifact, 
  AgentExecution,
  ExecutionStatus,
  AgentCapability 
} from '@/types/agents'

export abstract class BaseAgent {
  public readonly key: AgentKey
  public readonly capabilities: AgentCapability[]
  protected _status: AgentStatus
  protected _executions: AgentExecution[] = []

  constructor(
    key: AgentKey, 
    capabilities: AgentCapability[],
    initialStatus: Partial<AgentStatus> = {}
  ) {
    this.key = key
    this.capabilities = capabilities
    this._status = {
      id: `status-${key}-${Date.now()}`,
      agent_key: key,
      status: 'idle',
      status_line: 'Ready',
      last_activity: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...initialStatus
    }
  }

  get status(): AgentStatus {
    return { ...this._status }
  }

  get state(): AgentState {
    return this._status.status
  }

  get statusLine(): string {
    return this._status.status_line
  }

  /**
   * Update agent status
   */
  protected updateStatus(updates: Partial<AgentStatus>): void {
    this._status = {
      ...this._status,
      ...updates,
      updated_at: new Date().toISOString(),
      last_activity: new Date().toISOString()
    }
  }

  /**
   * Set agent state with automatic status line updates
   */
  protected setState(state: AgentState, statusLine?: string): void {
    const defaultStatusLines: Record<AgentState, string> = {
      idle: 'Ready',
      working: 'Processing...',
      blocked: 'Waiting for data',
      done: 'Complete'
    }

    this.updateStatus({
      status: state,
      status_line: statusLine || defaultStatusLines[state]
    })
  }

  /**
   * Execute the agent's primary capability
   */
  public async execute(input?: any): Promise<Artifact[]> {
    const executionId = `exec-${this.key}-${Date.now()}`
    
    const execution: AgentExecution = {
      id: executionId,
      agent_key: this.key,
      trigger_type: 'manual',
      trigger_data: input,
      status: 'running',
      start_time: new Date().toISOString(),
      artifacts_created: [],
      performance_metrics: {
        cpu_time_ms: 0,
        memory_usage_mb: 0,
        api_calls_made: 0,
        data_points_processed: 0
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this._executions.push(execution)
    this.setState('working', 'Starting execution...')

    try {
      const startTime = performance.now()
      const artifacts = await this.performExecution(input)
      const endTime = performance.now()

      // Update execution record
      execution.status = 'completed'
      execution.end_time = new Date().toISOString()
      execution.duration_ms = endTime - startTime
      execution.artifacts_created = artifacts.map(a => a.id)
      execution.performance_metrics.cpu_time_ms = endTime - startTime

      this.setState('done', `Created ${artifacts.length} artifact(s)`)
      
      // Auto-reset to idle after 3 seconds
      setTimeout(() => {
        if (this._status.status === 'done') {
          this.setState('idle')
        }
      }, 3000)

      return artifacts

    } catch (error) {
      execution.status = 'failed'
      execution.end_time = new Date().toISOString()
      execution.errors = [{
        type: 'computation',
        message: error instanceof Error ? error.message : 'Unknown error',
        recoverable: true
      }]

      this.setState('blocked', error instanceof Error ? error.message : 'Execution failed')
      throw error
    }
  }

  /**
   * Abstract method that subclasses must implement
   */
  protected abstract performExecution(input?: any): Promise<Artifact[]>

  /**
   * Create an artifact with agent metadata
   */
  protected createArtifact(
    type: Artifact['type'],
    title: string,
    content: Artifact['content'],
    metadata: Partial<Artifact['metadata']> = {}
  ): Artifact {
    return {
      id: `artifact-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      agent_key: this.key,
      title,
      content,
      metadata: {
        agent_version: '1.0.0',
        execution_id: this._executions[this._executions.length - 1]?.id || 'unknown',
        data_sources: [],
        dependencies: [],
        tags: [],
        ...metadata
      },
      project_id: 'current', // TODO: Get from context
      version: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  /**
   * Simulate processing time for demo purposes
   */
  protected async simulateProcessing(
    message: string,
    durationMs: number = 2000
  ): Promise<void> {
    this.setState('working', message)
    await new Promise(resolve => setTimeout(resolve, durationMs))
  }

  /**
   * Get recent executions
   */
  public getExecutionHistory(limit: number = 10): AgentExecution[] {
    return this._executions
      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
      .slice(0, limit)
  }

  /**
   * Check if agent can execute given current state
   */
  public canExecute(): boolean {
    return this._status.status === 'idle' || this._status.status === 'done'
  }

  /**
   * Reset agent to idle state
   */
  public reset(): void {
    this.setState('idle')
  }
}