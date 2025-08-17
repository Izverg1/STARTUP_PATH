import { BaseAgent } from './base'
import { 
  Artifact, 
  AllocArtifact, 
  BudgetCaptainCapability,
  AllocationStrategy,
  ChannelWeight,
  ExpectedImpact,
  RiskAssessment 
} from '@/types/agents'

export class BudgetCaptainAgent extends BaseAgent {
  constructor() {
    const capabilities: BudgetCaptainCapability[] = [
      {
        name: 'Budget Optimization',
        description: 'Optimize budget allocation across channels using statistical methods',
        type: 'budget_optimization',
        inputs: [
          {
            name: 'channel_performance',
            type: 'array',
            required: true,
            description: 'Historical performance data for each channel'
          },
          {
            name: 'total_budget',
            type: 'number',
            required: true,
            description: 'Total budget to allocate'
          },
          {
            name: 'constraints',
            type: 'object',
            required: false,
            description: 'Allocation constraints (min/max per channel)'
          }
        ],
        outputs: [
          {
            name: 'allocation_recommendation',
            type: 'object',
            description: 'Optimized budget allocation with expected performance'
          }
        ],
        dependencies: ['performance_data', 'statistical_models']
      },
      {
        name: 'Risk Assessment',
        description: 'Assess risk of allocation strategies',
        type: 'risk_assessment',
        inputs: [
          {
            name: 'allocation_strategy',
            type: 'object',
            required: true,
            description: 'Proposed allocation strategy'
          }
        ],
        outputs: [
          {
            name: 'risk_analysis',
            type: 'object',
            description: 'Risk assessment with mitigation strategies'
          }
        ],
        dependencies: ['risk_models', 'historical_volatility']
      }
    ]

    super('budget_captain', capabilities)
  }

  protected async performExecution(input?: {
    total_budget?: number
    strategy?: AllocationStrategy
    channels?: Array<{ id: string; name: string; performance_data: any }>
    constraints?: any
  }): Promise<Artifact[]> {
    const artifacts: Artifact[] = []

    await this.simulateProcessing('Analyzing channel performance...', 1200)
    
    const allocationArtifact = await this.optimizeBudgetAllocation(input)
    artifacts.push(allocationArtifact)

    await this.simulateProcessing('Assessing allocation risks...', 1000)
    
    const riskArtifact = await this.assessAllocationRisk(allocationArtifact)
    artifacts.push(riskArtifact)

    return artifacts
  }

  private async optimizeBudgetAllocation(input?: {
    total_budget?: number
    strategy?: AllocationStrategy
    channels?: Array<{ id: string; name: string; performance_data: any }>
    constraints?: any
  }): Promise<AllocArtifact> {
    const totalBudget = input?.total_budget || 50000
    const strategy = input?.strategy || 'thompson_sampling'
    
    // Mock channel data if not provided
    const channels = input?.channels || this.getMockChannelData()
    
    // Generate allocation based on strategy
    const allocation = this.generateAllocation(channels, totalBudget, strategy)
    
    const previousAllocation = this.generatePreviousAllocation(channels, totalBudget)
    const expectedImpact = this.calculateExpectedImpact(allocation, previousAllocation)
    const riskAssessment = this.assessRiskLevel(allocation)

    return this.createArtifact(
      'alloc',
      `Budget Allocation - ${strategy}`,
      {
        markdown_body: `## Budget Allocation Recommendation\n\n**Strategy:** ${strategy}\n**Total Budget:** $${totalBudget.toLocaleString()}\n**Expected CPQM Improvement:** ${expectedImpact.cpqm_improvement_percent.toFixed(1)}%\n\n### Channel Allocation\n\n${allocation.map(channel => 
          `**${channel.channel_name}**\n- Budget: $${channel.budget_amount.toLocaleString()} (${channel.new_weight.toFixed(1)}%)\n- Performance Score: ${channel.performance_score.toFixed(2)}\n- Change: ${channel.new_weight > channel.previous_weight ? '+' : ''}${(channel.new_weight - channel.previous_weight).toFixed(1)}%\n`
        ).join('\n')}\n\n### Expected Impact\n- **CPQM Improvement:** ${expectedImpact.cpqm_improvement_percent.toFixed(1)}%\n- **Additional Meetings:** +${expectedImpact.total_meetings_change}\n- **Time to Impact:** ${expectedImpact.time_to_impact_days} days\n- **Confidence:** ${(expectedImpact.confidence_level * 100).toFixed(0)}%`,
        structured_data: {
          allocation_date: new Date().toISOString(),
          strategy_used: strategy,
          previous_weights: previousAllocation,
          new_weights: allocation,
          rationale: this.generateRationale(strategy, allocation),
          expected_impact: expectedImpact,
          risk_assessment: riskAssessment
        }
      },
      {
        confidence_score: 0.84,
        data_sources: ['channel_performance', 'statistical_models', 'allocation_algorithms'],
        tags: ['allocation', strategy, 'optimization'],
        computation_time_ms: 1200
      }
    ) as AllocArtifact
  }

