import { createClient } from '@/lib/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/client'

// =============================================================================
// Type Aliases for Convenience
// =============================================================================

type Organization = Tables<'SPATH_organizations'>
type User = Tables<'SPATH_users'>
type Project = Tables<'SPATH_projects'>
type Experiment = Tables<'SPATH_experiments'>
type Channel = Tables<'SPATH_channels'>
type Gate = Tables<'SPATH_gates'>
type Result = Tables<'SPATH_results'>

type ProjectInsert = TablesInsert<'SPATH_projects'>

// =============================================================================
// User Queries (Client-side)
// =============================================================================

export async function getUserProfile(userId: string): Promise<(User & { SPATH_organizations: Organization }) | null> {
  const supabase = createClient()
  
  // Get user profile first
  const { data: user, error: userError } = await supabase
    .from('SPATH_users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (userError) {
    console.error('Error fetching user profile:', userError.message)
    return null
  }

  if (!user) {
    return null
  }

  // Get organization separately if user has org_id
  let organization = null
  if (user.org_id) {
    const { data: org, error: orgError } = await supabase
      .from('SPATH_organizations')
      .select('id, name, slug, subscription_tier, settings')
      .eq('id', user.org_id)
      .single()
    
    if (!orgError && org) {
      organization = org
    }
  }
  
  return {
    ...user,
    SPATH_organizations: organization
  } as User & { SPATH_organizations: Organization }
}

export async function getOrganizationTeamMembers(orgId: string): Promise<User[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('SPATH_users')
    .select('*')
    .eq('org_id', orgId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching organization team members:', error.message)
    return []
  }
  
  return data
}

export async function inviteTeamMember(orgId: string, email: string, role: 'admin' | 'contributor' | 'viewer' = 'contributor'): Promise<User | null> {
  const supabase = createClient()
  
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('SPATH_users')
    .select('*')
    .eq('email', email)
    .single()
  
  if (existingUser) {
    console.error('User already exists with this email')
    return null
  }
  
  // Create invitation - in a real app, this would send an email
  // For now, we'll create a pending user record
  const { data, error } = await supabase
    .from('SPATH_users')
    .insert({
      email,
      name: email.split('@')[0], // Temporary name from email
      org_id: orgId,
      role,
      is_active: false, // Will be activated when user accepts invitation
      onboarding_completed: false
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating team member invitation:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// Project Queries (Client-side)
// =============================================================================

export async function getOrganizationProjects(orgId: string): Promise<Project[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('SPATH_projects')
      .select('*')
      .eq('org_id', orgId)
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching organization projects:', error.message)
      // If it's a missing table error, return empty array gracefully
      if (error.message.includes('does not exist') || error.message.includes('relation') || error.message.includes('table')) {
        console.warn('Database tables may not be set up yet. Returning empty projects array.')
        return []
      }
      return []
    }
    
    return data || []
  } catch (err) {
    console.error('Database connection error:', err)
    return []
  }
}

export async function createProject(project: ProjectInsert): Promise<Project | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('SPATH_projects')
    .insert(project)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating project:', error.message)
    return null
  }
  
  return data
}

// =============================================================================
// Experiment Queries (Client-side)
// =============================================================================

export async function getProjectExperiments(projectId: string): Promise<Experiment[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('SPATH_experiments')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching project experiments:', error.message)
    return []
  }
  
  return data
}

export async function getProjectExperimentsWithChannels(projectId: string): Promise<ExperimentWithChannels[]> {
  const supabase = createClient()
  
  try {
    // For now, return empty array since experiment tables don't exist yet
    // This prevents the relationship error until the full schema is implemented
    console.warn('Experiment tables not yet implemented - returning empty array')
    return []
    
    // TODO: Uncomment when experiment tables are created
    // const { data, error } = await supabase
    //   .from('SPATH_experiments')
    //   .select('*')
    //   .eq('project_id', projectId)
    //   .order('updated_at', { ascending: false })
    // 
    // if (error) {
    //   console.error('Error fetching project experiments:', error.message)
    //   return []
    // }
    
    // TODO: When tables are implemented, return transformed data here
  } catch (err) {
    console.error('Database connection error:', err)
    return []
  }
}

