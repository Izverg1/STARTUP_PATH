'use client'

import { useState } from 'react'
import { AgentDock } from './AgentDock'
import { ArtifactsSidebar } from '../artifacts/ArtifactsSidebar'
import { useAgents, useAgentsDemo } from '@/hooks/useAgents'
import { AgentKey } from '@/types/agents'
import { Button } from '@/components/ui/button'
import { theme } from '@/config/theme'

export function AgentSystemDemo() {
  const { 
    statuses, 
    artifacts, 
    executeAgent, 
    resetAllAgents, 
    isInitialized,
    getSystemStatus 
  } = useAgents()
  
  const { runDemo } = useAgentsDemo()
  const [selectedAgent, setSelectedAgent] = useState<AgentKey | null>(null)

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-gray-900">
        <div className="text-center">
          <div className="animate-pulse text-lg mb-2">Initializing Agent System...</div>
          <div className="text-sm text-gray-600">Setting up agents and configurations</div>
        </div>
      </div>
    )
  }

  const agentStatusData = Object.entries(statuses).map(([key, status]) => ({
    key: key as AgentKey,
    title: status.agent_key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    state: status.status,
    statusLine: status.status_line,
    isActive: selectedAgent === key
  }))

  const systemStatus = getSystemStatus()

  const handleAgentClick = async (agentKey: AgentKey) => {
    setSelectedAgent(agentKey)
    
    // Auto-execute agent for demo purposes
    try {
      const demoInputs = {
        channel_discovery_engine: {
          vertical: 'SaaS',
          target_audience: 'B2B Decision Makers',
          budget_range: [20000, 50000] as [number, number]
        },
        campaign_optimization_engine: {
          channel_type: 'email',
          copy_type: 'subject_line' as const,
          target_audience: 'Enterprise CTOs',
          tone: 'professional' as const
        },
        performance_analytics_engine: {
          metric_type: 'cpqm' as const,
          time_period: '30d'
        },
        budget_allocation_engine: {
          total_budget: 50000,
          strategy: 'thompson_sampling' as const
        }
      }

      await executeAgent(agentKey, demoInputs[agentKey])
    } catch (error) {
      console.error(`Failed to execute ${agentKey}:`, error)
    }
  }

  return (
    <div className="relative h-screen bg-zinc-950 overflow-hidden">
      {/* Agent Dock */}
      <AgentDock
        agents={agentStatusData}
        onAgentClick={handleAgentClick}
      />

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col items-center justify-center text-white px-4"
        style={{ 
          marginLeft: theme.layout.agentDock,
          marginRight: theme.layout.artifactsSidebar 
        }}
      >
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-6 text-white">
            STARTUP_PATH Agent System
          </h1>
          
          <p className="text-xl text-zinc-300 mb-8">
            4 AI engines working together to optimize your go-to-market operations
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-zinc-900/60 rounded-xl p-6 border border-zinc-800/60 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-white">System Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-300">Idle:</span>
                  <span className="text-zinc-400 font-mono">{systemStatus.idle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Working:</span>
                  <span className="text-cyan-400 font-mono">{systemStatus.working}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Blocked:</span>
                  <span className="text-red-400 font-mono">{systemStatus.blocked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Complete:</span>
                  <span className="text-green-400 font-mono">{systemStatus.done}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/60 rounded-xl p-6 border border-zinc-800/60 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-white">Artifacts Generated</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-300">Total:</span>
                  <span className="text-zinc-300 font-mono">{artifacts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Benchmarks:</span>
                  <span className="text-cyan-400 font-mono">
                    {artifacts.filter(a => a.type === 'benchmark').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Copy:</span>
                  <span className="text-green-400 font-mono">
                    {artifacts.filter(a => a.type === 'copy').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Calculations:</span>
                  <span className="text-purple-400 font-mono">
                    {artifacts.filter(a => a.type === 'calc').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Allocations:</span>
                  <span className="text-yellow-400 font-mono">
                    {artifacts.filter(a => a.type === 'alloc').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={runDemo}
              size="lg"
              className="bg-magenta-600 hover:bg-magenta-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-magenta-500/25"
            >
              Run Full Demo
            </Button>
            
            <Button
              onClick={resetAllAgents}
              variant="outline"
              size="lg"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white px-8 py-3 rounded-lg transition-all duration-200"
            >
              Reset All Agents
            </Button>
          </div>

          <div className="mt-8 text-sm text-zinc-400 space-y-1">
            <p>Click on agent cards to execute individual agents</p>
            <p>View generated artifacts in the sidebar</p>
            <p className="text-magenta-400 font-medium">AI Engines work together for optimal results</p>
          </div>
        </div>
      </div>

      {/* Artifacts Sidebar */}
      <ArtifactsSidebar
        artifacts={artifacts}
        onArtifactClick={(artifact) => {
          console.log('Artifact clicked:', artifact)
          // Could open a modal or navigate to detail view
        }}
      />
    </div>
  )
}