  private getMockChannelData() {
    return [
      {
        id: 'linkedin',
        name: 'LinkedIn Sales Navigator',
        performance_data: {
          cpqm: 145,
          conversion_rate: 0.08,
          volume_capacity: 500,
          volatility: 0.15
        }
      },
      {
        id: 'email',
        name: 'Cold Email Sequences',
        performance_data: {
          cpqm: 89,
          conversion_rate: 0.12,
          volume_capacity: 1000,
          volatility: 0.22
        }
      },
      {
        id: 'events',
        name: 'Industry Events',
        performance_data: {
          cpqm: 234,
          conversion_rate: 0.18,
          volume_capacity: 200,
          volatility: 0.35
        }
      },
      {
        id: 'referrals',
        name: 'Partner Referrals',
        performance_data: {
          cpqm: 67,
          conversion_rate: 0.25,
          volume_capacity: 300,
          volatility: 0.28
        }
      },
      {
        id: 'content',
        name: 'Content Marketing',
        performance_data: {
          cpqm: 178,
          conversion_rate: 0.06,
          volume_capacity: 800,
          volatility: 0.18
        }
      }
    ]
  }

  private generateAllocation(
    channels: Array<{ id: string; name: string; performance_data: any }>,
    totalBudget: number,
    strategy: AllocationStrategy
  ): ChannelWeight[] {
    let weights: number[]

    switch (strategy) {
      case 'thompson_sampling':
        weights = this.thompsonSamplingAllocation(channels)
        break
      case 'epsilon_greedy':
        weights = this.epsilonGreedyAllocation(channels)
        break
      case 'ucb':
        weights = this.ucbAllocation(channels)
        break
      case 'manual':
        weights = this.equalAllocation(channels)
        break
      default:
        weights = this.thompsonSamplingAllocation(channels)
    }

    // Normalize weights to sum to 100%
    const totalWeight = weights.reduce((sum, w) => sum + w, 0)
    const normalizedWeights = weights.map(w => (w / totalWeight) * 100)

    return channels.map((channel, i) => ({
      channel_id: channel.id,
      channel_name: channel.name,
      previous_weight: 100 / channels.length, // Equal previous allocation
      new_weight: normalizedWeights[i],
      budget_amount: (normalizedWeights[i] / 100) * totalBudget,
      performance_score: this.calculatePerformanceScore(channel.performance_data)
    }))
  }

  private thompsonSamplingAllocation(channels: Array<any>): number[] {
    // Mock Thompson Sampling - would normally sample from Beta distributions
    return channels.map(channel => {
      const score = this.calculatePerformanceScore(channel.performance_data)
      const uncertainty = channel.performance_data.volatility || 0.2
      // Add randomness for exploration vs exploitation
      const explorationFactor = Math.random() * uncertainty
      return Math.max(0.1, score + explorationFactor)
    })
  }

  private epsilonGreedyAllocation(channels: Array<any>): number[] {
    const epsilon = 0.1 // 10% exploration
    const scores = channels.map(c => this.calculatePerformanceScore(c.performance_data))
    
    if (Math.random() < epsilon) {
      // Explore: random allocation
      return channels.map(() => Math.random())
    } else {
      // Exploit: allocate to best performers
      return scores
    }
  }

