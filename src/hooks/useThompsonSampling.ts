'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSimulationService, SimulationService, SimulationState, SimulationMetrics } from '@/lib/simulation/simulation-service';
import { AllocationResult } from '@/lib/simulation/thompson-sampling';
import { useCurrentProject } from './useCurrentProject';

interface UseThompsonSamplingOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface ThompsonSamplingHook {
  // State
  isInitialized: boolean;
  isRunning: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Data
  allocation: AllocationResult[];
  metrics: SimulationMetrics;
  channelSummary: ReturnType<SimulationService['getChannelSummary']>;
  decisionGates: ReturnType<SimulationService['checkDecisionGates']>;
  
  // Actions
  initialize: () => Promise<void>;
  allocateBudget: () => Promise<void>;
  updateChannelPerformance: (channelId: string, conversions: number, impressions: number, spend: number) => Promise<void>;
  simulatePeriod: (days?: number, noiseVariance?: number) => Promise<any[]>;
  stopSimulation: () => void;
  updateConfig: (config: any) => void;
  
  // Refresh data
  refresh: () => void;
}

export function useThompsonSampling(options: UseThompsonSamplingOptions = {}): ThompsonSamplingHook {
  const { autoRefresh = false, refreshInterval = 30000 } = options;
  const { currentProject } = useCurrentProject();
  const [state, setState] = useState<SimulationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    totalBudget: 0,
    allocatedBudget: 0,
    expectedConversions: 0,
    confidenceScore: 0,
    lastUpdated: new Date()
  });
  
  const serviceRef = useRef<SimulationService | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize service
  useEffect(() => {
    serviceRef.current = getSimulationService();
    
    // Subscribe to state changes
    const unsubscribe = serviceRef.current.subscribe((newState) => {
      setState(newState);
      if (newState.allocator) {
        setMetrics(serviceRef.current!.getMetrics());
      }
    });
    
    unsubscribeRef.current = unsubscribe;
    
    // Get initial state
    setState(serviceRef.current.getState());
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Initialize project when currentProject changes
  const initialize = useCallback(async () => {
    if (!currentProject?.id || !serviceRef.current) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await serviceRef.current.initializeProject(currentProject.id);
      setMetrics(serviceRef.current.getMetrics());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize simulation');
      console.error('Thompson Sampling initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentProject?.id]);

  // Auto-initialize when project changes
  useEffect(() => {
    if (currentProject?.id && serviceRef.current) {
      initialize();
    }
  }, [currentProject?.id, initialize]);

  // Allocate budget using Thompson Sampling
  const allocateBudget = useCallback(async () => {
    if (!serviceRef.current) return;

    setIsLoading(true);
    setError(null);
    
    try {
      await serviceRef.current.allocateBudget();
      setMetrics(serviceRef.current.getMetrics());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to allocate budget');
      console.error('Budget allocation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update channel performance
  const updateChannelPerformance = useCallback(async (
    channelId: string,
    conversions: number,
    impressions: number,
    spend: number
  ) => {
    if (!serviceRef.current) return;

    setIsLoading(true);
    setError(null);
    
    try {
      await serviceRef.current.updateChannelPerformance(channelId, conversions, impressions, spend);
      setMetrics(serviceRef.current.getMetrics());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update channel performance');
      console.error('Channel update error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simulate time period
  const simulatePeriod = useCallback(async (days: number = 7, noiseVariance: number = 0.05) => {
    if (!serviceRef.current) return [];

    setIsLoading(true);
    setError(null);
    
    try {
      const results = await serviceRef.current.simulatePeriod(days, noiseVariance);
      setMetrics(serviceRef.current.getMetrics());
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run simulation');
      console.error('Simulation error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    if (!serviceRef.current) return;
    
    serviceRef.current.stopSimulation();
    setMetrics(serviceRef.current.getMetrics());
  }, []);

  // Update configuration
  const updateConfig = useCallback((config: any) => {
    if (!serviceRef.current) return;
    
    serviceRef.current.updateConfig(config);
    setMetrics(serviceRef.current.getMetrics());
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    if (!serviceRef.current) return;
    
    setState(serviceRef.current.getState());
    setMetrics(serviceRef.current.getMetrics());
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !state?.isRunning) return;

    intervalRef.current = setInterval(() => {
      if (serviceRef.current && state?.isRunning) {
        refresh();
      }
    }, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, state?.isRunning, refresh]);

  // Get derived data
  const channelSummary = serviceRef.current?.getChannelSummary() || [];
  const decisionGates = serviceRef.current?.checkDecisionGates() || [];
  const allocation = state?.lastAllocation || [];

  return {
    // State
    isInitialized: !!state?.allocator,
    isRunning: !!state?.isRunning,
    isLoading,
    error,
    
    // Data
    allocation,
    metrics,
    channelSummary,
    decisionGates,
    
    // Actions
    initialize,
    allocateBudget,
    updateChannelPerformance,
    simulatePeriod,
    stopSimulation,
    updateConfig,
    
    // Refresh
    refresh
  };
}

// Hook for simulation scenarios
export function useSimulationScenarios() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScenarios = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load predefined scenarios or from API
      const defaultScenarios = [
        {
          id: 'conservative',
          name: 'Conservative Growth',
          description: 'Low risk, steady allocation with high confidence thresholds',
          config: {
            totalBudget: 10000,
            minAllocationPercentage: 0.10,
            maxAllocationPercentage: 0.40,
            decisionThreshold: 0.85,
            riskTolerance: 'conservative' as const
          }
        },
        {
          id: 'balanced',
          name: 'Balanced Optimization',
          description: 'Moderate risk with balanced exploration and exploitation',
          config: {
            totalBudget: 10000,
            minAllocationPercentage: 0.05,
            maxAllocationPercentage: 0.60,
            decisionThreshold: 0.75,
            riskTolerance: 'moderate' as const
          }
        },
        {
          id: 'aggressive',
          name: 'Aggressive Growth',
          description: 'High risk, high reward with dynamic reallocation',
          config: {
            totalBudget: 10000,
            minAllocationPercentage: 0.02,
            maxAllocationPercentage: 0.80,
            decisionThreshold: 0.65,
            riskTolerance: 'aggressive' as const
          }
        }
      ];
      
      setScenarios(defaultScenarios);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scenarios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScenarios();
  }, [loadScenarios]);

  return {
    scenarios,
    isLoading,
    error,
    refresh: loadScenarios
  };
}

// Hook for budget allocator with real-time updates
export function useBudgetAllocator(projectId?: string) {
  const { allocation, metrics, isRunning, allocateBudget } = useThompsonSampling();
  const [updateInterval, setUpdateInterval] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start real-time updates
  const startRealTimeUpdates = useCallback((intervalMs: number = 30000) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setUpdateInterval(intervalMs);
    intervalRef.current = setInterval(() => {
      if (isRunning) {
        allocateBudget();
      }
    }, intervalMs);
  }, [isRunning, allocateBudget]);

  // Stop real-time updates
  const stopRealTimeUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setUpdateInterval(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    allocation,
    metrics,
    isRunning,
    updateInterval,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    allocateBudget
  };
}