'use client';

import { useState, useEffect } from 'react';

export type EngineStatus = 'processing' | 'optimizing' | 'stopped' | 'reallocating' | 'insights';

export interface EngineState {
  id: string;
  name: string;
  status: EngineStatus;
  statusText: string;
  currentTask: string;
}

const INITIAL_ENGINES: EngineState[] = [
  {
    id: 'channel-discovery',
    name: 'Channel Agent',
    status: 'processing',
    statusText: 'Scanning LinkedIn, Google Ads, cold email...',
    currentTask: 'Testing micro-budgets'
  },
  {
    id: 'campaign-optimization', 
    name: 'Campaign Agent',
    status: 'stopped',
    statusText: 'Idle - Ready to start A/B tests...',
    currentTask: 'Awaiting configuration'
  },
  {
    id: 'performance-analytics',
    name: 'Analytics Agent',
    status: 'insights',
    statusText: 'Monitoring 500K+ data points...',
    currentTask: 'Trend detection'
  },
  {
    id: 'budget-allocation',
    name: 'Finance Agent',
    status: 'reallocating',
    statusText: 'Thompson sampling optimization...',
    currentTask: 'Reallocating $15K budget'
  }
];

export function useEngineStatus() {
  const [engines, setEngines] = useState<EngineState[]>(INITIAL_ENGINES);

  // Simulate realistic engine status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setEngines(prev => prev.map(engine => {
        // Random chance to change status for dynamic simulation
        if (Math.random() < 0.4) { // 40% chance to change
          const statusOptions: EngineStatus[] = ['processing', 'optimizing', 'stopped', 'reallocating', 'insights'];
          const newStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
          
          const statusTexts = {
            processing: ['Scanning channels...', 'Analyzing performance...', 'Processing data...'],
            optimizing: ['Running A/B tests...', 'Optimizing campaigns...', 'Fine-tuning parameters...'],
            stopped: ['Idle - Ready to start...', 'Awaiting configuration...', 'Standing by...'],
            reallocating: ['Moving budget...', 'Redistributing spend...', 'Thompson sampling...'],
            insights: ['Generating insights...', 'Pattern detection...', 'Trend analysis...']
          };

          const tasks = {
            processing: ['Testing micro-budgets', 'Channel discovery', 'Data processing'],
            optimizing: ['A/B test optimization', 'Campaign tuning', 'Performance boost'],
            stopped: ['Awaiting configuration', 'Ready to deploy', 'Standing by'],
            reallocating: ['Budget reallocation', 'Spend optimization', 'Resource balancing'],
            insights: ['Trend detection', 'Anomaly scanning', 'Insight generation']
          };
          
          return {
            ...engine,
            status: newStatus,
            statusText: statusTexts[newStatus][Math.floor(Math.random() * statusTexts[newStatus].length)],
            currentTask: tasks[newStatus][Math.floor(Math.random() * tasks[newStatus].length)]
          };
        }
        return engine;
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return engines;
}

export function getStatusIndicator(status: EngineStatus) {
  switch (status) {
    case 'processing':
      return {
        color: 'bg-green-400',
        textColor: 'text-green-400',
        borderColor: 'border-green-400/50',
        glowColor: 'shadow-green-400/50',
        animation: 'animate-pulse',
        label: 'PROCESSING'
      };
    case 'optimizing':
      return {
        color: 'bg-orange-400',
        textColor: 'text-orange-400',
        borderColor: 'border-orange-400/50', 
        glowColor: 'shadow-orange-400/50',
        animation: 'animate-bounce',
        label: 'OPTIMIZING'
      };
    case 'stopped':
      return {
        color: 'bg-red-400',
        textColor: 'text-red-400',
        borderColor: 'border-red-400/50',
        glowColor: 'shadow-red-400/50', 
        animation: '',
        label: 'STOPPED'
      };
    case 'reallocating':
      return {
        color: 'bg-purple-400',
        textColor: 'text-purple-400',
        borderColor: 'border-purple-400/50',
        glowColor: 'shadow-purple-400/50',
        animation: 'animate-ping',
        label: 'REALLOCATING'
      };
    case 'insights':
      return {
        color: 'bg-cyan-400',
        textColor: 'text-cyan-400',
        borderColor: 'border-cyan-400/50',
        glowColor: 'shadow-cyan-400/50',
        animation: 'animate-pulse',
        label: 'INSIGHTS'
      };
    default:
      return {
        color: 'bg-gray-400',
        textColor: 'text-gray-400',
        borderColor: 'border-gray-400/50',
        glowColor: 'shadow-gray-400/50',
        animation: '',
        label: 'IDLE'
      };
  }
}