  private ucbAllocation(channels: Array<any>): number[] {
    // Upper Confidence Bound allocation
    return channels.map(channel => {
      const score = this.calculatePerformanceScore(channel.performance_data)
      const uncertainty = channel.performance_data.volatility || 0.2
      const confidenceBound = uncertainty * Math.sqrt(2 * Math.log(100) / 30) // Mock sample size
      return score + confidenceBound
    })
  }

  private equalAllocation(channels: Array<any>): number[] {
    return channels.map(() => 1) // Equal weights
  }

  private calculatePerformanceScore(performanceData: any): number {
    // Combine CPQM (lower is better) and conversion rate (higher is better)
    const normalizedCpqm = 1 / (performanceData.cpqm / 100) // Invert CPQM
    const normalizedConversion = performanceData.conversion_rate * 10
    
    return (normalizedCpqm + normalizedConversion) / 2
  }

  private generatePreviousAllocation(
    channels: Array<{ id: string; name: string; performance_data: any }>,
    totalBudget: number
  ): ChannelWeight[] {
    // Mock previous allocation (equal split)
    const equalWeight = 100 / channels.length
    const equalBudget = totalBudget / channels.length

    return channels.map(channel => ({
      channel_id: channel.id,
      channel_name: channel.name,
      previous_weight: equalWeight,
      new_weight: equalWeight, // Will be updated
      budget_amount: equalBudget,
      performance_score: this.calculatePerformanceScore(channel.performance_data)
    }))
  }

  private calculateExpectedImpact(
    newAllocation: ChannelWeight[],
    previousAllocation: ChannelWeight[]
  ): ExpectedImpact {
    // Mock impact calculation
    const avgWeightChange = newAllocation.reduce((sum, channel, i) => {
      return sum + Math.abs(channel.new_weight - previousAllocation[i].previous_weight)
    }, 0) / newAllocation.length

    const cpqmImprovement = Math.min(avgWeightChange * 0.3, 15) // Max 15% improvement
    const meetingsChange = Math.floor(cpqmImprovement * 2) // Rough estimate

    return {
      cpqm_improvement_percent: cpqmImprovement,
      total_meetings_change: meetingsChange,
      confidence_level: Math.max(0.6, 1 - (avgWeightChange / 50)), // Higher changes = lower confidence
      time_to_impact_days: Math.ceil(avgWeightChange * 0.5 + 7) // 7-30 days
    }
  }

  private assessRiskLevel(allocation: ChannelWeight[]): RiskAssessment {
    const riskFactors = []
    let overallRisk: 'low' | 'medium' | 'high' = 'low'

    // Check for concentration risk
    const maxAllocation = Math.max(...allocation.map(a => a.new_weight))
    if (maxAllocation > 60) {
      riskFactors.push({
        type: 'volatility' as const,
        severity: 'high' as const,
        description: 'High concentration in single channel',
        impact_if_realized: 'Significant performance decline if channel fails'
      })
      overallRisk = 'high'
    } else if (maxAllocation > 40) {
      riskFactors.push({
        type: 'volatility' as const,
        severity: 'medium' as const,
        description: 'Moderate concentration in top channel',
        impact_if_realized: 'Performance vulnerability to channel changes'
      })
      overallRisk = 'medium'
    }

    // Check for dramatic changes
    const bigChanges = allocation.filter(a => Math.abs(a.new_weight - a.previous_weight) > 20)
    if (bigChanges.length > 0) {
      riskFactors.push({
        type: 'external_factors' as const,
        severity: 'medium' as const,
        description: 'Large allocation changes proposed',
        impact_if_realized: 'Execution risk and potential performance disruption'
      })
      if (overallRisk === 'low') overallRisk = 'medium'
    }

    return {
      overall_risk: overallRisk,
      risk_factors: riskFactors,
      mitigation_strategies: this.getMitigationStrategies(riskFactors)
    }
  }

