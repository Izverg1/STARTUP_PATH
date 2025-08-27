'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Rocket, Lock, Mail, TrendingUp, DollarSign, BarChart3, Zap, Target, Brain, AlertCircle } from 'lucide-react'
import { LoadingTransition } from '@/components/LoadingTransition'
import { useAuth } from '@/contexts/AuthContext'
import { sanitizeAuthError } from '@/lib/utils/errorHandler'

// Channel logo components
const GoogleAdsLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const LinkedInLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path fill="#0077B5" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const FacebookLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const SlackLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path fill="#4A154B" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
)

const HubSpotLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path fill="#FF7A59" d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067c0 .843.482 1.591 1.212 1.956v2.844a6.96 6.96 0 00-4.193-1.388 6.986 6.986 0 00-6.275 3.874l-.016-.008-3.022-1.259a1.397 1.397 0 00-.307-1.727 1.413 1.413 0 00-1.987 0 1.413 1.413 0 000 1.988c.436.436 1.056.548 1.604.34l2.89 1.204a6.95 6.95 0 00-.88 3.392A6.987 6.987 0 0011 21.49a6.987 6.987 0 006.986-6.985 6.962 6.962 0 00-2.822-5.575v-.001zM11 18.603a4.097 4.097 0 01-4.093-4.093A4.097 4.097 0 0111 10.417a4.097 4.097 0 014.093 4.093A4.097 4.097 0 0111 18.603z"/>
  </svg>
)

const MailchimpLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path fill="#FFE01B" d="M11.267 0L0 6.088v12.48L11.267 24l11.267-5.432V6.088zm7.133 16.773l-.009.002-.009.003c-.145.056-.301.09-.462.099a1.26 1.26 0 01-.818-.256 1.815 1.815 0 01-.294-.279l-.537.479c-.435.389-.963.641-1.541.736a3.47 3.47 0 01-.737.012c-.405-.038-.767-.168-1.057-.371-.208.163-.46.281-.739.336a2.592 2.592 0 01-1.64-.232 2.373 2.373 0 01-.852-.731c-.522-.782-.52-1.838.004-2.616.436-.645 1.155-1.103 1.968-1.257.328-.062.643-.065.937-.015-.061-.605.074-1.175.378-1.596.306-.422.748-.692 1.243-.759a1.78 1.78 0 011.042.148c.297.146.53.369.669.637.045-.047.092-.092.142-.134.329-.277.754-.423 1.195-.41.44.013.853.177 1.16.46.308.285.488.678.505 1.105.024.605-.275 1.193-.82 1.613-.079.061-.162.117-.248.168.278.161.518.389.696.668.21.326.329.713.343 1.125.013.412-.082.821-.275 1.178a1.737 1.737 0 01-.91.785zm-2.551-4.943c-.23.153-.358.419-.341.71.056.008.111.019.166.032.22-.233.368-.519.427-.829a.84.84 0 00-.252.087z"/>
  </svg>
)

const TwitterLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path fill="#1DA1F2" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
)

const WebinarLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <rect fill="#9333EA" x="2" y="4" width="20" height="14" rx="2"/>
    <polygon fill="white" points="10,8 16,12 10,16"/>
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('user@startuppath.ai')
  const [password, setPassword] = useState('demo123')
  const [isClient, setIsClient] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to dashboard')
      setShowTransition(true)
    }
    
    // Clear any existing errors when component mounts
    setError(null)
    
    // Debug: Log auth loading state
    console.log('Auth state:', { isAuthenticated, loading })
  }, [isAuthenticated, loading])

  // Force debug check - if loading persists for too long, something is wrong
  useEffect(() => {
    if (isClient) {
      const debugTimeout = setTimeout(() => {
        if (loading && !isAuthenticated) {
          console.error('🚨 LOGIN DEBUG: Auth loading state stuck! This indicates an issue with the AuthContext initialization.')
          console.error('Current state:', { loading, isAuthenticated, pathname: window.location.pathname })
        }
      }, 3000)
      
      return () => clearTimeout(debugTimeout)
    }
  }, [isClient, loading, isAuthenticated])

  // Professional authentication flow
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLocalLoading(true)
    
    console.log('🔐 Starting login process...')
    
    try {
      await login(email, password)
      // Success - show professional transition
      console.log('✅ Login completed, showing transition')
      setLocalLoading(false)
      setShowTransition(true)
    } catch (err) {
      // Log technical details to console for debugging (dev only)
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Login failed:', err)
      }
      
      // Use utility function to get clean, user-friendly error message
      const errorMessage = sanitizeAuthError(err);
      
      setError(errorMessage)
      setLocalLoading(false)
    }
  }

  const handleTransitionComplete = () => {
    router.push('/dashboard/projects')
  }

  const channelLogos = [
    { component: GoogleAdsLogo, name: 'Google Ads' },
    { component: LinkedInLogo, name: 'LinkedIn' },
    { component: FacebookLogo, name: 'Facebook' },
    { component: SlackLogo, name: 'Slack' },
    { component: HubSpotLogo, name: 'HubSpot' },
    { component: MailchimpLogo, name: 'Mailchimp' },
    { component: TwitterLogo, name: 'Twitter' },
    { component: WebinarLogo, name: 'Webinars' }
  ]

  // Metrics that rain down
  const metrics = [
    { label: 'CAC', value: '$680', icon: DollarSign, color: 'text-green-400' },
    { label: 'ROI', value: '240%', icon: TrendingUp, color: 'text-cyan-400' },
    { label: 'CPQM', value: '$300', icon: Target, color: 'text-purple-400' },
    { label: 'Conv', value: '3.2%', icon: BarChart3, color: 'text-yellow-400' },
    { label: 'Opt', value: 'AI', icon: Brain, color: 'text-pink-400' },
    { label: 'Perf', value: '4x', icon: Zap, color: 'text-orange-400' }
  ]

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (showTransition) {
    return <LoadingTransition onComplete={handleTransitionComplete} />
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Storm Background */}
      <div className="absolute inset-0">
        
        {/* Dark storm clouds background */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Animated storm grid */}
        <div className="absolute inset-0"
             style={{
               backgroundImage: `
                 linear-gradient(rgba(255, 0, 64, 0.02) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px)
               `,
               backgroundSize: '100px 100px',
               transform: 'perspective(800px) rotateX(60deg)',
               transformOrigin: 'center bottom',
               animation: 'storm-grid 15s ease-in-out infinite'
             }} />
        
        {/* Storm Vortex Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          
          {/* Storm eye - darker center */}
          <div className="absolute w-[400px] h-[400px] rounded-full"
               style={{
                 background: `
                   radial-gradient(circle at center, 
                     rgba(0, 0, 0, 0.95) 0%,
                     rgba(0, 0, 0, 0.8) 20%,
                     rgba(20, 20, 30, 0.6) 40%,
                     transparent 70%)
                 `,
                 boxShadow: `
                   inset 0 0 100px rgba(0, 0, 0, 1),
                   0 0 150px rgba(100, 100, 120, 0.2)
                 `,
                 animation: 'storm-eye 20s ease-in-out infinite'
               }} />
          
          {/* Swirling storm clouds */}
          <div className="absolute w-[900px] h-[900px] animate-storm-rotate">
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * Math.PI * 2
              const radius = 350 + (i % 3) * 50
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              
              return (
                <div
                  key={`cloud-${i}`}
                  className="absolute w-32 h-32"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                    background: `radial-gradient(circle, rgba(150, 150, 170, 0.1) 0%, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                    animation: `cloud-morph ${10 + i * 2}s ease-in-out infinite`
                  }}
                />
              )
            })}
          </div>
        </div>
        
        {/* Channel logos in storm vortex */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Spiraling channel logos */}
          <div className="absolute w-[800px] h-[800px] animate-vortex-spin">
            {channelLogos.map((logo, i) => {
              const angle = (i / channelLogos.length) * Math.PI * 2
              const baseRadius = 250
              const spiralOffset = (i * 30) % 100
              const radius = baseRadius + spiralOffset
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              const LogoComponent = logo.component
              
              return (
                <div
                  key={`logo-${i}`}
                  className="absolute"
                  style={{
                    '--x': `${x}px`,
                    '--y': `${y}px`,
                    '--r': `${angle * 180 / Math.PI}deg`,
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle * 180 / Math.PI}deg)`,
                    animation: `storm-float ${8 + i}s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`
                  } as React.CSSProperties}
                >
                  <div className="w-14 h-14 bg-white/80 rounded-xl p-2.5 shadow-2xl backdrop-blur-sm"
                       style={{
                         boxShadow: '0 10px 40px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.1)'
                       }}>
                    <LogoComponent />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Raining metrics */}
        {isClient && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 24 }, (_, i) => {
              const metricIndex = i % metrics.length
              const metric = metrics[metricIndex]
              const leftPos = ((i * 41 + 7) % 90) + 5
              const delay = (i * 1.3) % 10
              const duration = 12 + (i % 4) * 2
              const Icon = metric.icon
              
              return (
                <div
                  key={`metric-${i}`}
                  className="absolute flex items-center gap-2 opacity-0"
                  style={{
                    left: `${leftPos}%`,
                    top: '-10%',
                    animation: `rain-fall ${duration}s linear infinite`,
                    animationDelay: `${delay}s`
                  }}
                >
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 border border-gray-700/50">
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase">{metric.label}</span>
                      <span className={`text-sm font-bold ${metric.color}`}>{metric.value}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {/* Lightning flashes */}
        {isClient && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={`lightning-${i}`}
                className="absolute w-full h-full opacity-0"
                style={{
                  background: `linear-gradient(${120 * i}deg, transparent 48%, rgba(255,255,255,0.03) 50%, transparent 52%)`,
                  animation: `lightning-flash ${15 + i * 5}s ease-in-out infinite`,
                  animationDelay: `${i * 7}s`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Storm wind lines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={`wind-${i}`}
              className="absolute w-full h-[2px]"
              style={{
                top: `${20 + i * 15}%`,
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)`,
                animation: `wind-blow ${3 + i}s linear infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Login Card - Professional Style */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-black/80 backdrop-blur-xl border border-red-500/30 neon-border shadow-2xl hover:border-red-400/50 transition-all duration-300">
          <div className="p-6">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300 border border-red-400/30 neon-border">
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-2 neon-glow">
                STARTUP_PATH Platform
              </h1>
              <p className="text-gray-400">Access your optimization dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-black/40 border border-red-500/30 text-white placeholder:text-gray-400 focus:bg-black/60 focus:border-red-400/50 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-black/40 border border-red-500/30 text-white placeholder:text-gray-400 focus:bg-black/60 focus:border-red-400/50 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-300 text-sm bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                  <div className="text-xs text-red-200/80 pl-6">
                    <div className="mb-1">Demo credentials:</div>
                    <div>• Email: <span className="font-mono text-red-200">user@startuppath.ai</span></div>
                    <div>• Password: <span className="font-mono text-red-200">demo123</span></div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={localLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-300 neon-border"
              >
                {localLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign In
                    <Rocket className="w-4 h-4 ml-2" />
                  </div>
                )}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm">
              <p className="text-gray-300 text-sm text-center">
                Demo Credentials:<br />
                <span className="text-white font-mono text-xs">user@startuppath.ai / demo123</span>
              </p>
            </div>

            {/* Copyright footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                © 2025 <a href="https://iamkarlson.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">KARLSON LLC</a>. All rights reserved.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}