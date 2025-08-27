import { NextResponse } from 'next/server'
import { getUserProfile } from '@/lib/db/client-queries'

export async function GET() {
  try {
    console.log('🧪 Testing database connection...')
    
    // Test getUserProfile function
    const userProfile = await getUserProfile('550e8400-e29b-41d4-a716-446655440001')
    
    if (!userProfile) {
      return NextResponse.json({
        success: false,
        error: 'User profile not found',
        details: '550e8400-e29b-41d4-a716-446655440001 not found in database'
      })
    }
    
    console.log('✅ Database test successful:', { 
      userId: userProfile.id,
      userName: userProfile.name,
      orgId: userProfile.org_id,
      orgName: userProfile.SPATH_organizations?.name
    })
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        user: {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email
        },
        organization: userProfile.SPATH_organizations ? {
          id: userProfile.SPATH_organizations.id,
          name: userProfile.SPATH_organizations.name,
          slug: userProfile.SPATH_organizations.slug
        } : null
      }
    })
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}