// =============================================================================
// Analytics and Calculations (Client-side)
// =============================================================================

export async function getExperimentResults(experimentId: string, startDate?: string, endDate?: string): Promise<(Result & { channel: Channel })[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('SPATH_results')
    .select(`
      *,
      channel:SPATH_channels (*)
    `)
    .in('channel_id', 
      supabase
        .from('SPATH_channels')
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
// Enhanced Experiment Queries for Real Dashboard Integration
// =============================================================================

export interface ExperimentWithChannels extends Experiment {
  channels: Channel[]
  gates: Gate[]
  results: Result[]
  statistical_significance?: number
  confidence_level?: number
  days_running?: number
  budget_spent?: number
  primary_metric?: string
  current_value?: number
  target_value?: number
  variant_performance?: Array<{
    name: string
    value: number
    conversion_rate: number
    spend: number
  }>
}

export async function getOrganizationExperiments(orgId: string): Promise<ExperimentWithChannels[]> {
  const supabase = createClient()
  
  // Validate UUID format and auto-correct if needed
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(orgId)) {
    // Use fallback UUID for demo org if invalid format detected
    orgId = '550e8400-e29b-41d4-a716-446655440000';
  }
  
  try {
    // First get all projects for the organization
    const { data: projects, error: projectsError } = await supabase
      .from('SPATH_projects')
      .select('id')
      .eq('org_id', orgId)
    
    if (projectsError) {
      console.error('Error fetching organization projects:', projectsError.message)
      return []
    }
    
    if (!projects?.length) return []
    
    const projectIds = projects.map(p => p.id)
    
    const { data, error } = await supabase
      .from('SPATH_experiments')
      .select(`
        *,
        channels:SPATH_channels (*),
        gates:SPATH_gates (*),
        results:SPATH_results (*)
      `)
      .in('project_id', projectIds)
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching organization experiments:', error.message)
      // If it's a missing table error, return empty array gracefully
      if (error.message.includes('does not exist') || error.message.includes('relation') || error.message.includes('table')) {
        console.warn('Database tables may not be set up yet. Returning empty experiments array.')
        return []
      }
      return []
    }
    // Transform the data to match the UI expectations
    return (data || []).map(experiment => {
    const experimentData = experiment as any
    const channels = experimentData.channels || []
    const gates = experimentData.gates || []
    const results = experimentData.results || []
    
    // Calculate derived metrics
    const totalBudgetSpent = results.reduce((sum: number, r: any) => sum + (r.cost || 0), 0)
    const totalMeetings = results.reduce((sum: number, r: any) => sum + (r.meetings || 0), 0)
    const totalLeads = results.reduce((sum: number, r: any) => sum + (r.leads || 0), 0)
    const currentCPQM = totalMeetings > 0 ? totalBudgetSpent / totalMeetings : 0
    
    const daysRunning = experiment.start_date 
      ? Math.ceil((new Date().getTime() - new Date(experiment.start_date).getTime()) / (1000 * 60 * 60 * 24))
      : 0
    
    return {
      ...experiment,
      channels,
      gates,
      results,
      days_running: daysRunning,
      budget_spent: totalBudgetSpent,
      primary_metric: 'CPQM',
      current_value: currentCPQM,
      target_value: experiment.target_cpqm || 100,
      statistical_significance: Math.random() * 0.3 + 0.7, // TODO: Calculate real statistical significance
      confidence_level: Math.random() * 0.2 + 0.8, // TODO: Calculate real confidence level
      variant_performance: [] // TODO: Implement A/B test variants
    }
  })
  } catch (err) {
    console.error('Database connection error:', err)
    return []
  }
}

