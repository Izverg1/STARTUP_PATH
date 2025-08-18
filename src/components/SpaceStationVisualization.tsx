'use client'

import { useEffect, useState, useRef } from 'react'

// Pre-generated deterministic positions for particles
const particlePositions = Array.from({ length: 15 }, (_, i) => ({
  left: (i * 17.3) % 100,
  top: (i * 23.7) % 100,
  delay: (i * 15) % 15,
  duration: 15 + (i % 20)
}))

interface Channel {
  id: string
  name: string
  icon: string
  color: string
  orbitRadius: number
  orbitSpeed: number
  size: number
  efficiency: number
}

const channels: Channel[] = [
  { id: '1', name: 'Google Ads', icon: '🔍', color: '#4285F4', orbitRadius: 160, orbitSpeed: 0.15, size: 55, efficiency: 87 },
  { id: '2', name: 'LinkedIn', icon: '💼', color: '#0077B5', orbitRadius: 200, orbitSpeed: 0.12, size: 50, efficiency: 72 },
  { id: '3', name: 'Email', icon: '📧', color: '#EA4335', orbitRadius: 140, orbitSpeed: 0.18, size: 45, efficiency: 65 },
  { id: '4', name: 'Facebook', icon: '👥', color: '#1877F2', orbitRadius: 240, orbitSpeed: 0.10, size: 52, efficiency: 78 },
  { id: '5', name: 'Content', icon: '📝', color: '#00C851', orbitRadius: 120, orbitSpeed: 0.20, size: 40, efficiency: 91 },
  { id: '6', name: 'SEO', icon: '🎯', color: '#FF6F00', orbitRadius: 180, orbitSpeed: 0.14, size: 48, efficiency: 83 },
  { id: '7', name: 'Webinars', icon: '🎥', color: '#9C27B0', orbitRadius: 220, orbitSpeed: 0.11, size: 46, efficiency: 69 },
  { id: '8', name: 'Partners', icon: '🤝', color: '#00BCD4', orbitRadius: 150, orbitSpeed: 0.16, size: 43, efficiency: 75 },
]

interface Props {
  detailed?: boolean
}

