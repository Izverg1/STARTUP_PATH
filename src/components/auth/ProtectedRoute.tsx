'use client'

// Professional route protection for STARTUP_PATH Platform
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoadingTransition } from '@/components/LoadingTransition'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user, hasRole } = useAuth()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Wait for auth to initialize
    if (isLoading) return

    // Professional authentication check
    if (!isAuthenticated) {
      router.replace(fallbackPath)
      return
    }

    // Professional role-based access control
    if (requiredRole && !hasRole(requiredRole)) {
      router.replace('/unauthorized')
      return
    }

    // Auth check complete
    setIsCheckingAuth(false)
  }, [isAuthenticated, isLoading, user, requiredRole, router, fallbackPath, hasRole])

  // Professional loading state
  if (isLoading || isCheckingAuth) {
    return <LoadingTransition />
  }

  // Professional access denied state
  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null // Will redirect via useEffect
  }

  return <>{children}</>
}