export async function getActiveExperiments(orgId: string): Promise<ExperimentWithChannels[]> {
  const allExperiments = await getOrganizationExperiments(orgId)
  return allExperiments.filter(exp => exp.status === 'running' || exp.status === 'paused')
}

export async function getCompletedExperiments(orgId: string): Promise<ExperimentWithChannels[]> {
  const allExperiments = await getOrganizationExperiments(orgId)
  return allExperiments.filter(exp => exp.status === 'completed')
}

export async function getFailedExperiments(orgId: string): Promise<ExperimentWithChannels[]> {
  const allExperiments = await getOrganizationExperiments(orgId)
  return allExperiments.filter(exp => exp.status === 'killed')
}

export async function pauseExperiment(experimentId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('SPATH_experiments')
    .update({ status: 'paused', updated_at: new Date().toISOString() })
    .eq('id', experimentId)
  
  if (error) {
    console.error('Error pausing experiment:', error.message)
    return false
  }
  
  return true
}

export async function resumeExperiment(experimentId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('SPATH_experiments')
    .update({ status: 'running', updated_at: new Date().toISOString() })
    .eq('id', experimentId)
  
  if (error) {
    console.error('Error resuming experiment:', error.message)
    return false
  }
  
  return true
}

export async function killExperiment(experimentId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('SPATH_experiments')
    .update({ 
      status: 'killed', 
      end_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString() 
    })
    .eq('id', experimentId)
  
  if (error) {
    console.error('Error killing experiment:', error.message)
    return false
  }
  
  return true
}

// =============================================================================
// Analytics and Effectiveness Queries
// =============================================================================

export interface ChannelPerformance {
  channel: string
  channel_type: string
  spend: number
  revenue: number
  customers: number
  cac: number
  roas: number
  efficiency_score: number
  trend: 'up' | 'down' | 'flat'
}

export interface EffectivenessOverview {
  overall_efficiency_score: number
  mer: number
  roas: number
  blended_cac: number
  ltv_cac_ratio: number
}

export interface OptimizationOpportunity {
  type: 'budget_reallocation' | 'channel_optimization' | 'timing_adjustment'
  description: string
  potential_impact: number
  confidence: number
  effort_required: 'low' | 'medium' | 'high'
  estimated_roi: number
}

export interface TimeSeriesData {
  month: string
  mer: number
  roas: number
  efficiency: number
  spend: number
  revenue: number
}

export interface EffectivenessData {
  overview: EffectivenessOverview
  channelPerformance: ChannelPerformance[]
  timeSeriesData: TimeSeriesData[]
  optimizationOpportunities: OptimizationOpportunity[]
}

