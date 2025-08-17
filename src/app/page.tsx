'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Satellite
} from 'lucide-react'

const slides = [
  { id: 'hero', title: 'Mission Control', icon: Rocket },
  { id: 'problem', title: 'The Void', icon: Orbit },
  { id: 'solution', title: 'Your Station', icon: Satellite },
  { id: 'features', title: 'Systems', icon: Zap },
  { id: 'results', title: 'Victory', icon: Star },
  { id: 'cta', title: 'Launch', icon: Rocket }
]

// Pre-generated deterministic positions for hyperdrive lines
const hyperdriveLines = Array.from({ length: 50 }, (_, i) => ({
  left: (i * 7.3) % 100,
  top: (i * 11.7) % 100,
  delay: (i * 0.3) % 3,
  duration: 8 + (i % 4),
  rotation: -45 + (i * 23) % 90
}))

// Pre-generated deterministic positions for stars
const distantStars = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 13.7) % 100,
  top: (i * 19.3) % 100,
  delay: (i * 0.8) % 8,
  duration: 15 + (i % 10)
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
      {/* Hyperdrive Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Hyperdrive streaming lines */}
        <div className="hyperdrive-container">
          {hyperdriveLines.map((line, i) => (
            <div
              key={`line-${i}`}
              className="hyperdrive-line"
              style={{
                left: `${line.left}%`,
                top: `${line.top}%`,
                animationDelay: `${line.delay}s`,
                animationDuration: `${line.duration}s`,
                transform: `rotate(${line.rotation}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Elegant nebula formations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/30 to-transparent rounded-full filter blur-[120px] animate-drift-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[300px] bg-gradient-to-l from-blue-500/25 to-transparent rounded-full filter blur-[100px] animate-drift-slower" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[200px] bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-transparent rounded-full filter blur-[140px] animate-drift-slowest" />
        </div>

        {/* Distant stars - minimal and calm */}
        <div className="absolute inset-0">
          {distantStars.map((star, i) => (
            <div
              key={`star-${i}`}
              className="distant-star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Startup_Path</span>
            <span className="text-xs text-purple-300 font-mono">SPACE COMMAND</span>
          </div>
          
          <a href="/login">
            <Button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20">
              <LogIn className="w-4 h-4 mr-2" />
              Mission Login
            </Button>
          </a>
        </div>
      </header>

      {/* Slide Container - Enhanced Rolling Deck */}
      <div 
        ref={containerRef}
        className="absolute inset-0 flex transition-all duration-1200 ease-out"
        style={{ 
          transform: `translateX(-${currentSlide * 100}%) perspective(1000px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Slide 1: Hero */}
        <div className="min-w-full h-full flex items-center justify-center px-8">
          <div className="max-w-6xl mx-auto text-center z-10">
            <div className="space-y-8 mb-12">
              <h1 className="text-7xl font-bold text-white leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Your Startup
                </span>
                <br />
                <span className="text-white mt-4 block">Is Startup_Path</span>
              </h1>
              <p className="text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed mt-8">
                Navigate the cosmos of distribution channels.<br/>
                Find your orbit. Achieve escape velocity.
              </p>
            </div>
            
            <div className="mb-12">
              <SpaceStationVisualization />
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <Button 
                onClick={nextSlide}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl px-12 py-6 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Begin Mission
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <div className="flex items-center gap-3 text-purple-300 text-lg">
                <Sparkles className="w-5 h-5" />
                <span>Join 500+ startups achieving orbit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2: Problem */}
        <div className="min-w-full h-full flex items-center justify-center px-8">
          <div className="max-w-6xl mx-auto z-10">
            <div className="text-center mb-16">
              <h2 className="text-7xl font-bold text-white mb-8">
                Lost in The Void
              </h2>
              <p className="text-3xl text-purple-200 leading-relaxed">
                87% of startups drift aimlessly through distribution space
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-10">
              <Card className="bg-red-900/20 backdrop-blur-sm border-red-500/30 p-10 hover:border-red-400/50 transition-all duration-300 hover:scale-105 group">
                <div className="text-red-400 text-6xl mb-6 group-hover:animate-pulse flex justify-center">⚠️</div>
                <h3 className="text-2xl font-bold text-red-300 mb-4 text-center">Burning Fuel</h3>
                <p className="text-red-200 text-lg leading-relaxed text-center">$50K/month on channels that don't convert</p>
              </Card>
              
              <Card className="bg-orange-900/20 backdrop-blur-sm border-orange-500/30 p-10 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 group">
                <div className="text-orange-400 text-6xl mb-6 group-hover:animate-pulse flex justify-center">📉</div>
                <h3 className="text-2xl font-bold text-orange-300 mb-4 text-center">No Navigation</h3>
                <p className="text-orange-200 text-lg leading-relaxed text-center">Guessing which channels will reach your ICP</p>
              </Card>
              
              <Card className="bg-yellow-900/20 backdrop-blur-sm border-yellow-500/30 p-10 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 group">
                <div className="text-yellow-400 text-6xl mb-6 group-hover:animate-pulse flex justify-center">⏰</div>
                <h3 className="text-2xl font-bold text-yellow-300 mb-4 text-center">Time Decay</h3>
                <p className="text-yellow-200 text-lg leading-relaxed text-center">18 months runway, no PMF in sight</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Slide 3: Solution */}
        <div className="min-w-full h-full flex items-center justify-center px-8">
          <div className="max-w-6xl mx-auto z-10">
            <div className="text-center mb-16">
              <h2 className="text-7xl font-bold text-white mb-8">
                Your Distribution <span className="text-cyan-400">Startup_Path</span>
              </h2>
              <p className="text-3xl text-blue-200 leading-relaxed">
                AI-powered command center with channels in perfect orbit
              </p>
            </div>
            
            <div className="relative h-[400px] mb-16">
              <SpaceStationVisualization detailed={true} />
            </div>
            
            <div className="flex justify-center gap-20">
              <div className="text-center group hover:scale-110 transition-transform">
                <div className="text-6xl font-bold text-purple-400 mb-4">8</div>
                <div className="text-xl text-purple-200">Active Channels</div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform">
                <div className="text-6xl font-bold text-blue-400 mb-4">14</div>
                <div className="text-xl text-blue-200">Day Cycles</div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform">
                <div className="text-6xl font-bold text-cyan-400 mb-4">87%</div>
                <div className="text-xl text-cyan-200">Faster PMF</div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 4: Features */}
        <div className="min-w-full h-full flex items-center justify-center px-8">
          <div className="max-w-6xl mx-auto z-10">
            <div className="text-center mb-16">
              <h2 className="text-7xl font-bold text-white mb-8">
                Station <span className="text-purple-400">Systems</span>
              </h2>
              <p className="text-3xl text-blue-200 leading-relaxed">
                4 AI Officers commanding your growth trajectory
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-12">
              <Card className="bg-purple-900/20 backdrop-blur-sm border-purple-500/30 p-10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mr-6 group-hover:shadow-lg group-hover:shadow-purple-500/30">
                    <Satellite className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-300">Channel Scout</h3>
                    <p className="text-purple-200 text-lg">Navigation Officer</p>
                  </div>
                </div>
                <p className="text-purple-100 text-lg leading-relaxed">Discovers optimal distribution orbits using GPT-4 analysis</p>
              </Card>
              
              <Card className="bg-blue-900/20 backdrop-blur-sm border-blue-500/30 p-10 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-6 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-300">Offer Alchemist</h3>
                    <p className="text-blue-200 text-lg">Communications Officer</p>
                  </div>
                </div>
                <p className="text-blue-100 text-lg leading-relaxed">Crafts messages that resonate across the cosmos</p>
              </Card>
              
              <Card className="bg-cyan-900/20 backdrop-blur-sm border-cyan-500/30 p-10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center mr-6 group-hover:shadow-lg group-hover:shadow-cyan-500/30">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-300">Signal Wrangler</h3>
                    <p className="text-cyan-200 text-lg">Data Officer</p>
                  </div>
                </div>
                <p className="text-cyan-100 text-lg leading-relaxed">Analyzes signals from across distribution space</p>
              </Card>
              
              <Card className="bg-indigo-900/20 backdrop-blur-sm border-indigo-500/30 p-10 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center mr-6 group-hover:shadow-lg group-hover:shadow-indigo-500/30">
                    <Orbit className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-indigo-300">Budget Captain</h3>
                    <p className="text-indigo-200 text-lg">Resource Officer</p>
                  </div>
                </div>
                <p className="text-indigo-100 text-lg leading-relaxed">Optimizes fuel allocation across all channels</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Slide 5: Results */}
        <div className="min-w-full h-full flex items-center justify-center px-8">
          <div className="max-w-6xl mx-auto z-10">
            <div className="text-center mb-12">
              <h2 className="text-7xl font-bold text-white mb-6">
                Mission <span className="text-green-400">Success</span>
              </h2>
              <p className="text-3xl text-green-200">
                Startups achieving escape velocity
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 mb-12">
              <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/20 backdrop-blur-sm border-green-500/40 p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 group shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-green-300 text-lg mb-3 font-bold tracking-wide">TechStart Industries</p>
                    <p className="text-green-100 text-2xl leading-relaxed">"Reduced CAC by 62% in 6 weeks"</p>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="text-green-400 text-sm">B2B SaaS</div>
                      <div className="text-green-400 text-sm">•</div>
                      <div className="text-green-400 text-sm">Series A</div>
                      <div className="text-green-400 text-sm">•</div>
                      <div className="text-green-400 text-sm">$50M ARR</div>
                    </div>
                  </div>
                  <div className="text-green-400 text-6xl group-hover:animate-bounce ml-8">🚀</div>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-900/25 to-cyan-900/15 backdrop-blur-sm border-blue-500/30 p-8 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 group shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-blue-300 text-lg mb-3 font-bold tracking-wide">DataFlow Systems</p>
                    <p className="text-blue-100 text-2xl leading-relaxed">"Found PMF 10x faster than expected"</p>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="text-blue-400 text-sm">Data Analytics</div>
                      <div className="text-blue-400 text-sm">•</div>
                      <div className="text-blue-400 text-sm">Seed</div>
                      <div className="text-blue-400 text-sm">•</div>
                      <div className="text-blue-400 text-sm">$5M ARR</div>
                    </div>
                  </div>
                  <div className="text-blue-400 text-6xl group-hover:animate-pulse ml-8">🛸</div>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-900/25 to-indigo-900/15 backdrop-blur-sm border-purple-500/30 p-8 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 group shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-purple-300 text-lg mb-3 font-bold tracking-wide">CloudSaaS Ventures</p>
                    <p className="text-purple-100 text-2xl leading-relaxed">"12-month payback from 36 months"</p>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="text-purple-400 text-sm">Infrastructure</div>
                      <div className="text-purple-400 text-sm">•</div>
                      <div className="text-purple-400 text-sm">Series B</div>
                      <div className="text-purple-400 text-sm">•</div>
                      <div className="text-purple-400 text-sm">$100M ARR</div>
                    </div>
                  </div>
                  <div className="text-purple-400 text-6xl group-hover:animate-spin ml-8">🌟</div>
                </div>
              </Card>
            </div>
            
            <div className="text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
              <div className="text-5xl font-bold text-white mb-4">
                500+ Startups in Orbit
              </div>
              <p className="text-2xl text-blue-200">Join the mission today</p>
            </div>
          </div>
        </div>

        {/* Slide 6: CTA */}
        <div className="min-w-full h-full flex items-center justify-center px-8">
          <div className="max-w-5xl mx-auto text-center space-y-10 z-10">
            <div className="space-y-6">
              <h2 className="text-7xl font-bold text-white">
                Ready for <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">Launch?</span>
              </h2>
              <p className="text-3xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                Your Startup_Path awaits. Your channels are ready to orbit.
              </p>
            </div>
            
            <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl border-white/30 p-10 max-w-2xl mx-auto shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="space-y-6">
                <p className="text-2xl text-white font-semibold mb-6">Begin Your Mission</p>
                <div className="flex">
                  <Input
                    type="email"
                    placeholder="captain@startup.space"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/15 border-white/30 text-white placeholder:text-white/60 text-lg py-6 px-4 rounded-r-none focus:bg-white/20 focus:border-white/40"
                  />
                  <Button className="rounded-l-none bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 text-lg px-8 py-6 shadow-lg">
                    Launch
                    <Rocket className="w-5 h-5 ml-3" />
                  </Button>
                </div>
                
                <div className="text-center space-y-2 pt-4">
                  <p className="text-lg text-purple-200 font-semibold">14-day free flight</p>
                  <p className="text-base text-blue-200">No credit card • Cancel anytime • Full access</p>
                </div>
              </div>
            </Card>
            
            <div className="space-y-6">
              <div className="flex justify-center gap-6">
                <a href="/login">
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 text-lg px-8 py-5 shadow-lg hover:scale-105">
                    <LogIn className="w-5 h-5 mr-3" />
                    Crew Login
                  </Button>
                </a>
                <a href="/dashboard">
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 text-lg px-8 py-5 shadow-lg hover:scale-105">
                    <Sparkles className="w-5 h-5 mr-3" />
                    View Demo Startup_Path
                  </Button>
                </a>
              </div>
              
              <div className="flex justify-center gap-8 pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400">500+</div>
                  <div className="text-sm text-purple-200">Active Missions</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400">87%</div>
                  <div className="text-sm text-blue-200">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-400">14d</div>
                  <div className="text-sm text-cyan-200">Avg to PMF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center space-x-8">
          {/* Previous button */}
          <Button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 disabled:opacity-30"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {/* Breadcrumb navigation */}
          <div className="flex items-center space-x-4">
            {slides.map((slide, index) => {
              const Icon = slide.icon
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`
                    relative group transition-all duration-300
                    ${index === currentSlide ? 'scale-125' : 'hover:scale-110'}
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${index === currentSlide 
                      ? 'bg-gradient-to-br from-purple-500 to-cyan-500' 
                      : 'bg-white/10 border border-white/20'
                    }
                  `}>
                    <Icon className={`w-5 h-5 ${index === currentSlide ? 'text-white' : 'text-white/60'}`} />
                  </div>
                  <span className={`
                    absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap
                    ${index === currentSlide ? 'text-white' : 'text-white/40'}
                  `}>
                    {slide.title}
                  </span>
                  
                  {/* Connection line to next */}
                  {index < slides.length - 1 && (
                    <div className={`
                      absolute top-1/2 left-full w-4 h-px
                      ${index < currentSlide ? 'bg-purple-400' : 'bg-white/20'}
                    `} />
                  )}
                </button>
              )
            })}
          </div>
          
          {/* Next button */}
          <Button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 disabled:opacity-30"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-8 right-8 text-white/40 text-sm">
        Use ← → arrows or click to navigate
      </div>

      <style jsx>{`
        .hyperdrive-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .hyperdrive-line {
          position: absolute;
          width: 2px;
          height: 100px;
          background: linear-gradient(to bottom, transparent, rgba(147, 51, 234, 0.6), transparent);
          animation: hyperdriveStream linear infinite;
          transform-origin: top;
        }
        
        .distant-star {
          position: absolute;
          width: 1px;
          height: 1px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: gentleTwinkle ease-in-out infinite;
        }
        
        @keyframes hyperdriveStream {
          0% { 
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
          10% { 
            opacity: 1; 
          }
          90% { 
            opacity: 1; 
          }
          100% { 
            transform: translateY(100vh) scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes gentleTwinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes drift-slow {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(30px) translateY(-20px); }
          66% { transform: translateX(-20px) translateY(30px); }
        }
        
        @keyframes drift-slower {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(-40px) translateY(20px) rotate(180deg); }
        }
        
        @keyframes drift-slowest {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(20px) translateY(-30px); }
          75% { transform: translateX(-30px) translateY(15px); }
        }
        
        /* Enhanced slide deck animations */
        .slide-container {
          animation: slideAppear 0.8s ease-out;
        }
        
        @keyframes slideAppear {
          0% { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Floating element enhancements */
        .floating-enhanced {
          animation: floatEnhanced 6s ease-in-out infinite;
        }
        
        @keyframes floatEnhanced {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(4px) rotate(-0.5deg); }
        }
      `}</style>
    </div>
  )
}