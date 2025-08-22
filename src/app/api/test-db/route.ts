import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    console.log('Testing database connection...')
    const supabase = await createServerSupabaseClient()
    
    // Test basic connection by trying to select from the waitlist table directly
    const { data: waitlistTest, error: testError } = await supabase
      .from('SPATH_waitlist')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.error('Waitlist table error:', testError)
      return NextResponse.json({ 
        error: 'SPATH_waitlist table does not exist',
        details: testError.message,
        code: testError.code
      }, { status: 500 })
    }
    
    console.log('Waitlist table test successful:', waitlistTest)
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      waitlistExists: true,
      tableData: waitlistTest
    })
    
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}