  private getMitigationStrategies(riskFactors: any[]): string[] {
    const strategies = []

    if (riskFactors.some(r => r.type === 'volatility')) {
      strategies.push('Implement gradual allocation changes over 2-3 weeks')
      strategies.push('Monitor performance closely during transition')
      strategies.push('Maintain minimum allocation (10%) in each channel')
    }

    if (riskFactors.some(r => r.type === 'external_factors')) {
      strategies.push('Phase rollout with performance checkpoints')
      strategies.push('Prepare rollback plan if performance degrades')
      strategies.push('Increase monitoring frequency during changes')
    }

    if (strategies.length === 0) {
      strategies.push('Continue standard monitoring procedures')
      strategies.push('Review allocation monthly')
    }

    return strategies
  }

  private generateRationale(strategy: AllocationStrategy, allocation: ChannelWeight[]): string {
    const topChannel = allocation.reduce((prev, current) => 
      prev.new_weight > current.new_weight ? prev : current
    )

    const strategyDescriptions = {
      thompson_sampling: 'Thompson Sampling balances exploitation of known high performers with exploration of uncertain channels',
      epsilon_greedy: 'Epsilon-Greedy strategy allocates primarily to best performers while reserving budget for testing',
      ucb: 'Upper Confidence Bound strategy accounts for uncertainty in performance estimates',
      manual: 'Manual allocation provides equal distribution for conservative approach'
    }

    return `${strategyDescriptions[strategy]}. Top performer: ${topChannel.channel_name} (${topChannel.new_weight.toFixed(1)}% allocation) based on performance score of ${topChannel.performance_score.toFixed(2)}.`
  }

  private async assessAllocationRisk(allocationArtifact: AllocArtifact): Promise<Artifact> {
    const allocation = allocationArtifact.content.structured_data
    const riskAssessment = allocation.risk_assessment

    return this.createArtifact(
      'calc',
      'Allocation Risk Assessment',
      {
        markdown_body: `## Risk Assessment\n\n**Overall Risk Level:** ${riskAssessment.overall_risk.toUpperCase()}\n\n### Risk Factors\n\n${riskAssessment.risk_factors.length > 0 ? 
          riskAssessment.risk_factors.map((factor, i) => 
            `**${i + 1}. ${factor.type.toUpperCase()} Risk**\n- **Severity:** ${factor.severity}\n- **Description:** ${factor.description}\n- **Impact:** ${factor.impact_if_realized}\n`
          ).join('\n') : 
          'No significant risk factors identified.\n'
        }\n\n### Mitigation Strategies\n\n${riskAssessment.mitigation_strategies.map((strategy, i) => `${i + 1}. ${strategy}`).join('\n')}`,
        json_data: {
          risk_assessment: riskAssessment,
          assessment_date: new Date().toISOString(),
          recommendations: this.generateRiskRecommendations(riskAssessment)
        }
      },
      {
        confidence_score: 0.88,
        data_sources: ['allocation_data', 'risk_models', 'historical_performance'],
        tags: ['risk', 'assessment', 'allocation']
      }
    )
  }

  private generateRiskRecommendations(riskAssessment: RiskAssessment): string[] {
    const recommendations = []

    switch (riskAssessment.overall_risk) {
      case 'high':
        recommendations.push('Consider reducing allocation changes by 50%')
        recommendations.push('Implement weekly performance reviews')
        recommendations.push('Prepare immediate rollback procedures')
        break
      case 'medium':
        recommendations.push('Monitor key metrics daily during transition')
        recommendations.push('Set performance thresholds for allocation adjustments')
        break
      case 'low':
        recommendations.push('Proceed with allocation as planned')
        recommendations.push('Monitor with standard reporting cadence')
        break
    }

    return recommendations
  }

  /**
   * Optimize budget allocation for given parameters
   */
  public async optimizeBudget(params: {
    total_budget: number
    strategy?: AllocationStrategy
    channels?: Array<{ id: string; name: string; performance_data: any }>
    constraints?: any
  }): Promise<AllocArtifact[]> {
    const artifacts = await this.execute(params)
    return artifacts.filter(a => a.type === 'alloc') as AllocArtifact[]
  }

