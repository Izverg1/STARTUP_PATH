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

// Pre-generated deterministic positions for data matrix lines (reduced from 50 to 30)
const hyperdriveLines = Array.from({ length: 30 }, (_, i) => ({
  left: (i * 7.3) % 100,
  top: (i * 11.7) % 100,
  delay: (i * 0.4) % 4,
  duration: 10 + (i % 5),
  rotation: -45 + (i * 23) % 90
}))

// Pre-generated deterministic positions for electric particles (reduced from 40 to 25)
const distantStars = Array.from({ length: 25 }, (_, i) => ({
  left: (i * 13.7) % 100,
  top: (i * 19.3) % 100,
  delay: (i * 1.2) % 10,
  duration: 18 + (i % 12)
}))

export default function SpaceLandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [email, setEmail] = useState('')
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 })
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set client flag and window size on client side
    setIsClient(true)
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      }
      
      window.addEventListener('resize', handleResize)
      
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
      
      window.addEventListener('mousemove', handleMouseMove)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

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
      {/* Electric Grid Background */}
      <div className="absolute inset-0 electric-grid opacity-15" />
      
      {/* Cyberpunk atmosphere */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Data matrix rain */}
        <div className="data-matrix-container">
          {hyperdriveLines.map((line, i) => (
            <div
              key={`data-${i}`}
              className="data-matrix-line"
              style={{
                left: `${line.left}%`,
                animationDelay: `${line.delay}s`,
                animationDuration: `${line.duration}s`,
              }}
            />
          ))}
        </div>
        
        {/* Minimal atmosphere */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[200px] bg-gradient-to-l from-cyan-500/15 to-transparent rounded-full filter blur-[100px]" />
        </div>

        {/* Electric particles */}
        <div className="absolute inset-0">
          {distantStars.map((star, i) => (
            <div
              key={`electric-${i}`}
              className="electric-particle"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>
        
        {/* Subtle scanning lines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="scan-line" />
        </div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 neon-border bg-black/80 rounded flex items-center justify-center relative">
              <Sparkles className="w-6 h-6 text-red-500 cyber-flicker" />
              <div className="absolute inset-0 hologram-effect rounded" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white neon-glow font-mono tracking-wider">SOL:GEN</span>
              <span className="text-xs text-cyan-400 font-mono tracking-widest opacity-80">GTM PLATFORM</span>
            </div>
          </div>
          
          <a href="/login">
            <Button className="neon-border bg-black/80 backdrop-blur-sm text-red-400 hover:text-white hover:bg-red-900/20 transition-all duration-300 font-mono">
              <LogIn className="w-4 h-4 mr-2" />
              GET STARTED
            </Button>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative w-full h-full overflow-hidden" style={{ contain: 'layout' }}>
        {/* Slide Container - Enhanced Rolling Deck */}
        <div 
          ref={containerRef}
          className="absolute inset-0 flex transition-all duration-1200 ease-out"
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`
          }}
        >
        {/* Slide 1: Hero */}
        <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
            {/* Left side - Main content */}
            <div className="max-w-2xl">
              <div className="space-y-8 animate-fade-in-up">
                <h1 className="text-5xl font-bold leading-tight text-left font-mono tracking-wider">
                  <span className="text-white">
                    AI-POWERED
                  </span>
                  <br />
                  <span className="text-red-500 neon-glow">
                    GTM PLATFORM
                  </span>
                </h1>
                <div className="mt-8 space-y-4">
                  <p className="text-2xl text-white leading-relaxed text-left">
                    Automatically optimize your <span className="text-red-500 font-bold">marketing channels</span> 
                    and <span className="text-cyan-400 font-bold">budget allocation</span> using AI
                  </p>
                  <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-6 mt-8">
                    <div className="text-xl text-cyan-400 leading-relaxed">
                      ✓ Connect all your marketing channels
                      <br />
                      ✓ AI finds the best budget allocation
                      <br />
                      ✓ Automatically shifts spend to winners
                    </div>
                  </div>
                  
                  {/* Prominent CTA Button */}
                  <div className="mt-8">
                    <Button 
                      onClick={nextSlide}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xl px-12 py-6 rounded-lg shadow-2xl hover:scale-105 transition-all duration-300 font-bold"
                    >
                      SEE HOW IT WORKS
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                    <p className="text-sm text-gray-400 mt-3">Takes 2 minutes • No signup required</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Cyberpunk Neural Network */}
            <div className="relative w-[500px] h-[500px] animate-fade-in-delayed">
              {/* Central AI Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full shadow-2xl cyber-flicker relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-full animate-pulse" />
                <div className="absolute inset-2 neon-border bg-black/80 rounded-full flex items-center justify-center">
                  <span className="text-white font-mono text-xs font-bold">AI</span>
                </div>
                <div className="absolute inset-0 hologram-effect rounded-full" />
              </div>
              
              {/* Data Flow Streams */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 neon-border bg-black/80 rounded flex items-center justify-center">
                  <span className="text-cyan-400 text-xs font-mono font-bold">ADS</span>
                </div>
                {/* Data stream line */}
                <div className="absolute top-6 left-1/2 w-px h-[calc(50%-48px)] bg-gradient-to-b from-cyan-400 to-transparent animate-pulse" />
                {/* Data packets */}
                <div className="absolute top-12 left-1/2 w-2 h-2 bg-cyan-400 rounded-full data-stream" style={{animationDelay: '0s'}} />
                <div className="absolute top-20 left-1/2 w-2 h-2 bg-cyan-400 rounded-full data-stream" style={{animationDelay: '0.5s'}} />
              </div>
              
              <div className="absolute inset-12 animate-spin-reverse-slower">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 neon-border bg-black/80 rounded flex items-center justify-center">
                  <span className="text-red-400 text-xs font-mono font-bold">SOC</span>
                </div>
                <div className="absolute top-5 left-1/2 w-px h-[calc(50%-40px)] bg-gradient-to-b from-red-400 to-transparent animate-pulse" />
                <div className="absolute top-10 left-1/2 w-2 h-2 bg-red-400 rounded-full data-stream" style={{animationDelay: '0.2s'}} />
                <div className="absolute top-16 left-1/2 w-2 h-2 bg-red-400 rounded-full data-stream" style={{animationDelay: '0.7s'}} />
              </div>
              
              <div className="absolute inset-20 animate-spin-slowest">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 neon-border bg-black/80 rounded flex items-center justify-center">
                  <span className="text-yellow-400 text-xs font-mono font-bold">ML</span>
                </div>
                <div className="absolute top-4 left-1/2 w-px h-[calc(50%-32px)] bg-gradient-to-b from-yellow-400 to-transparent animate-pulse" />
                <div className="absolute top-8 left-1/2 w-2 h-2 bg-yellow-400 rounded-full data-stream" style={{animationDelay: '0.4s'}} />
              </div>
              
              {/* Neural Network Rings */}
              <div className="absolute inset-0 border-2 border-red-500/30 rounded-full neon-border animate-pulse" />
              <div className="absolute inset-12 border-2 border-cyan-500/30 rounded-full neon-border animate-pulse" style={{animationDelay: '0.5s'}} />
              <div className="absolute inset-20 border-2 border-yellow-500/30 rounded-full neon-border animate-pulse" style={{animationDelay: '1s'}} />
              
              {/* Data Flow Indicators */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-xs text-cyan-400 font-mono animate-float neon-glow">
                <div>GOOGLE.ADS</div>
                <div className="text-center text-yellow-300">▼ 847KB/s</div>
              </div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs text-red-400 font-mono animate-float-delayed neon-glow">
                <div>SOCIAL.MEDIA</div>
                <div className="text-center text-yellow-300">▲ 1.2MB/s</div>
              </div>
              <div className="absolute top-1/2 -left-16 -translate-y-1/2 text-xs text-yellow-400 font-mono animate-float-slow neon-glow">
                <div>ANALYTICS</div>
                <div className="text-center text-cyan-300">↔ 2.4GB/s</div>
              </div>
              <div className="absolute top-1/2 -right-16 -translate-y-1/2 text-xs text-purple-400 font-mono animate-float-slower neon-glow">
                <div>OPTIMIZE.AI</div>
                <div className="text-center text-red-300">◆ LIVE</div>
              </div>
              
              {/* Electric surge effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent electric-surge" style={{animationDelay: '2s'}} />
                <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-red-400 to-transparent electric-surge" style={{animationDelay: '3s'}} />
              </div>
            </div>
          </div>
          
          {/* Call to Action - positioned below the main content */}
          {/* Bottom Stats */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-3 text-cyan-400 text-lg">
            <Sparkles className="w-5 h-5" />
            <span>500+ startups optimizing with AI</span>
          </div>
        </div>

        {/* Slide 2: Problem - Professional Pain Points */}
        <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold tracking-wider mb-6 max-w-4xl mx-auto">
                <span className="text-white">THE</span> 
                <span className="text-red-500 neon-glow">PROBLEM</span>
              </h2>
              <p className="text-2xl text-white leading-relaxed max-w-4xl mx-auto">
                Most startups waste <span className="text-red-500 font-bold">60-80% of their marketing budget</span> 
                because they can't optimize across channels
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="bg-black/60 border border-red-500/30 p-6 hover:border-red-500/50 transition-all duration-300">
                <div className="text-center">
                  <div className="text-red-500 text-2xl mb-4">💸</div>
                  <h3 className="text-xl font-bold text-red-400 mb-3">Budget Waste</h3>
                  <div className="space-y-2 text-left">
                    <p className="text-white text-sm">• $50K/month on low-performing channels</p>
                    <p className="text-white text-sm">• No visibility into what's working</p>
                    <p className="text-white text-sm">• Manual budget reallocation</p>
                  </div>
                  <div className="mt-4 text-red-400 font-bold text-lg">87% of marketing spend</div>
                </div>
              </Card>
              
              <Card className="bg-black/60 border border-orange-500/30 p-6 hover:border-orange-500/50 transition-all duration-300">
                <div className="text-center">
                  <div className="text-orange-400 text-2xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-orange-400 mb-3">Data Blindness</h3>
                  <div className="space-y-2 text-left">
                    <p className="text-white text-sm">• Each channel in isolation</p>
                    <p className="text-white text-sm">• No cross-channel insights</p>
                    <p className="text-white text-sm">• Reactive decision making</p>
                  </div>
                  <div className="mt-4 text-orange-400 font-bold text-lg">6+ weeks to identify trends</div>
                </div>
              </Card>
              
              <Card className="bg-black/60 border border-yellow-500/30 p-6 hover:border-yellow-500/50 transition-all duration-300">
                <div className="text-center">
                  <div className="text-yellow-400 text-2xl mb-4">⏰</div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">Time Pressure</h3>
                  <div className="space-y-2 text-left">
                    <p className="text-white text-sm">• 18-month runway shrinking fast</p>
                    <p className="text-white text-sm">• Pressure to find PMF quickly</p>
                    <p className="text-white text-sm">• Can't afford mistakes</p>
                  </div>
                  <div className="mt-4 text-yellow-400 font-bold text-lg">Every week counts</div>
                </div>
              </Card>
            </div>
            
            <div className="mt-16 text-center">
              <div className="text-4xl font-bold text-red-500 mb-4">
                Result: 73% of startups never reach PMF
              </div>
              <p className="text-2xl text-gray-300">
                Not because of bad products, but because of inefficient go-to-market
              </p>
            </div>
          </div>
        </div>

        {/* Slide 3: Solution - Streamlined Story */}
        <div className="min-w-full h-full flex-shrink-0 flex flex-col items-center justify-center px-16 relative overflow-hidden py-20">
          
          {/* Simple, Clear Title */}
          <div className="w-full text-center mb-12">
            <h2 className="text-5xl font-bold tracking-wider mb-6">
              <span className="text-white">Your Budget,</span> 
              <span className="text-green-400"> Optimized</span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
              Watch how AI transforms scattered spending into focused growth
            </p>
          </div>

          {/* Animated Budget Flow Visualization */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative h-[450px] bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl border border-gray-700/50 p-8">
              
              {/* Monthly Budget Display */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
                <div className="text-sm text-gray-400 mb-2">Your Monthly Marketing Budget</div>
                <div className="text-4xl font-bold text-white">$100,000</div>
              </div>

              {/* Animated Money Flow */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl">
                
                {/* Channel Performance Bars */}
                <div className="space-y-4 mt-8">
                  {/* Google Ads - High Performer */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Google Ads</span>
                      <span className="text-green-400 text-sm">High ROI ↑</span>
                    </div>
                    <div className="h-12 bg-gray-800 rounded-lg overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center px-4">
                        <div className="h-8 bg-gradient-to-r from-green-500 to-green-400 rounded animate-grow-width" 
                             style={{ width: '45%', animationDelay: '0.5s' }}>
                          <div className="h-full flex items-center justify-end pr-3">
                            <span className="text-black font-bold text-sm">$45K</span>
                          </div>
                        </div>
                      </div>
                      {/* Flowing particles effect */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="h-full w-2 bg-green-400/30 animate-flow-right" />
                        <div className="h-full w-2 bg-green-400/30 animate-flow-right" style={{ animationDelay: '0.5s' }} />
                        <div className="h-full w-2 bg-green-400/30 animate-flow-right" style={{ animationDelay: '1s' }} />
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn - Medium Performer */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">LinkedIn</span>
                      <span className="text-yellow-400 text-sm">Moderate ROI →</span>
                    </div>
                    <div className="h-12 bg-gray-800 rounded-lg overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center px-4">
                        <div className="h-8 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded animate-grow-width" 
                             style={{ width: '25%', animationDelay: '0.7s' }}>
                          <div className="h-full flex items-center justify-end pr-3">
                            <span className="text-black font-bold text-sm">$25K</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Facebook - Low Performer */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Facebook</span>
                      <span className="text-red-400 text-sm">Low ROI ↓</span>
                    </div>
                    <div className="h-12 bg-gray-800 rounded-lg overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center px-4">
                        <div className="h-8 bg-gradient-to-r from-red-500 to-red-400 rounded animate-shrink-width" 
                             style={{ width: '15%', animationDelay: '0.9s' }}>
                          <div className="h-full flex items-center justify-end pr-3">
                            <span className="text-white font-bold text-sm">$15K</span>
                          </div>
                        </div>
                      </div>
                      {/* Money leaving animation */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="h-full w-2 bg-red-400/30 animate-flow-left" />
                      </div>
                    </div>
                  </div>

                  {/* Content Marketing - Growing */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Content Marketing</span>
                      <span className="text-cyan-400 text-sm">Improving ↑</span>
                    </div>
                    <div className="h-12 bg-gray-800 rounded-lg overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center px-4">
                        <div className="h-8 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded animate-grow-width" 
                             style={{ width: '15%', animationDelay: '1.1s' }}>
                          <div className="h-full flex items-center justify-end pr-3">
                            <span className="text-black font-bold text-sm">$15K</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Optimization Indicator */}
                <div className="absolute -right-8 top-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-green-500 to-cyan-500 rounded-full p-3 animate-pulse">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-green-400 mt-2 font-mono">AI ACTIVE</div>
                </div>
              </div>

              {/* Bottom Result */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                <div className="text-sm text-gray-400 mb-2">Projected Monthly Savings</div>
                <div className="text-3xl font-bold text-green-400 animate-pulse">+$25,000</div>
                <div className="text-xs text-gray-300 mt-1">Reallocated to high-performing channels</div>
              </div>
            </div>
          </div>
          
          {/* Simple Benefits */}
          <div className="mt-12 flex justify-center gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">24/7</div>
              <div className="text-sm text-gray-300">Continuous Optimization</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">2-3x</div>
              <div className="text-sm text-gray-300">Better ROI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">Real-time</div>
              <div className="text-sm text-gray-300">Budget Shifts</div>
            </div>
          </div>
        </div>

        {/* Slide 4: Features - 4 AI Agents Story */}
        <div className="min-w-full h-full flex-shrink-0 flex flex-col items-center justify-center px-16 relative overflow-hidden py-16">
          
          {/* Big Title */}
          <div className="text-center mb-10">
            <h2 className="text-5xl font-bold tracking-wider leading-tight">
              <span className="text-white">4 AI</span> 
              <span className="text-cyan-400">SPECIALISTS</span>
            </h2>
            <p className="text-2xl text-white mt-4 leading-relaxed">
              Each AI agent handles a different part of your marketing optimization
            </p>
          </div>
          
          {/* Agent Grid with Clear Roles */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
              
              {/* Channel Scout */}
              <Card className="bg-black/60 border border-cyan-500/30 p-4 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Satellite className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-cyan-400 mb-1">Channel Discovery</h3>
                    <p className="text-sm text-gray-300 mb-3">Finds new marketing channels and opportunities</p>
                    <div className="space-y-1 text-xs">
                      <div className="text-white">• Discovers untapped channels in your industry</div>
                      <div className="text-white">• Analyzes competitor marketing strategies</div>
                      <div className="text-white">• Identifies emerging platforms early</div>
                      <div className="text-cyan-400 font-bold mt-2 text-sm">→ Result: 3-5 new channels to test monthly</div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Message Optimization */}
              <Card className="bg-black/60 border border-green-500/30 p-4 hover:border-green-500/50 transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-400 mb-1">Message Optimization</h3>
                    <p className="text-sm text-gray-300 mb-3">Creates and tests high-converting offers</p>
                    <div className="space-y-1 text-xs">
                      <div className="text-white">• A/B tests messages across all channels</div>
                      <div className="text-white">• Personalizes content for each audience</div>
                      <div className="text-white">• Optimizes for conversion rates automatically</div>
                      <div className="text-green-400 font-bold mt-2 text-sm">→ Result: 40-60% higher conversion rates</div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Performance Analytics */}
              <Card className="bg-black/60 border border-blue-500/30 p-4 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-blue-400 mb-1">Performance Analytics</h3>
                    <p className="text-sm text-gray-300 mb-3">Tracks and analyzes all channel data</p>
                    <div className="space-y-1 text-xs">
                      <div className="text-white">• Monitors performance across all channels</div>
                      <div className="text-white">• Identifies trends and anomalies instantly</div>
                      <div className="text-white">• Provides actionable insights daily</div>
                      <div className="text-blue-400 font-bold mt-2 text-sm">→ Result: 90% faster problem detection</div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Budget Optimization */}
              <Card className="bg-black/60 border border-purple-500/30 p-4 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Orbit className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-purple-400 mb-1">Budget Optimization</h3>
                    <p className="text-sm text-gray-300 mb-3">Automatically reallocates budget to winners</p>
                    <div className="space-y-1 text-xs">
                      <div className="text-white">• Moves budget to high-performing channels</div>
                      <div className="text-white">• Reduces spend on underperformers</div>
                      <div className="text-white">• Optimizes allocation every 24 hours</div>
                      <div className="text-purple-400 font-bold mt-2 text-sm">→ Result: 25-35% better ROAS</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Bottom Summary */}
          <div className="mt-12 text-center">
            <div className="text-4xl font-bold text-white mb-4">
              Working together = <span className="text-green-400">Continuous optimization</span>
            </div>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Each AI specialist shares data with the others, creating a self-improving system 
              that gets better at optimizing your marketing over time
            </p>
          </div>
        </div>

        {/* Slide 5: Dynamic Results & Growth */}
        <div className="min-w-full h-full flex-shrink-0 flex flex-col items-center justify-center px-16 relative overflow-hidden py-16">
          
          {/* Exciting Title */}
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold text-white mb-4">
              <span className="text-white">EXPLOSIVE</span> 
              <span className="text-green-400 neon-glow">GROWTH</span>
            </h2>
            <p className="text-2xl text-green-200">
              Real startups, real results in weeks
            </p>
          </div>

          {/* Dynamic Growth Visualization */}
          <div className="w-full max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-3 gap-6">
              
              {/* Before/After Growth Charts */}
              <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 hover:scale-105 transition-all duration-500">
                <div className="text-center">
                  <div className="text-green-400 text-4xl mb-3 animate-bounce">📈</div>
                  <h3 className="text-xl font-bold text-green-400 mb-2">TechFlow AI</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-400">Before:</span>
                      <span className="text-white">$45K CAC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">After:</span>
                      <span className="text-green-400 font-bold">$18K CAC</span>
                    </div>
                    <div className="bg-green-500/20 rounded-full h-2 mt-3">
                      <div className="bg-green-500 h-full rounded-full animate-pulse" style={{width: '75%'}} />
                    </div>
                    <div className="text-green-400 font-bold text-lg">60% Reduction</div>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-6 hover:scale-105 transition-all duration-500">
                <div className="text-center">
                  <div className="text-cyan-400 text-4xl mb-3 animate-spin">🚀</div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-2">DataVault Pro</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-400">Before:</span>
                      <span className="text-white">18 months to PMF</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-cyan-400">After:</span>
                      <span className="text-cyan-400 font-bold">4 months to PMF</span>
                    </div>
                    <div className="bg-cyan-500/20 rounded-full h-2 mt-3">
                      <div className="bg-cyan-500 h-full rounded-full animate-pulse" style={{width: '80%'}} />
                    </div>
                    <div className="text-cyan-400 font-bold text-lg">4.5x Faster</div>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 border border-purple-500/30 rounded-lg p-6 hover:scale-105 transition-all duration-500">
                <div className="text-center">
                  <div className="text-purple-400 text-4xl mb-3 animate-pulse">💰</div>
                  <h3 className="text-xl font-bold text-purple-400 mb-2">CloudSync Inc</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-400">Before:</span>
                      <span className="text-white">$2M ARR</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-400">After:</span>
                      <span className="text-purple-400 font-bold">$8M ARR</span>
                    </div>
                    <div className="bg-purple-500/20 rounded-full h-2 mt-3">
                      <div className="bg-purple-500 h-full rounded-full animate-pulse" style={{width: '90%'}} />
                    </div>
                    <div className="text-purple-400 font-bold text-lg">4x Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projected Impact */}
          <div className="bg-black/80 border border-green-500/50 rounded-lg p-8 max-w-4xl mx-auto text-center">
            <div className="text-4xl font-bold text-green-400 mb-4">
              Projected Annual Savings
            </div>
            <div className="text-5xl font-bold text-white mb-4">
              $2.4M - $4.8M
            </div>
            <div className="text-lg text-gray-300">
              Based on typical $100K/month marketing spend
            </div>
            
            {/* Realistic Projections */}
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">20-30%</div>
                <div className="text-sm text-gray-300">CAC Reduction Target</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">2-3x</div>
                <div className="text-sm text-gray-300">ROI Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">15-25%</div>
                <div className="text-sm text-gray-300">Budget Efficiency Gain</div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 6: CTA */}
        <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden" style={{ visibility: currentSlide === 5 ? 'visible' : 'hidden' }}>
          <div className="w-full max-w-7xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white text-center max-w-5xl mx-auto leading-tight" style={{ textShadow: '0 0 5px rgba(255,255,255,0.3)' }}>
                Ready to <span className="text-green-400" style={{ textShadow: '0 0 10px #22c55e, 0 0 20px #22c55e' }}>Optimize</span> Your Growth?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Join our early access program and optimize your marketing spend with AI
              </p>
            </div>
            
            <Card className="bg-gradient-to-br from-red-900/20 to-gray-900/20 backdrop-blur-xl border-white/30 p-6 max-w-2xl mx-auto shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="space-y-6">
                <p className="text-xl text-white font-semibold mb-4">Request Early Access</p>
                <div className="flex">
                  <Input
                    type="email"
                    placeholder="founder@startup.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/15 border-white/30 text-white placeholder:text-white/60 text-lg py-6 px-4 rounded-r-none focus:bg-white/20 focus:border-white/40"
                  />
                  <Button className="rounded-l-none bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 transition-all duration-300 text-lg px-8 py-6 shadow-lg">
                    Get Access
                    <Rocket className="w-5 h-5 ml-3" />
                  </Button>
                </div>
                
                <div className="text-center space-y-2 pt-4">
                  <p className="text-lg text-red-200 font-semibold">14-day free trial</p>
                  <p className="text-base text-gray-200">No credit card • Cancel anytime • Full access</p>
                </div>
              </div>
            </Card>
            
            <div className="space-y-6">
              <div className="flex justify-center gap-6">
                <a href="/login">
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 text-lg px-8 py-5 shadow-lg hover:scale-105">
                    <LogIn className="w-5 h-5 mr-3" />
                    Login
                  </Button>
                </a>
                <a href="/dashboard">
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 text-lg px-8 py-5 shadow-lg hover:scale-105">
                    <Sparkles className="w-5 h-5 mr-3" />
                    View Demo Dashboard
                  </Button>
                </a>
              </div>
              
              <div className="flex justify-center gap-8 pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-400">50+</div>
                  <div className="text-sm text-red-200">Early Adopters</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-400">24/7</div>
                  <div className="text-sm text-gray-200">AI Optimization</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-400">14d</div>
                  <div className="text-sm text-red-200">Free Trial</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        
        {/* Minimalist Side Navigation */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50">
          <div className="flex flex-col items-center space-y-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`
                  relative group transition-all duration-300
                  ${index === currentSlide ? 'scale-110' : 'hover:scale-105'}
                `}
                aria-label={slide.title}
              >
                <div className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${index === currentSlide 
                    ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                    : 'bg-white/20 hover:bg-white/40'
                  }
                `} />
                
                {/* Tooltip on hover */}
                <span className={`
                  absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 rounded
                  bg-black/80 border border-white/20 text-xs whitespace-nowrap
                  opacity-0 group-hover:opacity-100 pointer-events-none
                  transition-opacity duration-200
                `}>
                  {slide.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Floating Arrow Navigation */}
        <div className="fixed bottom-8 right-8 flex items-center gap-2 z-50">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`
              p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10
              text-white/60 hover:text-white hover:bg-black/70 transition-all duration-200
              disabled:opacity-20 disabled:cursor-not-allowed
            `}
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`
              p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10
              text-white/60 hover:text-white hover:bg-black/70 transition-all duration-200
              disabled:opacity-20 disabled:cursor-not-allowed
            `}
            aria-label="Next slide"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Keyboard hint - smaller and more subtle */}
        <div className="fixed bottom-8 left-8 text-white/20 text-xs">
          Press ← → to navigate
        </div>
      </div>

      
    </div>
  )
}