export async function getOrganizationEffectivenessData(orgId: string): Promise<EffectivenessData> {
  const supabase = createClient()
  
  // Get all projects for the organization
  const { data: projects } = await supabase
    .from('SPATH_projects')
    .select('id')
    .eq('org_id', orgId)
  
  if (!projects?.length) {
    return {
      overview: {
        overall_efficiency_score: 0,
        mer: 0,
        roas: 0,
        blended_cac: 0,
        ltv_cac_ratio: 0
      },
      channelPerformance: [],
      timeSeriesData: [],
      optimizationOpportunities: []
    }
  }
  
  const projectIds = projects.map(p => p.id)
  
  // Get experiments and their results
  const { data: experiments } = await supabase
    .from('SPATH_experiments')
    .select(`
      *,
      channels:SPATH_channels (*),
      results:SPATH_results (*)
    `)
    .in('project_id', projectIds)
    .eq('status', 'running')
  
  if (!experiments?.length) {
    return {
      overview: {
        overall_efficiency_score: 0,
        mer: 0,
        roas: 0,
        blended_cac: 0,
        ltv_cac_ratio: 0
      },
      channelPerformance: [],
      timeSeriesData: [],
      optimizationOpportunities: []
    }
  }
  
  // Calculate channel performance
  const channelMap = new Map<string, {
    spend: number
    revenue: number
    customers: number
    meetings: number
    opportunities: number
    wins: number
    channel_type: string
  }>()
  
  experiments.forEach(experiment => {
    const experimentData = experiment as any
    const channels = experimentData.channels || []
    const results = experimentData.results || []
    
    channels.forEach((channel: any) => {
      const channelResults = results.filter((r: any) => r.channel_id === channel.id)
      const channelSpend = channelResults.reduce((sum: number, r: any) => sum + (r.cost || 0), 0)
      const channelRevenue = channelResults.reduce((sum: number, r: any) => sum + (r.revenue || 0), 0)
      const channelCustomers = channelResults.reduce((sum: number, r: any) => sum + (r.wins || 0), 0)
      const channelMeetings = channelResults.reduce((sum: number, r: any) => sum + (r.meetings || 0), 0)
      const channelOpportunities = channelResults.reduce((sum: number, r: any) => sum + (r.opportunities || 0), 0)
      const channelWins = channelResults.reduce((sum: number, r: any) => sum + (r.wins || 0), 0)
      
      if (!channelMap.has(channel.name)) {
        channelMap.set(channel.name, {
          spend: 0,
          revenue: 0,
          customers: 0,
          meetings: 0,
          opportunities: 0,
          wins: 0,
          channel_type: channel.type
        })
      }
      
      const existing = channelMap.get(channel.name)!
      channelMap.set(channel.name, {
        ...existing,
        spend: existing.spend + channelSpend,
        revenue: existing.revenue + channelRevenue,
        customers: existing.customers + channelCustomers,
        meetings: existing.meetings + channelMeetings,
        opportunities: existing.opportunities + channelOpportunities,
        wins: existing.wins + channelWins
      })
    })
  })
  
  // Transform to ChannelPerformance format
  const channelPerformance: ChannelPerformance[] = Array.from(channelMap.entries()).map(([channelName, data]) => {
    const cac = data.customers > 0 ? data.spend / data.customers : 0
    const roas = data.spend > 0 ? data.revenue / data.spend : 0
    const efficiency_score = Math.min(10, Math.max(0, (roas * 2) + (data.customers / Math.max(1, data.spend / 1000))))
    
    return {
      channel: channelName,
      channel_type: data.channel_type,
      spend: data.spend,
      revenue: data.revenue,
      customers: data.customers,
      cac,
      roas,
      efficiency_score,
      trend: roas > 3.5 ? 'up' : roas < 2.0 ? 'down' : 'flat'
    }
  })
  
  // Calculate overall metrics
  const totalSpend = channelPerformance.reduce((sum, ch) => sum + ch.spend, 0)
  const totalRevenue = channelPerformance.reduce((sum, ch) => sum + ch.revenue, 0)
  const totalCustomers = channelPerformance.reduce((sum, ch) => sum + ch.customers, 0)
  
  const overview: EffectivenessOverview = {
    overall_efficiency_score: channelPerformance.length > 0 
      ? channelPerformance.reduce((sum, ch) => sum + ch.efficiency_score, 0) / channelPerformance.length
      : 0,
    mer: totalSpend > 0 ? totalRevenue / totalSpend : 0,
    roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
    blended_cac: totalCustomers > 0 ? totalSpend / totalCustomers : 0,
    ltv_cac_ratio: 4.2 // TODO: Calculate from customer data
  }
  
  // Generate sample time series data (last 4 months)
  const timeSeriesData: TimeSeriesData[] = [
    { month: 'Oct', mer: overview.mer * 0.85, roas: overview.roas * 0.90, efficiency: overview.overall_efficiency_score * 0.92, spend: totalSpend * 0.85, revenue: totalRevenue * 0.90 },
    { month: 'Nov', mer: overview.mer * 0.92, roas: overview.roas * 0.95, efficiency: overview.overall_efficiency_score * 0.96, spend: totalSpend * 0.90, revenue: totalRevenue * 0.95 },
    { month: 'Dec', mer: overview.mer * 0.96, roas: overview.roas * 0.98, efficiency: overview.overall_efficiency_score * 0.98, spend: totalSpend * 0.95, revenue: totalRevenue * 0.98 },
    { month: 'Jan', mer: overview.mer, roas: overview.roas, efficiency: overview.overall_efficiency_score, spend: totalSpend, revenue: totalRevenue },
  ]
  
  // Generate optimization opportunities based on channel performance
  const optimizationOpportunities: OptimizationOpportunity[] = []
  
  // Find underperforming channels for budget reallocation
  const sortedChannels = [...channelPerformance].sort((a, b) => b.roas - a.roas)
  if (sortedChannels.length >= 2) {
    const topChannel = sortedChannels[0]
    const bottomChannel = sortedChannels[sortedChannels.length - 1]
    
    if (topChannel.roas > bottomChannel.roas * 1.5) {
      optimizationOpportunities.push({
        type: 'budget_reallocation',
        description: `Shift 15% budget from ${bottomChannel.channel} to ${topChannel.channel}`,
        potential_impact: 0.18,
        confidence: 0.85,
        effort_required: 'low',
        estimated_roi: 2.4
      })
    }
  }
  
  // Find channels with declining trends
  const decliningChannels = channelPerformance.filter(ch => ch.trend === 'down')
  decliningChannels.forEach(channel => {
    optimizationOpportunities.push({
      type: 'channel_optimization',
      description: `Improve ${channel.channel} creative performance`,
      potential_impact: 0.12,
      confidence: 0.72,
      effort_required: 'medium',
      estimated_roi: 1.8
    })
  })
  
  return {
    overview,
    channelPerformance,
    timeSeriesData,
    optimizationOpportunities
  }
}

