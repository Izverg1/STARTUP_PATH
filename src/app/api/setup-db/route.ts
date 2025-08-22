import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    console.log('Setting up SPATH_waitlist table...')
    const supabase = await createServerSupabaseClient()
    
    // Create the SPATH_waitlist table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS SPATH_waitlist (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL,
          name TEXT,
          company TEXT,
          position TEXT,
          type TEXT NOT NULL CHECK (type IN ('customer', 'partner')),
          source TEXT DEFAULT 'landing_page',
          utm_campaign TEXT,
          utm_source TEXT,
          utm_medium TEXT,
          utm_content TEXT,
          utm_term TEXT,
          referrer TEXT,
          ip_address INET,
          user_agent TEXT,
          additional_info JSONB DEFAULT '{}',
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'declined', 'spam')),
          priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
          contacted_at TIMESTAMP WITH TIME ZONE,
          contacted_by UUID,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_spath_waitlist_email ON SPATH_waitlist(email);
      CREATE INDEX IF NOT EXISTS idx_spath_waitlist_type ON SPATH_waitlist(type);
      CREATE INDEX IF NOT EXISTS idx_spath_waitlist_status ON SPATH_waitlist(status);
      CREATE INDEX IF NOT EXISTS idx_spath_waitlist_created_at ON SPATH_waitlist(created_at);
      
      -- Enable RLS
      ALTER TABLE SPATH_waitlist ENABLE ROW LEVEL SECURITY;
      
      -- Create policies
      CREATE POLICY IF NOT EXISTS "Allow public waitlist signup" ON SPATH_waitlist
          FOR INSERT 
          TO anon, authenticated
          WITH CHECK (true);
      
      CREATE POLICY IF NOT EXISTS "Allow authenticated users to view waitlist" ON SPATH_waitlist
          FOR SELECT 
          TO authenticated
          USING (true);
    `
    
    // Execute SQL using raw query
    const { error } = await supabase.rpc('exec', { sql: createTableSQL })
    
    if (error) {
      console.error('Migration error:', error)
      return NextResponse.json({ 
        error: 'Failed to create table',
        details: error.message 
      }, { status: 500 })
    }
    
    // Test the created table
    const { data: testData, error: testError } = await supabase
      .from('SPATH_waitlist')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.error('Table test error:', testError)
      return NextResponse.json({ 
        error: 'Table created but test failed',
        details: testError.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'SPATH_waitlist table created successfully',
      testResult: testData
    })
    
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      error: 'Setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}