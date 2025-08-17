// Scenario generator for creating test scenarios and what-if analyses
// Provides pre-built scenarios and tools for custom scenario creation

import { 
  SimulationScenario, 
  ChannelArm, 
  ThompsonSamplingConfig,
  createDefaultChannels,
  createDefaultConfig 
} from './thompson-sampling';
import { ChannelType } from '@/types';

export interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  category: 'startup' | 'growth' | 'scale' | 'optimization' | 'crisis';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // minutes
  learningObjectives: string[];
  tags: string[];
}

export interface WhatIfParameter {
  id: string;
  name: string;
  description: string;
  type: 'budget' | 'conversion_rate' | 'competition' | 'seasonality' | 'market_shift';
  baseValue: number;
  currentValue: number;
  minValue: number;
  maxValue: number;
  unit: string;
  impact: 'low' | 'medium' | 'high';
}

export interface ScenarioOutcome {
  totalConversions: number;
  totalCost: number;
  averageCPA: number;
  bestPerformingChannel: string;
  worstPerformingChannel: string;
  recommendedAction: string;
  confidenceScore: number;
  riskFactors: string[];
}

export class ScenarioGenerator {
  private templates: ScenarioTemplate[] = [];

  constructor() {
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates(): void {
    this.templates = [
      {
        id: 'startup-mvp-launch',
        name: 'MVP Launch - Limited Budget',
        description: 'Early-stage startup with $5K monthly budget testing initial channels',
        category: 'startup',
        difficulty: 'beginner',
        estimatedDuration: 15,
        learningObjectives: [
          'Understand budget allocation with limited resources',
          'Learn to identify high-performing channels early',
          'Practice risk-averse decision making'
        ],
        tags: ['mvp', 'budget-constrained', 'early-stage']
      },
      {
        id: 'growth-stage-scaling',
        name: 'Growth Stage - Channel Expansion',
        description: 'Growing startup with $25K budget exploring new channels',
        category: 'growth',
        difficulty: 'intermediate',
        estimatedDuration: 25,
        learningObjectives: [
          'Master multi-channel optimization',
          'Learn to balance exploration vs exploitation',
          'Understand channel interaction effects'
        ],
        tags: ['growth', 'multi-channel', 'scaling']
      },
      {
        id: 'market-downturn',
        name: 'Economic Downturn Response',
        description: 'Adapting strategy during market contraction with reduced budgets',
        category: 'crisis',
        difficulty: 'advanced',
        estimatedDuration: 35,
        learningObjectives: [
          'Navigate budget cuts effectively',
          'Identify recession-proof channels',
          'Maintain growth with constraints'
        ],
        tags: ['crisis', 'budget-cuts', 'resilience']
      },
      {
        id: 'competitor-entry',
        name: 'New Competitor Impact',
        description: 'Major competitor enters market, affecting conversion rates',
        category: 'crisis',
        difficulty: 'intermediate',
        estimatedDuration: 20,
        learningObjectives: [
          'Respond to competitive pressure',
          'Adjust bidding strategies',
          'Find defensive positioning'
        ],
        tags: ['competition', 'defensive', 'market-response']
      },
      {
        id: 'seasonal-peak',
        name: 'Holiday Season Optimization',
        description: 'Maximize performance during Q4 seasonal peak',
        category: 'optimization',
        difficulty: 'intermediate',
        estimatedDuration: 30,
        learningObjectives: [
          'Handle seasonal traffic spikes',
          'Optimize for peak performance',
          'Manage increased competition'
        ],
        tags: ['seasonal', 'peak-traffic', 'optimization']
      },
      {
        id: 'scale-enterprise',
        name: 'Enterprise Scale Operations',
        description: 'Managing $100K+ monthly budgets across 8+ channels',
        category: 'scale',
        difficulty: 'advanced',
        estimatedDuration: 45,
        learningObjectives: [
          'Handle large-scale operations',
          'Master complex attribution',
          'Coordinate cross-channel strategy'
        ],
        tags: ['enterprise', 'large-budget', 'complex']
      }
    ];
  }

  getTemplates(
    category?: ScenarioTemplate['category'],
    difficulty?: ScenarioTemplate['difficulty']
  ): ScenarioTemplate[] {
    let filtered = this.templates;
    
    if (category) {
      filtered = filtered.filter(t => t.category === category);
    }
    
    if (difficulty) {
      filtered = filtered.filter(t => t.difficulty === difficulty);
    }
    
    return filtered;
  }

  generateScenario(templateId: string, customizations?: Partial<SimulationScenario>): SimulationScenario {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    let baseScenario: SimulationScenario;

    switch (templateId) {
      case 'startup-mvp-launch':
        baseScenario = this.createStartupMVPScenario();
        break;
      case 'growth-stage-scaling':
        baseScenario = this.createGrowthStageScenario();
        break;
      case 'market-downturn':
        baseScenario = this.createMarketDownturnScenario();
        break;
      case 'competitor-entry':
        baseScenario = this.createCompetitorEntryScenario();
        break;
      case 'seasonal-peak':
        baseScenario = this.createSeasonalPeakScenario();
        break;
      case 'scale-enterprise':
        baseScenario = this.createEnterpriseScaleScenario();
        break;
      default:
        baseScenario = this.createDefaultScenario(template);
    }

    // Apply customizations
    return {
      ...baseScenario,
      ...customizations
    };
  }

  private createStartupMVPScenario(): SimulationScenario {
    return {
      id: 'startup-mvp-launch',
      name: 'MVP Launch - Limited Budget',
      description: 'Test your allocation skills with a $5K budget across 3 proven channels',
      channels: [
        {
          id: 'google-ads',
          name: 'Google Ads',
          type: 'paid_search',
          totalConversions: 25,
          totalImpressions: 2500,
          totalBudget: 1500
        },
        {
          id: 'facebook-ads',
          name: 'Facebook Ads',
          type: 'paid_social',
          totalConversions: 18,
          totalImpressions: 3000,
          totalBudget: 1200
        },
        {
          id: 'content-marketing',
          name: 'Content Marketing',
          type: 'content',
          totalConversions: 12,
          totalImpressions: 1000,
          totalBudget: 800
        }
      ],
      budget: 5000,
      duration: 30,
      expectedOutcome: 'Identify the most cost-effective channel for future investment',
      noiseVariance: 0.08 // 8% variance
    };
  }

  private createGrowthStageScenario(): SimulationScenario {
    return {
      id: 'growth-stage-scaling',
      name: 'Growth Stage - Channel Expansion',
      description: 'Scale from 3 to 6 channels with a $25K budget',
      channels: [
        ...createDefaultChannels(),
        {
          id: 'twitter-ads',
          name: 'Twitter Ads',
          type: 'paid_social',
          totalConversions: 35,
          totalImpressions: 4500,
          totalBudget: 2200
        },
        {
          id: 'youtube-ads',
          name: 'YouTube Ads',
          type: 'video',
          totalConversions: 28,
          totalImpressions: 6000,
          totalBudget: 3500
        }
      ],
      budget: 25000,
      duration: 60,
      expectedOutcome: 'Optimize multi-channel performance while testing new opportunities',
      noiseVariance: 0.06
    };
  }

  private createMarketDownturnScenario(): SimulationScenario {
    const channels = createDefaultChannels().map(channel => ({
      ...channel,
      totalConversions: Math.round((channel.totalConversions || 0) * 0.7), // 30% reduction
      totalImpressions: channel.totalImpressions,
      totalBudget: Math.round((channel.totalBudget || 0) * 0.8) // 20% cost increase
    }));

    return {
      id: 'market-downturn',
      name: 'Economic Downturn Response',
      description: 'Navigate reduced conversion rates and increased costs during recession',
      channels,
      budget: 8000, // Reduced from normal
      duration: 45,
      expectedOutcome: 'Maintain positive ROI despite challenging market conditions',
      noiseVariance: 0.12 // Higher variance due to market instability
    };
  }

  private createCompetitorEntryScenario(): SimulationScenario {
    const channels = createDefaultChannels().map(channel => {
      // Paid channels are more affected by competition
      const isAffected = channel.type === 'paid_search' || channel.type === 'paid_social';
      return {
        ...channel,
        totalConversions: isAffected 
          ? Math.round((channel.totalConversions || 0) * 0.75) 
          : channel.totalConversions,
        totalBudget: isAffected 
          ? Math.round((channel.totalBudget || 0) * 1.25) 
          : channel.totalBudget
      };
    });

    return {
      id: 'competitor-entry',
      name: 'New Competitor Impact',
      description: 'Adapt to increased competition in paid channels',
      channels,
      budget: 12000,
      duration: 30,
      expectedOutcome: 'Maintain market share while competitor establishes presence',
      noiseVariance: 0.10
    };
  }

  private createSeasonalPeakScenario(): SimulationScenario {
    const channels = createDefaultChannels().map(channel => ({
      ...channel,
      totalConversions: Math.round((channel.totalConversions || 0) * 1.4), // 40% seasonal boost
      totalImpressions: Math.round((channel.totalImpressions || 0) * 1.2),
      totalBudget: Math.round((channel.totalBudget || 0) * 1.15) // 15% cost increase
    }));

    return {
      id: 'seasonal-peak',
      name: 'Holiday Season Optimization',
      description: 'Capitalize on Q4 traffic surge while managing increased costs',
      channels,
      budget: 18000,
      duration: 14, // Short holiday period
      expectedOutcome: 'Maximize conversions during peak shopping season',
      noiseVariance: 0.07
    };
  }

  private createEnterpriseScaleScenario(): SimulationScenario {
    const enterpriseChannels = [
      ...createDefaultChannels(),
      {
        id: 'programmatic-display',
        name: 'Programmatic Display',
        type: 'display',
        totalConversions: 280,
        totalImpressions: 45000,
        totalBudget: 15000
      },
      {
        id: 'email-marketing',
        name: 'Email Marketing',
        type: 'email',
        totalConversions: 420,
        totalImpressions: 25000,
        totalBudget: 5000
      },
      {
        id: 'affiliate-network',
        name: 'Affiliate Network',
        type: 'affiliate',
        totalConversions: 180,
        totalImpressions: 12000,
        totalBudget: 8000
      },
      {
        id: 'podcast-advertising',
        name: 'Podcast Advertising',
        type: 'audio',
        totalConversions: 95,
        totalImpressions: 8000,
        totalBudget: 12000
      }
    ];

    return {
      id: 'scale-enterprise',
      name: 'Enterprise Scale Operations',
      description: 'Manage complex multi-channel strategy at enterprise scale',
      channels: enterpriseChannels,
      budget: 100000,
      duration: 90,
      expectedOutcome: 'Optimize large-scale operations across diverse channel portfolio',
      noiseVariance: 0.05 // Lower variance with larger scale
    };
  }

  private createDefaultScenario(template: ScenarioTemplate): SimulationScenario {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      channels: createDefaultChannels(),
      budget: 10000,
      duration: 30,
      expectedOutcome: 'Learn optimal budget allocation strategies',
      noiseVariance: 0.05
    };
  }

