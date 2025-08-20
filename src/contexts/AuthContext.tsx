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

  useEffect(() => {
    // Subscribe to auth changes
    const unsubscribe = authService.onAuthChange((user) => {
      setUser(user)
      setLoading(false)
      
      // Redirect logic
      const publicPaths = ['/', '/login', '/auth/register', '/auth/reset-password']
      const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
      
      if (!user && !isPublicPath) {
        router.push('/login')
      } else if (user && pathname === '/login') {
        router.push('/dashboard')
      }
    })

    return unsubscribe
  }, [pathname, router])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      await authService.login(email, password)
      // User state will be updated via the auth change listener
    } catch (error) {
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