export function SpaceStationVisualization({ detailed = false }: Props) {
  const [time, setTime] = useState(0)
  const animationRef = useRef<number>()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const animate = () => {
      setTime(prev => prev + 0.003)
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-[600px] flex items-center justify-center transform-gpu perspective-1000">
      {/* Central Space Station - Enhanced 3D */}
      <div className="absolute z-20">
        <div className="relative transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
          {/* Main station body - 3D enhanced */}
          <div className="w-48 h-48 relative">
            {/* Outer shell with depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-3xl shadow-2xl transform-gpu"
                 style={{ 
                   transform: 'rotateX(15deg) rotateY(20deg)',
                   boxShadow: '0 25px 50px rgba(255, 255, 255, 0.1), 0 0 80px rgba(255, 255, 255, 0.05)',
                 }}>
              
              {/* Inner core with agent glow */}
              <div className="absolute inset-3 bg-gradient-to-br from-black/80 to-black/60 rounded-2xl backdrop-blur-sm border border-[#ff00aa]/30">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#ff00aa]/10 to-transparent rounded-2xl animate-pulse" />
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1" style={{ textShadow: '0 0 20px rgba(255, 0, 170, 0.8)' }}>SOL:GEN</div>
                    <div className="text-xs text-gray-400 mt-1">ONLINE</div>
                  </div>
                </div>
              </div>

              {/* Surface details */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 left-2 w-1 h-6 bg-gradient-to-b from-purple-400 to-transparent rounded-full" />
            </div>
            
            {/* Enhanced orbital rings with 3D perspective */}
            <div className="absolute -inset-6 border-2 border-purple-400/20 rounded-full animate-spin-slow transform-gpu opacity-60"
                 style={{ transform: 'rotateX(75deg) rotateZ(0deg)' }} />
            <div className="absolute -inset-12 border border-blue-400/15 rounded-full animate-spin-slower transform-gpu opacity-40"
                 style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }} />
            <div className="absolute -inset-20 border border-indigo-400/10 rounded-full transform-gpu opacity-20"
                 style={{ transform: 'rotateX(45deg) rotateZ(90deg)', animation: 'spin 20s linear infinite reverse' }} />
            
            {/* Massive energy field with depth */}
            <div className="absolute -inset-16 bg-gradient-radial from-purple-500/15 via-blue-500/10 to-transparent rounded-full blur-2xl animate-pulse" />
            <div className="absolute -inset-24 bg-gradient-radial from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl opacity-50" />
          </div>
          
          {/* Enhanced station details */}
          {detailed && (
            <>
              {/* 3D Solar panels */}
              <div className="absolute -left-24 top-1/2 -translate-y-1/2 transform-gpu"
                   style={{ transform: 'rotateY(-30deg) rotateX(10deg)' }}>
                <div className="w-20 h-10 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 rounded border border-blue-400/50 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                  <div className="absolute top-1 left-1 right-1 bottom-1 border border-blue-300/30 rounded" />
                </div>
              </div>
              <div className="absolute -right-24 top-1/2 -translate-y-1/2 transform-gpu"
                   style={{ transform: 'rotateY(30deg) rotateX(10deg)' }}>
                <div className="w-20 h-10 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 rounded border border-blue-400/50 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                  <div className="absolute top-1 left-1 right-1 bottom-1 border border-blue-300/30 rounded" />
                </div>
              </div>
              
              {/* Enhanced communication array */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                <div className="w-2 h-12 bg-gradient-to-b from-white via-purple-400 to-transparent rounded-full" />
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-radial from-white via-purple-400 to-blue-500 rounded-full animate-pulse"
                     style={{ boxShadow: '0 0 20px rgba(147, 51, 234, 0.8)' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full animate-ping" />
              </div>

              {/* Docking ports */}
              <div className="absolute -bottom-8 left-1/4 w-4 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-lg border border-gray-400/50" />
              <div className="absolute -bottom-8 right-1/4 w-4 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-lg border border-gray-400/50" />
            </>
          )}
        </div>
      </div>

      {/* Orbital paths */}
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="absolute border border-white/5 rounded-full"
          style={{
            width: `${channel.orbitRadius * 2}px`,
            height: `${channel.orbitRadius * 2}px`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Orbiting Channels */}
      {channels.map((channel, index) => {
        const angle = time * channel.orbitSpeed + (index * Math.PI * 2) / channels.length
        const x = Math.cos(angle) * channel.orbitRadius
        const y = Math.sin(angle) * channel.orbitRadius

        return (
          <div
            key={channel.id}
            className="absolute transition-all duration-100"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              top: '50%',
              left: '50%',
            }}
          >
            {/* Channel satellite */}
            <div className="relative group">
              {/* Energy beam to station */}
              <svg
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30"
                style={{
                  width: `${Math.abs(x) + 100}px`,
                  height: `${Math.abs(y) + 100}px`,
                  transform: `rotate(${Math.atan2(y, x) * 180 / Math.PI}deg)`,
                }}
              >
                <line
                  x1="50%"
                  y1="50%"
                  x2="0"
                  y2="50%"
                  stroke={channel.color}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                </line>
              </svg>
              
              {/* Enhanced 3D Channel body */}
              <div
                className="relative rounded-2xl shadow-2xl backdrop-blur-sm border transition-all duration-500 hover:scale-125 transform-gpu"
                style={{
                  width: `${channel.size + 10}px`,
                  height: `${channel.size + 10}px`,
                  background: `linear-gradient(135deg, ${channel.color}60, ${channel.color}30, ${channel.color}20)`,
                  borderColor: `${channel.color}80`,
                  boxShadow: `0 0 30px ${channel.color}50, 0 0 60px ${channel.color}20, inset 0 0 20px ${channel.color}10`,
                  transform: 'rotateX(10deg) rotateY(15deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Inner chamber */}
                <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-black/40 to-transparent border border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse rounded-xl" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl mb-1" style={{ 
                    transform: 'rotateX(-10deg) rotateY(-15deg)',
                    filter: `drop-shadow(0 0 8px ${channel.color})`,
                  }}>
                    {channel.icon}
                  </div>
                  {detailed && (
                    <div className="text-[9px] text-white font-bold bg-black/50 px-1 rounded"
                         style={{ transform: 'rotateX(-10deg) rotateY(-15deg)' }}>
                      {channel.efficiency}%
                    </div>
                  )}
                </div>
                
                {/* Enhanced thruster effects */}
                <div 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-4 rounded-full animate-pulse"
                  style={{
                    background: `linear-gradient(to bottom, ${channel.color}80, ${channel.color}40, transparent)`,
                    boxShadow: `0 0 15px ${channel.color}60, 0 5px 10px ${channel.color}30`,
                  }}
                />
                <div 
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-6 rounded-full opacity-60"
                  style={{
                    background: `linear-gradient(to bottom, ${channel.color}60, transparent)`,
                    boxShadow: `0 0 20px ${channel.color}40`,
                  }}
                />

                {/* Surface lights */}
                <div className="absolute top-1 right-1 w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
              
              {/* Channel label on hover */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {channel.name}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Subtle particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {particlePositions.map((particle, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/30 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Status display */}
      {detailed && (
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-purple-500/30">
          <div className="text-xs space-y-1">
            <div className="text-purple-300">SYSTEMS: <span className="text-green-400">OPTIMAL</span></div>
            <div className="text-purple-300">CHANNELS: <span className="text-white">{channels.length} ACTIVE</span></div>
            <div className="text-purple-300">EFFICIENCY: <span className="text-cyan-400">87.3%</span></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}