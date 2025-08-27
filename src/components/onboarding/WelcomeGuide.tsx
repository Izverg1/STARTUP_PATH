'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  ArrowRight, 
  MousePointer2, 
  Zap,
  BarChart3,
  Bot,
  HelpCircle,
  CheckCircle,
  Rocket,
  Target,
  TrendingUp,
  DollarSign
} from 'lucide-react'

interface WelcomeGuideProps {
  isOpen: boolean
  onClose: () => void
}

export function WelcomeGuide({ isOpen, onClose }: WelcomeGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to STARTUP_PATH™",
      icon: Rocket,
      color: "text-blue-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Your AI-powered Go-To-Market testing platform is ready! STARTUP_PATH helps you validate distribution channels, 
            optimize customer acquisition costs, and make data-driven GTM decisions.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-medium">4 AI Engines Working For You</span>
            </div>
            <p className="text-sm text-gray-400">
              Channel Discovery • Campaign Optimization • Performance Analytics • Budget Allocation
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Navigation Made Simple",
      icon: MousePointer2,
      color: "text-green-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 mb-4">The platform uses <strong>hover interactions</strong> to keep your workspace clean:</p>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-8 bg-slate-600 rounded-sm"></div>
                <span className="text-white font-medium">Left Sidebar</span>
              </div>
              <p className="text-sm text-gray-400">Hover over the thin left bar to see navigation menu</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-8 bg-slate-600 rounded-sm"></div>
                <span className="text-white font-medium">Right Sidebar</span>
              </div>
              <p className="text-sm text-gray-400">Hover over the thin right bar for live analytics</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>
                <span className="text-white font-medium">Bottom Footer</span>
              </div>
              <p className="text-sm text-gray-400">Hover over colored dots to see AI engine status</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Meet Your AI Engines",
      icon: Bot,
      color: "text-purple-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">Four intelligent engines work 24/7 to optimize your GTM strategy:</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-blue-400 font-medium text-sm">Channel Discovery</span>
              </div>
              <p className="text-xs text-gray-400">Finds and tests optimal distribution channels for your market</p>
            </div>
            
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-indigo-400 font-medium text-sm">Campaign Optimization</span>
              </div>
              <p className="text-xs text-gray-400">A/B tests ad copy, subject lines, and CTAs automatically</p>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-purple-400 font-medium text-sm">Performance Analytics</span>
              </div>
              <p className="text-xs text-gray-400">Monitors CPQM, CAC, LTV and detects anomalies in real-time</p>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 font-medium text-sm">Budget Allocation</span>
              </div>
              <p className="text-xs text-gray-400">Uses Thompson Sampling to optimize spend across channels</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Quick Start Guide",
      icon: Target,
      color: "text-cyan-400",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">Follow these steps to get started:</p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
              <div>
                <div className="text-white font-medium">Create Your First Project</div>
                <div className="text-sm text-gray-400">Go to Projects → Create a new GTM experiment</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
              <div>
                <div className="text-white font-medium">Set Your Gates & Thresholds</div>
                <div className="text-sm text-gray-400">Define success criteria (CPQM, CAC targets)</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
              <div>
                <div className="text-white font-medium">Let AI Engines Work</div>
                <div className="text-sm text-gray-400">Give engines 48+ hours to gather data and optimize</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
              <div>
                <div className="text-white font-medium">Monitor & Iterate</div>
                <div className="text-sm text-gray-400">Check footer engines and right sidebar for insights</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">Pro Tip</span>
            </div>
            <p className="text-sm text-gray-300">Hover over any element to discover hidden features and get more information!</p>
          </div>
        </div>
      )
    }
  ]

  const currentStepData = steps[currentStep]
  const StepIcon = currentStepData.icon

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-slate-900 border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-slate-800 rounded-lg`}>
                <StepIcon className={`w-6 h-6 ${currentStepData.color}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{currentStepData.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
                  <div className="flex gap-1">
                    {steps.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx === currentStep 
                            ? 'bg-blue-400' 
                            : idx < currentStep 
                              ? 'bg-green-400' 
                              : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-8">
            {currentStepData.content}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                Need help? Visit Support section
              </span>
            </div>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Back
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={onClose}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Get Started
                  <Rocket className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}