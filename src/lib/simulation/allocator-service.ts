// Service layer connecting database experiments with Thompson Sampling allocator
// Provides real-time budget allocation and scenario simulation capabilities

import { 
  ThompsonSamplingAllocator, 
  AllocationResult, 
  ThompsonSamplingConfig,
  createDefaultConfig,
  SimulationScenario,
  ChannelArm 
} from './thompson-sampling';
import { 
  ScenarioGenerator, 
  createScenarioGenerator, 
  WhatIfParameter 
} from './scenario-generator';
import { ChannelType } from '@/types';

export interface ExperimentAllocation {
  experimentId: string;
  allocations: AllocationResult[];
  timestamp: Date;
  totalBudget: number;
  confidence: number;
  recommendedActions: string[];
  performanceMetrics: {
    totalConversions: number;
    totalCost: number;
    averageCPA: number;
    bestChannel: string;
    worstChannel: string;
  };
}

export interface SimulationResult {
  scenarioId: string;
  allocations: AllocationResult[];
  projectedOutcome: {
    totalConversions: number;
    totalCost: number;
    roi: number;
    riskScore: number;
  };
  dayByDayResults: Array<{
    day: number;
    channelResults: Array<{
      channelId: string;
      conversions: number;
      cost: number;
      impressions: number;
    }>;
  }>;
}

export class AllocatorService {
  private allocators: Map<string, ThompsonSamplingAllocator> = new Map();
  private scenarioGenerator: ScenarioGenerator;

  constructor() {
    this.scenarioGenerator = createScenarioGenerator();
  }

  // Initialize allocator for a specific experiment
  async initializeExperiment(
    experimentId: string, 
    channels: Array<{
      id: string;
      name: string;
      type: ChannelType;
      totalBudget: number;
      totalConversions: number;
      totalImpressions: number;
    }>,
    config?: Partial<ThompsonSamplingConfig>
  ): Promise<void> {
    const allocatorConfig: ThompsonSamplingConfig = {
      ...createDefaultConfig(),
      ...config
    };

    const allocator = new ThompsonSamplingAllocator(allocatorConfig);

    // Add channels to the allocator
    channels.forEach(channel => {
      allocator.addChannel({
        id: channel.id,
        name: channel.name,
        type: channel.type,
        totalBudget: channel.totalBudget,
        totalConversions: channel.totalConversions,
        totalImpressions: channel.totalImpressions
      });
    });

    this.allocators.set(experimentId, allocator);
  }

  // Update channel performance data
  async updateChannelPerformance(
    experimentId: string,
    channelId: string,
    newConversions: number,
    newImpressions: number,
    budgetSpent: number
  ): Promise<void> {
    const allocator = this.allocators.get(experimentId);
    if (!allocator) {
      throw new Error(`Allocator not found for experiment ${experimentId}`);
    }

    allocator.updateChannelPerformance(channelId, newConversions, newImpressions, budgetSpent);
  }

  // Get current budget allocation for an experiment
  async getAllocation(experimentId: string): Promise<ExperimentAllocation> {
    const allocator = this.allocators.get(experimentId);
    if (!allocator) {
      throw new Error(`Allocator not found for experiment ${experimentId}`);
    }

    const allocations = allocator.allocateBudget();
    const gates = allocator.checkDecisionGates(allocations);
    const summary = allocator.getChannelSummary();

    const totalBudget = allocations.reduce((sum, a) => sum + a.allocatedBudget, 0);
    const totalConversions = summary.reduce((sum, s) => sum + s.totalConversions, 0);
    const totalCost = summary.reduce((sum, s) => sum + s.totalBudget, 0);
    const averageCPA = totalCost / Math.max(1, totalConversions);

    // Find best and worst performing channels
    const channelsByCPA = summary
      .map(s => ({ 
        id: s.channelId, 
        cpa: s.totalBudget / Math.max(1, s.totalConversions),
        name: s.name
      }))
      .sort((a, b) => a.cpa - b.cpa);

    const bestChannel = channelsByCPA[0]?.name || 'Unknown';
    const worstChannel = channelsByCPA[channelsByCPA.length - 1]?.name || 'Unknown';

    // Calculate overall confidence
    const avgConfidence = summary.reduce((sum, s) => sum + s.confidence, 0) / summary.length;

    // Generate recommendations
    const failedGates = gates.filter(g => !g.passed);
    const recommendedActions = failedGates.map(g => g.recommendation);

    if (recommendedActions.length === 0) {
      recommendedActions.push('Continue current allocation strategy');
    }

    return {
      experimentId,
      allocations,
      timestamp: new Date(),
      totalBudget,
      confidence: avgConfidence,
      recommendedActions,
      performanceMetrics: {
        totalConversions,
        totalCost,
        averageCPA,
        bestChannel,
        worstChannel
      }
    };
  }