  generateWhatIfParameters(scenario: SimulationScenario): WhatIfParameter[] {
    const parameters: WhatIfParameter[] = [
      {
        id: 'total-budget',
        name: 'Total Budget',
        description: 'Monthly marketing budget available for allocation',
        type: 'budget',
        baseValue: scenario.budget,
        currentValue: scenario.budget,
        minValue: scenario.budget * 0.5,
        maxValue: scenario.budget * 2,
        unit: '$',
        impact: 'high'
      },
      {
        id: 'market-competition',
        name: 'Competition Level',
        description: 'Overall market competition affecting all channels',
        type: 'competition',
        baseValue: 1.0,
        currentValue: 1.0,
        minValue: 0.5,
        maxValue: 2.0,
        unit: 'multiplier',
        impact: 'high'
      },
      {
        id: 'seasonal-factor',
        name: 'Seasonal Multiplier',
        description: 'Seasonal effect on conversion rates',
        type: 'seasonality',
        baseValue: 1.0,
        currentValue: 1.0,
        minValue: 0.6,
        maxValue: 1.8,
        unit: 'multiplier',
        impact: 'medium'
      },
      {
        id: 'market-confidence',
        name: 'Market Confidence',
        description: 'Economic confidence affecting customer behavior',
        type: 'market_shift',
        baseValue: 1.0,
        currentValue: 1.0,
        minValue: 0.7,
        maxValue: 1.3,
        unit: 'multiplier',
        impact: 'medium'
      }
    ];

    // Add channel-specific parameters
    scenario.channels.forEach(channel => {
      parameters.push({
        id: `${channel.id}-conversion-boost`,
        name: `${channel.name} Performance`,
        description: `Conversion rate multiplier for ${channel.name}`,
        type: 'conversion_rate',
        baseValue: 1.0,
        currentValue: 1.0,
        minValue: 0.5,
        maxValue: 2.0,
        unit: 'multiplier',
        impact: 'medium'
      });
    });

    return parameters;
  }

