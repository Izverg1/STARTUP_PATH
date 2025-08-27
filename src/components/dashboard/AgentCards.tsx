'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Satellite, Target, BarChart3, TrendingUp, Play, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngineStatus, getStatusIndicator } from '@/hooks/useEngineStatus';

// Professional agent definitions with clear processing status
const AGENTS = [
  {
    id: 'channel-discovery',
    name: 'Channel Agent',
    subtitle: '',
    icon: Satellite,
    status: 'processing',
    statusText: 'Scanning LinkedIn, Google Ads, cold email...',
    currentTask: 'Testing micro-budgets',
    dataPoints: 1247,
    velocity: '3.2 channels/hr'
  },
  {
    id: 'campaign-optimization', 
    name: 'Campaign Agent',
    subtitle: '',
    icon: Target,
    status: 'stopped',
    statusText: 'Idle - Ready to start A/B tests...',
    currentTask: 'Awaiting configuration',
    dataPoints: 892,
    velocity: '15 tests/day'
  },
  {
    id: 'performance-analytics',
    name: 'Analytics Agent',
    subtitle: '',
    icon: BarChart3,
    status: 'processing',
    statusText: 'Monitoring 500K+ data points...',
    currentTask: 'Trend detection',
    dataPoints: 523841,
    velocity: '2.1 insights/hr'
  },
  {
    id: 'budget-allocation',
    name: 'Finance Agent',
    subtitle: '',
    icon: TrendingUp,
    status: 'processing',
    statusText: 'Thompson sampling optimization...',
    currentTask: 'Reallocating $15K budget',
    dataPoints: 156,
    velocity: '4 moves/day'
  }
];

type AgentStatus = 'processing' | 'stopped';

interface AgentCardProps {
  agent: typeof AGENTS[0];
  size?: 'small' | 'medium';
}

function AgentCard({ agent, size = 'small' }: AgentCardProps) {
  const Icon = agent.icon;
  
  const getStatusIndicator = (status: AgentStatus) => {
    switch (status) {
      case 'processing':
        return {
          icon: Play,
          color: 'text-green-400 bg-green-400/20',
          borderColor: 'border-green-400/50',
          pulseColor: 'bg-green-400',
          label: 'PROCESSING'
        };
      case 'stopped':
        return {
          icon: Square,
          color: 'text-red-400 bg-red-400/20',
          borderColor: 'border-red-400/50',
          pulseColor: 'bg-red-400',
          label: 'STOPPED'
        };
      default:
        return {
          icon: Square,
          color: 'text-gray-400 bg-gray-400/20',
          borderColor: 'border-gray-400/50',
          pulseColor: 'bg-gray-400',
          label: 'IDLE'
        };
    }
  };

  const statusIndicator = getStatusIndicator(agent.status);
  const StatusIcon = statusIndicator.icon;

  return (
    <Card className={cn(
      "bg-black border-red-500/30 hover:border-red-500/50 transition-all duration-200 hover:scale-[1.02] relative overflow-hidden group",
      "rounded-lg shadow-lg hover:shadow-xl",
      size === 'small' ? 'w-24 h-24 p-3' : 'w-32 h-32 p-4',
      // Dynamic border based on status
      agent.status === 'processing' && statusIndicator.borderColor,
      agent.status === 'stopped' && statusIndicator.borderColor
    )}>
      {/* Animated border for processing status */}
      {agent.status === 'processing' && (
        <div className="absolute inset-0 border border-green-400/30 animate-pulse rounded-lg" />
      )}
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className={cn(
          "bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center mb-1 transition-all duration-100",
          "hover:scale-110",
          size === 'small' ? 'w-8 h-8' : 'w-10 h-10'
        )}>
          <Icon className={cn(
            "text-red-400 transition-all duration-100",
            size === 'small' ? 'w-4 h-4' : 'w-5 h-5'
          )} />
        </div>
        
        <div className="text-center">
          <div className={cn(
            "font-bold text-white",
            size === 'small' ? 'text-xs leading-tight' : 'text-sm'
          )}>
            {agent.name}
          </div>
          <div className={cn(
            "text-gray-400 font-medium",
            size === 'small' ? 'text-xs' : 'text-xs'
          )}>
            {agent.subtitle}
          </div>
        </div>

        {/* Clear Status Indicator - GREEN FOR PROCESSING, RED FOR STOPPED */}
        <div className={cn(
          "absolute top-1 right-1 flex items-center justify-center rounded-full transition-all duration-200",
          statusIndicator.color,
          size === 'small' ? 'w-4 h-4' : 'w-5 h-5'
        )}>
          <StatusIcon className={cn(
            size === 'small' ? 'w-2 h-2' : 'w-3 h-3'
          )} />
          {agent.status === 'processing' && (
            <div className={cn(
              "absolute inset-0 rounded-full animate-ping",
              statusIndicator.pulseColor
            )} />
          )}
        </div>

        {/* Status Label on Hover */}
        <div className={cn(
          "absolute top-6 right-1 px-1 py-0.5 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap",
          statusIndicator.color,
          size === 'small' ? 'text-xs' : 'text-xs'
        )}>
          {statusIndicator.label}
        </div>
      </div>

      {/* Enhanced tooltip on hover */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 bg-black border border-red-500/30 rounded-lg px-3 py-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <StatusIcon className={cn("w-3 h-3", 
            agent.status === 'processing' ? 'text-green-400' : 'text-red-400'
          )} />
          <span className={cn("font-bold text-xs",
            agent.status === 'processing' ? 'text-green-400' : 'text-red-400'
          )}>
            {statusIndicator.label}
          </span>
        </div>
        <div className="font-semibold text-red-300 mb-1">{agent.currentTask}</div>
        <div className="text-gray-300 mb-1">{agent.statusText}</div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-cyan-400">{agent.dataPoints.toLocaleString()} pts</span>
          <span className="text-purple-400">{agent.velocity}</span>
        </div>
      </div>
    </Card>
  );
}

interface AgentCardsProps {
  layout?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium';
  className?: string;
}

export function AgentCards({ layout = 'vertical', size = 'small', className }: AgentCardsProps) {
  const engines = useEngineStatus();

  // Map engines to agents format for compatibility
  const agents = engines.map((engine, index) => ({
    ...AGENTS[index],
    status: engine.status === 'processing' || engine.status === 'optimizing' || engine.status === 'reallocating' || engine.status === 'insights' ? 'processing' : 'stopped',
    statusText: engine.statusText,
    currentTask: engine.currentTask
  }));

  return (
    <div className={cn(
      "flex gap-3",
      layout === 'vertical' ? 'flex-col' : 'flex-row',
      className
    )}>
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} size={size} />
      ))}
    </div>
  );
}