// Thompson Sampling implementation for budget allocation experiments
// Uses Beta distribution for modeling channel conversion rates and allocation decisions

import { ChannelType } from '@/types';

export interface ChannelArm {
  id: string;
  name: string;
  type: ChannelType;
  alpha: number; // Beta distribution alpha parameter (successes + 1)
  beta: number;  // Beta distribution beta parameter (failures + 1)
  totalBudget: number;
  totalConversions: number;
  totalImpressions: number;
  lastUpdated: Date;
}

export interface AllocationResult {
  channelId: string;
  allocatedBudget: number;
  expectedConversionRate: number;
  confidenceInterval: {
    lower: number;
    upper: number;
    confidence: number;
  };
  sampledValue: number;
}

export interface ThompsonSamplingConfig {
  totalBudget: number;
  minAllocationPercentage: number; // Minimum allocation per channel (e.g., 0.05 = 5%)
  maxAllocationPercentage: number; // Maximum allocation per channel (e.g., 0.60 = 60%)
  decisionThreshold: number; // Threshold for automatic allocation decisions
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  deterministic?: boolean; // If true, use seeded RNG for reproducibility
  seed?: number; // Seed value for deterministic runs
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  channels: Partial<ChannelArm>[];
  budget: number;
  duration: number; // days
  expectedOutcome: string;
  noiseVariance: number; // 0.0 to 0.1 (0% to 10%)
}

export interface DecisionGate {
  metric: 'conversion_rate' | 'cpa' | 'roi' | 'confidence';
  threshold: number;
  operator: 'gt' | 'gte' | 'lt' | 'lte';
  action: 'continue' | 'pause' | 'reallocate' | 'alert';
  description: string;
}

export class ThompsonSamplingAllocator {
  private channels: Map<string, ChannelArm> = new Map();
  private config: ThompsonSamplingConfig;
  private decisionGates: DecisionGate[] = [];
  private rng: () => number; // RNG source (seeded or Math.random)

  constructor(config: ThompsonSamplingConfig) {
    this.config = config;
    this.rng = this.createRng(config.deterministic, config.seed);
    this.initializeDefaultDecisionGates();
  }

