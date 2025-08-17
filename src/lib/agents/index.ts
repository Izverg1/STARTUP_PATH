export { BaseAgent } from './base'
export { ChannelScoutAgent } from './channel-scout'
export { OfferAlchemistAgent } from './offer-alchemist'
export { SignalWranglerAgent } from './signal-wrangler'
export { BudgetCaptainAgent } from './budget-captain'

// Agent registry for easy instantiation
export const AgentRegistry = {
  channel_scout: ChannelScoutAgent,
  offer_alchemist: OfferAlchemistAgent,
  signal_wrangler: SignalWranglerAgent,
  budget_captain: BudgetCaptainAgent
} as const

// Factory function to create agents
export function createAgent(key: keyof typeof AgentRegistry) {
  const AgentClass = AgentRegistry[key]
  return new AgentClass()
}

// Create all agents
export function createAllAgents() {
  return {
    channel_scout: new ChannelScoutAgent(),
    offer_alchemist: new OfferAlchemistAgent(),
    signal_wrangler: new SignalWranglerAgent(),
    budget_captain: new BudgetCaptainAgent()
  }
}