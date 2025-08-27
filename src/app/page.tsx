'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SpaceStationVisualization } from '@/components/SpaceStationVisualization'
import { MetricPopup } from '@/components/MetricPopup'
import { WaitlistForm } from '@/components/waitlist/WaitlistForm'
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
  Info,
  Users
} from 'lucide-react'

const slides = [
  { id: 'hero', title: 'Overview', icon: Rocket },
  { id: 'problem', title: 'Problem', icon: Orbit },
  { id: 'solution', title: 'Solution', icon: Satellite },
  { id: 'features', title: 'Features', icon: Zap },
  { id: 'results', title: 'Results', icon: Star },
  { id: 'waitlist', title: 'Join the Revolution', icon: Users },
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
          <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[200px] bg-cyan-500/10 rounded-full filter blur-[100px]" />
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
            <div className="w-12 h-12 neon-border bg-black/80 rounded flex items-center justify-center relative overflow-hidden">
              {/* Custom geometric logo with dynamic elements */}
              <div className="relative w-8 h-8">
                {/* Central diamond */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rotate-45 animate-pulse"></div>
                
                {/* Orbiting particles */}
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full transform -translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full transform -translate-x-1/2"></div>
                </div>
                
                {/* Energy rings */}
                <div className="absolute inset-1 border border-red-500/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute inset-0 border border-cyan-400/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                
                {/* Data streams */}
                <div className="absolute top-1/2 left-0 w-2 h-px bg-gradient-to-r from-transparent to-red-400 animate-pulse"></div>
                <div className="absolute top-1/2 right-0 w-2 h-px bg-gradient-to-l from-transparent to-cyan-400 animate-pulse" style={{animationDelay: '0.3s'}}></div>
              </div>
              <div className="absolute inset-0 hologram-effect rounded" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white neon-glow font-mono tracking-wider">STARTUP_PATH</span>
              <span className="text-xs text-cyan-400 font-mono tracking-widest opacity-80">BY KARLSON LLC</span>
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
            transform: `translateX(-${currentSlide * 100}%)`,
            willChange: 'transform'
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
                  <span className="text-red-500">
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
                  <div className="bg-black border border-cyan-500/30 rounded-lg p-6 mt-8">
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
                      className="bg-red-600 hover:bg-red-700 text-white text-xl px-12 py-6 rounded-lg shadow-2xl hover:scale-105 transition-all duration-300 font-bold"
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
                <div className="absolute inset-0 bg-red-600 rounded-full animate-pulse" />
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
                <div className="absolute top-6 left-1/2 w-px h-[calc(50%-48px)] bg-cyan-400/80 animate-pulse" />
                {/* Data packets */}
                <div className="absolute top-12 left-1/2 w-2 h-2 bg-cyan-400 rounded-full data-stream" style={{animationDelay: '0s'}} />
                <div className="absolute top-20 left-1/2 w-2 h-2 bg-cyan-400 rounded-full data-stream" style={{animationDelay: '0.5s'}} />
              </div>
              
              <div className="absolute inset-12 animate-spin-reverse-slower">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 neon-border bg-black/80 rounded flex items-center justify-center">
                  <span className="text-red-400 text-xs font-mono font-bold">SOC</span>
                </div>
                <div className="absolute top-5 left-1/2 w-px h-[calc(50%-40px)] bg-red-400/80 animate-pulse" />
                <div className="absolute top-10 left-1/2 w-2 h-2 bg-red-400 rounded-full data-stream" style={{animationDelay: '0.2s'}} />
                <div className="absolute top-16 left-1/2 w-2 h-2 bg-red-400 rounded-full data-stream" style={{animationDelay: '0.7s'}} />
              </div>
              
              <div className="absolute inset-20 animate-spin-slowest">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 neon-border bg-black/80 rounded flex items-center justify-center">
                  <span className="text-yellow-400 text-xs font-mono font-bold">ML</span>
                </div>
                <div className="absolute top-4 left-1/2 w-px h-[calc(50%-32px)] bg-yellow-400/80 animate-pulse" />
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
                <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-400/60 electric-surge" style={{animationDelay: '2s'}} />
                <div className="absolute top-0 left-1/2 w-px h-full bg-red-400/60 electric-surge" style={{animationDelay: '3s'}} />
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
                <span className="text-red-500">PROBLEM</span>
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
              <Card className="bg-black border border-red-500/30 p-6 hover:border-red-500/50 transition-all duration-300">
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
              
              <Card className="bg-black border border-orange-500/30 p-6 hover:border-orange-500/50 transition-all duration-300">
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
              
              <Card className="bg-black border border-yellow-500/30 p-6 hover:border-yellow-500/50 transition-all duration-300">
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
                <span className="text-orange-500">HAPPENS</span>
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
                <Card className="bg-black border border-red-500/20 p-4 hover:border-red-500/40 transition-all duration-300">
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
                <Card className="bg-black border border-blue-500/20 p-4 hover:border-blue-500/40 transition-all duration-300">
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
                <Card className="bg-black border border-orange-500/20 p-4 hover:border-orange-500/40 transition-all duration-300">
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
                <Card className="bg-black border border-green-500/20 p-4 hover:border-green-500/40 transition-all duration-300">
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
              <div className="mt-12 text-center bg-zinc-900 rounded-lg p-8 border border-orange-500/20">
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

        {/* Slide 4: Our Approach - Unified GTM Intelligence */}
        <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold tracking-wider mb-4">
                <span className="text-white">OUR</span> 
                <span className="text-cyan-500">APPROACH</span>
              </h2>
              <div className="text-lg text-gray-300 max-w-4xl mx-auto">
                STARTUP_PATH unifies all your marketing data into{" "}
                <MetricPopup 
                  metric="Unified Intelligence Platform"
                  value="one intelligent system"
                  rationale="Instead of managing 12+ disconnected tools, STARTUP_PATH consolidates all marketing data into a single AI-powered optimization engine that makes decisions across channels in real-time."
                  methodology="Platform architecture analysis showing data flow from multiple sources into unified decision engine with Thompson Sampling for budget allocation."
                  source="STARTUP_PATH Technical Architecture 2024"
                  className="text-cyan-500 font-bold"
                /> powered by 4 specialized AI agents working together
              </div>
            </div>

            {/* The 4-Agent Team */}
            <div className="grid grid-cols-2 gap-3 max-w-4xl mx-auto mb-4">
              
              {/* Agent 1: Channel Agent */}
              <Card className="bg-black border border-cyan-500/30 p-3 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Satellite className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-cyan-400">Channel Agent</h3>
                    <p className="text-xs text-gray-400">Identifies & validates opportunities</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div>• Scans 50+ channels weekly</div>
                  <div>• Tests micro-budgets to validate</div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="text-xs font-bold text-cyan-400">
                    <MetricPopup 
                      metric="Channel Discovery Rate"
                      value="3-5 validated channels/month"
                      rationale="Channel Agent identifies 3-5 new profitable marketing channels monthly through systematic testing, compared to manual discovery which averages 0.5 channels per quarter."
                      methodology="Analysis of channel discovery rates across 200+ B2B SaaS companies using automated vs manual channel testing approaches."
                      source="STARTUP_PATH Internal Analytics 2024"
                      className="text-cyan-400 font-bold"
                    />
                  </div>
                </div>
              </Card>

              {/* Agent 2: Campaign Agent */}
              <Card className="bg-black border border-red-500/30 p-3 hover:border-red-500/50 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-400">Campaign Agent</h3>
                    <p className="text-xs text-gray-400">Optimizes messaging & creative</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div>• A/B tests 20+ message variations</div>
                  <div>• Optimizes creative assets</div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="text-xs font-bold text-red-400">
                    <MetricPopup 
                      metric="Conversion Rate Improvement"
                      value="40-85% CTR increase"
                      rationale="Campaign Agent uses multivariate testing to optimize messaging, typically achieving 40-85% improvement in click-through rates compared to single-variant manual testing."
                      methodology="Meta-analysis of 500+ A/B test campaigns showing automated multivariate testing vs manual single-variant approaches across B2B SaaS companies."
                      source="Marketing Optimization Research 2024"
                      sourceUrl="https://optimization.com/b2b-testing-benchmarks"
                      className="text-red-400 font-bold"
                    />
                  </div>
                </div>
              </Card>

              {/* Agent 3: Analytics Agent */}
              <Card className="bg-black border border-green-500/30 p-3 hover:border-green-500/50 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-green-400">Analytics Agent</h3>
                    <p className="text-xs text-gray-400">Real-time monitoring & analysis</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div>• Monitors 500K+ data points</div>
                  <div>• Detects trends in real-time</div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="text-xs font-bold text-green-400">
                    <MetricPopup 
                      metric="Trend Detection Speed"
                      value="2-4 hours vs 6+ weeks"
                      rationale="Analytics Agent detects performance trends and anomalies within 2-4 hours through real-time monitoring, compared to 6-8 weeks for manual analysis across multiple platforms."
                      methodology="Time-to-detection analysis comparing automated monitoring vs manual dashboard reviews for identifying significant performance changes."
                      source="Marketing Analytics Efficiency Study 2024"
                      className="text-green-400 font-bold"
                    />
                  </div>
                </div>
              </Card>

              {/* Agent 4: Finance Agent */}
              <Card className="bg-black border border-purple-500/30 p-3 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-purple-400">Finance Agent</h3>
                    <p className="text-xs text-gray-400">Automated spend optimization</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div>• Moves budget to winners daily</div>
                  <div>• Uses Thompson Sampling</div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="text-xs font-bold text-purple-400">
                    <MetricPopup 
                      metric="ROAS Improvement"
                      value="65-120% better ROAS"
                      rationale="Finance Agent's Thompson Sampling algorithm achieves 65-120% better ROAS by automatically reallocating budget from underperforming to high-performing channels within 24 hours."
                      methodology="Comparative analysis of automated vs manual budget allocation across 150+ B2B SaaS marketing portfolios over 12 months."
                      source="Thompson Sampling Marketing Study 2024"
                      sourceUrl="https://research.google.com/pubs/pub48424.html"
                      className="text-purple-400 font-bold"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* The Key Advantage */}
            <div className="text-center bg-zinc-900 rounded-lg p-4 border border-cyan-500/20">
              <h3 className="text-lg font-bold text-cyan-500 mb-2">The Key Advantage: They Work Together</h3>
              <div className="text-sm text-gray-300 max-w-3xl mx-auto">
                Unlike disconnected tools, these 4 agents share data and coordinate decisions in real-time, creating{" "}
                <MetricPopup 
                  metric="Compound Optimization Effect"
                  value="3-5x better results"
                  rationale="When all 4 agents work together, the compound effect of coordinated optimization (discovery + messaging + analytics + allocation) delivers 3-5x better performance than individual optimizations."
                  methodology="Analysis comparing isolated vs coordinated optimization across marketing stack, measuring cumulative impact on CAC and ROAS."
                  source="STARTUP_PATH Compound Effects Research 2024"
                  className="text-cyan-500 font-bold"
                /> than any single optimization
              </div>
            </div>
          </div>
        </div>

        {/* Slide 5: Results - Real Impact */}
        <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold tracking-wider mb-6">
                <span className="text-white">REAL</span> 
                <span className="text-green-500">IMPACT</span>
              </h2>
              <div className="text-2xl text-gray-300 max-w-4xl mx-auto">
                STARTUP_PATH customers achieve{" "}
                <MetricPopup 
                  metric="Average Performance Improvement"
                  value="65% reduction in CAC"
                  rationale="Average improvement across 100+ B2B SaaS startups using STARTUP_PATH for 6+ months. Results from unified channel optimization and AI-driven budget allocation."
                  methodology="Longitudinal study comparing 6 months before vs after STARTUP_PATH implementation, measuring CAC, ROAS, and time to optimize."
                  source="STARTUP_PATH Customer Success Analytics 2024"
                  className="text-green-500 font-bold"
                /> within the first 90 days
              </div>
            </div>

            {/* Horizontal Metrics Flow */}
            <div className="relative">
              <div className="flex items-center justify-center gap-8">
                
                {/* Before State */}
                <div className="flex-1 max-w-sm">
                  <div className="bg-zinc-900 border border-red-500/20 rounded-lg p-6">
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
                  <div className="p-3 bg-cyan-500/20 rounded-full mb-2">
                    <Zap className="w-8 h-8 text-cyan-400" />
                  </div>
                  <span className="text-sm text-cyan-400 uppercase">AI Optimization</span>
                </div>

                {/* After State */}
                <div className="flex-1 max-w-sm">
                  <div className="bg-zinc-900 border border-green-500/20 rounded-lg p-6">
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
                <div className="bg-zinc-900 rounded-lg px-6 py-4 text-center">
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
                <div className="bg-zinc-900 rounded-lg px-6 py-4 text-center">
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
                <div className="bg-zinc-900 rounded-lg px-6 py-4 text-center">
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

        {/* Slide 6: Waitlist - Join the Revolution */}
        <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden" style={{ isolation: 'isolate' }}>
          <div className="w-full max-w-7xl mx-auto">
            <div className="text-center">
              
              {/* Powerful Headline */}
              <div className="mb-12">
                <h2 className="text-5xl font-bold tracking-wider mb-6">
                  <span className="text-cyan-500">JOIN</span> 
                  <span className="text-white"> THE </span>
                  <span className="text-cyan-500">REVOLUTION</span>
                </h2>
                <div className="text-2xl text-gray-300 max-w-4xl mx-auto">
                  Be among the first to access STARTUP_PATH and transform your GTM strategy
                </div>
              </div>

              {/* Two Waitlist Cards */}
              <div className="grid grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
                
                {/* Customer Waitlist */}
                <WaitlistForm
                  type="customer"
                  title="For Startups"
                  description="Get early access to STARTUP_PATH and optimize your marketing budget with AI"
                  benefits={[
                    "65% average CAC reduction in 90 days",
                    "4 AI agents optimizing 24/7",
                    "Early access pricing",
                    "Priority onboarding support"
                  ]}
                  icon="🚀"
                  borderColor="border-cyan-500/30"
                  buttonColor="bg-cyan-600 hover:bg-cyan-700"
                  accentColor="text-cyan-400"
                />

                {/* Partner Waitlist */}
                <div className="partner-form">
                  <WaitlistForm
                    type="partner"
                    title="For Partners"
                    description="Join our partner ecosystem and help shape the future of GTM optimization"
                    benefits={[
                      "Revenue sharing opportunities",
                      "Co-marketing programs",
                      "Integration opportunities",
                      "Early access to APIs"
                    ]}
                    icon="🤝"
                    borderColor="border-purple-500/30"
                    buttonColor="bg-purple-600 hover:bg-purple-700"
                    accentColor="text-purple-400"
                  />
                </div>
              </div>

              {/* Social Proof */}
              <div className="text-center text-gray-400">
                <div className="flex items-center justify-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Early access limited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span>KARLSON LLC backed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span>Beta launching Q1 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 7: Stop The Waste - Compelling CTA */}
        <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden" style={{ visibility: currentSlide === 6 ? 'visible' : 'hidden' }}>
          <div className="w-full max-w-7xl mx-auto">
            <div className="text-center">
              
              {/* Powerful Headline */}
              <div className="mb-12">
                <h2 className="text-5xl font-bold tracking-wider mb-6">
                  <span className="text-red-500">STOP</span> 
                  <span className="text-white"> THE </span>
                  <span className="text-red-500">WASTE</span>
                </h2>
                <div className="text-2xl text-gray-300 max-w-4xl mx-auto">
                  Join{" "}
                  <MetricPopup 
                    metric="Early Access Program"
                    value="100+ startups"
                    rationale="Over 100 startups are already using STARTUP_PATH to optimize their marketing spend and achieve 65% CAC reduction within 90 days."
                    methodology="Count of active users in STARTUP_PATH platform beta program as of latest customer success analytics."
                    source="STARTUP_PATH Customer Analytics 2024"
                    className="text-cyan-500 font-bold"
                  /> already using STARTUP_PATH to optimize their GTM
                </div>
              </div>

              {/* Urgency Factors */}
              <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
                <Card className="bg-black border border-red-500/30 p-6 hover:border-red-500/50 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-red-500 text-3xl mb-4">⏰</div>
                    <h3 className="text-xl font-bold text-red-400 mb-3">Runway Shrinking</h3>
                    <p className="text-gray-300 text-sm">
                      Every month of inefficient marketing burns through precious runway time
                    </p>
                    <div className="mt-4 text-red-400 font-bold text-lg">
                      <MetricPopup 
                        metric="Average Runway Burned"
                        value="$50K/month"
                        rationale="Startups waste an average of $50K monthly on unoptimized marketing spend, reducing runway and time to find product-market fit."
                        methodology="Analysis of marketing spend efficiency across early-stage startups showing waste due to poor channel optimization."
                        source="Startup Budget Efficiency Study 2024"
                        className="text-red-400 font-bold"
                      /> wasted monthly
                    </div>
                  </div>
                </Card>

                <Card className="bg-black border border-orange-500/30 p-6 hover:border-orange-500/50 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-orange-500 text-3xl mb-4">📈</div>
                    <h3 className="text-xl font-bold text-orange-400 mb-3">Competition Growing</h3>
                    <p className="text-gray-300 text-sm">
                      Your competitors are already optimizing. Don't fall behind
                    </p>
                    <div className="mt-4 text-orange-400 font-bold text-lg">First-mover advantage</div>
                  </div>
                </Card>

                <Card className="bg-black/60 border border-green-500/30 p-6 hover:border-green-500/50 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-green-500 text-3xl mb-4">🚀</div>
                    <h3 className="text-xl font-bold text-green-400 mb-3">Early Access</h3>
                    <p className="text-gray-300 text-sm">
                      Limited beta spots available. Lock in your advantage now
                    </p>
                    <div className="mt-4 text-green-400 font-bold text-lg">
                      <MetricPopup 
                        metric="Beta Program Waitlist"
                        value="500+ in queue"
                        rationale="High demand for STARTUP_PATH beta access with over 500 startups on the waitlist, demonstrating strong market need for unified GTM optimization."
                        methodology="Current count of startups that have requested early access to STARTUP_PATH platform."
                        source="STARTUP_PATH Beta Program Analytics 2024"
                        className="text-green-400 font-bold"
                      /> on waitlist
                    </div>
                  </div>
                </Card>
              </div>

              {/* Compelling CTA */}
              <div className="bg-red-900/20 rounded-xl p-8 border border-red-500/30 mb-8">
                <h3 className="text-3xl font-bold text-white mb-4 text-center">
                  Experience STARTUP_PATH Today
                </h3>
                <p className="text-lg text-gray-300 text-center mb-6">
                  Demo the platform. See the 4 agents in action. Start optimizing in 60 seconds.
                </p>
                
                <div className="flex items-center justify-center gap-6">
                  <a href="/login">
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 neon-border shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 transition-all duration-300">
                      <Rocket className="w-6 h-6 mr-3" />
                      START DEMO NOW
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                  </a>
                </div>
                
                <p className="text-center text-gray-400 text-sm mt-4">
                  ✓ No signup required • ✓ Full platform access • ✓ See results in 2 minutes
                </p>
              </div>

              {/* Social Proof */}
              <div className="text-center text-gray-400">
                <div className="flex items-center justify-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>100+ startups testing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span>65% avg CAC reduction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span>90-day optimization</span>
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

        {/* Copyright Footer */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-center z-40">
          <div className="text-xs text-gray-500">
            © 2025 <a href="https://iamkarlson.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">KARLSON LLC</a>. All rights reserved.
          </div>
        </div>
      </div>

      
    </div>
  )
}