  /**
   * Rebalance allocation based on performance changes
   */
  public async rebalanceAllocation(
    currentAllocation: ChannelWeight[],
    performanceChanges: Array<{ channel_id: string; performance_delta: number }>
  ): Promise<AllocArtifact> {
    await this.simulateProcessing('Analyzing performance changes...', 1000)
    
    // Mock rebalancing logic
    const updatedChannels = currentAllocation.map(channel => {
      const change = performanceChanges.find(c => c.channel_id === channel.channel_id)
      const performanceDelta = change?.performance_delta || 0
      
      return {
        id: channel.channel_id,
        name: channel.channel_name,
        performance_data: {
          cpqm: 150 * (1 - performanceDelta), // Adjust based on performance change
          conversion_rate: 0.1 * (1 + performanceDelta),
          volume_capacity: 500,
          volatility: 0.2
        }
      }
    })

    const totalBudget = currentAllocation.reduce((sum, c) => sum + c.budget_amount, 0)
    const newAllocation = this.generateAllocation(updatedChannels, totalBudget, 'thompson_sampling')
    
    const expectedImpact = this.calculateExpectedImpact(newAllocation, currentAllocation)
    const riskAssessment = this.assessRiskLevel(newAllocation)

    return this.createArtifact(
      'alloc',
      'Rebalanced Budget Allocation',
      {
        structured_data: {
          allocation_date: new Date().toISOString(),
          strategy_used: 'performance_driven_rebalance',
          previous_weights: currentAllocation,
          new_weights: newAllocation,
          rationale: 'Rebalancing based on recent performance changes',
          expected_impact: expectedImpact,
          risk_assessment: riskAssessment
        }
      },
      {
        confidence_score: 0.79,
        data_sources: ['performance_changes', 'current_allocation'],
        tags: ['rebalance', 'performance_driven', 'allocation']
      }
    ) as AllocArtifact
  }

  /**
   * Simulate allocation scenarios
   */
  public async simulateScenarios(
    baseAllocation: ChannelWeight[],
    scenarios: Array<{
      name: string
      changes: Array<{ channel_id: string; weight_change: number }>
    }>
  ): Promise<Artifact[]> {
    await this.simulateProcessing('Running allocation scenarios...', 1500)
    
    const results = scenarios.map(scenario => {
      const modifiedAllocation = baseAllocation.map(channel => {
        const change = scenario.changes.find(c => c.channel_id === channel.channel_id)
        return {
          ...channel,
          new_weight: channel.new_weight + (change?.weight_change || 0)
        }
      })

      // Normalize weights
      const totalWeight = modifiedAllocation.reduce((sum, c) => sum + c.new_weight, 0)
      const normalizedAllocation = modifiedAllocation.map(c => ({
        ...c,
        new_weight: (c.new_weight / totalWeight) * 100
      }))

      const impact = this.calculateExpectedImpact(normalizedAllocation, baseAllocation)
      const risk = this.assessRiskLevel(normalizedAllocation)

      return {
        scenario: scenario.name,
        allocation: normalizedAllocation,
        expected_impact: impact,
        risk_assessment: risk
      }
    })

    return [this.createArtifact(
      'calc',
      'Allocation Scenario Analysis',
      {
        markdown_body: `## Scenario Analysis Results\n\n${results.map((result, i) => 
          `### Scenario ${i + 1}: ${result.scenario}\n- **CPQM Improvement:** ${result.expected_impact.cpqm_improvement_percent.toFixed(1)}%\n- **Risk Level:** ${result.risk_assessment.overall_risk}\n- **Additional Meetings:** +${result.expected_impact.total_meetings_change}\n`
        ).join('\n')}`,
        json_data: { scenarios: results }
      },
      {
        confidence_score: 0.82,
        data_sources: ['scenario_modeling', 'allocation_algorithms'],
        tags: ['scenarios', 'modeling', 'analysis']
      }
    )]
  }
}