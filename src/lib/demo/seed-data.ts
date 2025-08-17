import { 
  ICP, 
  Experiment, 
  Channel, 
  Gate, 
  Result,
  ExperimentStatus,
  ChannelType,
  GateMetric,
  GateOperator,
  CompanySize,
  GeographicRegion,
  SalesMotion
} from '@/types';

// Deterministic random number generator for consistent demo data
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  between(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  integer(min: number, max: number): number {
    return Math.floor(this.between(min, max + 1));
  }

  choice<T>(array: T[]): T {
    return array[this.integer(0, array.length - 1)];
  }

  boolean(probability: number = 0.5): boolean {
    return this.next() < probability;
  }
}

// Demo seed data configuration
export const DEMO_SEED = 42069; // Fixed seed for consistent data
export const DEMO_DAYS = 14;

// Generate seeded ICP data
export function generateDemoICP(seed: number = DEMO_SEED): ICP {
  const rng = new SeededRandom(seed);
  
  const personas = [
    'VP of Marketing at SaaS companies',
    'Growth Marketing Manager at B2B startups',
    'Head of Demand Generation at scale-ups',
    'Marketing Director at enterprise companies'
  ];

  const companySizes: CompanySize[] = ['startup', 'smb', 'mid_market'];
  const regions: GeographicRegion[] = ['north_america', 'europe', 'asia_pacific'];
  const salesMotions: SalesMotion[] = ['plg', 'sales_led'];

  return {
    persona: rng.choice(personas),
    company_size: rng.choice(companySizes),
    geographic_region: rng.choice(regions),
    acv_range: {
      min: rng.integer(5000, 15000),
      max: rng.integer(25000, 75000),
      currency: 'USD'
    },
    gross_margin_percent: rng.between(0.65, 0.85),
    sales_motion: rng.choice(salesMotions),
    decision_window_days: rng.integer(30, 90),
    pain_points: [
      'Inefficient lead generation',
      'Poor attribution tracking',
      'High customer acquisition costs',
      'Low conversion rates'
    ],
    use_cases: [
      'Multi-channel attribution',
      'Budget optimization',
      'Conversion tracking',
      'Performance analytics'
    ]
  };
}

// Generate demo experiment
export function generateDemoExperiment(seed: number = DEMO_SEED): Experiment {
  const rng = new SeededRandom(seed);
  const icp = generateDemoICP(seed);
  
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - DEMO_DAYS);

  return {
    id: `demo-exp-${seed}`,
    created_at: startDate.toISOString(),
    updated_at: today.toISOString(),
    name: 'Q4 Growth Campaign - Demo Mode',
    description: 'Multi-channel growth experiment targeting enterprise customers',
    project_id: 'demo-project-1',
    status: 'running' as ExperimentStatus,
    icp,
    target_cpqm: rng.between(400, 600),
    max_cac_payback_months: rng.between(6, 12),
    budget_allocated: rng.between(50000, 100000),
    start_date: startDate.toISOString(),
    hypothesis: 'By targeting enterprise customers with a multi-channel approach, we can achieve better conversion rates and lower CAC',
    success_criteria: {
      primary_metric: 'cost_per_qualified_meeting',
      target_value: rng.between(400, 500),
      confidence_level: 0.95,
      minimum_sample_size: 100
    }
  };
}

