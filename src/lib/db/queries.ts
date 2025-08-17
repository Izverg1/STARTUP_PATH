import { createServerSupabaseClient } from '@/lib/supabase/client'
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/client'

// =============================================================================
// Type Aliases for Convenience
// =============================================================================

type Organization = Tables<'sg_orgs'>
type User = Tables<'sg_users'>
type Project = Tables<'sg_projects'>
type Experiment = Tables<'sg_experiments'>
type Channel = Tables<'sg_channels'>
type Gate = Tables<'sg_gates'>
type Result = Tables<'sg_results'>
type Decision = Tables<'sg_decisions'>
type Benchmark = Tables<'sg_benchmarks'>
type Agent = Tables<'sg_agents'>
type AgentState = Tables<'sg_agent_state'>
type Artifact = Tables<'sg_artifacts'>
type FactSheet = Tables<'sg_fact_sheets'>

type OrganizationInsert = TablesInsert<'sg_orgs'>
type UserInsert = TablesInsert<'sg_users'>
type ProjectInsert = TablesInsert<'sg_projects'>
type ExperimentInsert = TablesInsert<'sg_experiments'>
type ChannelInsert = TablesInsert<'sg_channels'>
type GateInsert = TablesInsert<'sg_gates'>
type ResultInsert = TablesInsert<'sg_results'>
type DecisionInsert = TablesInsert<'sg_decisions'>
type ArtifactInsert = TablesInsert<'sg_artifacts'>

// =============================================================================
// Organization Queries
// =============================================================================

export async function getOrganization(orgId: string): Promise<Organization | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_orgs')
    .select('*')
    .eq('id', orgId)
    .single()
  
  if (error) {
    console.error('Error fetching organization:', error.message)
    return null
  }
  
  return data
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_orgs')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Error fetching organization by slug:', error.message)
    return null
  }
  
  return data
}

export async function createOrganization(org: OrganizationInsert): Promise<Organization | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_orgs')
    .insert(org)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating organization:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// User Queries
// =============================================================================

export async function getUserProfile(userId: string): Promise<(User & { sg_orgs: Organization }) | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_users')
    .select(`
      *,
      sg_orgs:org_id (
        id,
        name,
        slug,
        subscription_tier,
        settings
      )
    `)
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user profile:', error.message)
    return null
  }
  
  return data as User & { sg_orgs: Organization }
}

export async function getOrganizationUsers(orgId: string): Promise<User[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_users')
    .select('*')
    .eq('org_id', orgId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching organization users:', error.message)
    return []
  }
  
  return data
}

export async function createUser(user: UserInsert): Promise<User | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_users')
    .insert(user)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating user:', error.message)
    return null
  }
  
  return data
}

export async function updateUserProfile(userId: string, updates: Partial<TablesUpdate<'sg_users'>>): Promise<User | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating user profile:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// Project Queries
// =============================================================================

export async function getOrganizationProjects(orgId: string): Promise<Project[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_projects')
    .select('*')
    .eq('org_id', orgId)
    .order('updated_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching organization projects:', error.message)
    return []
  }
  
  return data
}

export async function getProject(projectId: string): Promise<Project | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_projects')
    .select('*')
    .eq('id', projectId)
    .single()
  
  if (error) {
    console.error('Error fetching project:', error.message)
    return null
  }
  
  return data
}

export async function createProject(project: ProjectInsert): Promise<Project | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_projects')
    .insert(project)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating project:', error.message)
    return null
  }
  
  return data
}

export async function updateProject(projectId: string, updates: Partial<TablesUpdate<'sg_projects'>>): Promise<Project | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating project:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// Experiment Queries
// =============================================================================

export async function getProjectExperiments(projectId: string): Promise<Experiment[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_experiments')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching project experiments:', error.message)
    return []
  }
  
  return data
}

export async function getExperiment(experimentId: string): Promise<Experiment | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_experiments')
    .select('*')
    .eq('id', experimentId)
    .single()
  
  if (error) {
    console.error('Error fetching experiment:', error.message)
    return null
  }
  
  return data
}

export async function getExperimentWithChannels(experimentId: string): Promise<(Experiment & { channels: (Channel & { gates: Gate[] })[] }) | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_experiments')
    .select(`
      *,
      channels:sg_channels (
        *,
        gates:sg_gates (*)
      )
    `)
    .eq('id', experimentId)
    .single()
  
  if (error) {
    console.error('Error fetching experiment with channels:', error.message)
    return null
  }
  
  return data as Experiment & { channels: (Channel & { gates: Gate[] })[] }
}

