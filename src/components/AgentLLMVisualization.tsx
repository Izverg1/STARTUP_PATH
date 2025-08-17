'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Sparkles, 
  Target, 
  Zap, 
  BarChart3, 
  DollarSign,
  ArrowRight,
  Activity,
  Bot,
  MessageSquare
} from 'lucide-react'

const agents = [
  {
    id: 'scout',
    name: 'Channel Scout',
    icon: Target,
    color: 'from-purple-500 to-indigo-600',
    description: 'Discovers optimal channels',
    status: 'analyzing',
    llmModel: 'GPT-4 Turbo',
    currentTask: 'Analyzing LinkedIn outreach performance...',
    metrics: { accuracy: 94, speed: '1.2s', cost: '$0.03' }
  },
  {
    id: 'alchemist',
    name: 'Offer Alchemist',
    icon: Zap,
    color: 'from-indigo-500 to-blue-600',
    description: 'Crafts compelling offers',
    status: 'generating',
    llmModel: 'Claude 3 Opus',
    currentTask: 'Generating A/B test variations...',
    metrics: { accuracy: 96, speed: '0.8s', cost: '$0.02' }
  },
  {
    id: 'wrangler',
    name: 'Signal Wrangler',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-600',
    description: 'Analyzes performance data',
    status: 'processing',
    llmModel: 'GPT-4 Vision',
    currentTask: 'Processing conversion funnel metrics...',
    metrics: { accuracy: 98, speed: '2.1s', cost: '$0.04' }
  },
  {
    id: 'captain',
    name: 'Budget Captain',
    icon: DollarSign,
    color: 'from-cyan-500 to-teal-600',
    description: 'Optimizes spend allocation',
    status: 'optimizing',
    llmModel: 'Claude 3 Sonnet',
    currentTask: 'Reallocating budget to top performers...',
    metrics: { accuracy: 92, speed: '1.5s', cost: '$0.02' }
  }
]

export function AgentLLMVisualization() {
  const [activeConnections, setActiveConnections] = useState<string[]>([])
  const [messages, setMessages] = useState<Array<{id: string, from: string, to: string, text: string}>>([])

  useEffect(() => {
    // Simulate agent communications
    const interval = setInterval(() => {
      const fromAgent = agents[Math.floor(Math.random() * agents.length)]
      const toAgent = agents.find(a => a.id !== fromAgent.id) || agents[0]
      
      const newMessage = {
        id: Date.now().toString(),
        from: fromAgent.id,
        to: toAgent.id,
        text: `Processing ${Math.floor(Math.random() * 1000)} data points...`
      }
      
      setMessages(prev => [...prev.slice(-4), newMessage])
      setActiveConnections([fromAgent.id, toAgent.id])
      
      setTimeout(() => {
        setActiveConnections([])
      }, 1000)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          AI Agents Powered by Leading LLMs
        </h2>
        <p className="text-gray-600">Watch how our agents collaborate using state-of-the-art language models</p>
      </div>

      {/* Central Hub Visualization */}
      <div className="relative h-[500px] bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-3xl p-8 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        {/* Central LLM Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex flex-col items-center justify-center text-white shadow-2xl animate-pulse">
              <Brain className="w-12 h-12 mb-1" />
              <span className="text-xs font-semibold">LLM Hub</span>
            </div>
            
            {/* Orbiting rings */}
            <div className="absolute inset-0 -m-20 w-52 h-52 border-2 border-purple-200 rounded-full animate-spin-slow opacity-50" />
            <div className="absolute inset-0 -m-32 w-76 h-76 border border-indigo-200 rounded-full animate-spin-slower opacity-30" />
          </div>
        </div>

        {/* Agent Cards */}
        {agents.map((agent, index) => {
          const angle = (360 / agents.length) * index
          const radius = 180
          const x = Math.cos((angle * Math.PI) / 180) * radius
          const y = Math.sin((angle * Math.PI) / 180) * radius
          const Icon = agent.icon
          const isActive = activeConnections.includes(agent.id)

          return (
            <div
              key={agent.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
              }}
            >
              <Card className={`
                w-48 p-4 bg-white/90 backdrop-blur-sm border-2
                ${isActive ? 'border-purple-400 shadow-purple-200 shadow-lg scale-105' : 'border-gray-200'}
                transition-all duration-300 hover:scale-105
              `}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 bg-gradient-to-br ${agent.color} rounded-lg flex items-center justify-center text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {agent.llmModel}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm">{agent.name}</h3>
                    <p className="text-xs text-gray-500">{agent.description}</p>
                  </div>
                  
                  <div className="text-xs text-gray-600 italic">
                    {agent.currentTask}
                  </div>
                  
                  <div className="flex gap-2 text-xs">
                    <span className="text-green-600">↑{agent.metrics.accuracy}%</span>
                    <span className="text-blue-600">⚡{agent.metrics.speed}</span>
                    <span className="text-purple-600">${agent.metrics.cost}</span>
                  </div>
                </div>
              </Card>
              
              {/* Connection line to center when active */}
              {isActive && (
                <div className="absolute top-1/2 left-1/2 w-px h-[180px] bg-gradient-to-b from-purple-400 to-transparent origin-top animate-pulse"
                  style={{
                    transform: `rotate(${angle + 90}deg)`,
                  }}
                />
              )}
            </div>
          )
        })}

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Message Stream */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="flex items-center mb-4">
          <MessageSquare className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="font-semibold">Agent Communication Stream</h3>
        </div>
        <div className="space-y-2">
          {messages.map((msg) => {
            const fromAgent = agents.find(a => a.id === msg.from)
            const toAgent = agents.find(a => a.id === msg.to)
            return (
              <div key={msg.id} className="flex items-center gap-2 text-sm animate-slide-in">
                <Badge className={`bg-gradient-to-r ${fromAgent?.color} text-white`}>
                  {fromAgent?.name}
                </Badge>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Badge variant="outline">
                  {toAgent?.name}
                </Badge>
                <span className="text-gray-600 italic">{msg.text}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-purple-600">12,847</p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-indigo-600">1.3s</p>
            </div>
            <Zap className="w-8 h-8 text-indigo-400" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-blue-600">98.7%</p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-cyan-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cost Saved</p>
              <p className="text-2xl font-bold text-cyan-600">$4,280</p>
            </div>
            <DollarSign className="w-8 h-8 text-cyan-400" />
          </div>
        </Card>
      </div>
    </div>
  )
}