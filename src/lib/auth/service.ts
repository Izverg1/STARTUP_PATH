'use client'

// Professional authentication service for STARTUP_PATH Platform
import { AUTH_CONFIG, AuthUser, AuthSession, AuthError, UserRole } from './config'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/types'

class AuthService {
  private session: AuthSession | null = null
  private listeners: ((user: AuthUser | null) => void)[] = []
  private supabase: ReturnType<typeof createBrowserClient<Database>> | null = null

  constructor() {
    console.log('🔧 AuthService: Initializing...')
    if (typeof window !== 'undefined') {
      this.initializeSupabase()
      this.loadStoredSession()
      console.log('🔧 AuthService: Initialization complete')
    } else {
      console.log('🔧 AuthService: Server-side initialization (no localStorage)')
    }
  }

  private initializeSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      this.supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
    } else {
      console.warn('⚠️ Supabase credentials not found, using fallback demo authentication')
    }
  }

  // Professional login flow
  async login(email: string, password: string): Promise<AuthUser> {
    try {
      // Check if this is demo user credentials
      const { DEMO_USER, DEV } = AUTH_CONFIG
      if (email === DEMO_USER.email && password === DEMO_USER.password) {
        // If Supabase is not configured, use demo mode directly
        if (!this.supabase) {
          console.log('🔄 Using fallback demo authentication (Supabase not configured)')
          return this.handleDemoLogin(email, password)
        }
        
        // Try Supabase first, fall back to demo mode if it fails
        try {
          return await this.handleDemoUserSupabaseLogin(email, password)
        } catch (supabaseError) {
          console.warn('Supabase auth failed, using fallback demo mode:', (supabaseError as Error).message)
          
          // Use fallback demo authentication in development
          if (DEV.useFallbackAuth && process.env.NODE_ENV === 'development') {
            console.log('🔄 Using fallback demo authentication for development')
            return this.handleDemoLogin(email, password)
          }
          
          // Re-throw the original error if not in fallback mode
          throw supabaseError
        }
      }

      // Real Supabase authentication for other users
      return this.handleSupabaseLogin(email, password)
    } catch (error) {
      if (error instanceof AuthError) throw error
      
      // Convert any other errors to user-friendly messages
      let userMessage = 'Something went wrong during login. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('Network')) {
          userMessage = 'Unable to connect. Please check your internet connection and try again.';
        }
      }
      
      throw new AuthError(userMessage, 'network_error')
    }
  }


  // Demo user authentication through real Supabase
  private async handleDemoUserSupabaseLogin(email: string, password: string): Promise<AuthUser> {
    if (!this.supabase) {
      throw new AuthError('Supabase client not initialized', 'network_error')
    }

    // Only try to sign in - no auto-registration for security
    const { data: signInData, error: signInError } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError) {
      throw new AuthError(
        signInError.message || 'Authentication failed. Demo user must be created manually.',
        'invalid_credentials'
      )
    }

    if (!signInData.user) {
      throw new AuthError('No user data received', 'invalid_credentials')
    }

    return this.createUserSession(signInData.user, signInData.session)
  }

  // Helper to create user session from Supabase data
  private async createUserSession(user: any, session: any): Promise<AuthUser> {
    // Get user profile from SPATH_users table (using actual table name)
    const { data: userProfile, error: profileError } = await this.supabase!
      .from('SPATH_users')
      .select(`
        *,
        SPATH_organizations (
          id,
          name,
          slug
        )
      `)
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      // Don't throw error if profile doesn't exist, just continue without it
      console.warn('Profile error but continuing with auth user data only - this is expected for demo users')
    }

    // Create professional user session from Supabase user and profile
    const authUser: AuthUser = {
      id: user.id,
      email: user.email || user.email,
      name: userProfile?.name || user.user_metadata?.name || 'Demo User',
      role: (userProfile?.role as UserRole) || 'owner',
      orgId: userProfile?.SPATH_organizations?.id || '550e8400-e29b-41d4-a716-446655440000',
      orgName: userProfile?.SPATH_organizations?.name || 'STARTUP_PATH Demo',
      avatarUrl: userProfile?.avatar_url || user.user_metadata?.avatar_url,
      lastLogin: new Date().toISOString(),
      onboardingCompleted: true // Default to true since field doesn't exist in schema
    }

    // Create session with Supabase session data
    this.session = {
      user: authUser,
      token: session?.access_token || this.generateDemoToken(),
      expiresAt: session?.expires_at ? session.expires_at * 1000 : Date.now() + AUTH_CONFIG.SESSION.duration,
      refreshToken: session?.refresh_token
    }

    // Store in localStorage for persistence
    this.storeSession()
    this.notifyListeners(authUser)

    return authUser
  }

  // Demo authentication for professional platform
  private async handleDemoLogin(email: string, password: string): Promise<AuthUser> {
    // Simulate API delay for realistic experience (reduced from 800ms to 300ms for better UX)
    await new Promise(resolve => setTimeout(resolve, 300))

    const { DEMO_USER } = AUTH_CONFIG
    
    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
      throw new AuthError(
        'Incorrect email or password. Please check your credentials and try again.', 
        'invalid_credentials'
      )
    }

    // Create professional user session
    const user: AuthUser = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      role: DEMO_USER.role,
      orgId: DEMO_USER.orgId,
      orgName: DEMO_USER.org,
      lastLogin: new Date().toISOString(),
      onboardingCompleted: this.getOnboardingStatus()
    }

    // Create session
    this.session = {
      user,
      token: this.generateDemoToken(),
      expiresAt: Date.now() + AUTH_CONFIG.SESSION.duration
    }

    // Store in localStorage for persistence
    this.storeSession()
    this.notifyListeners(user)

    return user
  }

  // Real Supabase authentication for professional platform
  private async handleSupabaseLogin(email: string, password: string): Promise<AuthUser> {
    if (!this.supabase) {
      throw new AuthError('Authentication service unavailable. Please contact support.', 'network_error')
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      // Provide user-friendly error messages
      let userMessage = 'Authentication failed';
      
      if (error.message.includes('Invalid login credentials') || 
          error.message.includes('invalid_credentials') ||
          error.message.includes('Email not confirmed')) {
        userMessage = 'Incorrect email or password. Please check your credentials and try again.';
      } else if (error.message.includes('Too many requests')) {
        userMessage = 'Too many login attempts. Please wait a moment and try again.';
      } else if (error.message.includes('Network')) {
        userMessage = 'Unable to connect. Please check your internet connection and try again.';
      }
      
      throw new AuthError(userMessage, 'invalid_credentials')
    }

    if (!data.user) {
      throw new AuthError('No user data received', 'invalid_credentials')
    }

    // Get user profile from SPATH_users table  
    const { data: userProfile, error: profileError } = await this.supabase
      .from('SPATH_users')
      .select(`
        *,
        SPATH_organizations (
          id,
          name,
          slug
        )
      `)
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
    }

    // Create professional user session from Supabase user and profile
    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email || email,
      name: userProfile?.name || data.user.user_metadata?.name || 'User',
      role: (userProfile?.role as UserRole) || 'owner',
      orgId: userProfile?.SPATH_organizations?.id || '550e8400-e29b-41d4-a716-446655440000',
      orgName: userProfile?.SPATH_organizations?.name || 'STARTUP_PATH',
      avatarUrl: userProfile?.avatar_url || data.user.user_metadata?.avatar_url,
      lastLogin: new Date().toISOString(),
      onboardingCompleted: userProfile?.onboarding_completed || false
    }

    // Create session with Supabase session data
    this.session = {
      user,
      token: data.session?.access_token || this.generateDemoToken(),
      expiresAt: data.session?.expires_at ? data.session.expires_at * 1000 : Date.now() + AUTH_CONFIG.SESSION.duration,
      refreshToken: data.session?.refresh_token
    }

    // Store in localStorage for persistence
    this.storeSession()
    this.notifyListeners(user)

    return user
  }

  // Professional user registration for STARTUP_PATH Platform
  async register(email: string, password: string, name: string): Promise<AuthUser> {
    if (!this.supabase) {
      throw new AuthError('Supabase client not initialized', 'network_error')
    }

    // Register user with Supabase Auth
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })

    if (error) {
      throw new AuthError(
        error.message || 'Registration failed',
        'invalid_credentials'
      )
    }

    if (!data.user) {
      throw new AuthError('No user data received', 'invalid_credentials')
    }

    // The trigger function should automatically create the user profile
    // If registration is successful and user is confirmed, auto-login
    if (data.session) {
      return this.handleSupabaseLogin(email, password)
    }

    // Return basic user info for email confirmation flow
    return {
      id: data.user.id,
      email: data.user.email || email,
      name: name,
      role: 'owner',
      orgId: '550e8400-e29b-41d4-a716-446655440000',
      orgName: 'STARTUP_PATH',
      lastLogin: new Date().toISOString(),
      onboardingCompleted: false
    }
  }

  // Professional logout
  async logout(): Promise<void> {
    // Sign out from Supabase if not in demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true' && this.supabase) {
      await this.supabase.auth.signOut()
    }

    this.session = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_CONFIG.SESSION.storageKey)
      localStorage.removeItem(AUTH_CONFIG.ONBOARDING.storageKey)
    }

    this.notifyListeners(null)
  }

  // Get current authenticated user
  getCurrentUser(): AuthUser | null {
    const hasSession = !!this.session
    const isExpired = this.isSessionExpired()
    console.log('🔍 AuthService.getCurrentUser:', { hasSession, isExpired })
    
    if (!this.session || isExpired) {
      return null
    }
    return this.session.user
  }

  // Professional session management
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  private isSessionExpired(session?: AuthSession): boolean {
    const sessionToCheck = session || this.session
    if (!sessionToCheck) return true
    return Date.now() > sessionToCheck.expiresAt
  }

  // Professional token generation for demo
  private generateDemoToken(): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(JSON.stringify({
      sub: '550e8400-e29b-41d4-a716-446655440001',
      email: 'user@startuppath.ai',
      org: '550e8400-e29b-41d4-a716-446655440000',
      role: 'owner',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + AUTH_CONFIG.SESSION.duration) / 1000)
    }))
    const signature = btoa('demo-signature-spath-platform')
    return `${header}.${payload}.${signature}`
  }

  // Session persistence
  private storeSession(): void {
    if (typeof window !== 'undefined' && this.session) {
      localStorage.setItem(
        AUTH_CONFIG.SESSION.storageKey, 
        JSON.stringify(this.session)
      )
    }
  }

  private loadStoredSession(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AUTH_CONFIG.SESSION.storageKey)
      if (stored) {
        try {
          const session = JSON.parse(stored)
          if (session && !this.isSessionExpired(session)) {
            this.session = session
            console.log('📱 Restored session for:', session.user?.email)
          } else {
            console.log('🗑️ Expired session removed')
            localStorage.removeItem(AUTH_CONFIG.SESSION.storageKey)
          }
        } catch (error) {
          // Invalid stored session, clear it
          console.warn('🗑️ Invalid stored session removed')
          localStorage.removeItem(AUTH_CONFIG.SESSION.storageKey)
        }
      }
    }
  }

  // Professional onboarding flow
  getOnboardingStatus(): boolean {
    if (typeof window === 'undefined') return false
    const progress = localStorage.getItem(AUTH_CONFIG.ONBOARDING.storageKey)
    return progress === 'completed'
  }

  markOnboardingComplete(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_CONFIG.ONBOARDING.storageKey, 'completed')
      if (this.session) {
        this.session.user.onboardingCompleted = true
        this.storeSession()
      }
    }
  }

  // Listener pattern for React integration
  onAuthChange(listener: (user: AuthUser | null) => void): () => void {
    // Ensure client-side initialization if not already done
    if (typeof window !== 'undefined') {
      console.log('🔄 AuthService: Ensuring client-side initialization')
      if (!this.supabase) {
        console.log('🔧 AuthService: Performing late Supabase initialization')
        this.initializeSupabase()
      }
      // Always try to load session on client side
      this.loadStoredSession()
    }

    this.listeners.push(listener)
    
    // Call immediately with current state (ensure this happens asynchronously to avoid issues)
    setTimeout(() => {
      const currentUser = this.getCurrentUser()
      console.log('🔄 AuthService: Initial auth state for listener:', currentUser?.email || 'none')
      listener(currentUser)
    }, 0)
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners(user: AuthUser | null): void {
    this.listeners.forEach(listener => listener(user))
  }

  // Professional role-based access control
  hasRole(requiredRole: UserRole): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    const roleHierarchy: Record<UserRole, number> = {
      viewer: 1,
      contributor: 2, 
      admin: 3,
      owner: 4
    }

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  // Professional organization access
  getOrganization(): { id: string; name: string } | null {
    const user = this.getCurrentUser()
    if (!user) return null
    return { id: user.orgId, name: user.orgName }
  }
}

// Professional singleton instance
export const authService = new AuthService()