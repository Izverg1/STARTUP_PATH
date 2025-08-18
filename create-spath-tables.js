#!/usr/bin/env node

// Create SPATH_ prefixed tables using Supabase client
// This will connect to your real Supabase database and create the tables

const { createClient } = require('@supabase/supabase-js')

// Your Supabase credentials from .env
const supabaseUrl = 'https://oftpmcfukkidmjvzeqfc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHBtY2Z1a2tpZG1qdnplcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4OTYyODEsImV4cCI6MjA1MDQ3MjI4MX0.LdnXCY6lTpX9EOLwHbm7JkF9fUvf2hLFkrBCcvQbEKU'

console.log('🚀 Creating SPATH_ prefixed tables in your Supabase database...')
console.log(`   Database: ${supabaseUrl}`)

async function createTables() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    console.log('📋 Creating SPATH_organizations table...')
    
    // Test the connection first
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      console.log('🛠️  You need to run the SQL manually in Supabase Dashboard:')
      console.log('   1. Go to your Supabase project dashboard')
      console.log('   2. Navigate to SQL Editor')
      console.log('   3. Run the SQL from: src/lib/supabase/migrations-spath.sql')
      return
    }
    
    console.log('✅ Connected to Supabase successfully!')
    console.log('')
    console.log('⚠️  Note: Table creation requires elevated privileges.')
    console.log('   The anon key cannot create tables directly.')
    console.log('')
    console.log('🎯 Please run the following SQL in your Supabase Dashboard:')
    console.log('─'.repeat(60))
    
    const sql = `
-- STARTUP_PATH Platform - SPATH_ prefixed tables for KSON_DB
-- Run this in Supabase Dashboard → SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table  
CREATE TABLE IF NOT EXISTS SPATH_organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_tier TEXT DEFAULT 'demo' CHECK (subscription_tier IN ('demo', 'starter', 'growth', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users profile table
CREATE TABLE IF NOT EXISTS SPATH_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    org_id UUID REFERENCES SPATH_organizations(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'contributor', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS SPATH_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    org_id UUID REFERENCES SPATH_organizations(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES SPATH_users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
    mode TEXT DEFAULT 'simulation' CHECK (mode IN ('simulation', 'connected')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-create user profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_org_id UUID;
BEGIN
    -- Get or create default organization
    SELECT id INTO default_org_id FROM SPATH_organizations WHERE slug = 'startup-path-demo' LIMIT 1;
    
    IF default_org_id IS NULL THEN
        INSERT INTO SPATH_organizations (name, slug, subscription_tier)
        VALUES ('STARTUP_PATH Demo', 'startup-path-demo', 'demo')
        RETURNING id INTO default_org_id;
    END IF;
    
    -- Create user profile
    INSERT INTO SPATH_users (id, email, name, org_id)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        default_org_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE SPATH_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE SPATH_users ENABLE ROW LEVEL SECURITY;  
ALTER TABLE SPATH_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their organization" ON SPATH_organizations
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM SPATH_users WHERE org_id = SPATH_organizations.id)
    );

CREATE POLICY "Users can view profiles in their organization" ON SPATH_users
    FOR SELECT USING (
        org_id = (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
    );

CREATE POLICY "Users can update their own profile" ON SPATH_users
    FOR UPDATE USING (auth.uid() = id);

-- Insert default organization
INSERT INTO SPATH_organizations (name, slug, subscription_tier) 
VALUES ('STARTUP_PATH Demo', 'startup-path-demo', 'demo')
ON CONFLICT (slug) DO NOTHING;
    `
    
    console.log(sql)
    console.log('─'.repeat(60))
    console.log('')
    console.log('✨ After running the SQL, your SPATH_ tables will be ready!')
    console.log('   Test authentication at: http://localhost:3000/login')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

createTables()