  // Run scenario simulation
  async runScenarioSimulation(
    scenarioId: string,
    customParameters?: WhatIfParameter[]
  ): Promise<SimulationResult> {
    let scenario = this.scenarioGenerator.generateScenario(scenarioId);

    // Apply custom parameters if provided
    if (customParameters && customParameters.length > 0) {
      scenario = this.scenarioGenerator.applyWhatIfParameters(scenario, customParameters);
    }

    // Create temporary allocator for simulation
    const config: ThompsonSamplingConfig = {
      totalBudget: scenario.budget,
      minAllocationPercentage: 0.05,
      maxAllocationPercentage: 0.60,
      decisionThreshold: 0.80,
      riskTolerance: 'moderate'
    };

    const allocator = new ThompsonSamplingAllocator(config);

    // Add channels from scenario
    scenario.channels.forEach(channel => {
      if (channel.id && channel.name && channel.type) {
        allocator.addChannel({
          id: channel.id,
          name: channel.name,
          type: channel.type as ChannelType,
          totalBudget: channel.totalBudget || 0,
          totalConversions: channel.totalConversions || 0,
          totalImpressions: channel.totalImpressions || 0
        });
      }
    });

    // Get allocation
    const allocations = allocator.allocateBudget();

    // Simulate day-by-day results
    const dayByDayResults = [];
    const totalDays = scenario.duration;

    for (let day = 1; day <= totalDays; day++) {
      const dailyResults = allocator.simulatePeriod(allocations, 1, scenario.noiseVariance);
      dayByDayResults.push({
        day,
        channelResults: dailyResults
      });

      // Update allocator with daily results for next iteration
      dailyResults.forEach(result => {
        allocator.updateChannelPerformance(
          result.channelId,
          result.conversions,
          result.impressions,
          result.cost
        );
      });
    }

    // Calculate final projections
    const totalConversions = dayByDayResults.reduce((sum, day) => 
      sum + day.channelResults.reduce((daySum, channel) => daySum + channel.conversions, 0), 0
    );

    const totalCost = dayByDayResults.reduce((sum, day) => 
      sum + day.channelResults.reduce((daySum, channel) => daySum + channel.cost, 0), 0
    );

    const roi = (totalConversions * 1000) / Math.max(1, totalCost); // Assume $1000 per conversion
    const riskScore = this.calculateRiskScore(allocations, scenario);

    return {
      scenarioId,
      allocations,
      projectedOutcome: {
        totalConversions,
        totalCost,
        roi,
        riskScore
      },
      dayByDayResults
    };
  }

  // Calculate risk score based on allocation diversity and confidence
  private calculateRiskScore(allocations: AllocationResult[], scenario: SimulationScenario): number {
    // Risk factors:
    // 1. Concentration risk (too much budget in one channel)
    // 2. Low confidence intervals
    // 3. High noise variance
    
    const totalBudget = allocations.reduce((sum, a) => sum + a.allocatedBudget, 0);
    const maxAllocation = Math.max(...allocations.map(a => a.allocatedBudget));
    const concentrationRatio = maxAllocation / totalBudget;
    
    const avgConfidenceWidth = allocations.reduce((sum, a) => 
      sum + (a.confidenceInterval.upper - a.confidenceInterval.lower), 0
    ) / allocations.length;
    
    const noiseRisk = scenario.noiseVariance * 10; // Scale 0-1 to 0-10
    const concentrationRisk = concentrationRatio * 10; // Scale 0-1 to 0-10
    const confidenceRisk = avgConfidenceWidth * 10; // Scale 0-1 to 0-10
    
    // Combine risks (lower is better)
    const totalRisk = (noiseRisk + concentrationRisk + confidenceRisk) / 3;
    
    // Return as 0-10 scale where 0 is lowest risk, 10 is highest risk
    return Math.min(10, Math.max(0, totalRisk));
  }

