'use client'

// Professional authentication hook for STARTUP_PATH Platform
import { useState, useEffect } from 'react'
import { authService } from '@/lib/auth/service'
import { AuthUser, AuthError } from '@/lib/auth/config'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  clearError: () => void
  hasRole: (role: string) => boolean
  organization: { id: string; name: string } | null
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })
  const [error, setError] = useState<string | null>(null)

  // Professional authentication state management
  useEffect(() => {
    const unsubscribe = authService.onAuthChange((user) => {
      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user
      })
    })

    return unsubscribe
  }, [])

  // Professional login with comprehensive error handling
  const login = async (email: string, password: string): Promise<void> => {
    setError(null)
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      await authService.login(email, password)
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  // Professional logout
  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  // Professional error management
  const clearError = (): void => {
    setError(null)
  }

  // Professional role-based access control
  const hasRole = (requiredRole: string): boolean => {
    return authService.hasRole(requiredRole as any)
  }

  // Professional organization context
  const organization = authService.getOrganization()

  return {
    ...state,
    login,
    logout,
    error,
    clearError,
    hasRole,
    organization
  }
}