export async function createExperiment(experiment: ExperimentInsert): Promise<Experiment | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_experiments')
    .insert(experiment)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating experiment:', error.message)
    return null
  }
  
  return data
}

export async function updateExperiment(experimentId: string, updates: Partial<TablesUpdate<'sg_experiments'>>): Promise<Experiment | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_experiments')
    .update(updates)
    .eq('id', experimentId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating experiment:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// Channel Queries
// =============================================================================

export async function getExperimentChannels(experimentId: string): Promise<(Channel & { gates: Gate[] })[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_channels')
    .select(`
      *,
      gates:sg_gates (*)
    `)
    .eq('experiment_id', experimentId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching experiment channels:', error.message)
    return []
  }
  
  return data as (Channel & { gates: Gate[] })[]
}

export async function createChannel(channel: ChannelInsert): Promise<Channel | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_channels')
    .insert(channel)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating channel:', error.message)
    return null
  }
  
  return data
}

export async function updateChannelWeight(channelId: string, weight: number): Promise<Channel | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_channels')
    .update({ current_weight: weight })
    .eq('id', channelId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating channel weight:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// Gate Queries
// =============================================================================

export async function createGate(gate: GateInsert): Promise<Gate | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_gates')
    .insert(gate)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating gate:', error.message)
    return null
  }
  
  return data
}

export async function getChannelGates(channelId: string): Promise<Gate[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_gates')
    .select('*')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching channel gates:', error.message)
    return []
  }
  
  return data
}

// =============================================================================
// Results Queries
// =============================================================================

export async function getChannelResults(channelId: string, startDate?: string, endDate?: string): Promise<Result[]> {
  const supabase = await createServerSupabaseClient()
  
  let query = supabase
    .from('sg_results')
    .select('*')
    .eq('channel_id', channelId)
    .order('date', { ascending: true })
  
  if (startDate) {
    query = query.gte('date', startDate)
  }
  
  if (endDate) {
    query = query.lte('date', endDate)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching channel results:', error.message)
    return []
  }
  
  return data
}

export async function getExperimentResults(experimentId: string, startDate?: string, endDate?: string): Promise<(Result & { channel: Channel })[]> {
  const supabase = await createServerSupabaseClient()
  
  let query = supabase
    .from('sg_results')
    .select(`
      *,
      channel:sg_channels (*)
    `)
    .in('channel_id', 
      supabase
        .from('sg_channels')
        .select('id')
        .eq('experiment_id', experimentId)
    )
    .order('date', { ascending: true })
  
  if (startDate) {
    query = query.gte('date', startDate)
  }
  
  if (endDate) {
    query = query.lte('date', endDate)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching experiment results:', error.message)
    return []
  }
  
  return data as (Result & { channel: Channel })[]
}

export async function createResult(result: ResultInsert): Promise<Result | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_results')
    .insert(result)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating result:', error.message)
    return null
  }
  
  return data
}

