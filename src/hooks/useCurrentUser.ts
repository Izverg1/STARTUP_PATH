'use client';

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserProfile } from '@/lib/db/client-queries'
import type { Tables } from '@/lib/supabase/client'

type User = Tables<'SPATH_users'>
type Organization = Tables<'SPATH_organizations'>

interface UserWithOrganization extends User {
  SPATH_organizations: Organization
}

export function useCurrentUser() {
  const [user, setUser] = useState<UserWithOrganization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const getCurrentUser = async () => {
      try {
        // First check if we have a user from AuthService (handles demo mode)
        const { authService } = await import('@/lib/auth/service')
        const currentUser = authService.getCurrentUser()
        
        if (currentUser) {
          // We have an AuthService user (real or demo), use it directly
          const userProfile: UserWithOrganization = {
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
            avatar_url: currentUser.avatarUrl || null,
            org_id: currentUser.orgId || null,
            role: currentUser.role,
            is_active: true,
            last_login: currentUser.lastLogin ? new Date(currentUser.lastLogin) : null,
            onboarding_completed: currentUser.onboardingCompleted,
            created_at: new Date(),
            updated_at: new Date(),
            SPATH_organizations: {
              id: currentUser.orgId || '550e8400-e29b-41d4-a716-446655440000',
              name: currentUser.orgName || 'Demo Organization',
              slug: 'demo-org-slug',
              subscription_tier: 'demo',
              settings: {},
              created_at: new Date(),
              updated_at: new Date()
            }
          }
          
          if (mounted) {
            setUser(userProfile)
            setLoading(false)
            setError(null)
          }
          return
        }
        
        // Fallback to Supabase authentication for real users
        const supabase = createClient()
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !authUser) {
          if (mounted) {
            setUser(null)
            setLoading(false)
            setError(authError?.message || 'No authenticated user')
          }
          return
        }

        // Get the user profile with organization data
        const userProfile = await getUserProfile(authUser.id)
        
        if (mounted) {
          setUser(userProfile)
          setLoading(false)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load user')
          setLoading(false)
        }
      }
    }

    getCurrentUser()

    return () => {
      mounted = false
    }
  }, [])

  return {
    user,
    organization: user?.SPATH_organizations || null,
    loading,
    error,
    refetch: async () => {
      setLoading(true)
      setError(null)
      // Re-trigger the effect
      try {
        // First check if we have a user from AuthService (handles demo mode)
        const { authService } = await import('@/lib/auth/service')
        const currentUser = authService.getCurrentUser()
        
        if (currentUser) {
          // We have an AuthService user (real or demo), use it directly
          const userProfile: UserWithOrganization = {
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
            avatar_url: currentUser.avatarUrl || null,
            org_id: currentUser.orgId || null,
            role: currentUser.role,
            is_active: true,
            last_login: currentUser.lastLogin ? new Date(currentUser.lastLogin) : null,
            onboarding_completed: currentUser.onboardingCompleted,
            created_at: new Date(),
            updated_at: new Date(),
            SPATH_organizations: {
              id: currentUser.orgId || '550e8400-e29b-41d4-a716-446655440000',
              name: currentUser.orgName || 'Demo Organization',
              slug: 'demo-org-slug',
              subscription_tier: 'demo',
              settings: {},
              created_at: new Date(),
              updated_at: new Date()
            }
          }
          
          setUser(userProfile)
          setLoading(false)
          setError(null)
          return
        }
        
        // Fallback to Supabase authentication for real users
        const supabase = createClient()
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !authUser) {
          setUser(null)
          setLoading(false)
          setError(authError?.message || 'No authenticated user')
          return
        }

        const userProfile = await getUserProfile(authUser.id)
        setUser(userProfile)
        setLoading(false)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user')
        setLoading(false)
      }
    }
  }
}