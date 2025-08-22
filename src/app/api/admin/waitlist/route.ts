import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // For now, we'll skip auth check for demo purposes
    // In production, you'd want to verify admin authentication here
    
    // Get all waitlist entries with pagination
    const { data: entries, error } = await supabase
      .from('SPATH_waitlist')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000) // Limit for performance
    
    if (error) {
      console.error('Error fetching waitlist entries:', error)
      return NextResponse.json(
        { error: 'Failed to fetch entries' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      entries
    })

  } catch (error) {
    console.error('Admin waitlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}