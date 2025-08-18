'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Satellite, Target, BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Professional agent definitions
const AGENTS = [
  {
    id: 'channel-discovery',
    name: 'Channel Discovery',
    subtitle: 'Engine',
    icon: Satellite,
    color: 'cyan',
    status: 'working',
    statusText: 'Scanning 50+ channels...',
    progress: 75
  },
  {
    id: 'campaign-optimization', 
    name: 'Campaign Optimization',
    subtitle: 'Engine',
    icon: Target,
    color: 'red',
    status: 'done',
    statusText: 'A/B tests complete',
    progress: 100
  },
  {
    id: 'performance-analytics',
    name: 'Performance Analytics', 
    subtitle: 'Engine',
    icon: BarChart3,
    color: 'green',
    status: 'working',
    statusText: 'Analyzing trends...',
    progress: 45
  },
  {
    id: 'budget-allocation',
    name: 'Budget Allocation',
    subtitle: 'Engine', 
    icon: TrendingUp,
    color: 'purple',
    status: 'idle',
    statusText: 'Ready for reallocation',
    progress: 0
  }
];

type AgentStatus = 'idle' | 'working' | 'blocked' | 'done';

interface AgentCardProps {
  agent: typeof AGENTS[0];
  size?: 'small' | 'medium';
}

function AgentCard({ agent, size = 'small' }: AgentCardProps) {
  const Icon = agent.icon;
  
  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'working': return 'text-cyan-400 bg-cyan-400/10';
      case 'done': return 'text-green-400 bg-green-400/10';
      case 'blocked': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'cyan': return 'border-cyan-500/30 hover:border-cyan-500/50 bg-cyan-500/5';
      case 'red': return 'border-red-500/30 hover:border-red-500/50 bg-red-500/5';
      case 'green': return 'border-green-500/30 hover:border-green-500/50 bg-green-500/5';
      case 'purple': return 'border-purple-500/30 hover:border-purple-500/50 bg-purple-500/5';
      default: return 'border-gray-500/30 hover:border-gray-500/50 bg-gray-500/5';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'cyan': return 'text-cyan-400';
      case 'red': return 'text-red-400';
      case 'green': return 'text-green-400';
      case 'purple': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className={cn(
      "bg-black/60 backdrop-blur-sm transition-all duration-300 hover:scale-105 relative overflow-hidden",
      getColorClasses(agent.color),
      size === 'small' ? 'w-24 h-24 p-3' : 'w-32 h-32 p-4'
    )}>
      {/* Animated background effects */}
      {agent.status === 'working' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-pulse" />
      )}
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className={cn(
          "rounded-lg flex items-center justify-center mb-1",
          size === 'small' ? 'w-8 h-8' : 'w-10 h-10',
          `bg-${agent.color}-500/20`
        )}>
          <Icon className={cn(
            getIconColor(agent.color),
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

        {/* Status indicator */}
        <div className={cn(
          "absolute top-1 right-1 w-2 h-2 rounded-full",
          getStatusColor(agent.status)
        )}>
          {agent.status === 'working' && (
            <div className="w-full h-full rounded-full animate-pulse" />
          )}
        </div>

        {/* Progress bar for working status */}
        {agent.status === 'working' && agent.progress > 0 && (
          <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000 rounded-full",
                `bg-${agent.color}-400`
              )}
              style={{ width: `${agent.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-gray-700 rounded px-2 py-1 text-xs text-white opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
        {agent.statusText}
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
  const [agents, setAgents] = useState(AGENTS);

  // Simulate agent status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'working') {
          const newProgress = Math.min(100, agent.progress + Math.random() * 5);
          return {
            ...agent,
            progress: newProgress,
            status: newProgress >= 100 ? 'done' : 'working'
          };
        }
        return agent;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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