export async function upsertResult(result: ResultInsert): Promise<Result | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_results')
    .upsert(result, { 
      onConflict: 'channel_id,date',
      ignoreDuplicates: false 
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error upserting result:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// Decision Queries
// =============================================================================

export async function getExperimentDecisions(experimentId: string): Promise<Decision[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_decisions')
    .select('*')
    .eq('experiment_id', experimentId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching experiment decisions:', error.message)
    return []
  }
  
  return data
}

export async function createDecision(decision: DecisionInsert): Promise<Decision | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_decisions')
    .insert(decision)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating decision:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// Benchmark Queries
// =============================================================================

export async function getBenchmarks(channelType?: string, vertical?: string, companySize?: string): Promise<Benchmark[]> {
  const supabase = await createServerSupabaseClient()
  
  let query = supabase
    .from('sg_benchmarks')
    .select('*')
    .order('updated_at', { ascending: false })
  
  if (channelType) {
    query = query.eq('channel_type', channelType)
  }
  
  if (vertical) {
    query = query.eq('vertical', vertical)
  }
  
  if (companySize) {
    query = query.eq('company_size', companySize)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching benchmarks:', error.message)
    return []
  }
  
  return data
}

export async function getBenchmarkForMetric(
  metric: string, 
  channelType?: string, 
  vertical?: string, 
  companySize?: string
): Promise<Benchmark | null> {
  const supabase = await createServerSupabaseClient()
  
  let query = supabase
    .from('sg_benchmarks')
    .select('*')
    .eq('metric', metric)
  
  if (channelType) {
    query = query.eq('channel_type', channelType)
  }
  
  if (vertical) {
    query = query.eq('vertical', vertical)
  }
  
  if (companySize) {
    query = query.eq('company_size', companySize)
  }
  
  const { data, error } = await query.single()
  
  if (error) {
    console.error('Error fetching benchmark for metric:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// Agent Queries
// =============================================================================

export async function getAgents(): Promise<Agent[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_agents')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching agents:', error.message)
    return []
  }
  
  return data
}

export async function getProjectAgentStates(projectId: string): Promise<AgentState[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_agent_state')
    .select('*')
    .eq('project_id', projectId)
  
  if (error) {
    console.error('Error fetching project agent states:', error.message)
    return []
  }
  
  return data
}

export async function upsertAgentState(projectId: string, agentKey: string, state: Partial<TablesUpdate<'sg_agent_state'>>): Promise<AgentState | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_agent_state')
    .upsert({
      project_id: projectId,
      agent_key: agentKey,
      ...state
    }, {
      onConflict: 'project_id,agent_key',
      ignoreDuplicates: false
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error upserting agent state:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// Artifact Queries
// =============================================================================

export async function getProjectArtifacts(projectId: string, limit: number = 50): Promise<Artifact[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_artifacts')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching project artifacts:', error.message)
    return []
  }
  
  return data
}

export async function createArtifact(artifact: ArtifactInsert): Promise<Artifact | null> {
  const supabase = await createServerSupabaseClient()
  
  // Mark previous versions as not current
  if (artifact.is_current) {
    await supabase
      .from('sg_artifacts')
      .update({ is_current: false })
      .eq('project_id', artifact.project_id)
      .eq('agent_key', artifact.agent_key)
      .eq('type', artifact.type)
  }
  
  const { data, error } = await supabase
    .from('sg_artifacts')
    .insert(artifact)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating artifact:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// Fact Sheet Queries
// =============================================================================

export async function getProjectFactSheets(projectId: string): Promise<FactSheet[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('sg_fact_sheets')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching project fact sheets:', error.message)
    return []
  }
  
  return data
}

export async function getLatestFactSheet(projectId: string, experimentId?: string): Promise<FactSheet | null> {
  const supabase = await createServerSupabaseClient()
  
  let query = supabase
    .from('sg_fact_sheets')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(1)
  
  if (experimentId) {
    query = query.eq('experiment_id', experimentId)
  }
  
  const { data, error } = await query.single()
  
  if (error) {
    console.error('Error fetching latest fact sheet:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// Analytics and Calculations
// =============================================================================

export async function calculateExperimentMetrics(experimentId: string, startDate?: string, endDate?: string): Promise<{
  totalCost: number;
  totalMeetings: number;
  cpqm: number;
  totalOpportunities: number;
  totalWins: number;
  conversionRate: number;
  cac: number;
} | null> {
  const results = await getExperimentResults(experimentId, startDate, endDate)
  
  if (!results.length) return null
  
  const totals = results.reduce((acc, result) => {
    const metrics = result.metrics as any
    const costs = result.costs as any
    
    return {
      totalCost: acc.totalCost + (costs.total_cost || 0),
      totalMeetings: acc.totalMeetings + (metrics.meetings_held || 0),
      totalOpportunities: acc.totalOpportunities + (metrics.opportunities || 0),
      totalWins: acc.totalWins + (metrics.wins || 0),
      totalLeads: acc.totalLeads + (metrics.leads || 0)
    }
  }, {
    totalCost: 0,
    totalMeetings: 0,
    totalOpportunities: 0,
    totalWins: 0,
    totalLeads: 0
  })
  
  const cpqm = totals.totalMeetings > 0 ? totals.totalCost / totals.totalMeetings : 0
  const conversionRate = totals.totalLeads > 0 ? totals.totalWins / totals.totalLeads : 0
  const cac = totals.totalWins > 0 ? totals.totalCost / totals.totalWins : 0
  
  return {
    totalCost: totals.totalCost,
    totalMeetings: totals.totalMeetings,
    cpqm,
    totalOpportunities: totals.totalOpportunities,
    totalWins: totals.totalWins,
    conversionRate,
    cac
  }
}

// =============================================================================
// Error Handling Utilities
// =============================================================================

export function handleDatabaseError(error: any, operation: string): void {
  console.error(`Database error in ${operation}:`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  })
}

// =============================================================================
// Query Builder Utilities
// =============================================================================

export function buildDateRangeFilter(startDate?: string, endDate?: string) {
  return {
    startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days ago
    endDate: endDate || new Date().toISOString().split('T')[0] // Default to today
  }
}