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
        channel_scout: {
          vertical: 'SaaS',
          target_audience: 'B2B Decision Makers',
          budget_range: [20000, 50000] as [number, number]
        },
        offer_alchemist: {
          channel_type: 'email',
          copy_type: 'subject_line' as const,
          target_audience: 'Enterprise CTOs',
          tone: 'professional' as const
        },
        signal_wrangler: {
          metric_type: 'cpqm' as const,
          time_period: '30d'
        },
        budget_captain: {
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
    <div className="relative h-screen bg-white overflow-hidden">
      {/* Agent Dock */}
      <AgentDock
        agents={agentStatusData}
        onAgentClick={handleAgentClick}
      />

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col items-center justify-center text-gray-900 px-4"
        style={{ 
          marginLeft: theme.layout.agentDock,
          marginRight: theme.layout.artifactsSidebar 
        }}
      >
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-6">
            SOL:GEN Agent System
          </h1>
          
          <p className="text-xl text-zinc-300 mb-8">
            Autonomous agents working together to optimize your sales and marketing operations
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Idle:</span>
                  <span className="text-gray-400">{systemStatus.idle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Working:</span>
                  <span className="text-blue-400">{systemStatus.working}</span>
                </div>
                <div className="flex justify-between">
                  <span>Blocked:</span>
                  <span className="text-red-400">{systemStatus.blocked}</span>
                </div>
                <div className="flex justify-between">
                  <span>Complete:</span>
                  <span className="text-green-400">{systemStatus.done}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Artifacts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="text-zinc-300">{artifacts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Benchmarks:</span>
                  <span className="text-blue-400">
                    {artifacts.filter(a => a.type === 'benchmark').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Copy:</span>
                  <span className="text-green-400">
                    {artifacts.filter(a => a.type === 'copy').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Calculations:</span>
                  <span className="text-purple-400">
                    {artifacts.filter(a => a.type === 'calc').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Allocations:</span>
                  <span className="text-yellow-400">
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
              className="bg-pink-600 hover:bg-pink-700"
            >
              Run Full Demo
            </Button>
            
            <Button
              onClick={resetAllAgents}
              variant="outline"
              size="lg"
            >
              Reset All Agents
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-600">
            <p>Click on agent cards to execute individual agents</p>
            <p>View generated artifacts in the sidebar</p>
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