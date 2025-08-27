import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting database setup...')
    
    const supabase = createClient()
    
    // Create demo organization first
    const orgData = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Demo Startup Inc.',
      slug: 'demo-startup',
      subscription_tier: 'demo' as const,
      owner_id: '550e8400-e29b-41d4-a716-446655440001',
      settings: {
        timezone: 'America/New_York',
        currency: 'USD'
      }
    }
    
    const { data: org, error: orgError } = await supabase
      .from('SPATH_organizations')
      .upsert(orgData)
      .select()
      .single()
    
    if (orgError) {
      throw new Error(`Failed to create organization: ${orgError.message}`)
    }
    
    // Create demo user
    const userData = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'user@startuppath.ai',
      name: 'Demo User',
      org_id: org.id,
      role: 'owner' as const,
      onboarding_completed: true
    }
    
    const { data: user, error: userError } = await supabase
      .from('SPATH_users')
      .upsert(userData)
      .select()
      .single()
    
    if (userError) {
      throw new Error(`Failed to create user: ${userError.message}`)
    }
    
    // Create demo project
    const projectData = {
      name: 'Demo GTM Experiment',
      description: 'Sample go-to-market experiment for testing the platform',
      org_id: org.id,
      owner_id: user.id,
      mode: 'simulation' as const,
      status: 'active' as const
    }
    
    const { data: project, error: projectError } = await supabase
      .from('SPATH_projects')
      .upsert(projectData)
      .select()
      .single()
    
    if (projectError) {
      throw new Error(`Failed to create project: ${projectError.message}`)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully!',
      data: {
        organizationName: org.name,
        userEmail: user.email,
        projectName: project.name
      }
    })
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Database setup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}