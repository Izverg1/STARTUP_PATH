import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    console.log('Creating SPATH_waitlist table manually...')
    const supabase = await createServerSupabaseClient()
    
    // Instead of running SQL directly, let's manually insert a test record to create the table structure
    // This is a workaround since we might not have SQL execution permissions
    const { data, error } = await supabase
      .from('SPATH_waitlist')
      .insert({
        email: 'test@setup.com',
        name: 'Setup Test',
        company: 'Test Company',
        type: 'customer',
        source: 'setup',
        additional_info: { test: true },
        status: 'pending',
        priority: 1
      })
      .select()
    
    if (error) {
      // If table doesn't exist, the error will tell us
      console.log('Table does not exist, need to create it via Supabase dashboard')
      return NextResponse.json({ 
        error: 'Table does not exist in database',
        details: error.message,
        solution: 'Please create the SPATH_waitlist table in your Supabase dashboard using the migration SQL'
      }, { status: 404 })
    }
    
    // If we get here, table exists and insert worked
    return NextResponse.json({
      success: true,
      message: 'Table exists and is working',
      testRecord: data
    })
    
  } catch (error) {
    console.error('Table test error:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}