// =============================================================================
// Agent System Queries
// =============================================================================

export async function getProjectAgents(projectId: string): Promise<Tables<'SPATH_agents'>[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('SPATH_agents')
    .select('*')
    .eq('project_id', projectId)
    .eq('is_active', true)
    .order('agent_key')
  
  if (error) {
    console.error('Error fetching project agents:', error.message)
    return []
  }
  
  return data || []
}

export async function getAgentExecutions(
  agentId: string, 
  limit: number = 20
): Promise<Tables<'SPATH_agent_executions'>[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('SPATH_agent_executions')
    .select('*')
    .eq('agent_id', agentId)
    .order('start_time', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching agent executions:', error.message)
    return []
  }
  
  return data || []
}

export async function getRecentArtifacts(
  projectId: string, 
  agentKey?: string,
  limit: number = 20
): Promise<(Tables<'SPATH_artifacts'> & { 
  execution: Tables<'SPATH_agent_executions'> | null 
})[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('SPATH_artifacts')
    .select(`
      *,
      execution:SPATH_agent_executions (
        id,
        status,
        start_time,
        duration_ms
      )
    `)
    .eq('project_id', projectId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (agentKey) {
    query = query.eq('agent_key', agentKey)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching recent artifacts:', error.message)
    return []
  }
  
  return data as any || []
}

export async function getAgentPerformanceData(projectId: string): Promise<{
  agents: Array<{
    agent_key: string
    status: string
    total_executions: number
    successful_executions: number
    failed_executions: number
    avg_duration_ms: number
    artifacts_created: number
    last_activity: string | null
  }>
  recent_executions: Tables<'SPATH_agent_executions'>[]
}> {
  const supabase = createClient()
  
  // Get agent statistics
  const { data: agents, error: agentsError } = await supabase
    .from('SPATH_agents')
    .select(`
      agent_key,
      status,
      last_activity,
      SPATH_agent_executions (
        status,
        duration_ms,
        artifacts_created
      )
    `)
    .eq('project_id', projectId)
    .eq('is_active', true)
  
  if (agentsError) {
    console.error('Error fetching agent performance data:', agentsError.message)
    return { agents: [], recent_executions: [] }
  }
  
  // Get recent executions across all agents
  const { data: recentExecutions, error: executionsError } = await supabase
    .from('SPATH_agent_executions')
    .select('*')
    .in('agent_id', 
      supabase
        .from('SPATH_agents')
        .select('id')
        .eq('project_id', projectId)
    )
    .order('start_time', { ascending: false })
    .limit(50)
  
  if (executionsError) {
    console.error('Error fetching recent executions:', executionsError.message)
  }
  
  // Transform agent data
  const agentStats = (agents || []).map((agent: any) => {
    const executions = agent.SPATH_agent_executions || []
    const totalExecutions = executions.length
    const successfulExecutions = executions.filter((e: any) => e.status === 'completed').length
    const failedExecutions = executions.filter((e: any) => e.status === 'failed').length
    const avgDuration = totalExecutions > 0 
      ? executions.reduce((sum: number, e: any) => sum + (e.duration_ms || 0), 0) / totalExecutions
      : 0
    const artifactsCreated = executions.reduce((sum: number, e: any) => sum + (e.artifacts_created?.length || 0), 0)
    
    return {
      agent_key: agent.agent_key,
      status: agent.status,
      total_executions: totalExecutions,
      successful_executions: successfulExecutions,
      failed_executions: failedExecutions,
      avg_duration_ms: avgDuration,
      artifacts_created: artifactsCreated,
      last_activity: agent.last_activity
    }
  })
  
  return {
    agents: agentStats,
    recent_executions: recentExecutions || []
  }
}

export async function updateAgentStatus(
  projectId: string,
  agentKey: string,
  status: 'idle' | 'working' | 'blocked' | 'done',
  statusLine?: string
): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('SPATH_agents')
    .update({
      status,
      status_line: statusLine || status,
      last_activity: new Date().toISOString()
    })
    .eq('project_id', projectId)
    .eq('agent_key', agentKey)
  
  if (error) {
    console.error('Error updating agent status:', error.message)
    return false
  }
  
  return true
}

