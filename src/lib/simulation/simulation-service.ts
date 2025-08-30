// Simulation Service - Bridge between Thompson Sampling and Dashboard
// Connects the sophisticated Thompson Sampling algorithm to the production UI

import { createClient } from '@/lib/supabase/client'
import { ThompsonSamplingAllocator, ThompsonSamplingConfig, AllocationResult, ChannelArm, createDefaultConfig } from './thompson-sampling'
import type { Project, Experiment, Channel, ExperimentWithChannels } from '@/types'

export interface SimulationState {
  isRunning: boolean
  currentProject: Project | null
  allocator: ThompsonSamplingAllocator | null
  lastAllocation: AllocationResult[]
  scenarioId?: string
  config: ThompsonSamplingConfig
}

export interface SimulationMetrics {
  totalBudget: number
  allocatedBudget: number
  expectedConversions: number
  confidenceScore: number
  lastUpdated: Date
}

export class SimulationService {
  private state: SimulationState = {
    isRunning: false,
    currentProject: null,
    allocator: null,
    lastAllocation: [],
    config: createDefaultConfig()
  }

  private subscribers: Array<(state: SimulationState) => void> = []

  constructor(config?: Partial<ThompsonSamplingConfig>) {
    if (config) {
      this.state.config = { ...this.state.config, ...config }
    }
  }

  // Initialize simulation for a project
  async initializeProject(projectId: string): Promise<void> {
    const supabase = createClient()
    
    // Get project data
    const { data: project, error: projectError } = await supabase
      .from('SPATH_projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      throw new Error(`Failed to load project: ${projectError?.message}`)
    }

    // Get experiments with channels for this project
    const { data: experiments, error: expError } = await supabase
      .from('SPATH_experiments')
      .select(`
        *,
        channels:SPATH_channels (*),
        results:SPATH_results (*)
      `)
      .eq('project_id', projectId)
      .eq('status', 'active')

    if (expError) {
      throw new Error(`Failed to load experiments: ${expError.message}`)
    }

    // Initialize Thompson Sampling Allocator
    const allocator = new ThompsonSamplingAllocator(this.state.config)

    // Add channels to the allocator
    if (experiments) {
      experiments.forEach(exp => {
        if (exp.channels) {
          exp.channels.forEach((channel: any) => {
            // Calculate performance metrics from results
            const channelResults = exp.results?.filter((r: any) => r.channel_id === channel.id) || []
            const totalConversions = channelResults.reduce((sum: number, r: any) => sum + (r.conversions || 0), 0)
            const totalImpressions = channelResults.reduce((sum: number, r: any) => sum + (r.impressions || 0), 0)
            const totalBudget = channelResults.reduce((sum: number, r: any) => sum + (r.spend || 0), 0)

            const channelArm: Omit<ChannelArm, 'alpha' | 'beta' | 'lastUpdated'> = {
              id: channel.id,
              name: channel.name,
              type: channel.channel_type,
              totalConversions,
              totalImpressions,
              totalBudget
            }

            allocator.addChannel(channelArm)
          })
        }
      })
    }

    this.state = {
      ...this.state,
      currentProject: project,
      allocator,
      isRunning: false
    }

    this.notifySubscribers()
  }

  // Run Thompson Sampling allocation
  async allocateBudget(): Promise<AllocationResult[]> {
    if (!this.state.allocator) {
      throw new Error('Simulation not initialized. Call initializeProject first.')
    }

    const allocation = this.state.allocator.allocateBudget()
    
    this.state = {
      ...this.state,
      lastAllocation: allocation,
      isRunning: true
    }

    // Save allocation to database
    await this.saveAllocation(allocation)
    
    this.notifySubscribers()
    return allocation
  }

  // Update channel performance and recalculate
  async updateChannelPerformance(
    channelId: string, 
    newConversions: number, 
    newImpressions: number,
    budgetSpent: number
  ): Promise<AllocationResult[]> {
    if (!this.state.allocator) {
      throw new Error('Simulation not initialized')
    }

    // Update the allocator
    this.state.allocator.updateChannelPerformance(
      channelId,
      newConversions,
      newImpressions,
      budgetSpent
    )

    // Get new allocation
    const newAllocation = this.state.allocator.allocateBudget()
    
    this.state = {
      ...this.state,
      lastAllocation: newAllocation
    }

    // Save updated performance to database
    await this.saveChannelUpdate(channelId, newConversions, newImpressions, budgetSpent)
    
    this.notifySubscribers()
    return newAllocation
  }

