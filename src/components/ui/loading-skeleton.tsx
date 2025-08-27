'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 border border-white/10 rounded-xl bg-black/20", className)}>
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-4 pb-2 border-b border-white/10">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6", className)}>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="h-[300px] bg-white/5 rounded-lg flex items-end justify-between p-4 space-x-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton 
              key={i} 
              className="w-full bg-white/10" 
              style={{ height: `${Math.random() * 80 + 20}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={cn("animate-spin rounded-full border-2 border-white/20 border-t-white", sizeClasses[size], className)} />
  )
}

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-white/70 text-sm">{message}</p>
    </div>
  )
}