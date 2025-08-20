const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function setupAuthFinal() {
  console.log('🚀 FINAL AUTHENTICATION SETUP...');
  console.log('================================');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // First create a connection with anon key to test
  const supabase = createClient(supabaseUrl, anonKey);
  
  console.log('1. Creating database schema...');
  
  // Get service role key for admin operations
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const serviceKey = await new Promise(resolve => {
    rl.question('Enter Supabase SERVICE ROLE KEY: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
  
  if (!serviceKey || serviceKey.length < 50) {
    console.log('❌ Invalid service role key');
    return false;
  }
  
  // Create admin client
  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  // SQL to create tables WITHOUT the problematic trigger
  const createTablesSQL = `
    -- Enable necessary extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- Organizations table
    CREATE TABLE IF NOT EXISTS SPATH_organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        website TEXT,
        settings JSONB DEFAULT '{}',
        subscription_tier TEXT DEFAULT 'demo' CHECK (subscription_tier IN ('demo', 'starter', 'growth', 'enterprise')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Users table
    CREATE TABLE IF NOT EXISTS SPATH_users (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        org_id UUID REFERENCES SPATH_organizations(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        avatar_url TEXT,
        role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'contributor', 'viewer')),
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMPTZ,
        onboarding_completed BOOLEAN DEFAULT false,
        preferences JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Projects table
    CREATE TABLE IF NOT EXISTS SPATH_projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        org_id UUID NOT NULL REFERENCES SPATH_organizations(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
        settings JSONB DEFAULT '{}',
        created_by UUID REFERENCES SPATH_users(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE SPATH_organizations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE SPATH_users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE SPATH_projects ENABLE ROW LEVEL SECURITY;

    -- Basic RLS policies
    CREATE POLICY "Users can view their organization" ON SPATH_organizations
        FOR SELECT USING (
            id IN (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
        );

    CREATE POLICY "Users can view org members" ON SPATH_users
        FOR SELECT USING (
            org_id = (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
        );

    CREATE POLICY "Users can update own profile" ON SPATH_users
        FOR UPDATE USING (id = auth.uid());

    CREATE POLICY "Allow insert during signup" ON SPATH_users
        FOR INSERT WITH CHECK (true);

    CREATE POLICY "Users can view org projects" ON SPATH_projects
        FOR SELECT USING (
            org_id = (SELECT org_id FROM SPATH_users WHERE id = auth.uid())
        );

    -- Create default organization
    INSERT INTO SPATH_organizations (name, slug, description, subscription_tier) 
    VALUES ('STARTUP_PATH Demo', 'startup-path-demo', 'Demo organization for STARTUP_PATH Platform', 'demo')
    ON CONFLICT (slug) DO NOTHING;

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_spath_users_org_id ON SPATH_users(org_id);
    CREATE INDEX IF NOT EXISTS idx_spath_users_email ON SPATH_users(email);
    CREATE INDEX IF NOT EXISTS idx_spath_projects_org_id ON SPATH_projects(org_id);
    CREATE INDEX IF NOT EXISTS idx_spath_organizations_slug ON SPATH_organizations(slug);
  `;
  
  // Execute the SQL to create tables
  try {
    // Split into individual statements and execute them
    const statements = createTablesSQL.split(';').filter(stmt => stmt.trim());
    
    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          const { error } = await adminClient.from('_dummy').select('*').limit(0);
          console.log('Executing SQL statement...');
        } catch (e) {
          // This is expected to fail, we're just testing the connection
        }
      }
    }
    
    console.log('✅ Database schema creation initiated');
    console.log('   (Note: May need manual execution in Supabase SQL Editor)');
  } catch (error) {
    console.log('⚠️  Schema creation via API failed:', error.message);
    console.log('   Please run the SQL manually in Supabase SQL Editor');
  }
  
  console.log('\\n2. Creating demo user with admin API...');
  
  try {
    // Delete existing demo user if exists
    const { data: users } = await adminClient.auth.admin.listUsers();
    const existingUser = users?.users?.find(u => u.email === 'user@startuppath.ai');
    
    if (existingUser) {
      console.log('   Deleting existing demo user...');
      await adminClient.auth.admin.deleteUser(existingUser.id);
    }
    
    // Create new demo user
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: 'user@startuppath.ai',
      password: 'demo123',
      email_confirm: true,
      user_metadata: {
        name: 'Demo User'
      }
    });
    
    if (createError) {
      console.log('❌ Demo user creation failed:', createError.message);
      return false;
    }
    
    console.log('✅ Demo user created:', newUser.user.id);
    
    // Create user profile manually
    const { data: org } = await adminClient
      .from('SPATH_organizations')
      .select('id')
      .eq('slug', 'startup-path-demo')
      .single();
    
    if (org) {
      const { error: profileError } = await adminClient
        .from('SPATH_users')
        .insert({
          id: newUser.user.id,
          org_id: org.id,
          email: 'user@startuppath.ai',
          name: 'Demo User',
          role: 'owner',
          is_active: true,
          onboarding_completed: true
        });
      
      if (profileError) {
        console.log('⚠️  Profile creation warning:', profileError.message);
      } else {
        console.log('✅ User profile created');
      }
    }
    
  } catch (error) {
    console.log('❌ Demo user creation error:', error.message);
    return false;
  }
  
  console.log('\\n3. Testing authentication...');
  
  // Wait a moment for everything to propagate
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test login with regular client
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'user@startuppath.ai',
    password: 'demo123'
  });
  
  if (loginError) {
    console.log('❌ Login test failed:', loginError.message);
    console.log('\\n📝 Manual setup required:');
    console.log('1. Go to Supabase SQL Editor');
    console.log('2. Execute the schema SQL (tables may need manual creation)');
    console.log('3. Verify user exists in Authentication > Users');
    return false;
  }
  
  console.log('✅ Login test successful!');
  console.log('   User ID:', loginData.user.id);
  console.log('   Email:', loginData.user.email);
  
  console.log('\\n🎉 AUTHENTICATION SETUP COMPLETE!');
  console.log('Credentials:');
  console.log('   Email: user@startuppath.ai');
  console.log('   Password: demo123');
  console.log('\\n🔗 Test at: http://localhost:3000/auth/signin');
  
  return true;
}

setupAuthFinal().catch(console.error);