  // Get available scenarios
  getAvailableScenarios(
    category?: 'startup' | 'growth' | 'scale' | 'optimization' | 'crisis',
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  ) {
    return this.scenarioGenerator.getTemplates(category, difficulty);
  }

  // Get what-if parameters for a scenario
  getWhatIfParameters(scenarioId: string): WhatIfParameter[] {
    const scenario = this.scenarioGenerator.generateScenario(scenarioId);
    return this.scenarioGenerator.generateWhatIfParameters(scenario);
  }

  // Generate deterministic results with seeded random
  async runDeterministicSimulation(
    scenarioId: string,
    seed: number = 12345
  ): Promise<SimulationResult> {
    // Set deterministic seed for consistent results
    const originalRandom = Math.random;
    let currentSeed = seed;
    
    // Simple linear congruential generator for deterministic "random" numbers
    Math.random = () => {
      currentSeed = (currentSeed * 1664525 + 1013904223) % Math.pow(2, 32);
      return currentSeed / Math.pow(2, 32);
    };

    try {
      const result = await this.runScenarioSimulation(scenarioId);
      return result;
    } finally {
      // Restore original Math.random
      Math.random = originalRandom;
    }
  }

  // Clean up allocator when experiment ends
  removeExperiment(experimentId: string): void {
    this.allocators.delete(experimentId);
  }

  // Get active allocators count
  getActiveAllocatorsCount(): number {
    return this.allocators.size;
  }

  // Get performance summary for all active experiments
  async getPerformanceSummary(): Promise<Array<{
    experimentId: string;
    totalBudget: number;
    totalConversions: number;
    averageCPA: number;
    bestChannel: string;
    confidence: number;
  }>> {
    const summaries = [];

    for (const [experimentId, allocator] of this.allocators.entries()) {
      const allocations = allocator.allocateBudget();
      const channels = allocator.getChannelSummary();

      const totalBudget = allocations.reduce((sum, a) => sum + a.allocatedBudget, 0);
      const totalConversions = channels.reduce((sum, c) => sum + c.totalConversions, 0);
      const totalCost = channels.reduce((sum, c) => sum + c.totalBudget, 0);
      const averageCPA = totalCost / Math.max(1, totalConversions);
      
      const bestChannel = channels
        .sort((a, b) => (a.totalBudget / Math.max(1, a.totalConversions)) - (b.totalBudget / Math.max(1, b.totalConversions)))[0]?.name || 'Unknown';
      
      const avgConfidence = channels.reduce((sum, c) => sum + c.confidence, 0) / channels.length;

      summaries.push({
        experimentId,
        totalBudget,
        totalConversions,
        averageCPA,
        bestChannel,
        confidence: avgConfidence
      });
    }

    return summaries;
  }
}

// Singleton instance
let allocatorServiceInstance: AllocatorService | null = null;

export function getAllocatorService(): AllocatorService {
  if (!allocatorServiceInstance) {
    allocatorServiceInstance = new AllocatorService();
  }
  return allocatorServiceInstance;
}

// Utility function for testing scenarios
export function createTestScenario(
  name: string,
  channels: Array<{ id: string; name: string; type: ChannelType }>,
  budget: number
): SimulationScenario {
  return {
    id: `test-${Date.now()}`,
    name,
    description: `Test scenario: ${name}`,
    channels: channels.map(channel => ({
      ...channel,
      totalConversions: Math.floor(Math.random() * 100) + 10,
      totalImpressions: Math.floor(Math.random() * 5000) + 1000,
      totalBudget: Math.floor(Math.random() * 2000) + 500
    })),
    budget,
    duration: 30,
    expectedOutcome: 'Test scenario for validation',
    noiseVariance: 0.05
  };
}