  applyWhatIfParameters(
    scenario: SimulationScenario, 
    parameters: WhatIfParameter[]
  ): SimulationScenario {
    const modifiedScenario = { ...scenario };
    
    parameters.forEach(param => {
      switch (param.type) {
        case 'budget':
          modifiedScenario.budget = param.currentValue;
          break;
          
        case 'competition':
          // Increase costs and reduce conversion rates
          modifiedScenario.channels = modifiedScenario.channels.map(channel => ({
            ...channel,
            totalBudget: Math.round((channel.totalBudget || 0) * param.currentValue),
            totalConversions: Math.round((channel.totalConversions || 0) / param.currentValue)
          }));
          break;
          
        case 'seasonality':
          // Affect conversion rates
          modifiedScenario.channels = modifiedScenario.channels.map(channel => ({
            ...channel,
            totalConversions: Math.round((channel.totalConversions || 0) * param.currentValue)
          }));
          break;
          
        case 'market_shift':
          // Affect overall performance
          modifiedScenario.channels = modifiedScenario.channels.map(channel => ({
            ...channel,
            totalConversions: Math.round((channel.totalConversions || 0) * param.currentValue),
            totalImpressions: Math.round((channel.totalImpressions || 0) * param.currentValue)
          }));
          break;
          
        case 'conversion_rate':
          // Channel-specific adjustments
          const channelId = param.id.replace('-conversion-boost', '');
          modifiedScenario.channels = modifiedScenario.channels.map(channel => {
            if (channel.id === channelId) {
              return {
                ...channel,
                totalConversions: Math.round((channel.totalConversions || 0) * param.currentValue)
              };
            }
            return channel;
          });
          break;
      }
    });

    return modifiedScenario;
  }

