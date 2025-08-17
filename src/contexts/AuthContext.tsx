'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  userEmail: string | null
  login: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check localStorage on mount
    const authStatus = localStorage.getItem('isAuthenticated')
    const email = localStorage.getItem('userEmail')
    
    if (authStatus === 'true' && email) {
      setIsAuthenticated(true)
      setUserEmail(email)
    }

    // Redirect logic
    const publicPaths = ['/', '/login']
    const isPublicPath = publicPaths.includes(pathname)
    
    if (!authStatus && !isPublicPath) {
      router.push('/login')
    }
  }, [pathname, router])

  const login = (email: string) => {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userEmail', email)
    setIsAuthenticated(true)
    setUserEmail(email)
    router.push('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    setIsAuthenticated(false)
    setUserEmail(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
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