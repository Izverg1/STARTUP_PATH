'use client'

import { useEffect, useState } from 'react'

const channels = [
  { name: 'Google Ads', icon: '🔍', color: '#8B5CF6', size: 'lg', glow: '#8B5CF6' },
  { name: 'LinkedIn', icon: '💼', color: '#6366F1', size: 'md', glow: '#6366F1' },
  { name: 'Email', icon: '📧', color: '#A855F7', size: 'md', glow: '#A855F7' },
  { name: 'Facebook', icon: '👥', color: '#EC4899', size: 'lg', glow: '#EC4899' },
  { name: 'Content', icon: '📝', color: '#8B5CF6', size: 'sm', glow: '#8B5CF6' },
  { name: 'SEO', icon: '🎯', color: '#6366F1', size: 'md', glow: '#6366F1' },
  { name: 'Webinars', icon: '🎥', color: '#A855F7', size: 'lg', glow: '#A855F7' },
  { name: 'Partners', icon: '🤝', color: '#EC4899', size: 'sm', glow: '#EC4899' },
]

export function ChannelOrbitCSS() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-[700px] bg-gradient-purple-dark rounded-3xl" />
  }

  return (
    <div className="w-full h-[700px] relative overflow-hidden bg-gradient-purple-dark rounded-3xl perspective-1000">
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-pink-900/20 animate-pulse-glow" />
      
      {/* Ambient background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={`bg-particle-${i}`}
            className="absolute w-px h-px bg-purple-400/30 rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>
      
      {/* Central hub with 3D effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative transform-gpu">
          {/* Central core with intense glow */}
          <div className="w-40 h-40 relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 w-40 h-40 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-full blur-xl animate-pulse-glow" />
            
            {/* Inner core */}
            <div className="absolute inset-6 w-28 h-28 glass-card border-purple-400/30 flex flex-col items-center justify-center text-white animate-scale-pulse glow-purple">
              <div className="text-4xl font-bold text-glow">20k+</div>
              <div className="text-sm opacity-90 text-purple-200">Channels</div>
              
              {/* Core pulse effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl animate-pulse" />
            </div>
          </div>
          
          {/* 3D Orbital rings with perspective */}
          <div className="absolute inset-0 -m-20 w-80 h-80">
            <div className="w-full h-full border-2 border-purple-400/20 rounded-full animate-rotate-slow transform-gpu" 
                 style={{ transform: 'rotateX(75deg) rotateY(0deg)' }} />
          </div>
          <div className="absolute inset-0 -m-28 w-96 h-96">
            <div className="w-full h-full border border-indigo-400/15 rounded-full animate-spin-slower transform-gpu" 
                 style={{ transform: 'rotateX(60deg) rotateY(45deg)' }} />
          </div>
          <div className="absolute inset-0 -m-36 w-112 h-112">
            <div className="w-full h-full border border-pink-400/10 rounded-full animate-spin-slowest transform-gpu" 
                 style={{ transform: 'rotateX(45deg) rotateY(90deg)' }} />
          </div>
        </div>
      </div>

      {/* Orbiting channels with glowing orbs */}
      <div className="absolute inset-0">
        {channels.map((channel, index) => {
          const angle = (360 / channels.length) * index
          const radius = 220 + (index % 3) * 50
          const duration = 25 + (index % 3) * 8
          
          return (
            <div key={channel.name}>
              {/* Orbital path indicator */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  width: `${radius * 2}px`,
                  height: `${radius * 2}px`,
                }}
              >
                <div className="w-full h-full border border-purple-300/10 rounded-full" />
              </div>
              
              {/* Channel orb */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  animation: `orbit-${index} ${duration}s linear infinite`,
                }}
              >
                <div
                  className={`
                    relative flex flex-col items-center justify-center transform-gpu
                    ${channel.size === 'sm' ? 'w-18 h-18' : channel.size === 'lg' ? 'w-28 h-28' : 'w-24 h-24'}
                    glass-card border-white/20 hover:border-white/40
                    transition-all duration-500 hover:scale-125 cursor-pointer
                    group
                  `}
                  style={{
                    transform: `translateX(${radius}px) rotate(${angle}deg)`,
                    animation: `float-${index} 4s ease-in-out infinite`,
                    animationDelay: `${index * 0.3}s`,
                    boxShadow: `0 0 30px ${channel.glow}40, 0 0 60px ${channel.glow}20`,
                  }}
                >
                  {/* Glowing background orb */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle, ${channel.glow}30 0%, ${channel.glow}10 50%, transparent 100%)`,
                    }}
                  />
                  
                  {/* Icon */}
                  <div 
                    className="text-3xl mb-1 relative z-10 group-hover:scale-110 transition-transform duration-300"
                    style={{ 
                      transform: `rotate(-${angle}deg)`,
                      filter: `drop-shadow(0 0 8px ${channel.glow})`,
                    }}
                  >
                    {channel.icon}
                  </div>
                  
                  {/* Channel name */}
                  <div 
                    className="text-[11px] font-bold text-white/90 text-center px-2 relative z-10 group-hover:text-white transition-colors duration-300"
                    style={{ 
                      transform: `rotate(-${angle}deg)`,
                      textShadow: `0 0 10px ${channel.glow}`,
                    }}
                  >
                    {channel.name}
                  </div>
                  
                  {/* Particle trail */}
                  <div 
                    className="absolute w-1 h-1 rounded-full opacity-70"
                    style={{
                      background: channel.glow,
                      boxShadow: `0 0 6px ${channel.glow}, 0 0 12px ${channel.glow}40`,
                      right: '120%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  />
                  
                  {/* Energy connection to center */}
                  <div 
                    className="absolute w-0.5 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
                    style={{
                      height: `${radius}px`,
                      right: '50%',
                      bottom: '100%',
                      transformOrigin: 'bottom',
                      transform: `rotate(${180 - angle}deg)`,
                      background: `linear-gradient(to top, transparent 0%, ${channel.glow}60 30%, ${channel.glow}40 70%, transparent 100%)`,
                      boxShadow: `0 0 4px ${channel.glow}`,
                    }}
                  />
                  
                  {/* Hover glow enhancement */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      boxShadow: `0 0 40px ${channel.glow}60, 0 0 80px ${channel.glow}30`,
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating info cards */}
      <div className="absolute top-8 left-8 space-y-4 z-30">
        <div className="glass-card p-6 max-w-sm">
          <h2 className="text-2xl font-bold text-white text-glow mb-2">
            Neural Channel Network
          </h2>
          <p className="text-purple-200/80 text-sm leading-relaxed">
            AI-powered distribution channels optimizing in real-time through quantum-enhanced algorithms
          </p>
        </div>
        
        <div className="glass-card p-4 w-48 glow-purple">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-200 text-sm">Active Channels</span>
            <span className="text-white font-bold text-lg text-glow">{channels.length}</span>
          </div>
          <div className="h-1 bg-purple-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse" 
                 style={{ width: '87%' }} />
          </div>
        </div>
      </div>

      {/* Performance metrics card */}
      <div className="absolute top-8 right-8 space-y-4 z-30">
        <div className="glass-card p-4 w-56">
          <h3 className="text-white font-semibold mb-3 text-glow">Performance Matrix</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-200 text-sm">CAC Optimization</span>
              <span className="text-green-400 font-bold">+45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-200 text-sm">Channel Efficiency</span>
              <span className="text-blue-400 font-bold">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-200 text-sm">Neural Score</span>
              <span className="text-purple-400 font-bold">9.4/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced particle system */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full animate-float"
            style={{
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
              background: `${['#8B5CF6', '#6366F1', '#A855F7', '#EC4899'][Math.floor(Math.random() * 4)]}${Math.floor(20 + Math.random() * 40).toString(16)}`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              boxShadow: `0 0 ${2 + Math.random() * 4}px currentColor`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-slower {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        @keyframes spin-slowest {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        ${channels.map((_, index) => {
          const angle = (360 / channels.length) * index
          return `
            @keyframes orbit-${index} {
              from { transform: translate(-50%, -50%) rotate(${angle}deg); }
              to { transform: translate(-50%, -50%) rotate(${angle + 360}deg); }
            }
            
            @keyframes float-${index} {
              0%, 100% { transform: translateX(${200 + (index % 3) * 40}px) rotate(${angle}deg) translateY(0); }
              50% { transform: translateX(${200 + (index % 3) * 40}px) rotate(${angle}deg) translateY(-5px); }
            }
          `
        }).join('\n')}
      `}</style>
    </div>
  )
}