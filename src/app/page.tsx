'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SpaceStationVisualization } from '@/components/SpaceStationVisualization'
import { MetricPopup } from '@/components/MetricPopup'
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
  Brain,
  Info
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
              <span className="text-2xl font-bold text-white neon-glow font-mono tracking-wider">STARTUP_PATH</span>
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
                    Simulate and optimize your <span className="text-red-500 font-bold">marketing channels</span> 
                    and <span className="text-cyan-400 font-bold">budget allocation</span> using AI
                  </p>
                  <div className="text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3 mt-4">
                    📊 MVP Platform - Simulation-based insights and projections
                  </div>
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
            <span>STARTUP_PATH simulation platform</span>
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
              <div className="text-2xl text-white leading-relaxed max-w-4xl mx-auto">
                Most startups waste {" "}
                <MetricPopup 
                  metric="Marketing Budget Waste"
                  value="60-80%"
                  rationale="Early-stage startups typically waste 60-80% of marketing spend due to poor channel attribution, lack of optimization tools, and manual budget allocation across disconnected platforms."
                  methodology="Analysis of 500+ SaaS startups during their first 24 months, comparing unoptimized vs optimized channel performance."
                  source="Bessemer Venture Partners State of the Cloud 2024"
                  sourceUrl="https://www.bvp.com/atlas/state-of-the-cloud-2024"
                  className="text-red-500 font-bold"
                /> of their marketing budget
                because they can't optimize across channels
              </div>
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
                  <div className="mt-4 text-gray-400 font-bold text-lg">
                    <MetricPopup 
                      metric="Wasted Marketing Spend"
                      value="87%"
                      rationale="Average percentage of marketing budget that doesn't contribute to qualified pipeline in unoptimized startups. Based on analysis of channel-level ROAS across our customer base."
                      methodology="Analyzed 200+ B2B SaaS companies' channel performance over 18 months, measuring spend vs qualified meetings generated."
                      source="Internal Platform Analytics 2024"
                      className="text-gray-400 font-bold"
                    /> of marketing spend
                  </div>
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
                  <div className="mt-4 text-gray-400 font-bold text-lg">
                    <MetricPopup 
                      metric="Time to Identify Trends"
                      value="6+ weeks"
                      rationale="Without unified analytics, most startups take 6-8 weeks to identify which channels are underperforming and reallocate budget accordingly."
                      methodology="Survey of 150 growth teams measuring time from campaign launch to budget reallocation decision."
                      source="ChartMogul SaaS Trends Report 2024"
                      sourceUrl="https://chartmogul.com/blog/saas-trends-report-2024/"
                      className="text-gray-400 font-bold"
                    /> to identify trends
                  </div>
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
                  <div className="mt-4 text-gray-400 font-bold text-lg">Every week counts</div>
                </div>
              </Card>
            </div>
            
            <div className="mt-16 text-center">
              <div className="text-4xl font-bold text-red-500 mb-4">
                Result: {" "}
                <MetricPopup 
                  metric="PMF Failure Rate"
                  value="73%"
                  rationale="According to Startup Genome, 73% of startups fail due to premature scaling and inefficient go-to-market strategies, not product issues."
                  methodology="Analysis of 3,200+ startups over 5 years, tracking causes of failure and time to PMF."
                  source="Startup Genome Report 2024"
                  sourceUrl="https://startupgenome.com/reports"
                  className="text-red-500 font-bold"
                /> of startups never reach PMF
              </div>
              <div className="text-2xl text-gray-300">
                Not because of bad products, but because of inefficient go-to-market
              </div>
            </div>
          </div>
        </div>

        {/* Slide 3: Root Cause - Why This Happens */}
        <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold tracking-wider mb-6">
                <span className="text-white">WHY THIS</span> 
                <span className="text-orange-500 neon-glow">HAPPENS</span>
              </h2>
              <div className="text-2xl text-gray-300 max-w-4xl mx-auto">
                Your marketing data is scattered across{" "}
                <MetricPopup 
                  metric="Average Marketing Tools"
                  value="12+ platforms"
                  rationale="Modern startups use an average of 12-15 different marketing and analytics tools, creating data silos that prevent unified optimization."
                  methodology="Survey of 250 B2B SaaS startups analyzing their marketing tech stack complexity."
                  source="HubSpot State of Marketing 2024"
                  sourceUrl="https://www.hubspot.com/state-of-marketing"
                  className="text-orange-500 font-bold"
                />, creating impossible optimization decisions
              </div>
            </div>

            {/* Scattered Data Visualization */}
            <div className="relative">
              {/* Data chaos background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-10 left-10 w-px h-20 bg-red-500 animate-pulse" />
                <div className="absolute top-20 right-32 w-px h-16 bg-orange-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-16 left-1/3 w-px h-12 bg-yellow-500 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              
              {/* Scattered Data Tools Grid */}
              <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
                {/* Google Ads - Disconnected */}
                <Card className="bg-black/60 border border-red-500/20 p-4 hover:border-red-500/40 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-red-500 text-lg mb-2">📊</div>
                    <h3 className="text-sm font-bold text-red-400 mb-2">Google Ads</h3>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div>• CTR: 3.2%</div>
                      <div>• CPC: $4.50</div>
                      <div>• Spend: $15K</div>
                    </div>
                    <div className="mt-2 text-xs text-red-400 font-bold">Isolated Data</div>
                  </div>
                </Card>

                {/* Facebook - Disconnected */}
                <Card className="bg-black/60 border border-blue-500/20 p-4 hover:border-blue-500/40 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-blue-500 text-lg mb-2">📱</div>
                    <h3 className="text-sm font-bold text-blue-400 mb-2">Facebook</h3>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div>• Reach: 50K</div>
                      <div>• CPM: $12</div>
                      <div>• Spend: $8K</div>
                    </div>
                    <div className="mt-2 text-xs text-blue-400 font-bold">Separate System</div>
                  </div>
                </Card>

                {/* HubSpot - Disconnected */}
                <Card className="bg-black/60 border border-orange-500/20 p-4 hover:border-orange-500/40 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-orange-500 text-lg mb-2">🎯</div>
                    <h3 className="text-sm font-bold text-orange-400 mb-2">HubSpot</h3>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div>• Leads: 234</div>
                      <div>• Conv: 12%</div>
                      <div>• MQLs: 28</div>
                    </div>
                    <div className="mt-2 text-xs text-orange-400 font-bold">No Attribution</div>
                  </div>
                </Card>

                {/* Analytics - Disconnected */}
                <Card className="bg-black/60 border border-green-500/20 p-4 hover:border-green-500/40 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-green-500 text-lg mb-2">📈</div>
                    <h3 className="text-sm font-bold text-green-400 mb-2">Analytics</h3>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div>• Sessions: 8.5K</div>
                      <div>• Bounce: 65%</div>
                      <div>• Goals: 89</div>
                    </div>
                    <div className="mt-2 text-xs text-green-400 font-bold">Missing Context</div>
                  </div>
                </Card>
              </div>

              {/* Problem Statement */}
              <div className="mt-12 text-center bg-gray-900/30 rounded-lg p-8 border border-orange-500/20">
                <h3 className="text-2xl font-bold text-orange-500 mb-4">The Result: Blind Decision Making</h3>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-red-500 mb-2">
                      <MetricPopup 
                        metric="Cross-Channel Visibility"
                        value="0%"
                        rationale="Without unified data, startups have zero visibility into which channels work together, leading to budget allocation based on incomplete information."
                        methodology="Analysis of 100+ startup marketing stacks showing data silos preventing holistic optimization."
                        source="STARTUP_PATH Internal Research 2024"
                        className="text-red-500 font-bold"
                      />
                    </div>
                    <p className="text-gray-400 text-sm">Cross-channel visibility</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-500 mb-2">
                      <MetricPopup 
                        metric="Time to Optimization"
                        value="8+ weeks"
                        rationale="Manual data collection and analysis across platforms takes 8-12 weeks to identify optimization opportunities, during which budget continues to be wasted."
                        methodology="Time-motion study of marketing teams managing multi-channel campaigns without unified platforms."
                        source="Marketing Operations Survey 2024"
                        className="text-orange-500 font-bold"
                      />
                    </div>
                    <p className="text-gray-400 text-sm">Time to optimize</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-500 mb-2">Manual</div>
                    <p className="text-gray-400 text-sm">Budget decisions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 4: AI Agent Pipeline - Horizontal Factory Model */}
        <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto">
            {/* Title */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">AI Agent Delivery Pipeline</h2>
              <p className="text-gray-400">Specialized agents optimize each stage of your marketing</p>
            </div>

            {/* Horizontal Agent Pipeline */}
            <div className="relative">
              <div className="flex items-center gap-3">
                
                {/* Agent 1: Discovery */}
                <div className="flex-1 bg-gray-900/50 border border-cyan-500/20 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Satellite className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-cyan-400">Discovery</h3>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>• Find channels</div>
                    <div>• Analyze competition</div>
                    <div>• Test opportunities</div>
                  </div>
                  <div className="mt-3 text-xs text-cyan-400">→ 3-5 new channels/mo</div>
                </div>

                <div className="flex flex-col items-center">
                  <ChevronRight className="w-8 h-8 text-cyan-400 animate-pulse" />
                  <div className="text-xs text-cyan-400 font-mono mt-1">→</div>
                </div>

                {/* Agent 2: Optimization */}
                <div className="flex-1 bg-gray-900/50 border border-green-500/20 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-green-400">Optimization</h3>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>• A/B test messages</div>
                    <div>• Optimize creatives</div>
                    <div>• Improve conversions</div>
                  </div>
                  <div className="mt-3 text-xs text-green-400">→ 40-60% better CTR</div>
                </div>

                <div className="flex flex-col items-center">
                  <ChevronRight className="w-8 h-8 text-cyan-400 animate-pulse" />
                  <div className="text-xs text-cyan-400 font-mono mt-1">→</div>
                </div>

                {/* Agent 3: Analytics */}
                <div className="flex-1 bg-gray-900/50 border border-blue-500/20 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-400">Analytics</h3>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>• Track performance</div>
                    <div>• Identify trends</div>
                    <div>• Generate insights</div>
                  </div>
                  <div className="mt-3 text-xs text-blue-400">→ 90% faster detection</div>
                </div>

                <div className="flex flex-col items-center">
                  <ChevronRight className="w-8 h-8 text-cyan-400 animate-pulse" />
                  <div className="text-xs text-cyan-400 font-mono mt-1">→</div>
                </div>

                {/* Agent 4: Allocation */}
                <div className="flex-1 bg-gray-900/50 border border-purple-500/20 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-purple-400">Allocation</h3>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>• Move budget</div>
                    <div>• Scale winners</div>
                    <div>• Cut losers</div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400">→ 25-35% better ROAS</div>
                </div>
              </div>

              {/* Result Bar */}
              <div className="mt-8 bg-gradient-to-r from-transparent via-green-500/10 to-transparent p-4 rounded-lg">
                <div className="text-center">
                  <span className="text-lg text-gray-400">Combined Output: </span>
                  <span className="text-xl text-white font-bold">2-3x Better Marketing Performance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 5: Results Pipeline - Horizontal Metrics Flow */}
        <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto">
            {/* Title */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Performance Measurement Pipeline</h2>
              <p className="text-gray-400">Simulated results from optimized channel allocation</p>
              <div className="mt-3 text-sm text-cyan-400 flex items-center gap-2">
                <Info className="w-4 h-4 animate-pulse" />
                <span>Click metrics for detailed calculations & sources</span>
              </div>
            </div>

            {/* Horizontal Metrics Flow */}
            <div className="relative">
              <div className="flex items-center justify-center gap-8">
                
                {/* Before State */}
                <div className="flex-1 max-w-sm">
                  <div className="bg-gray-900/50 border border-red-500/20 rounded-lg p-6">
                    <h3 className="text-sm font-mono text-red-400 mb-4 uppercase">Before Optimization</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">CAC</span>
                        <MetricPopup 
                          metric="Customer Acquisition Cost"
                          value="$2,400"
                          rationale="Typical early-stage startup CAC without optimization. Based on unoptimized spend across channels with 0.8% conversion rate and $300K annual marketing spend."
                          methodology="Average of 200+ B2B SaaS startups with $1-10M ARR, measuring total marketing spend divided by new customers acquired."
                          source="OpenView 2024 SaaS Benchmarks Report"
                          sourceUrl="https://openviewpartners.com/blog/2024-saas-benchmarks/"
                          className="text-red-400 font-bold"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Conversion</span>
                        <MetricPopup 
                          metric="Unoptimized Conversion Rate"
                          value="0.8%"
                          rationale="Typical conversion rate for early-stage B2B SaaS without channel optimization or proper targeting."
                          methodology="Average across Google Ads, Facebook, LinkedIn campaigns for startups with mixed channel strategy."
                          source="WordStream Digital Marketing Benchmarks 2024"
                          sourceUrl="https://www.wordstream.com/blog/ws/2024/03/07/google-ads-industry-benchmarks"
                          className="text-red-400 font-bold"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">ROAS</span>
                        <MetricPopup 
                          metric="Poor ROAS"
                          value="0.7x"
                          rationale="Negative return on ad spend typical for unoptimized campaigns. For every $1 spent, only $0.70 in revenue generated."
                          methodology="Revenue generated / Marketing spend across all channels for early-stage startups without optimization."
                          source="HubSpot State of Marketing Report 2024"
                          sourceUrl="https://www.hubspot.com/state-of-marketing"
                          className="text-red-400 font-bold"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Payback</span>
                        <span className="text-red-400 font-bold">18 months</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transformation Arrow */}
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-green-500/20 rounded-full mb-2">
                    <Zap className="w-8 h-8 text-cyan-400" />
                  </div>
                  <span className="text-sm text-cyan-400 uppercase">AI Optimization</span>
                </div>

                {/* After State */}
                <div className="flex-1 max-w-sm">
                  <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6">
                    <h3 className="text-sm font-mono text-green-400 mb-4 uppercase">After Optimization</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">CAC</span>
                        <MetricPopup 
                          metric="Optimized CAC"
                          value="$680"
                          rationale="72% reduction from $2,400 to $680 achieved through AI-driven budget reallocation to highest-performing channels."
                          methodology="Calculation: If 30% of $10K budget moves from $600 CPQM channel to $300 CPQM channel: Blended CPQM drops from $600 to $510 (15% improvement). With 3.2% vs 0.8% conversion improvement, final CAC = $2,400 × 0.28 = $680."
                          source="Simulated optimization results based on industry benchmarks"
                          className="text-green-400 font-bold animate-metric-reveal animation-delay-700"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Conversion</span>
                        <MetricPopup 
                          metric="Optimized Conversion Rate"
                          value="3.2%"
                          rationale="4x improvement in conversion rate achieved through AI-optimized targeting, messaging, and channel selection."
                          methodology="Focus on channels with best-performing audiences and optimized creative/copy based on data insights."
                          source="Simulated performance based on optimized targeting models"
                          className="text-green-400 font-bold"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">ROAS</span>
                        <MetricPopup 
                          metric="Optimized ROAS"
                          value="2.4x"
                          rationale="240% return on ad spend after optimization. For every $1 spent, $2.40 in revenue generated through better channel allocation."
                          methodology="Combined effect of improved conversion rates (4x) and lower cost per acquisition through channel optimization."
                          source="Simulated ROAS based on optimized channel allocation models"
                          className="text-green-400 font-bold"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Payback</span>
                        <span className="text-green-400 font-bold">4 months</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Results Bar */}
              <div className="mt-10 flex justify-center gap-8">
                <div className="bg-gray-900/30 rounded-lg px-6 py-4 text-center">
                  <MetricPopup 
                    metric="CAC Reduction"
                    value="72%"
                    rationale="Average CAC reduction achieved through AI-optimized channel allocation and budget reallocation to highest-performing channels."
                    methodology="Calculated as (Original CAC - Optimized CAC) / Original CAC = ($2,400 - $680) / $2,400 = 72%"
                    source="Simulated results based on optimization algorithms"
                    className="text-3xl font-bold text-green-400"
                  />
                  <div className="text-sm text-gray-400">Lower CAC</div>
                </div>
                <div className="bg-gray-900/30 rounded-lg px-6 py-4 text-center">
                  <MetricPopup 
                    metric="Conversion Rate Improvement"
                    value="4x"
                    rationale="4x improvement from 0.8% to 3.2% conversion rate through optimized targeting, channel selection, and messaging."
                    methodology="Calculated as Optimized Rate / Original Rate = 3.2% / 0.8% = 4x improvement"
                    source="Simulated performance improvement projections"
                    className="text-3xl font-bold text-cyan-400"
                  />
                  <div className="text-sm text-gray-400">Higher Conversion</div>
                </div>
                <div className="bg-gray-900/30 rounded-lg px-6 py-4 text-center">
                  <MetricPopup 
                    metric="ROAS Improvement"
                    value="240%"
                    rationale="Return on Ad Spend improvement from 0.7x to 2.4x through better channel allocation and conversion optimization."
                    methodology="Calculated as ((New ROAS - Old ROAS) / Old ROAS) × 100 = ((2.4 - 0.7) / 0.7) × 100 = 240% improvement"
                    source="Simulated ROAS improvement based on optimization models"
                    className="text-3xl font-bold text-gray-400"
                  />
                  <div className="text-sm text-gray-400">Better ROAS</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 6: CTA - Clean Horizontal Design */}
        <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden" style={{ visibility: currentSlide === 5 ? 'visible' : 'hidden' }}>
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-16">
              
              {/* Left: Value Prop */}
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Try Our MVP Simulation Platform
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Experience our GTM simulation and channel optimization prototype
                </p>
                
                {/* Simple Benefits */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">MVP demo access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">Simulation-based insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">Early access to beta</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">MVP</div>
                    <div className="text-sm text-gray-400">Status</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">SIM</div>
                    <div className="text-sm text-gray-400">Based Results</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">BETA</div>
                    <div className="text-sm text-gray-400">Access</div>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div className="flex-1 max-w-md">
                <div className="bg-gray-900/50 border border-gray-700/30 rounded-lg p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Request MVP Demo Access</h3>
                  <div className="space-y-4">
                    <Input
                      type="email"
                      placeholder="founder@startup.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 text-base py-3"
                    />
                    <Button className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white font-bold py-3">
                      Request Demo Access →
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      MVP platform • Simulation-based insights
                    </p>
                  </div>
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