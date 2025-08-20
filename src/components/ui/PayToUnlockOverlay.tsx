'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Lock, Crown, Zap } from 'lucide-react'

interface PayToUnlockOverlayProps {
  children: ReactNode
  isLocked?: boolean
  title?: string
  description?: string
  plan?: 'pro' | 'enterprise'
  className?: string
}

export function PayToUnlockOverlay({
  children,
  isLocked = true,
  title = "Premium Feature",
  description = "Upgrade to unlock this feature",
  plan = 'pro',
  className
}: PayToUnlockOverlayProps) {
  const planConfig = {
    pro: {
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      buttonText: 'Upgrade to Pro',
      price: '$49/month'
    },
    enterprise: {
      icon: Zap,
      color: 'from-cyan-500 to-blue-500',
      buttonText: 'Get Enterprise',
      price: 'Contact Sales'
    }
  }

  const config = planConfig[plan]
  const Icon = config.icon

  if (!isLocked) {
    return <>{children}</>
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Blurred content */}
      <div className="filter blur-sm opacity-50 pointer-events-none select-none">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/95 to-slate-950/90 backdrop-blur-sm flex items-center justify-center">
        {/* Ambient glow */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-20 blur-3xl",
          config.color
        )} />
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 py-8 max-w-sm">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className={cn(
              "w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-2xl",
              config.color
            )}>
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Text */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
          </div>
          
          {/* Price */}
          <div className="mb-6">
            <div className={cn(
              "inline-block px-4 py-2 rounded-full bg-gradient-to-r text-white font-semibold text-sm",
              config.color
            )}>
              {config.price}
            </div>
          </div>
          
          {/* Action Button */}
          <Button
            className={cn(
              "w-full bg-gradient-to-r text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0",
              config.color,
              "hover:scale-105"
            )}
            onClick={() => {
              // TODO: Implement upgrade flow
              console.log(`Upgrade to ${plan}`)
            }}
          >
            <Lock className="w-4 h-4 mr-2" />
            {config.buttonText}
          </Button>
          
          {/* Features hint */}
          <div className="mt-4 text-xs text-slate-400">
            Unlock advanced analytics, AI insights & more
          </div>
        </div>
      </div>
    </div>
  )
}