  // Seedable PRNG (Mulberry32)
  private createRng(deterministic?: boolean, seed?: number) {
    if (!deterministic) return Math.random;
    let a = (seed ?? 123456789) >>> 0;
    return function() {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  private initializeDefaultDecisionGates(): void {
    const riskMultiplier = this.getRiskMultiplier();
    
    this.decisionGates = [
      {
        metric: 'conversion_rate',
        threshold: 0.01 * riskMultiplier,
        operator: 'gte',
        action: 'continue',
        description: 'Minimum acceptable conversion rate'
      },
      {
        metric: 'confidence',
        threshold: 0.80,
        operator: 'gte',
        action: 'continue',
        description: 'Statistical confidence threshold'
      },
      {
        metric: 'cpa',
        threshold: 500 / riskMultiplier,
        operator: 'lte',
        action: 'continue',
        description: 'Maximum cost per acquisition'
      },
      {
        metric: 'roi',
        threshold: 2.0 * riskMultiplier,
        operator: 'gte',
        action: 'continue',
        description: 'Minimum return on investment'
      }
    ];
  }

  private getRiskMultiplier(): number {
    switch (this.config.riskTolerance) {
      case 'conservative': return 0.8;
      case 'moderate': return 1.0;
      case 'aggressive': return 1.2;
      default: return 1.0;
    }
  }

  // Initialize or update a channel arm
  addChannel(channel: Omit<ChannelArm, 'alpha' | 'beta' | 'lastUpdated'>): void {
    const conversions = channel.totalConversions || 0;
    const impressions = channel.totalImpressions || 0;
    const failures = Math.max(0, impressions - conversions);

    const arm: ChannelArm = {
      ...channel,
      alpha: conversions + 1, // Bayesian prior
      beta: failures + 1,
      lastUpdated: new Date()
    };

    this.channels.set(channel.id, arm);
  }

  // Update channel performance data
  updateChannelPerformance(
    channelId: string, 
    newConversions: number, 
    newImpressions: number,
    budgetSpent: number
  ): void {
    const channel = this.channels.get(channelId);
    if (!channel) {
      throw new Error(`Channel ${channelId} not found`);
    }

    const newFailures = Math.max(0, newImpressions - newConversions);
    
    channel.alpha += newConversions;
    channel.beta += newFailures;
    channel.totalConversions += newConversions;
    channel.totalImpressions += newImpressions;
    channel.totalBudget += budgetSpent;
    channel.lastUpdated = new Date();

    this.channels.set(channelId, channel);
  }

  // Sample from Beta distribution using Box-Muller transform approximation
  private sampleBeta(alpha: number, beta: number): number {
    // For computational efficiency, we'll use a gamma approximation
    // In production, consider using a proper statistical library
    const x = this.sampleGamma(alpha);
    const y = this.sampleGamma(beta);
    return x / (x + y);
  }

  private sampleGamma(shape: number): number {
    // Simplified gamma sampling - use proper library in production
    if (shape < 1) {
      return this.sampleGamma(shape + 1) * Math.pow(Math.random(), 1 / shape);
    }
    
    const d = shape - 1/3;
    const c = 1 / Math.sqrt(9 * d);
    
    while (true) {
      let x = this.randomNormal();
      let v = 1 + c * x;
      if (v <= 0) continue;
      
      v = v * v * v;
      const u = this.rng();
      
      if (u < 1 - 0.0331 * x * x * x * x) {
        return d * v;
      }
      
      if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
        return d * v;
      }
    }
  }

  private randomNormal(): number {
    // Box-Muller transform
    const u1 = this.rng();
    const u2 = this.rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  // Perform Thompson Sampling allocation
  allocateBudget(): AllocationResult[] {
    if (this.channels.size === 0) {
      throw new Error('No channels available for allocation');
    }

    // Guard against invalid min/max constraints
    const n = this.channels.size;
    const minTotal = this.config.minAllocationPercentage * n;
    const maxTotal = this.config.maxAllocationPercentage * n;
    // If constraints are impossible, relax them proportionally
    if (minTotal > 1) {
      const relaxedMin = 1 / n;
      this.config.minAllocationPercentage = relaxedMin * 0.95; // keep a small margin
    }
    if (maxTotal < 1) {
      const relaxedMax = 1 / n;
      this.config.maxAllocationPercentage = relaxedMax * 1.05; // keep a small margin
    }

    const samples: Array<{channelId: string, sampledValue: number, channel: ChannelArm}> = [];
    
    // Sample from each channel's Beta distribution
    this.channels.forEach((channel, channelId) => {
      const sampledValue = this.sampleBeta(channel.alpha, channel.beta);
      samples.push({ channelId, sampledValue, channel });
    });

    // Sort by sampled values (descending)
    samples.sort((a, b) => b.sampledValue - a.sampledValue);

    // Calculate total sampled value for normalization
    const totalSampledValue = samples.reduce((sum, s) => sum + s.sampledValue, 0);

    // Allocate budget based on sampled performance (initial raw shares)
    const base: Array<AllocationResult & { priority: number }> = samples.map((sample, index) => {
      const rawAllocation = (sample.sampledValue / totalSampledValue) * this.config.totalBudget;
      const minBudget = this.config.totalBudget * this.config.minAllocationPercentage;
      const maxBudget = this.config.totalBudget * this.config.maxAllocationPercentage;

      // Start with clamped, integer allocations
      let allocatedBudget = Math.max(minBudget, Math.min(maxBudget, rawAllocation));
      allocatedBudget = Math.round(allocatedBudget);

      // Calculate confidence interval
      const expectedRate = sample.channel.alpha / (sample.channel.alpha + sample.channel.beta);
      const variance = (sample.channel.alpha * sample.channel.beta) / 
        (Math.pow(sample.channel.alpha + sample.channel.beta, 2) * (sample.channel.alpha + sample.channel.beta + 1));
      const stdDev = Math.sqrt(variance);

      return {
        channelId: sample.channelId,
        allocatedBudget: Math.round(allocatedBudget),
        expectedConversionRate: expectedRate,
        confidenceInterval: {
          lower: Math.max(0, expectedRate - 1.96 * stdDev),
          upper: Math.min(1, expectedRate + 1.96 * stdDev),
          confidence: 0.95
        },
        sampledValue: sample.sampledValue,
        priority: index
      };
    });

    // Enforce exact sum and constraints
    const normalized = this.normalizeAllocations(base, this.config.totalBudget);
    return normalized;
  }

  // Ensure the integer allocations sum exactly to totalBudget with min/max constraints
  private normalizeAllocations(results: Array<AllocationResult & { priority: number }>, totalBudget: number): AllocationResult[] {
    const n = results.length;
    const minBudget = Math.floor(this.config.minAllocationPercentage * totalBudget);
    const maxBudget = Math.ceil(this.config.maxAllocationPercentage * totalBudget);

    // Start from clamped values
    let allocs = results.map(r => ({ ...r }));
    let sum = allocs.reduce((s, r) => s + r.allocatedBudget, 0);

    // If sum < totalBudget, distribute remaining to those with headroom (<= maxBudget)
    if (sum < totalBudget) {
      let remaining = totalBudget - sum;
      // Sort by sampled value desc (priority ensures stable tie-break)
      allocs.sort((a, b) => (b.sampledValue - a.sampledValue) || (a.priority - b.priority));
      let idx = 0;
      while (remaining > 0) {
        const r = allocs[idx % n];
        if (r.allocatedBudget < maxBudget) {
          r.allocatedBudget += 1;
          remaining -= 1;
        }
        idx++;
        // Safety to avoid infinite loop if maxBudget too tight
        if (idx > n * (maxBudget + 1)) break;
      }
    }

    // If sum > totalBudget, remove surplus from those above minBudget
    sum = allocs.reduce((s, r) => s + r.allocatedBudget, 0);
    if (sum > totalBudget) {
      let surplus = sum - totalBudget;
      // Reduce from lowest sampled first to preserve strong performers
      allocs.sort((a, b) => (a.sampledValue - b.sampledValue) || (a.priority - b.priority));
      let idx = 0;
      while (surplus > 0) {
        const r = allocs[idx % n];
        if (r.allocatedBudget > minBudget) {
          r.allocatedBudget -= 1;
          surplus -= 1;
        }
        idx++;
        if (idx > n * (maxBudget + 1)) break;
      }
    }

    // Final clamp and return without priority field
    return allocs.map(r => ({
      channelId: r.channelId,
      allocatedBudget: Math.max(minBudget, Math.min(maxBudget, r.allocatedBudget)),
      expectedConversionRate: r.expectedConversionRate,
      confidenceInterval: r.confidenceInterval,
      sampledValue: r.sampledValue
    }));
  }

  // Check decision gates and return recommendations
  checkDecisionGates(allocation: AllocationResult[]): Array<{
    gate: DecisionGate;
    channelId: string;
    currentValue: number;
    passed: boolean;
    recommendation: string;
  }> {
    const results: Array<{
      gate: DecisionGate;
      channelId: string;
      currentValue: number;
      passed: boolean;
      recommendation: string;
    }> = [];

    allocation.forEach(result => {
      const channel = this.channels.get(result.channelId);
      if (!channel) return;

      this.decisionGates.forEach(gate => {
        let currentValue: number;
        
        switch (gate.metric) {
          case 'conversion_rate':
            currentValue = result.expectedConversionRate;
            break;
          case 'confidence':
            currentValue = this.calculateConfidence(channel);
            break;
          case 'cpa':
            currentValue = channel.totalBudget / Math.max(1, channel.totalConversions);
            break;
          case 'roi':
            // Simplified ROI calculation - customize based on your business model
            const revenue = channel.totalConversions * 1000; // Assume $1000 per conversion
            currentValue = revenue / Math.max(1, channel.totalBudget);
            break;
          default:
            currentValue = 0;
        }

        const passed = this.evaluateGate(currentValue, gate.threshold, gate.operator);
        
        results.push({
          gate,
          channelId: result.channelId,
          currentValue,
          passed,
          recommendation: this.generateRecommendation(gate, passed, currentValue)
        });
      });
    });

    return results;
  }

  private calculateConfidence(channel: ChannelArm): number {
    const n = channel.alpha + channel.beta - 2;
    if (n < 30) return 0.5; // Low confidence for small samples
    
    // Rough confidence measure based on sample size and variance
    const p = channel.alpha / (channel.alpha + channel.beta);
    const variance = p * (1 - p) / n;
    const marginOfError = 1.96 * Math.sqrt(variance);
    
    return Math.max(0, Math.min(1, 1 - marginOfError));
  }

  private evaluateGate(value: number, threshold: number, operator: string): boolean {
    switch (operator) {
      case 'gt': return value > threshold;
      case 'gte': return value >= threshold;
      case 'lt': return value < threshold;
      case 'lte': return value <= threshold;
      default: return false;
    }
  }

  private generateRecommendation(gate: DecisionGate, passed: boolean, currentValue: number): string {
    if (passed) {
      return `${gate.description} - Continue current allocation`;
    }

    switch (gate.action) {
      case 'pause':
        return `${gate.description} - Consider pausing this channel`;
      case 'reallocate':
        return `${gate.description} - Reduce allocation and redistribute`;
      case 'alert':
        return `${gate.description} - Monitor closely`;
      default:
        return `${gate.description} - Review performance`;
    }
  }

  // Get channel performance summary
  getChannelSummary(): Array<{
    channelId: string;
    name: string;
    type: ChannelType;
    conversionRate: number;
    totalConversions: number;
    totalImpressions: number;
    totalBudget: number;
    confidence: number;
    lastUpdated: Date;
  }> {
    return Array.from(this.channels.entries()).map(([channelId, channel]) => ({
      channelId,
      name: channel.name,
      type: channel.type,
      conversionRate: channel.alpha / (channel.alpha + channel.beta),
      totalConversions: channel.totalConversions,
      totalImpressions: channel.totalImpressions,
      totalBudget: channel.totalBudget,
      confidence: this.calculateConfidence(channel),
      lastUpdated: channel.lastUpdated
    }));
  }

  // Add noise to simulate real-world variance
  addNoise(value: number, noiseVariance: number): number {
    const noise = this.randomNormal() * noiseVariance;
    return Math.max(0, value + noise);
  }

  // Simulate a time period with given allocations and noise
  simulatePeriod(
    allocations: AllocationResult[], 
    days: number, 
    noiseVariance: number = 0.05
  ): Array<{
    channelId: string;
    day: number;
    conversions: number;
    impressions: number;
    cost: number;
  }> {
    const results: Array<{
      channelId: string;
      day: number;
      conversions: number;
      impressions: number;
      cost: number;
    }> = [];

    allocations.forEach(allocation => {
      const channel = this.channels.get(allocation.channelId);
      if (!channel) return;

      const dailyBudget = allocation.allocatedBudget / days;
      const baseConversionRate = allocation.expectedConversionRate;

      for (let day = 1; day <= days; day++) {
        // Add noise to conversion rate
        const noisyConversionRate = this.addNoise(baseConversionRate, noiseVariance);
        
        // Simulate impressions based on budget (simplified model)
        const impressions = Math.round(dailyBudget * 100); // Assume $0.01 per impression
        
        // Simulate conversions
        const conversions = Math.round(impressions * noisyConversionRate);
        
        results.push({
          channelId: allocation.channelId,
          day,
          conversions,
          impressions,
          cost: dailyBudget
        });
      }
    });

    return results;
  }
}

// Utility functions for creating scenarios and testing
export function createDefaultChannels(): Partial<ChannelArm>[] {
  return [
    {
      id: 'google-ads',
      name: 'Google Ads',
      type: 'google_search',
      totalConversions: 150,
      totalImpressions: 10000,
      totalBudget: 5000
    },
    {
      id: 'facebook-ads',
      name: 'Facebook Ads',
      type: 'paid_social',
      totalConversions: 89,
      totalImpressions: 8500,
      totalBudget: 4200
    },
    {
      id: 'linkedin-ads',
      name: 'LinkedIn Ads',
      type: 'paid_social',
      totalConversions: 45,
      totalImpressions: 3200,
      totalBudget: 3800
    },
    {
      id: 'display-network',
      name: 'Display Network',
      type: 'social_media',
      totalConversions: 32,
      totalImpressions: 15000,
      totalBudget: 2500
    }
  ];
}

export function createDefaultConfig(): ThompsonSamplingConfig {
  return {
    totalBudget: 10000,
    minAllocationPercentage: 0.05,
    maxAllocationPercentage: 0.60,
    decisionThreshold: 0.80,
    riskTolerance: 'moderate',
    deterministic: false,
    seed: undefined
  };
}
