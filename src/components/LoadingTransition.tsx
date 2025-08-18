'use client'

import { useEffect, useState } from 'react'
import { Rocket, Zap, BarChart3, TrendingUp } from 'lucide-react'

export function LoadingTransition({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(0)
  
  const stages = [
    { icon: Rocket, text: 'Initializing Command Center', color: 'text-red-500' },
    { icon: BarChart3, text: 'Loading Analytics Engine', color: 'text-white' },
    { icon: Zap, text: 'Optimizing Channels', color: 'text-red-500' },
    { icon: TrendingUp, text: 'Launching Dashboard', color: 'text-gray-400' }
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 300)
          return 100
        }
        return prev + 2
      })
    }, 30)
    
    return () => clearInterval(interval)
  }, [onComplete])
  
  useEffect(() => {
    const newStage = Math.floor(progress / 25)
    if (newStage !== stage && newStage < stages.length) {
      setStage(newStage)
    }
  }, [progress, stage, stages.length])
  
  const CurrentIcon = stages[stage].icon
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: `
               linear-gradient(rgba(255, 0, 64, 0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255, 0, 64, 0.1) 1px, transparent 1px)
             `,
             backgroundSize: '50px 50px'
           }} />
      
      <div className="relative">
        {/* Animated icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center animate-spin-slow">
              <CurrentIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-80 mb-4">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Status text */}
        <div className="text-center">
          <p className={`text-lg font-medium ${stages[stage].color} transition-all duration-300`}>
            {stages[stage].text}
          </p>
          <p className="text-gray-500 text-sm mt-2">{progress}%</p>
        </div>
        
        {/* Loading dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}