  // Get current simulation metrics
  getMetrics(): SimulationMetrics {
    if (!this.state.allocator || !this.state.lastAllocation.length) {
      return {
        totalBudget: this.state.config.totalBudget,
        allocatedBudget: 0,
        expectedConversions: 0,
        confidenceScore: 0,
        lastUpdated: new Date()
      }
    }

    const allocatedBudget = this.state.lastAllocation.reduce((sum, a) => sum + a.allocatedBudget, 0)
    const expectedConversions = this.state.lastAllocation.reduce(
      (sum, a) => sum + (a.allocatedBudget * a.expectedConversionRate), 
      0
    )
    const avgConfidence = this.state.lastAllocation.reduce(
      (sum, a) => sum + a.confidenceInterval.confidence, 
      0
    ) / this.state.lastAllocation.length

    return {
      totalBudget: this.state.config.totalBudget,
      allocatedBudget,
      expectedConversions,
      confidenceScore: avgConfidence,
      lastUpdated: new Date()
    }
  }

  // Get channel performance summary
  getChannelSummary() {
    if (!this.state.allocator) {
      return []
    }
    return this.state.allocator.getChannelSummary()
  }

  // Check decision gates
  checkDecisionGates() {
    if (!this.state.allocator || !this.state.lastAllocation.length) {
      return []
    }
    return this.state.allocator.checkDecisionGates(this.state.lastAllocation)
  }

  // Simulate a time period
  async simulatePeriod(days: number = 7, noiseVariance: number = 0.05) {
    if (!this.state.allocator || !this.state.lastAllocation.length) {
      throw new Error('No allocation to simulate')
    }

    const results = this.state.allocator.simulatePeriod(
      this.state.lastAllocation,
      days,
      noiseVariance
    )

    // Save simulation results to database
    await this.saveSimulationResults(results)

    return results
  }

  // Subscribe to state changes
  subscribe(callback: (state: SimulationState) => void): () => void {
    this.subscribers.push(callback)
    
    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  // Get current state
  getState(): SimulationState {
    return { ...this.state }
  }

  // Update configuration
  updateConfig(newConfig: Partial<ThompsonSamplingConfig>) {
    this.state.config = { ...this.state.config, ...newConfig }

    // Reinitialize allocator and rehydrate channels if it exists
    if (this.state.allocator) {
      const prevSummary = this.state.allocator.getChannelSummary()
      this.state.allocator = new ThompsonSamplingAllocator(this.state.config)
      for (const ch of prevSummary) {
        const channelArm: Omit<ChannelArm, 'alpha' | 'beta' | 'lastUpdated'> = {
          id: ch.channelId,
          name: ch.name,
          type: ch.type,
          totalConversions: ch.totalConversions,
          totalImpressions: ch.totalImpressions,
          totalBudget: ch.totalBudget
        }
        this.state.allocator.addChannel(channelArm)
      }
    }

    this.notifySubscribers()
  }

  // Stop simulation
  stopSimulation() {
    this.state = {
      ...this.state,
      isRunning: false
    }
    this.notifySubscribers()
  }

  // Private methods
  private notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.state)
      } catch (error) {
        console.error('Simulation subscriber error:', error)
      }
    })
  }

  private async saveAllocation(allocation: AllocationResult[]) {
    if (!this.state.currentProject) return

    const supabase = createClient()
    
    // Save allocation results to database
    for (const result of allocation) {
      await supabase
        .from('SPATH_results')
        .insert({
          project_id: this.state.currentProject.id,
          channel_id: result.channelId,
          date: new Date().toISOString().split('T')[0],
          allocated_budget: result.allocatedBudget,
          expected_conversion_rate: result.expectedConversionRate,
          confidence_lower: result.confidenceInterval.lower,
          confidence_upper: result.confidenceInterval.upper,
          allocation_type: 'thompson_sampling'
        })
    }
  }

  private async saveChannelUpdate(
    channelId: string,
    conversions: number,
    impressions: number,
    spend: number
  ) {
    if (!this.state.currentProject) return

    const supabase = createClient()
    
    await supabase
      .from('SPATH_results')
      .insert({
        project_id: this.state.currentProject.id,
        channel_id: channelId,
        date: new Date().toISOString().split('T')[0],
        conversions,
        impressions,
        spend,
        allocation_type: 'performance_update'
      })
  }

  private async saveSimulationResults(results: Array<{
    channelId: string;
    day: number;
    conversions: number;
    impressions: number;
    cost: number;
  }>) {
    if (!this.state.currentProject) return

    const supabase = createClient()
    
    for (const result of results) {
      await supabase
        .from('SPATH_results')
        .insert({
          project_id: this.state.currentProject.id,
          channel_id: result.channelId,
          date: new Date(Date.now() + result.day * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          conversions: result.conversions,
          impressions: result.impressions,
          spend: result.cost,
          allocation_type: 'simulation'
        })
    }
  }
}

// Global simulation service instance
let globalSimulationService: SimulationService | null = null

export function getSimulationService(): SimulationService {
  if (!globalSimulationService) {
    globalSimulationService = new SimulationService()
  }
  return globalSimulationService
}

export function createSimulationService(config?: Partial<ThompsonSamplingConfig>): SimulationService {
  return new SimulationService(config)
}
