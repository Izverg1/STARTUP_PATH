'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Rocket, Lock, Mail } from 'lucide-react'

// Pre-generated deterministic positions for hyperdrive lines
const hyperdriveLines = Array.from({ length: 30 }, (_, i) => ({
  left: (i * 11.3) % 100,
  top: (i * 13.7) % 100,
  delay: (i * 0.4) % 3,
  duration: 8 + (i % 4),
  rotation: -45 + (i * 31) % 90
}))

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Fake user credentials
  const FAKE_USER = {
    email: 'demo@startuply.space',
    password: 'demo123'
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      // Store auth in localStorage
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', email)
      
      // Redirect to command center
      router.push('/dashboard')
    } else {
      setError('Invalid credentials. Use demo@startuply.space / demo123')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hyperdrive Background */}
      <div className="absolute inset-0">
        {/* Hyperdrive streaming lines */}
        <div className="absolute inset-0">
          {hyperdriveLines.map((line, i) => (
            <div
              key={`line-${i}`}
              className="absolute w-2 h-24 bg-gradient-to-b from-transparent via-purple-500/60 to-transparent"
              style={{
                left: `${line.left}%`,
                top: `${line.top}%`,
                animationDelay: `${line.delay}s`,
                animationDuration: `${line.duration}s`,
                transform: `rotate(${line.rotation}deg)`,
                animation: 'hyperdriveStream linear infinite'
              }}
            />
          ))}
        </div>
        
        {/* Nebula clouds */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-gradient-to-r from-purple-500/30 to-transparent rounded-full filter blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-gradient-to-l from-blue-500/25 to-transparent rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[200px] bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-transparent rounded-full filter blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <div className="p-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300" style={{ boxShadow: '0 25px 50px rgba(147, 51, 234, 0.5)' }}>
                <Rocket className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Mission Control</h1>
              <p className="text-blue-200">Access your Startup_Path Command Center</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <Input
                    type="email"
                    placeholder="pilot@startuply.space"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:bg-white/20"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <Input
                    type="password"
                    placeholder="Access code"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:bg-white/20"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Launching...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Launch Mission
                    <Rocket className="w-5 h-5 ml-2" />
                  </div>
                )}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 backdrop-blur-sm">
              <p className="text-blue-200 text-sm text-center">
                Test Pilot Credentials:<br />
                <span className="text-white font-mono">demo@startuply.space / demo123</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <style jsx>{`
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
      `}</style>
    </div>
  )
}