// Generate demo channels
export function generateDemoChannels(experimentId: string, seed: number = DEMO_SEED): Channel[] {
  const rng = new SeededRandom(seed);
  
  const channelConfigs: Array<{
    type: ChannelType;
    name: string;
    description: string;
    budgetWeight: number;
  }> = [
    {
      type: 'google_search',
      name: 'Google Ads - Enterprise Keywords',
      description: 'Targeting high-intent enterprise search terms',
      budgetWeight: 0.35
    },
    {
      type: 'linkedin_inmail',
      name: 'LinkedIn InMail - VP+ Outreach',
      description: 'Direct outreach to VP+ marketing executives',
      budgetWeight: 0.25
    },
    {
      type: 'webinar',
      name: 'Monthly Growth Webinar Series',
      description: 'Educational webinars on marketing attribution',
      budgetWeight: 0.15
    },
    {
      type: 'content_marketing',
      name: 'SEO Content & Thought Leadership',
      description: 'High-value content targeting growth marketers',
      budgetWeight: 0.15
    },
    {
      type: 'events',
      name: 'Industry Conference Sponsorships',
      description: 'MarTech and SaaS conference participation',
      budgetWeight: 0.10
    }
  ];

  return channelConfigs.map((config, index) => {
    const channelRng = new SeededRandom(seed + index);
    const totalBudget = 75000; // Demo budget

    return {
      id: `demo-channel-${index + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      experiment_id: experimentId,
      type: config.type,
      name: config.name,
      description: config.description,
      parameters: generateChannelParameters(config.type, channelRng),
      is_active: true,
      allocated_budget: totalBudget * config.budgetWeight,
      current_weight: config.budgetWeight
    };
  });
}

// Generate channel-specific parameters
function generateChannelParameters(type: ChannelType, rng: SeededRandom): Record<string, any> {
  switch (type) {
    case 'google_search':
      return {
        keywords: ['marketing attribution', 'b2b analytics', 'conversion tracking'],
        match_types: ['exact', 'phrase'],
        locations: ['United States', 'Canada', 'United Kingdom'],
        bid_strategy: 'target_cpa',
        target_cpa: rng.between(80, 120)
      };
    
    case 'linkedin_inmail':
      return {
        job_titles: ['VP Marketing', 'Head of Growth', 'Marketing Director'],
        company_sizes: ['201-500', '501-1000', '1001-5000'],
        industries: ['Software', 'Technology', 'Internet'],
        message_template: 'personalized_outreach_v1'
      };
    
    case 'webinar':
      return {
        topic: 'Marketing Attribution Mastery',
        duration_minutes: 45,
        follow_up_sequence: 'nurture_sequence_v2',
        registration_page: 'webinar_landing_v1'
      };
    
    case 'content_marketing':
      return {
        content_types: ['blog_posts', 'whitepapers', 'case_studies'],
        distribution_channels: ['organic_search', 'email_newsletter', 'social_media'],
        topics: ['attribution', 'conversion_optimization', 'marketing_analytics']
      };
    
    case 'events':
      return {
        event_types: ['conference', 'workshop', 'networking'],
        booth_size: 'standard',
        speaking_opportunities: true,
        lead_capture_method: 'badge_scan'
      };
    
    default:
      return {};
  }
}

// Generate demo gates for channels
export function generateDemoGates(channels: Channel[], seed: number = DEMO_SEED): Gate[] {
  const gates: Gate[] = [];
  
  channels.forEach((channel, channelIndex) => {
    const channelRng = new SeededRandom(seed + channelIndex * 100);
    const gateConfigs = getGateConfigsForChannel(channel.type);
    
    gateConfigs.forEach((config, gateIndex) => {
      const gateRng = new SeededRandom(seed + channelIndex * 100 + gateIndex);
      
      gates.push({
        id: `demo-gate-${channelIndex + 1}-${gateIndex + 1}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        channel_id: channel.id,
        name: config.name,
        metric: config.metric,
        operator: config.operator,
        threshold_value: gateRng.between(config.minThreshold, config.maxThreshold),
        window_days: config.windowDays,
        is_critical: config.isCritical,
        benchmark_source: config.benchmarkSource,
        benchmark_range: config.benchmarkRange
      });
    });
  });
  
  return gates;
}

interface GateConfig {
  name: string;
  metric: GateMetric;
  operator: GateOperator;
  minThreshold: number;
  maxThreshold: number;
  windowDays: number;
  isCritical: boolean;
  benchmarkSource?: string;
  benchmarkRange?: {
    min: number;
    max: number;
    percentile_25?: number;
    percentile_75?: number;
  };
}

