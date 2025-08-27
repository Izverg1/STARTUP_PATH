import { createClient } from '@/lib/supabase/client'
import type { Database } from './types'

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']

// Demo data generation utilities
export class DatabaseSeeder {
  private supabase = createClient()

  // =============================================================================
  // Organization and User Seeding
  // =============================================================================

  async seedDemoOrganization(orgData: {
    name: string
    slug: string
    ownerEmail: string
    ownerName: string
    ownerId: string
  }) {
    const { name, slug, ownerEmail, ownerName, ownerId } = orgData

    // Create organization
    const { data: org, error: orgError } = await this.supabase
      .from('SPATH_organizations')
      .insert({
        name,
        slug,
        subscription_tier: 'demo',
        owner_id: ownerId,
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
          fiscal_year_start: '2024-01-01',
          notification_preferences: {
            email_enabled: true,
            notification_triggers: ['experiment_completed', 'gate_failed']
          },
          security_settings: {
            sso_enabled: false,
            mfa_required: false,
            session_timeout_hours: 24,
            allowed_domains: []
          }
        }
      })
      .select()
      .single()

    if (orgError) {
      throw new Error(`Failed to create organization: ${orgError.message}`)
    }

    // Create owner user
    const { data: user, error: userError } = await this.supabase
      .from('SPATH_users')
      .insert({
        id: ownerId,
        email: ownerEmail,
        name: ownerName,
        role: 'owner',
        org_id: org.id,
        is_active: true
      })
      .select()
      .single()

    if (userError) {
      throw new Error(`Failed to create user: ${userError.message}`)
    }

