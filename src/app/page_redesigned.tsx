'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SpaceStationVisualization } from '@/components/SpaceStationVisualization'
import { 
  ArrowRight,
  ArrowLeft,
  Rocket,
  Sparkles,
  Zap,
  Shield,
  ChevronRight,
  LogIn,
  Star,
  Orbit,
  Satellite,
  TrendingUp,
  BarChart3,
  Target,
  Brain
} from 'lucide-react'

const slides = [
  { id: 'hero', title: 'Overview', icon: Rocket },
  { id: 'problem', title: 'Problem', icon: Orbit },
  { id: 'solution', title: 'Solution', icon: Satellite },
  { id: 'features', title: 'Features', icon: Zap },
  { id: 'results', title: 'Results', icon: Star },
  { id: 'cta', title: 'Get Started', icon: Rocket }
]

export default function SpaceLandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
          setCurrentSlide(currentSlide + 1)
        } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
          setCurrentSlide(currentSlide - 1)
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentSlide])

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Keep existing header and background effects */}
      
      {/* Slide Container */}
      <div className="relative w-full h-full overflow-hidden" style={{ contain: 'layout' }}>
        <div className="absolute inset-0 flex transition-all duration-1200 ease-out" 
             style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          
          {/* Slides 1-2: Keep existing */}
          
          {/* Slide 3: Channel Assessment Pipeline - Horizontal Factory Model */}
          <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
            <div className="w-full max-w-7xl mx-auto">
              {/* Title Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Channel Assessment Pipeline</h2>
                <p className="text-gray-400">Transform scattered channels into optimized budget allocation</p>
              </div>

              {/* Horizontal Pipeline */}
              <div className="relative">
                <div className="flex items-center gap-3">
                  
                  {/* Input: Channels */}
                  <div className="flex-1 bg-gray-900/50 border border-red-500/20 rounded-lg p-4">
                    <h3 className="text-xs font-mono text-red-400 mb-3">CHANNEL INPUTS</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        <span className="text-xs text-gray-300">Google Ads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        <span className="text-xs text-gray-300">LinkedIn</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        <span className="text-xs text-gray-300">Facebook</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-600" />

                  {/* Process 1: Data Collection */}
                  <div className="flex-1 bg-gray-900/50 border border-gray-700/30 rounded-lg p-4">
                    <h3 className="text-xs font-mono text-gray-400 mb-3">DATA COLLECTION</h3>
                    <div className="text-center">
                      <BarChart3 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <div className="text-xs text-gray-500">
                        <div>CTR • CAC</div>
                        <div>Conversions</div>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-600" />

                  {/* Process 2: AI Analysis */}
                  <div className="flex-1 bg-gray-900/50 border border-cyan-500/20 rounded-lg p-4">
                    <h3 className="text-xs font-mono text-cyan-400 mb-3">AI OPTIMIZATION</h3>
                    <div className="text-center">
                      <Brain className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <div className="text-xs text-gray-500">
                        <div>Pattern Analysis</div>
                        <div>Budget Allocation</div>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-600" />

                  {/* Output: Optimized Budget */}
                  <div className="flex-1 bg-gray-900/50 border border-green-500/20 rounded-lg p-4">
                    <h3 className="text-xs font-mono text-green-400 mb-3">OPTIMIZED OUTPUT</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Google</span>
                        <span className="text-green-400">45%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">LinkedIn</span>
                        <span className="text-yellow-400">25%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Facebook</span>
                        <span className="text-red-400">15%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Loop */}
                <div className="mt-6 text-center">
                  <span className="text-xs text-gray-600">← CONTINUOUS OPTIMIZATION LOOP →</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 4: AI Agent Pipeline - Horizontal Factory Model */}
          <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
            <div className="w-full max-w-7xl mx-auto">
              {/* Title */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">AI Agent Delivery Pipeline</h2>
                <p className="text-gray-400">Specialized agents optimize each stage of your marketing</p>
              </div>

              {/* Horizontal Agent Pipeline */}
              <div className="relative">
                <div className="flex items-center gap-3">
                  
                  {/* Agent 1: Discovery */}
                  <div className="flex-1 bg-gray-900/50 border border-cyan-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded flex items-center justify-center">
                        <Satellite className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h3 className="text-sm font-bold text-cyan-400">Discovery</h3>
                    </div>
                    <div className="text-xs text-gray-400">
                      <div>• Find channels</div>
                      <div>• Analyze competition</div>
                      <div>• Test opportunities</div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-600" />

                  {/* Agent 2: Optimization */}
                  <div className="flex-1 bg-gray-900/50 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-500/20 rounded flex items-center justify-center">
                        <Target className="w-4 h-4 text-green-400" />
                      </div>
                      <h3 className="text-sm font-bold text-green-400">Optimization</h3>
                    </div>
                    <div className="text-xs text-gray-400">
                      <div>• A/B test messages</div>
                      <div>• Optimize creatives</div>
                      <div>• Improve conversions</div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-600" />

                  {/* Agent 3: Analytics */}
                  <div className="flex-1 bg-gray-900/50 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                      </div>
                      <h3 className="text-sm font-bold text-blue-400">Analytics</h3>
                    </div>
                    <div className="text-xs text-gray-400">
                      <div>• Track performance</div>
                      <div>• Identify trends</div>
                      <div>• Generate insights</div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-600" />

                  {/* Agent 4: Allocation */}
                  <div className="flex-1 bg-gray-900/50 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-500/20 rounded flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="text-sm font-bold text-purple-400">Allocation</h3>
                    </div>
                    <div className="text-xs text-gray-400">
                      <div>• Move budget</div>
                      <div>• Scale winners</div>
                      <div>• Cut losers</div>
                    </div>
                  </div>
                </div>

                {/* Result Bar */}
                <div className="mt-8 bg-gradient-to-r from-transparent via-green-500/10 to-transparent p-3 rounded-lg">
                  <div className="text-center">
                    <span className="text-sm text-green-400">Output: </span>
                    <span className="text-sm text-white font-bold">2-3x Better ROAS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 5: Results Pipeline - Horizontal Metrics Flow */}
          <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
            <div className="w-full max-w-7xl mx-auto">
              {/* Title */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Performance Measurement Pipeline</h2>
                <p className="text-gray-400">Real results from optimized channel allocation</p>
              </div>

              {/* Horizontal Metrics Flow */}
              <div className="relative">
                <div className="flex items-center gap-3">
                  
                  {/* Before State */}
                  <div className="flex-1">
                    <div className="bg-gray-900/50 border border-red-500/20 rounded-lg p-4">
                      <h3 className="text-xs font-mono text-red-400 mb-3">BEFORE</h3>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-400">
                          <div className="flex justify-between">
                            <span>CAC</span>
                            <span className="text-red-400">$2,400</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Conversion</span>
                            <span className="text-red-400">0.8%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ROAS</span>
                            <span className="text-red-400">0.7x</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transformation Arrow */}
                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-6 h-6 text-cyan-400" />
                    <span className="text-xs text-cyan-400 mt-1">AI OPTIMIZATION</span>
                  </div>

                  {/* After State */}
                  <div className="flex-1">
                    <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-4">
                      <h3 className="text-xs font-mono text-green-400 mb-3">AFTER</h3>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-400">
                          <div className="flex justify-between">
                            <span>CAC</span>
                            <span className="text-green-400">$680</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Conversion</span>
                            <span className="text-green-400">3.2%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ROAS</span>
                            <span className="text-green-400">2.4x</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Results Bar */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">72%</div>
                    <div className="text-xs text-gray-400">Lower CAC</div>
                  </div>
                  <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-cyan-400">4x</div>
                    <div className="text-xs text-gray-400">Higher Conversion</div>
                  </div>
                  <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-400">240%</div>
                    <div className="text-xs text-gray-400">Better ROAS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 6: CTA - Clean Horizontal Design */}
          <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
            <div className="w-full max-w-7xl mx-auto">
              <div className="flex items-center gap-12">
                
                {/* Left: Value Prop */}
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Ready to Optimize Your Growth?
                  </h2>
                  <p className="text-xl text-gray-300 mb-6">
                    Join 500+ startups using AI to optimize their marketing spend
                  </p>
                  
                  {/* Simple Benefits */}
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span className="text-gray-300">14-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span className="text-gray-300">No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span className="text-gray-300">Setup in 5 minutes</span>
                    </div>
                  </div>
                </div>

                {/* Right: Form */}
                <div className="flex-1 max-w-md">
                  <div className="bg-gray-900/50 border border-gray-700/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Start Your Free Trial</h3>
                    <div className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-black/50 border-gray-700 text-white"
                      />
                      <Button className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700">
                        Get Started →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Keep existing minimal design */}
    </div>
  )
}