'use client'

import { ReactNode, Suspense } from 'react'
import { ErrorBoundary } from './error-boundary'
import { LoadingState, Skeleton } from './loading-skeleton'

interface AsyncWrapperProps {
  children: ReactNode
  loading?: ReactNode
  error?: ReactNode
  loadingMessage?: string
  onError?: (error: Error, errorInfo: any) => void
  className?: string
}

export function AsyncWrapper({ 
  children, 
  loading, 
  error, 
  loadingMessage = "Loading...",
  onError,
  className 
}: AsyncWrapperProps) {
  const defaultLoading = loading || <LoadingState message={loadingMessage} className={className} />

  return (
    <ErrorBoundary fallback={error} onError={onError}>
      <Suspense fallback={defaultLoading}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

interface AsyncCardProps extends AsyncWrapperProps {
  title?: string
}

export function AsyncCard({ title, children, className, ...props }: AsyncCardProps) {
  const cardLoading = (
    <div className="p-6 border border-white/10 rounded-xl bg-black/20">
      {title && <Skeleton className="h-6 w-1/3 mb-4" />}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )

  return (
    <AsyncWrapper 
      loading={cardLoading} 
      className={className}
      {...props}
    >
      {children}
    </AsyncWrapper>
  )
}

interface AsyncTableProps extends AsyncWrapperProps {
  columns?: number
  rows?: number
}

export function AsyncTable({ columns = 4, rows = 5, children, className, ...props }: AsyncTableProps) {
  const tableLoading = (
    <div className="space-y-3">
      <div className={`grid gap-4 pb-2 border-b border-white/10`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <AsyncWrapper 
      loading={tableLoading} 
      className={className}
      {...props}
    >
      {children}
    </AsyncWrapper>
  )
}