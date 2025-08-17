'use client'

import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  benefits?: string[]
  className?: string
}

export function FeatureCard({ icon: Icon, title, description, benefits, className }: FeatureCardProps) {
  return (
    <Card className={`group relative overflow-hidden bg-white border-gray-200 hover:border-blue-300/30 transition-all duration-300 ${className}`}>
      <div className="relative p-6 space-y-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center group-hover:bg-blue-600/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600/90 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Benefits list */}
        {benefits && benefits.length > 0 && (
          <ul className="space-y-1">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}

// Agent-specific feature card variant
interface AgentCardProps {
  agentName: string
  agentRole: string
  description: string
  capabilities: string[]
  icon: LucideIcon
  className?: string
}

export function AgentCard({ agentName, agentRole, description, capabilities, icon: Icon, className }: AgentCardProps) {
  return (
    <Card className={`group relative overflow-hidden bg-white border-gray-200 hover:border-blue-300/40 transition-all duration-300 ${className}`}>
      {/* Agent badge */}
      <div className="absolute top-4 right-4 px-2 py-1 bg-blue-600/20 rounded text-xs text-blue-600 font-mono">
        AGENT
      </div>

      <div className="relative p-6 space-y-4">
        {/* Agent icon and header */}
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-300/20">
            <Icon className="w-7 h-7 text-blue-600" />
          </div>
          
          <div className="flex-1 space-y-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600/90 transition-colors duration-300">
              {agentName}
            </h3>
            <p className="text-blue-600 text-sm font-medium">
              {agentRole}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>

        {/* Capabilities */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900">Core Capabilities:</h4>
          <ul className="space-y-1">
            {capabilities.map((capability, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                <div className="w-1 h-1 bg-blue-600 rounded-full mt-2.5 flex-shrink-0" />
                <span>{capability}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}