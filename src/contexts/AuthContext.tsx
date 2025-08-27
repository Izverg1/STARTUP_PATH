'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/lib/auth/service'
import { AuthUser } from '@/lib/auth/config'

interface AuthContextType {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Safety timeout to prevent indefinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Auth loading timeout - forcing loading state to false')
        setLoading(false)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(timeout)
  }, [loading])

  useEffect(() => {
    console.log('🔄 AuthContext: Setting up auth listener')
    
    // Initialize auth state immediately
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        console.log('🔄 AuthContext: Initial auth check', { user: currentUser?.email || 'none' })
        setUser(currentUser)
        setLoading(false)
        
        // Handle redirects based on initial state
        const publicPaths = ['/', '/login', '/auth/register', '/auth/reset-password']
        const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
        
        if (!currentUser && !isPublicPath) {
          console.log('🔒 Redirecting to login (not authenticated)')
          router.push('/login')
        } else if (currentUser && pathname === '/login') {
          console.log('🏠 Redirecting to dashboard (already authenticated)')
          router.push('/dashboard/projects')
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error)
        setLoading(false)
        setUser(null)
        
        const publicPaths = ['/', '/login', '/auth/register', '/auth/reset-password']
        const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
        if (!isPublicPath) {
          router.push('/login')
        }
      }
    }
    
    // Subscribe to auth changes
    const unsubscribe = authService.onAuthChange((user) => {
      console.log('🔄 AuthContext: Auth state changed', { user: user?.email || 'none', pathname })
      setUser(user)
      setLoading(false)
      
      // Handle redirects based on auth changes
      const publicPaths = ['/', '/login', '/auth/register', '/auth/reset-password']
      const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
      
      if (!user && !isPublicPath) {
        console.log('🔒 Redirecting to login (not authenticated)')
        router.push('/login')
      } else if (user && pathname === '/login') {
        console.log('🏠 Redirecting to dashboard (already authenticated)')
        router.push('/dashboard/projects')
      }
    })

    // Initialize auth state
    initializeAuth()

    return unsubscribe
  }, [pathname, router])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const user = await authService.login(email, password)
      // User state will be updated via the auth change listener
      console.log('✅ Login successful:', user.email)
    } catch (error) {
      console.error('❌ Login failed:', error)
      setLoading(false)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      await authService.register(email, password, name)
      // User state will be updated via the auth change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authService.logout()
      // User state will be updated via the auth change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register,
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Alias for backward compatibility
export const useUser = useAuth