    return { org, user }
  }

  // =============================================================================
  // Project and Experiment Seeding
  // =============================================================================

  async seedDemoProject(orgId: string, ownerId: string) {
    // Create demo project
    const { data: project, error: projectError } = await this.supabase
      .from('SPATH_projects')
      .insert({
        name: 'FinOps SaaS GTM Test',
        description: 'B2B FinOps SaaS targeting $20-200M ARR companies with 14-day decision window',
        org_id: orgId,
        owner_id: ownerId,
        status: 'active',
        mode: 'simulation',
        settings: {
          default_confidence_level: 95,
          minimum_test_duration_days: 7,
          maximum_test_duration_days: 30,
          auto_pause_on_poor_performance: true,
          noise_variance_percent: 10,
          allocator_frequency: 'daily'
        }
      })
      .select()
      .single()

    if (projectError) {
      throw new Error(`Failed to create project: ${projectError.message}`)
    }

    // Create demo experiment
    const { data: experiment, error: experimentError } = await this.supabase
      .from('SPATH_experiments')
      .insert({
        name: 'Multi-Channel GTM Test',
        description: 'Testing Google Search, LinkedIn InMail, and Webinar channels',
        project_id: project.id,
        status: 'running',
        icp: {
          persona: 'FinOps Lead',
          company_size: 'mid_market',
          geographic_region: 'north_america',
          acv_range: {
            min: 20000,
            max: 50000,
            currency: 'USD'
          },
          gross_margin_percent: 85,
          sales_motion: 'sales_led',
          decision_window_days: 14,
          pain_points: [
            'Manual financial reporting processes',
            'Lack of real-time spend visibility',
            'Difficulty in budget forecasting'
          ],
          use_cases: [
            'Automated expense categorization',
            'Real-time budget tracking',
            'Predictive spend analytics'
          ]
        },
        target_cpqm: 350,
        max_cac_payback_months: 12,
        budget_allocated: 6000,
        start_date: new Date().toISOString().split('T')[0],
        hypothesis: 'LinkedIn InMail will outperform other channels for reaching FinOps leads due to targeting precision',
        success_criteria: {
          primary_metric: 'cost_per_meeting',
          target_value: 350,
          confidence_level: 95,
          minimum_sample_size: 30
        }
      })
      .select()
      .single()

    if (experimentError) {
      throw new Error(`Failed to create experiment: ${experimentError.message}`)
    }

    return { project, experiment }
  }

  // =============================================================================
  // Channel and Gate Seeding
  // =============================================================================

  async seedDemoChannels(experimentId: string) {
    const channels = [
      {
        type: 'google_search' as const,
        name: 'Google Search Ads',
        description: 'Targeted search campaigns for FinOps keywords',
        parameters: {
          keywords: ['finops software', 'financial operations platform', 'spend management'],
          match_types: ['exact', 'phrase'],
          locations: ['United States', 'Canada'],
          daily_budget: 150
        },
        allocated_budget: 2000,
        current_weight: 0.33
      },
      {
        type: 'linkedin_inmail' as const,
        name: 'LinkedIn InMail',
        description: 'Direct outreach to FinOps professionals',
        parameters: {
          job_titles: ['FinOps Manager', 'Financial Operations Lead', 'VP Finance'],
          company_sizes: ['201-500', '501-1000', '1001-5000'],
          industries: ['Technology', 'Financial Services', 'SaaS'],
          daily_sends: 20
        },
        allocated_budget: 2000,
        current_weight: 0.34
      },
      {
        type: 'webinar' as const,
        name: 'FinOps Best Practices Webinar',
        description: 'Educational webinar on FinOps automation',
        parameters: {
          topic: 'Automating FinOps: From Manual to Intelligent',
          duration_minutes: 45,
          follow_up_sequence: ['immediate', '3_days', '7_days'],
          promotion_channels: ['LinkedIn', 'Email']
        },
        allocated_budget: 2000,
        current_weight: 0.33
      }
    ]

    const createdChannels = []
    
    for (const channelData of channels) {
      const { data: channel, error: channelError } = await this.supabase
        .from('SPATH_channels')
        .insert({
          experiment_id: experimentId,
          ...channelData
        })
        .select()
        .single()

      if (channelError) {
        throw new Error(`Failed to create channel: ${channelError.message}`)
      }

      createdChannels.push(channel)

      // Create gates for each channel
      await this.seedChannelGates(channel.id, channel.type)
    }

    return createdChannels
  }

  async seedChannelGates(channelId: string, channelType: string) {
    const gateConfigs = {
      google_search: [
        {
          name: 'Click-through Rate',
          metric: 'click_through_rate' as const,
          operator: 'gte' as const,
          threshold_value: 0.04,
          window_days: 7,
          is_critical: true,
          benchmark_source: 'Google Ads Benchmarks',
          benchmark_range: { min: 0.02, max: 0.08, percentile_25: 0.03, percentile_75: 0.06 }
        },
        {
          name: 'Cost per Meeting',
          metric: 'cost_per_meeting' as const,
          operator: 'lte' as const,
          threshold_value: 400,
          window_days: 7,
          is_critical: true,
          benchmark_source: 'Industry Survey 2024',
          benchmark_range: { min: 150, max: 400, percentile_25: 200, percentile_75: 350 }
        }
      ],
      linkedin_inmail: [
        {
          name: 'Reply Rate',
          metric: 'reply_rate' as const,
          operator: 'gte' as const,
          threshold_value: 0.03,
          window_days: 7,
          is_critical: true,
          benchmark_source: 'Industry Survey 2024',
          benchmark_range: { min: 0.02, max: 0.08, percentile_25: 0.03, percentile_75: 0.06 }
        },
        {
          name: 'Cost per Meeting',
          metric: 'cost_per_meeting' as const,
          operator: 'lte' as const,
          threshold_value: 350,
          window_days: 7,
          is_critical: true,
          benchmark_source: 'Industry Survey 2024',
          benchmark_range: { min: 200, max: 500, percentile_25: 250, percentile_75: 400 }
        }
      ],
      webinar: [
        {
          name: 'Conversion Rate',
          metric: 'conversion_rate' as const,
          operator: 'gte' as const,
          threshold_value: 0.35,
          window_days: 14,
          is_critical: true,
          benchmark_source: 'Webinar Platform Data',
          benchmark_range: { min: 0.35, max: 0.60, percentile_25: 0.40, percentile_75: 0.50 }
        },
        {
          name: 'Meeting Show Rate',
          metric: 'meeting_show_rate' as const,
          operator: 'gte' as const,
          threshold_value: 0.65,
          window_days: 7,
          is_critical: false,
          benchmark_source: 'Industry Survey 2024',
          benchmark_range: { min: 0.50, max: 0.80, percentile_25: 0.60, percentile_75: 0.75 }
        }
      ]
    }

    const gates = gateConfigs[channelType as keyof typeof gateConfigs] || []

    for (const gateData of gates) {
      const { error: gateError } = await this.supabase
        .from('SPATH_gates')
        .insert({
          channel_id: channelId,
          ...gateData
        })

      if (gateError) {
        throw new Error(`Failed to create gate: ${gateError.message}`)
      }
    }
  }

  // =============================================================================
  // Results Seeding (14 days of demo data)
  // =============================================================================

  async seedDemoResults(channels: Tables<'SPATH_channels'>[]) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 13) // Start 13 days ago for 14 days total

    for (let day = 0; day < 14; day++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + day)
      const dateStr = currentDate.toISOString().split('T')[0]

      for (const channel of channels) {
        const resultData = this.generateResultsForChannel(channel, day)
        
        const { error: resultError } = await this.supabase
          .from('SPATH_results')
          .insert({
            channel_id: channel.id,
            date: dateStr,
            metrics: resultData.metrics,
            costs: resultData.costs,
            is_simulated: true,
            variance_applied: Math.random() * 20 - 10 // ±10% variance
          })

        if (resultError) {
          console.error(`Failed to create result for ${channel.name} on ${dateStr}:`, resultError.message)
        }
      }
    }
  }

  private generateResultsForChannel(channel: Tables<'SPATH_channels'>, dayIndex: number) {
    const baseMultiplier = 1 + (dayIndex * 0.05) // Gradual improvement over time
    const randomVariance = 0.8 + (Math.random() * 0.4) // ±20% random variance

    const dailyBudget = channel.allocated_budget / 14

    switch (channel.type) {
      case 'google_search':
        return {
          metrics: {
            impressions: Math.round(8000 * baseMultiplier * randomVariance),
            clicks: Math.round(320 * baseMultiplier * randomVariance),
            leads: Math.round(32 * baseMultiplier * randomVariance),
            replies: 0,
            meetings_scheduled: Math.round(4 * baseMultiplier * randomVariance),
            meetings_held: Math.round(3 * baseMultiplier * randomVariance),
            opportunities: Math.round(1 * baseMultiplier * randomVariance),
            wins: Math.round(dayIndex > 10 ? 0.2 * baseMultiplier * randomVariance : 0),
            pipeline_value: Math.round(25000 * baseMultiplier * randomVariance),
            closed_value: Math.round(dayIndex > 10 ? 12000 * baseMultiplier * randomVariance : 0)
          },
          costs: {
            media_spend: Math.round(dailyBudget * 0.85 * randomVariance),
            platform_fees: Math.round(dailyBudget * 0.1 * randomVariance),
            labor_costs: Math.round(dailyBudget * 0.05 * randomVariance),
            total_cost: Math.round(dailyBudget * randomVariance)
          }
        }

      case 'linkedin_inmail':
        return {
          metrics: {
            impressions: 0,
            clicks: 0,
            leads: Math.round(20 * baseMultiplier * randomVariance),
            replies: Math.round(1.2 * baseMultiplier * randomVariance),
            meetings_scheduled: Math.round(0.8 * baseMultiplier * randomVariance),
            meetings_held: Math.round(0.6 * baseMultiplier * randomVariance),
            opportunities: Math.round(0.3 * baseMultiplier * randomVariance),
            wins: Math.round(dayIndex > 10 ? 0.1 * baseMultiplier * randomVariance : 0),
            pipeline_value: Math.round(15000 * baseMultiplier * randomVariance),
            closed_value: Math.round(dayIndex > 10 ? 8000 * baseMultiplier * randomVariance : 0)
          },
          costs: {
            media_spend: Math.round(dailyBudget * 0.7 * randomVariance),
            platform_fees: Math.round(dailyBudget * 0.15 * randomVariance),
            labor_costs: Math.round(dailyBudget * 0.15 * randomVariance),
            total_cost: Math.round(dailyBudget * randomVariance)
          }
        }

      case 'webinar':
        return {
          metrics: {
            impressions: Math.round(5000 * baseMultiplier * randomVariance),
            clicks: Math.round(250 * baseMultiplier * randomVariance),
            leads: Math.round(100 * baseMultiplier * randomVariance),
            replies: 0,
            meetings_scheduled: Math.round(45 * baseMultiplier * randomVariance),
            meetings_held: Math.round(35 * baseMultiplier * randomVariance),
            opportunities: Math.round(8 * baseMultiplier * randomVariance),
            wins: Math.round(dayIndex > 10 ? 1.5 * baseMultiplier * randomVariance : 0),
            pipeline_value: Math.round(200000 * baseMultiplier * randomVariance),
            closed_value: Math.round(dayIndex > 10 ? 75000 * baseMultiplier * randomVariance : 0)
          },
          costs: {
            media_spend: Math.round(dailyBudget * 0.6 * randomVariance),
            platform_fees: Math.round(dailyBudget * 0.2 * randomVariance),
            labor_costs: Math.round(dailyBudget * 0.2 * randomVariance),
            total_cost: Math.round(dailyBudget * randomVariance)
          }
        }

      default:
        return {
          metrics: {
            impressions: 0, clicks: 0, leads: 0, replies: 0,
            meetings_scheduled: 0, meetings_held: 0, opportunities: 0,
            wins: 0, pipeline_value: 0, closed_value: 0
          },
          costs: {
            media_spend: 0, platform_fees: 0, labor_costs: 0, total_cost: 0
          }
        }
    }
  }

  // =============================================================================
  // Agent State Seeding
  // =============================================================================

  async seedAgentStates(projectId: string) {
    const agents = [
      {
        agent_key: 'channel_scout',
        status: 'done' as const,
        status_line: 'Gates set: email 3-6%, search CTR 4%+',
        progress_percent: 100
      },
      {
        agent_key: 'offer_alchemist',
        status: 'working' as const,
        status_line: 'Drafting InMail v2...',
        progress_percent: 65
      },
      {
        agent_key: 'signal_wrangler',
        status: 'working' as const,
        status_line: 'Payback modeling...',
        progress_percent: 80
      },
      {
        agent_key: 'budget_captain',
        status: 'idle' as const,
        status_line: 'Waiting for day close',
        progress_percent: 0
      }
    ]

    for (const agentData of agents) {
      const { error } = await this.supabase
        .from('SPATH_agent_state')
        .upsert({
          project_id: projectId,
          ...agentData,
          last_activity: new Date().toISOString()
        }, {
          onConflict: 'project_id,agent_key'
        })

      if (error) {
        console.error(`Failed to seed agent state for ${agentData.agent_key}:`, error.message)
      }
    }
  }

  // =============================================================================
  // Artifact Seeding
  // =============================================================================

  async seedDemoArtifacts(projectId: string) {
    const artifacts = [
      {
        agent_key: 'channel_scout',
        type: 'benchmark' as const,
        title: 'Channel Gate Analysis',
        md_body: `## Benchmark Analysis Results

### LinkedIn InMail
- **Reply Rate**: 3-6% (Industry benchmark)
- **Cost per Meeting**: $250-400 (Target: ≤$350)

### Google Search
- **Click-through Rate**: 4%+ (Above average)
- **Cost per Meeting**: $200-350 (Target: ≤$400)

### Webinar
- **Registration to Attendance**: 35-45%
- **Qualified Meeting Rate**: 15-25%

*Source: Industry Survey 2024, Google Ads Benchmarks*`,
        json_meta: {
          source: 'industry_benchmarks',
          confidence: 0.85,
          channels_analyzed: 3
        }
      },
      {
        agent_key: 'offer_alchemist',
        type: 'copy' as const,
        title: 'LinkedIn InMail v2',
        md_body: `## Revised InMail Copy

**Subject**: Quick question about your FinOps automation

Hi {{firstName}},

I noticed {{company}} has been scaling rapidly. With that growth, I imagine managing financial operations manually is becoming a real challenge.

We've helped similar companies like {{competitor}} reduce their month-end close time by 75% while improving spend visibility.

Worth a quick 15-minute conversation?

Best,
{{senderName}}

**Changes from v1:**
- More specific value proposition
- Added social proof with competitor reference
- Reduced length by 30%`,
        json_meta: {
          version: 2,
          prev_version_id: null,
          ab_test_winner: true,
          estimated_improvement: 0.15
        }
      },
      {
        agent_key: 'signal_wrangler',
        type: 'calc' as const,
        title: 'CAC Payback Analysis',
        md_body: `## Current CAC Payback Analysis

### Overall Metrics (Last 7 days)
- **Blended CAC**: $2,847
- **Payback Period**: 11.2 months ✅
- **LTV:CAC Ratio**: 3.2:1

### By Channel
1. **Webinar**: 9.8 months (Best performing)
2. **Google Search**: 12.1 months 
3. **LinkedIn InMail**: 13.4 months (Needs optimization)

### Anomalies Detected
- InMail reply rate dropped 15% on Friday
- Webinar no-show rate increased (external factor: conference)

*Target: ≤12 months payback*`,
        json_meta: {
          calculation_date: new Date().toISOString().split('T')[0],
          data_points: 14,
          confidence_interval: 0.95
        }
      },
      {
        agent_key: 'budget_captain',
        type: 'alloc' as const,
        title: 'Budget Reallocation - Day 14',
        md_body: `## Allocator Move - ${new Date().toLocaleDateString()}

### Recommended Changes
- **Webinar**: +15% (to 38%) - Strongest CPQM performance
- **Google Search**: +5% (to 35%) - Consistent performer
- **LinkedIn InMail**: -20% (to 27%) - Reply rate decline

### Rationale
Webinar channel showing 28% better CPQM than target. InMail underperforming due to reply rate drop. Moving $400 from InMail to Webinar for next 3 days.

### Risk Assessment
- Low risk: 3-day test period
- Fallback: Revert if InMail recovers
- Expected impact: 12% improvement in blended CPQM`,
        json_meta: {
          move_date: new Date().toISOString().split('T')[0],
          confidence: 0.78,
          expected_impact: 0.12,
          risk_level: 'low'
        }
      }
    ]

    for (const artifactData of artifacts) {
      const { error } = await this.supabase
        .from('SPATH_artifacts')
        .insert({
          project_id: projectId,
          ...artifactData,
          version: 1,
          is_active: true
        })

      if (error) {
        console.error(`Failed to seed artifact ${artifactData.title}:`, error.message)
      }
    }
  }

  // =============================================================================
  // Complete Demo Setup
  // =============================================================================

  async seedCompleteDemo(userData: {
    email: string
    name: string
    userId: string
  }) {
    try {
      console.log('Starting demo data seeding...')

      // 1. Create organization and user
      const { org, user } = await this.seedDemoOrganization({
        name: 'Demo Startup Inc.',
        slug: 'demo-startup',
        ownerEmail: userData.email,
        ownerName: userData.name,
        ownerId: userData.userId
      })
      console.log('✓ Created organization and user')

      // 2. Create project and experiment
      const { project, experiment } = await this.seedDemoProject(org.id, user.id)
      console.log('✓ Created project and experiment')

      // 3. Create channels with gates
      const channels = await this.seedDemoChannels(experiment.id)
      console.log('✓ Created channels and gates')

      // 4. Generate 14 days of results
      await this.seedDemoResults(channels)
      console.log('✓ Generated demo results')

      // 5. Initialize agent states
      await this.seedAgentStates(project.id)
      console.log('✓ Initialized agent states')

      // 6. Create demo artifacts
      await this.seedDemoArtifacts(project.id)
      console.log('✓ Created demo artifacts')

      console.log('Demo data seeding completed successfully!')

      return {
        organization: org,
        user,
        project,
        experiment,
        channels
      }
    } catch (error) {
      console.error('Error seeding demo data:', error)
      throw error
    }
  }

  // =============================================================================
  // Backward Compatibility Aliases
  // =============================================================================

  // Alias for setupDemoDatabase to maintain compatibility with setup scripts
  async setupDemoDatabase(userData: {
    email: string
    name: string
    userId: string
  }) {
    return this.seedCompleteDemo(userData)
  }
}

// Export singleton instance
export const databaseSeeder = new DatabaseSeeder()