// =============================================================================
// Business Rules Queries (Placeholder for future implementation)
// =============================================================================

export interface BusinessRuleSummary {
  id: string
  name: string
  description: string
  is_active: boolean
  approval_status: 'draft' | 'pending_approval' | 'approved' | 'rejected'
  last_triggered?: string
  trigger_count: number
  actions_taken: number
}

export async function getProjectRules(projectId: string): Promise<BusinessRuleSummary[]> {
  // TODO: Implement when rules tables are created
  // Placeholder returning empty array for now
  return []
}

// =============================================================================
// Dynamic Benchmarks Queries
// =============================================================================

export interface DynamicBenchmark {
  metric: string
  category: string
  current_value: number
  benchmark_value: number
  percentile_25: number
  percentile_75: number
  industry_average: number
  performance_status: 'excellent' | 'good' | 'average' | 'poor'
  trend: 'up' | 'down' | 'flat'
  last_calculated: string
}

// =============================================================================
// User Profile Management (Client-side)
// =============================================================================

export async function updateUserProfile(userId: string, updates: Partial<TablesUpdate<'SPATH_users'>>): Promise<User | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('SPATH_users')
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

export async function updateOrganization(orgId: string, updates: Partial<TablesUpdate<'SPATH_organizations'>>): Promise<Organization | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('SPATH_organizations')
    .update(updates)
    .eq('id', orgId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating organization:', error.message)
    return null
  }
  
  return data
}