function getGateConfigsForChannel(type: ChannelType): GateConfig[] {
  const baseConfigs: GateConfig[] = [
    {
      name: 'Cost per Meeting',
      metric: 'cost_per_meeting',
      operator: 'lte',
      minThreshold: 100,
      maxThreshold: 300,
      windowDays: 7,
      isCritical: true,
      benchmarkSource: 'Industry Report 2024',
      benchmarkRange: { min: 80, max: 400, percentile_25: 120, percentile_75: 250 }
    },
    {
      name: 'CAC Payback Months',
      metric: 'cac_payback_months',
      operator: 'lte',
      minThreshold: 6,
      maxThreshold: 12,
      windowDays: 30,
      isCritical: true,
      benchmarkSource: 'SaaS Benchmarks 2024',
      benchmarkRange: { min: 3, max: 18, percentile_25: 6, percentile_75: 12 }
    }
  ];

  switch (type) {
    case 'google_search':
      return [
        ...baseConfigs,
        {
          name: 'Click Through Rate',
          metric: 'click_through_rate',
          operator: 'gte',
          minThreshold: 0.02,
          maxThreshold: 0.05,
          windowDays: 7,
          isCritical: false,
          benchmarkSource: 'Google Ads Benchmarks',
          benchmarkRange: { min: 0.01, max: 0.08, percentile_25: 0.02, percentile_75: 0.04 }
        }
      ];
      
    case 'linkedin_inmail':
      return [
        ...baseConfigs,
        {
          name: 'Reply Rate',
          metric: 'reply_rate',
          operator: 'gte',
          minThreshold: 0.15,
          maxThreshold: 0.30,
          windowDays: 7,
          isCritical: false,
          benchmarkSource: 'LinkedIn Sales Navigator',
          benchmarkRange: { min: 0.10, max: 0.50, percentile_25: 0.18, percentile_75: 0.35 }
        }
      ];
      
    case 'webinar':
      return [
        ...baseConfigs,
        {
          name: 'Meeting Show Rate',
          metric: 'meeting_show_rate',
          operator: 'gte',
          minThreshold: 0.60,
          maxThreshold: 0.80,
          windowDays: 14,
          isCritical: false,
          benchmarkSource: 'Webinar Benchmarks',
          benchmarkRange: { min: 0.40, max: 0.90, percentile_25: 0.65, percentile_75: 0.80 }
        }
      ];
      
    default:
      return baseConfigs;
  }
}

// Generate 14 days of demo results with realistic patterns
export function generateDemoResults(channels: Channel[], seed: number = DEMO_SEED): Result[] {
  const results: Result[] = [];
  const today = new Date();
  
  channels.forEach((channel, channelIndex) => {
    const channelRng = new SeededRandom(seed + channelIndex * 1000);
    
    // Generate baseline performance metrics for this channel
    const baseMetrics = generateBaselineMetrics(channel.type, channelRng);
    
    for (let day = 0; day < DEMO_DAYS; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (DEMO_DAYS - day - 1));
      
      const dayRng = new SeededRandom(seed + channelIndex * 1000 + day);
      
      // Apply daily variance and trends
      const dayMetrics = applyDailyVariance(baseMetrics, day, dayRng);
      
      results.push({
        id: `demo-result-${channelIndex + 1}-${day + 1}`,
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
        channel_id: channel.id,
        date: date.toISOString().split('T')[0],
        metrics: dayMetrics,
        costs: calculateDailyCosts(dayMetrics, channel.allocated_budget / DEMO_DAYS, dayRng),
        is_simulated: true,
        variance_applied: dayRng.between(0.8, 1.2)
      });
    }
  });
  
  return results;
}

interface BaselineMetrics {
  impressions: number;
  clickRate: number;
  leadRate: number;
  replyRate: number;
  meetingRate: number;
  showRate: number;
  opportunityRate: number;
  winRate: number;
  avgDealSize: number;
}

function generateBaselineMetrics(type: ChannelType, rng: SeededRandom): BaselineMetrics {
  switch (type) {
    case 'google_search':
      return {
        impressions: rng.integer(8000, 12000),
        clickRate: rng.between(0.025, 0.045),
        leadRate: rng.between(0.15, 0.25),
        replyRate: rng.between(0.80, 0.90),
        meetingRate: rng.between(0.35, 0.50),
        showRate: rng.between(0.70, 0.85),
        opportunityRate: rng.between(0.40, 0.60),
        winRate: rng.between(0.25, 0.35),
        avgDealSize: rng.integer(25000, 45000)
      };
      
    case 'linkedin_inmail':
      return {
        impressions: rng.integer(500, 800),
        clickRate: 1.0, // Direct outreach
        leadRate: rng.between(0.20, 0.35),
        replyRate: rng.between(0.20, 0.35),
        meetingRate: rng.between(0.60, 0.80),
        showRate: rng.between(0.65, 0.80),
        opportunityRate: rng.between(0.50, 0.70),
        winRate: rng.between(0.30, 0.45),
        avgDealSize: rng.integer(35000, 60000)
      };
      
    case 'webinar':
      return {
        impressions: rng.integer(2000, 4000),
        clickRate: rng.between(0.08, 0.15),
        leadRate: rng.between(0.40, 0.60),
        replyRate: rng.between(0.85, 0.95),
        meetingRate: rng.between(0.25, 0.40),
        showRate: rng.between(0.75, 0.90),
        opportunityRate: rng.between(0.45, 0.65),
        winRate: rng.between(0.35, 0.50),
        avgDealSize: rng.integer(30000, 55000)
      };
      
    case 'content_marketing':
      return {
        impressions: rng.integer(15000, 25000),
        clickRate: rng.between(0.015, 0.030),
        leadRate: rng.between(0.10, 0.20),
        replyRate: rng.between(0.75, 0.85),
        meetingRate: rng.between(0.30, 0.45),
        showRate: rng.between(0.68, 0.82),
        opportunityRate: rng.between(0.35, 0.55),
        winRate: rng.between(0.20, 0.35),
        avgDealSize: rng.integer(20000, 40000)
      };
      
    case 'events':
      return {
        impressions: rng.integer(1000, 2000),
        clickRate: 1.0, // Direct interaction
        leadRate: rng.between(0.30, 0.50),
        replyRate: rng.between(0.90, 0.95),
        meetingRate: rng.between(0.50, 0.70),
        showRate: rng.between(0.80, 0.95),
        opportunityRate: rng.between(0.60, 0.80),
        winRate: rng.between(0.40, 0.60),
        avgDealSize: rng.integer(40000, 70000)
      };
      
    default:
      return {
        impressions: rng.integer(5000, 10000),
        clickRate: rng.between(0.02, 0.04),
        leadRate: rng.between(0.15, 0.25),
        replyRate: rng.between(0.75, 0.85),
        meetingRate: rng.between(0.35, 0.50),
        showRate: rng.between(0.70, 0.85),
        opportunityRate: rng.between(0.40, 0.60),
        winRate: rng.between(0.25, 0.40),
        avgDealSize: rng.integer(25000, 45000)
      };
  }
}