  analyzeScenarioOutcome(
    scenario: SimulationScenario,
    results: Array<{
      channelId: string;
      conversions: number;
      cost: number;
    }>
  ): ScenarioOutcome {
    const totalConversions = results.reduce((sum, r) => sum + r.conversions, 0);
    const totalCost = results.reduce((sum, r) => sum + r.cost, 0);
    const averageCPA = totalCost / Math.max(1, totalConversions);

    // Find best and worst performing channels
    const channelPerformance = results.map(r => ({
      channelId: r.channelId,
      cpa: r.cost / Math.max(1, r.conversions),
      conversions: r.conversions
    }));

    channelPerformance.sort((a, b) => a.cpa - b.cpa);
    const bestPerformingChannel = channelPerformance[0]?.channelId || 'none';
    const worstPerformingChannel = channelPerformance[channelPerformance.length - 1]?.channelId || 'none';

    // Calculate confidence score based on total conversions
    const confidenceScore = Math.min(1, totalConversions / 100); // Normalize to 0-1

    // Generate recommendations
    let recommendedAction = 'Continue current allocation';
    const riskFactors: string[] = [];

    if (averageCPA > 200) {
      recommendedAction = 'Reduce budget or optimize targeting';
      riskFactors.push('High cost per acquisition');
    }

    if (totalConversions < scenario.budget / 500) {
      recommendedAction = 'Increase budget allocation to top performers';
      riskFactors.push('Low conversion volume');
    }

    if (confidenceScore < 0.5) {
      riskFactors.push('Insufficient data for reliable decisions');
    }

    return {
      totalConversions,
      totalCost,
      averageCPA,
      bestPerformingChannel,
      worstPerformingChannel,
      recommendedAction,
      confidenceScore,
      riskFactors
    };
  }

  // Generate random scenario for testing
  generateRandomScenario(): SimulationScenario {
    const templates = this.getTemplates();
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return this.generateScenario(randomTemplate.id);
  }
}

// Factory function for easy scenario creation
export function createScenarioGenerator(): ScenarioGenerator {
  return new ScenarioGenerator();
}

// Utility function to create custom scenarios
export function createCustomScenario(
  name: string,
  description: string,
  channels: Partial<ChannelArm>[],
  budget: number,
  duration: number = 30,
  noiseVariance: number = 0.05
): SimulationScenario {
  return {
    id: `custom-${Date.now()}`,
    name,
    description,
    channels,
    budget,
    duration,
    expectedOutcome: 'Custom scenario outcome',
    noiseVariance
  };
}