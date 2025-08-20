#!/usr/bin/env node

// Simple script to create SPATH_ tables in Supabase
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration in .env.local')
  process.exit(1)
}

console.log('🚀 Creating SPATH_ tables in Supabase...')
console.log(`   Database: ${supabaseUrl}`)

// Create client with anon key (will work for public schema operations)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createTables() {
  try {
    // Create core tables one by one to avoid complex dependencies
    
    console.log('📝 Creating SPATH_organizations table...')
    const { error: orgError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS SPATH_organizations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          settings JSONB DEFAULT '{}',
          subscription_tier TEXT DEFAULT 'demo' CHECK (subscription_tier IN ('demo', 'starter', 'growth', 'enterprise')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })
    
    if (orgError) {
      console.log('   Using direct SQL approach...')
      // Try alternative approach
      await executeSimpleSQL()
      return
    }

    console.log('✅ SPATH_organizations created')

    console.log('📝 Creating SPATH_users table...')
    const { error: userError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS SPATH_users (
          id UUID PRIMARY KEY,
          org_id UUID REFERENCES SPATH_organizations(id) ON DELETE CASCADE,
          email TEXT NOT NULL,
          name TEXT NOT NULL,
          avatar_url TEXT,
          role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'contributor', 'viewer')),
          is_active BOOLEAN DEFAULT true,
          last_login TIMESTAMPTZ,
          onboarding_completed BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })

    if (userError) {
      console.error('❌ Error creating SPATH_users:', userError.message)
      return
    }

    console.log('✅ SPATH_users created')

    // Create default organization
    console.log('📝 Creating default organization...')
    const { error: insertError } = await supabase
      .from('SPATH_organizations')
      .insert({
        name: 'STARTUP_PATH Demo',
        slug: 'startup-path-demo',
        description: 'Demo organization for STARTUP_PATH Platform'
      })

    if (insertError && !insertError.message.includes('duplicate')) {
      console.error('❌ Error creating default org:', insertError.message)
    } else {
      console.log('✅ Default organization created')
    }

    console.log('\n🎯 SPATH_ tables created successfully!')
    console.log('   • SPATH_organizations - Organization management')
    console.log('   • SPATH_users - User profiles')
    console.log('\n✨ Basic tables are ready for authentication!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    await executeSimpleSQL()
  }
}

// Fallback: Manual SQL instructions
async function executeSimpleSQL() {
  console.log('\n🛠️  Manual setup required:')
  console.log('   1. Go to your Supabase project dashboard')
  console.log('   2. Navigate to SQL Editor')
  console.log('   3. Execute this SQL:')
  console.log('\n-- Create basic SPATH tables')
  console.log(`
CREATE TABLE IF NOT EXISTS SPATH_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'demo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS SPATH_users (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES SPATH_organizations(id),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'owner',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default organization
INSERT INTO SPATH_organizations (name, slug, description) 
VALUES ('STARTUP_PATH Demo', 'startup-path-demo', 'Demo organization for STARTUP_PATH Platform')
ON CONFLICT (slug) DO NOTHING;
  `)
  console.log('\n4. The authentication system will work once these tables exist.')
}

// Run the setup
createTables()