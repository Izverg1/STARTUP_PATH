export { BaseAgent } from './base'
export { ChannelDiscoveryEngineAgent } from './channel-scout'
export { CampaignOptimizationEngineAgent } from './offer-alchemist'
export { PerformanceAnalyticsEngineAgent } from './signal-wrangler'
export { BudgetAllocationEngineAgent } from './budget-captain'

// Agent registry for easy instantiation
export const AgentRegistry = {
  channel_discovery_engine: ChannelDiscoveryEngineAgent,
  campaign_optimization_engine: CampaignOptimizationEngineAgent,
  performance_analytics_engine: PerformanceAnalyticsEngineAgent,
  budget_allocation_engine: BudgetAllocationEngineAgent
} as const

// Factory function to create agents
export function createAgent(key: keyof typeof AgentRegistry) {
  const AgentClass = AgentRegistry[key]
  return new AgentClass()
}

// Create all agents
export function createAllAgents() {
  return {
    channel_discovery_engine: new ChannelDiscoveryEngineAgent(),
    campaign_optimization_engine: new CampaignOptimizationEngineAgent(),
    performance_analytics_engine: new PerformanceAnalyticsEngineAgent(),
    budget_allocation_engine: new BudgetAllocationEngineAgent()
  }
}