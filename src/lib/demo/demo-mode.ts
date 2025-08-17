import { DEMO_DATA, generateCompleteDemoData, DEMO_SEED } from './seed-data';
import { 
  ICP, 
  Experiment, 
  Channel, 
  Gate, 
  Result,
  Project,
  ProjectMode 
} from '@/types';

// Demo mode state management
interface DemoModeState {
  isEnabled: boolean;
  currentSeed: number;
  lastGenerated: string;
  customizations: DemoCustomizations;
}

interface DemoCustomizations {
  budgetMultiplier: number;
  performanceVariance: number;
  enableTrends: boolean;
  seasonalEffects: boolean;
}

// Default demo mode state
const DEFAULT_DEMO_STATE: DemoModeState = {
  isEnabled: false,
  currentSeed: DEMO_SEED,
  lastGenerated: new Date().toISOString(),
  customizations: {
    budgetMultiplier: 1.0,
    performanceVariance: 0.1,
    enableTrends: true,
    seasonalEffects: false
  }
};

// Demo mode utilities class
export class DemoModeManager {
  private static instance: DemoModeManager;
  private state: DemoModeState;
  private listeners: Set<(state: DemoModeState) => void> = new Set();

  private constructor() {
    this.state = this.loadState();
  }

  static getInstance(): DemoModeManager {
    if (!DemoModeManager.instance) {
      DemoModeManager.instance = new DemoModeManager();
    }
    return DemoModeManager.instance;
  }

  // State management
  getState(): DemoModeState {
    return { ...this.state };
  }

  setState(updates: Partial<DemoModeState>): void {
    this.state = { ...this.state, ...updates };
    this.saveState();
    this.notifyListeners();
  }

  subscribe(listener: (state: DemoModeState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  private saveState(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo-mode-state', JSON.stringify(this.state));
    }
  }

  private loadState(): DemoModeState {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('demo-mode-state');
      if (saved) {
        try {
          return { ...DEFAULT_DEMO_STATE, ...JSON.parse(saved) };
        } catch (error) {
          console.warn('Failed to load demo mode state:', error);
        }
      }
    }
    return DEFAULT_DEMO_STATE;
  }

  // Demo mode controls
  enable(): void {
    this.setState({ 
      isEnabled: true,
      lastGenerated: new Date().toISOString()
    });
  }

  disable(): void {
    this.setState({ isEnabled: false });
  }

  toggle(): void {
    this.setState({ isEnabled: !this.state.isEnabled });
  }

  isEnabled(): boolean {
    return this.state.isEnabled;
  }

  // Data generation
  generateNewData(customSeed?: number): ReturnType<typeof generateCompleteDemoData> {
    const seed = customSeed || this.generateRandomSeed();
    const data = generateCompleteDemoData(seed);
    
    this.setState({
      currentSeed: seed,
      lastGenerated: new Date().toISOString()
    });

    return data;
  }

  getCurrentData(): ReturnType<typeof generateCompleteDemoData> {
    return generateCompleteDemoData(this.state.currentSeed);
  }

  getDefaultData(): ReturnType<typeof generateCompleteDemoData> {
    return DEMO_DATA;
  }

  private generateRandomSeed(): number {
    return Math.floor(Math.random() * 1000000);
  }

  // Customizations
  updateCustomizations(customizations: Partial<DemoCustomizations>): void {
    this.setState({
      customizations: { ...this.state.customizations, ...customizations }
    });
  }

  getCustomizations(): DemoCustomizations {
    return { ...this.state.customizations };
  }

  // Reset to defaults
  reset(): void {
    this.setState(DEFAULT_DEMO_STATE);
  }
}

// Utility functions for working with demo data
export class DemoDataUtils {
  
  // Check if a project is in demo mode
  static isProjectInDemoMode(project: Project): boolean {
    return project.mode === 'simulation' || project.settings.noise_variance_percent !== undefined;
  }

  // Apply noise/variance to demo data for more realistic simulation
  static applyNoise<T extends { metrics?: any; costs?: any }>(
    data: T[], 
    variance: number = 0.1
  ): T[] {
    return data.map(item => {
      if (!item.metrics) return item;
      
      const noisyMetrics = { ...item.metrics };
      const noisyCosts = item.costs ? { ...item.costs } : undefined;
      
      // Apply random variance to numeric metrics
      Object.keys(noisyMetrics).forEach(key => {
        const value = noisyMetrics[key];
        if (typeof value === 'number' && value > 0) {
          const noiseMultiplier = 1 + (Math.random() - 0.5) * 2 * variance;
          noisyMetrics[key] = Math.round(value * noiseMultiplier);
        }
      });

      // Apply variance to costs
      if (noisyCosts) {
        Object.keys(noisyCosts).forEach(key => {
          const value = noisyCosts[key];
          if (typeof value === 'number' && value > 0) {
            const noiseMultiplier = 1 + (Math.random() - 0.5) * 2 * variance;
            noisyCosts[key] = value * noiseMultiplier;
          }
        });
      }

      return {
        ...item,
        metrics: noisyMetrics,
        costs: noisyCosts,
        variance_applied: 1 + (Math.random() - 0.5) * 2 * variance
      };
    });
  }