function applyDailyVariance(baseline: BaselineMetrics, day: number, rng: SeededRandom) {
  // Apply weekly patterns (weekends typically lower performance)
  const dayOfWeek = day % 7;
  const weekendFactor = (dayOfWeek === 5 || dayOfWeek === 6) ? 0.7 : 1.0;
  
  // Apply trending (slight improvement over time)
  const trendFactor = 1.0 + (day / DEMO_DAYS) * 0.1;
  
  // Daily random variance
  const varianceFactor = rng.between(0.85, 1.15);
  
  const totalFactor = weekendFactor * trendFactor * varianceFactor;
  
  // Calculate funnel metrics
  const impressions = Math.round(baseline.impressions * totalFactor);
  const clicks = Math.round(impressions * baseline.clickRate * rng.between(0.9, 1.1));
  const leads = Math.round(clicks * baseline.leadRate * rng.between(0.9, 1.1));
  const replies = Math.round(leads * baseline.replyRate * rng.between(0.95, 1.05));
  const meetings_scheduled = Math.round(replies * baseline.meetingRate * rng.between(0.9, 1.1));
  const meetings_held = Math.round(meetings_scheduled * baseline.showRate * rng.between(0.95, 1.05));
  const opportunities = Math.round(meetings_held * baseline.opportunityRate * rng.between(0.85, 1.15));
  const wins = Math.round(opportunities * baseline.winRate * rng.between(0.8, 1.2));
  
  return {
    impressions,
    clicks,
    leads,
    replies,
    meetings_scheduled,
    meetings_held,
    opportunities,
    wins,
    pipeline_value: opportunities * baseline.avgDealSize * rng.between(0.8, 1.2),
    closed_value: wins * baseline.avgDealSize * rng.between(0.9, 1.1)
  };
}

function calculateDailyCosts(metrics: any, dailyBudget: number, rng: SeededRandom) {
  const mediaSpendRatio = rng.between(0.70, 0.85);
  const platformFeeRatio = rng.between(0.05, 0.10);
  const laborRatio = rng.between(0.10, 0.20);
  
  const media_spend = dailyBudget * mediaSpendRatio;
  const platform_fees = dailyBudget * platformFeeRatio;
  const labor_costs = dailyBudget * laborRatio;
  
  return {
    media_spend,
    platform_fees,
    labor_costs,
    total_cost: media_spend + platform_fees + labor_costs
  };
}

// Generate complete demo dataset
export function generateCompleteDemoData(seed: number = DEMO_SEED) {
  const icp = generateDemoICP(seed);
  const experiment = generateDemoExperiment(seed);
  const channels = generateDemoChannels(experiment.id, seed);
  const gates = generateDemoGates(channels, seed);
  const results = generateDemoResults(channels, seed);

  return {
    icp,
    experiment,
    channels,
    gates,
    results,
    metadata: {
      seed,
      generatedAt: new Date().toISOString(),
      days: DEMO_DAYS,
      totalResults: results.length
    }
  };
}

// Export demo data for easy consumption
export const DEMO_DATA = generateCompleteDemoData(DEMO_SEED);