// Authentication configuration for STARTUP_PATH Platform
// Professional B2B SaaS authentication setup

export const AUTH_CONFIG = {
  // Demo credentials for professional platform
  DEMO_USER: {
    email: 'user@startuppath.ai',
    password: 'demo123',
    name: 'Demo User',
    role: 'owner' as const,
    org: 'STARTUP_PATH Demo',
    orgId: '550e8400-e29b-41d4-a716-446655440000'
  },

  // Session configuration
  SESSION: {
    duration: 24 * 60 * 60 * 1000, // 24 hours
    refreshThreshold: 60 * 60 * 1000, // 1 hour before expiry
    storageKey: 'spath-auth-session'
  },

  // Professional onboarding flow
  ONBOARDING: {
    steps: [
      'welcome',
      'company-info',
      'channel-setup', 
      'agent-configuration',
      'dashboard-tour'
    ],
    storageKey: 'spath-onboarding-progress'
  },

  // Feature flags for authentication
  FEATURES: {
    socialLogin: false, // Disabled for B2B focus
    mfa: false, // Future enterprise feature
    sso: false, // Future enterprise feature
    inviteFlow: true, // Team collaboration
    roleBasedAccess: true
  },

  // Temporary development configuration - REMOVE IN PRODUCTION
  DEV: {
    bypassSupabaseAuth: process.env.NODE_ENV === 'development',
    useFallbackAuth: true // Fall back to demo mode if Supabase auth fails
  }
}

// Professional user roles
export type UserRole = 'owner' | 'admin' | 'contributor' | 'viewer'

// Authentication state interface
export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  orgId: string
  orgName: string
  avatarUrl?: string
  lastLogin?: string
  onboardingCompleted: boolean
}

// Session interface
export interface AuthSession {
  user: AuthUser
  token: string
  expiresAt: number
  refreshToken?: string
}

// Professional error handling
export class AuthError extends Error {
  constructor(
    message: string,
    public code: 'invalid_credentials' | 'session_expired' | 'access_denied' | 'network_error'
  ) {
    super(message)
    this.name = 'AuthError'
  }
}