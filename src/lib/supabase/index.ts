// Main Supabase exports for the SOL:GEN platform
// This file provides a clean interface to all Supabase functionality

// =============================================================================
// Client exports
// =============================================================================

export {
  createClient,
  type Database,
  type Tables,
  type TablesInsert,
  type TablesUpdate,
  type Enums
} from './client'

// Server-side exports (only for server components and API routes)
export {
  createServerSupabaseClient,
  createMiddlewareClient,
  createAdminClient,
  getUser,
  getSession,
  getUserProfile
} from './server'

// =============================================================================
// Query utilities exports
// =============================================================================

export {
  // Organization queries
  getOrganization,
  getOrganizationBySlug,
  createOrganization,
  updateOrganization,

  // User queries
  getUserProfile as getUserProfileDetailed,
  getOrganizationUsers,
  createUser,
  updateUserProfile,

  // Project queries
  getOrganizationProjects,
  getProject,
  createProject,
  updateProject,

  // Experiment queries
  getProjectExperiments,
  getExperiment,
  getExperimentWithChannels,
  createExperiment,
  updateExperiment,

  // Channel queries
  getExperimentChannels,
  createChannel,
  updateChannelWeight,

  // Gate queries
  createGate,
  getChannelGates,

  // Results queries
  getChannelResults,
  getExperimentResults,
  createResult,
  upsertResult,

  // Decision queries
  getExperimentDecisions,
  createDecision,

  // Benchmark queries
  getBenchmarks,
  getBenchmarkForMetric,

  // Agent queries
  getAgents,
  getProjectAgentStates,
  upsertAgentState,

  // Artifact queries
  getProjectArtifacts,
  createArtifact,

  // Fact sheet queries
  getProjectFactSheets,
  getLatestFactSheet,

  // Analytics
  calculateExperimentMetrics,

  // Utilities
  handleDatabaseError,
  buildDateRangeFilter
} from '../db/queries'

// =============================================================================
// Middleware exports
// =============================================================================

export {
  updateSession,
  config as middlewareConfig
} from './middleware'

// =============================================================================
// Seeding utilities exports
// =============================================================================

export {
  DatabaseSeeder,
  databaseSeeder
} from './seed'

// =============================================================================
// Type exports
// =============================================================================

export type {
  Json
} from './types'

// Re-export specific table types for convenience
export type Organization = Tables<'SPATH_organizations'>
export type User = Tables<'SPATH_users'>
export type Project = Tables<'SPATH_projects'>
export type Experiment = Tables<'SPATH_experiments'>
export type Channel = Tables<'SPATH_channels'>
export type Gate = Tables<'SPATH_gates'>
export type Result = Tables<'SPATH_results'>
export type Decision = Tables<'SPATH_decisions'>
export type Benchmark = Tables<'SPATH_benchmarks'>
export type Agent = Tables<'SPATH_agents'>
export type AgentState = Tables<'SPATH_agent_state'>
export type Artifact = Tables<'SPATH_artifacts'>
export type FactSheet = Tables<'SPATH_fact_sheets'>
export type Ruleset = Tables<'SPATH_rulesets'>
export type Rule = Tables<'SPATH_rules'>
export type Space = Tables<'SPATH_spaces'>
export type Thread = Tables<'SPATH_threads'>
export type Comment = Tables<'SPATH_comments'>

// Re-export enum types for convenience
export type UserRole = Enums<'user_role'>
export type SubscriptionTier = Enums<'subscription_tier'>
export type ProjectStatus = Enums<'project_status'>
export type ProjectMode = Enums<'project_mode'>
export type ChannelType = Enums<'channel_type'>
export type ExperimentStatus = Enums<'experiment_status'>
export type DecisionType = Enums<'decision_type'>
export type AgentStatus = Enums<'agent_status'>
export type ArtifactType = Enums<'artifact_type'>
export type GateMetric = Enums<'gate_metric'>
export type GateOperator = Enums<'gate_operator'>
export type CompanySize = Enums<'company_size'>
export type GeographicRegion = Enums<'geographic_region'>
export type SalesMotion = Enums<'sales_motion'>
export type NotificationTrigger = Enums<'notification_trigger'>

// =============================================================================
// Helper functions for common operations
// =============================================================================

// Note: getCurrentUserWithOrg moved to server.ts to avoid client-side issues

/**
 * Check if a user has permission to access a resource
 */
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = { owner: 3, contributor: 2, viewer: 1 }
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

/**
 * Format currency values for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Format percentage values for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Calculate days between two dates
 */
export function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Generate a URL-safe slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get a friendly display name for channel types
 */
export function getChannelDisplayName(channelType: ChannelType): string {
  const displayNames = {
    google_search: 'Google Search',
    linkedin_inmail: 'LinkedIn InMail',
    webinar: 'Webinar',
    content_marketing: 'Content Marketing',
    outbound_email: 'Outbound Email',
    events: 'Events',
    partnerships: 'Partnerships',
    referrals: 'Referrals',
    social_media: 'Social Media',
    paid_social: 'Paid Social'
  }
  
  return displayNames[channelType] || channelType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Get a friendly display name for gate metrics
 */
export function getGateMetricDisplayName(metric: GateMetric): string {
  const displayNames = {
    reply_rate: 'Reply Rate',
    click_through_rate: 'Click-Through Rate',
    conversion_rate: 'Conversion Rate',
    cost_per_lead: 'Cost per Lead',
    cost_per_meeting: 'Cost per Meeting',
    meeting_show_rate: 'Meeting Show Rate',
    opportunity_rate: 'Opportunity Rate',
    close_rate: 'Close Rate',
    cac_payback_months: 'CAC Payback (Months)'
  }
  
  return displayNames[metric] || metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Get status color for UI components
 */
export function getStatusColor(status: string): string {
  const colors = {
    // Experiment status
    draft: 'gray',
    running: 'green',
    paused: 'yellow',
    completed: 'blue',
    killed: 'red',
    
    // Agent status
    idle: 'gray',
    working: 'blue',
    blocked: 'red',
    done: 'green',
    
    // Project status
    active: 'green',
    archived: 'gray'
  }
  
  return colors[status as keyof typeof colors] || 'gray'
}