  // Generate time series data for charts
  static generateTimeSeriesData(
    results: Result[],
    metric: keyof Result['metrics'],
    channelId?: string
  ): Array<{ date: string; value: number; channelId?: string }> {
    return results
      .filter(result => !channelId || result.channel_id === channelId)
      .map(result => ({
        date: result.date,
        value: result.metrics[metric] as number,
        channelId: result.channel_id
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Calculate performance metrics
  static calculateChannelPerformance(results: Result[], channels: Channel[]) {
    return channels.map(channel => {
      const channelResults = results.filter(r => r.channel_id === channel.id);
      
      if (channelResults.length === 0) {
        return {
          channelId: channel.id,
          channelName: channel.name,
          channelType: channel.type,
          totalCost: 0,
          totalLeads: 0,
          totalMeetings: 0,
          totalOpportunities: 0,
          totalWins: 0,
          costPerLead: 0,
          costPerMeeting: 0,
          costPerOpportunity: 0,
          conversionRate: 0,
          winRate: 0
        };
      }

      const totals = channelResults.reduce(
        (acc, result) => ({
          cost: acc.cost + result.costs.total_cost,
          leads: acc.leads + result.metrics.leads,
          meetings: acc.meetings + result.metrics.meetings_held,
          opportunities: acc.opportunities + result.metrics.opportunities,
          wins: acc.wins + result.metrics.wins,
          impressions: acc.impressions + result.metrics.impressions
        }),
        { cost: 0, leads: 0, meetings: 0, opportunities: 0, wins: 0, impressions: 0 }
      );

      return {
        channelId: channel.id,
        channelName: channel.name,
        channelType: channel.type,
        totalCost: totals.cost,
        totalLeads: totals.leads,
        totalMeetings: totals.meetings,
        totalOpportunities: totals.opportunities,
        totalWins: totals.wins,
        costPerLead: totals.leads > 0 ? totals.cost / totals.leads : 0,
        costPerMeeting: totals.meetings > 0 ? totals.cost / totals.meetings : 0,
        costPerOpportunity: totals.opportunities > 0 ? totals.cost / totals.opportunities : 0,
        conversionRate: totals.impressions > 0 ? totals.leads / totals.impressions : 0,
        winRate: totals.opportunities > 0 ? totals.wins / totals.opportunities : 0
      };
    });
  }

  // Simulate real-time updates for demo mode
  static simulateRealTimeUpdate(baseData: Result[]): Result[] {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Find today's results or create new ones
    const todayResults = baseData.filter(r => r.date === today);
    const otherResults = baseData.filter(r => r.date !== today);
    
    // Update today's results with slight variance
    const updatedTodayResults = todayResults.map(result => ({
      ...result,
      metrics: {
        ...result.metrics,
        impressions: result.metrics.impressions + Math.floor(Math.random() * 100),
        clicks: result.metrics.clicks + Math.floor(Math.random() * 10),
        leads: result.metrics.leads + Math.floor(Math.random() * 3)
      },
      updated_at: now.toISOString()
    }));

    return [...otherResults, ...updatedTodayResults];
  }

  // Validate demo data integrity
  static validateDemoData(data: ReturnType<typeof generateCompleteDemoData>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check that all channels have results
    const channelIds = new Set(data.channels.map(c => c.id));
    const resultChannelIds = new Set(data.results.map(r => r.channel_id));
    
    channelIds.forEach(id => {
      if (!resultChannelIds.has(id)) {
        errors.push(`Channel ${id} has no results`);
      }
    });

    // Check that all channels have gates
    const gateChannelIds = new Set(data.gates.map(g => g.channel_id));
    channelIds.forEach(id => {
      if (!gateChannelIds.has(id)) {
        warnings.push(`Channel ${id} has no gates`);
      }
    });

    // Check funnel logic in results
    data.results.forEach(result => {
      const metrics = result.metrics;
      if (metrics.clicks > metrics.impressions) {
        warnings.push(`Result ${result.id}: clicks exceed impressions`);
      }
      if (metrics.leads > metrics.clicks) {
        warnings.push(`Result ${result.id}: leads exceed clicks`);
      }
      if (metrics.wins > metrics.opportunities) {
        warnings.push(`Result ${result.id}: wins exceed opportunities`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// React hooks for demo mode
export function useDemoMode() {
  const manager = DemoModeManager.getInstance();
  
  return {
    isEnabled: manager.isEnabled(),
    state: manager.getState(),
    enable: () => manager.enable(),
    disable: () => manager.disable(),
    toggle: () => manager.toggle(),
    generateNewData: (seed?: number) => manager.generateNewData(seed),
    getCurrentData: () => manager.getCurrentData(),
    getDefaultData: () => manager.getDefaultData(),
    updateCustomizations: (customizations: Partial<DemoCustomizations>) => 
      manager.updateCustomizations(customizations),
    reset: () => manager.reset(),
    subscribe: (listener: (state: DemoModeState) => void) => manager.subscribe(listener)
  };
}

// Export singleton instance
export const demoModeManager = DemoModeManager.getInstance();

// Export types
export type { DemoModeState, DemoCustomizations };