export async function getOrganizationUsers(orgId: string): Promise<User[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('SPATH_users')
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

export async function calculateDynamicBenchmarks(orgId: string): Promise<DynamicBenchmark[]> {
  const supabase = createClient()
  
  // Get organization's performance data
  const effectivenessData = await getOrganizationEffectivenessData(orgId)
  
  // Get static benchmark data for comparison
  const { data: staticBenchmarks, error } = await supabase
    .from('SPATH_benchmarks')
    .select('*')
    .order('metric')
  
  if (error) {
    console.error('Error fetching static benchmarks:', error.message)
    return []
  }
  
  const benchmarks: DynamicBenchmark[] = []
  
  // Email Marketing Metrics
  const emailMetrics = effectivenessData.channelPerformance.filter(ch => 
    ch.channel_type === 'outbound_email' || ch.channel.toLowerCase().includes('email')
  )
  
  if (emailMetrics.length > 0) {
    const avgEmailCac = emailMetrics.reduce((sum, ch) => sum + ch.cac, 0) / emailMetrics.length
    const avgEmailRoas = emailMetrics.reduce((sum, ch) => sum + ch.roas, 0) / emailMetrics.length
    
    benchmarks.push({
      metric: 'Email CAC',
      category: 'Email Marketing',
      current_value: avgEmailCac,
      benchmark_value: 1200, // Industry benchmark
      percentile_25: 800,
      percentile_75: 2000,
      industry_average: 1200,
      performance_status: avgEmailCac < 1000 ? 'excellent' : avgEmailCac < 1400 ? 'good' : avgEmailCac < 2000 ? 'average' : 'poor',
      trend: avgEmailRoas > 3.5 ? 'up' : avgEmailRoas < 2.0 ? 'down' : 'flat',
      last_calculated: new Date().toISOString()
    })
  }
  
  // Overall Performance Metrics
  benchmarks.push({
    metric: 'Blended CAC',
    category: 'Overall Performance',
    current_value: effectivenessData.overview.blended_cac,
    benchmark_value: 1500,
    percentile_25: 1000,
    percentile_75: 2500,
    industry_average: 1500,
    performance_status: effectivenessData.overview.blended_cac < 1200 ? 'excellent' : 
                       effectivenessData.overview.blended_cac < 1800 ? 'good' : 
                       effectivenessData.overview.blended_cac < 2500 ? 'average' : 'poor',
    trend: effectivenessData.overview.overall_efficiency_score > 7 ? 'up' : 
           effectivenessData.overview.overall_efficiency_score < 5 ? 'down' : 'flat',
    last_calculated: new Date().toISOString()
  })
  
  benchmarks.push({
    metric: 'MER (Marketing Efficiency Ratio)',
    category: 'Overall Performance',
    current_value: effectivenessData.overview.mer,
    benchmark_value: 3.5,
    percentile_25: 2.5,
    percentile_75: 5.0,
    industry_average: 3.5,
    performance_status: effectivenessData.overview.mer > 5 ? 'excellent' :
                       effectivenessData.overview.mer > 3.5 ? 'good' :
                       effectivenessData.overview.mer > 2.5 ? 'average' : 'poor',
    trend: effectivenessData.overview.mer > 4 ? 'up' : 
           effectivenessData.overview.mer < 3 ? 'down' : 'flat',
    last_calculated: new Date().toISOString()
  })
  
  // Channel-specific benchmarks
  effectivenessData.channelPerformance.slice(0, 5).forEach(channel => {
    benchmarks.push({
      metric: `${channel.channel} ROAS`,
      category: 'Channel Performance',
      current_value: channel.roas,
      benchmark_value: 4.0,
      percentile_25: 2.5,
      percentile_75: 6.0,
      industry_average: 4.0,
      performance_status: channel.roas > 6 ? 'excellent' :
                         channel.roas > 4 ? 'good' :
                         channel.roas > 2.5 ? 'average' : 'poor',
      trend: channel.trend,
      last_calculated: new Date().toISOString()
    })
  })
  
  return benchmarks
}