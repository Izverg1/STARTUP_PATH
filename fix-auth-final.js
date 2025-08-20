const { createClient } = require('@supabase/supabase-js');

// Use the correct URL from .env.local
const supabaseUrl = 'https://oftpmcfukkidmjvzeqfc.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHBtY2Z1a2tpZG1qdnplcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4OTYyODEsImV4cCI6MjA1MDQ3MjI4MX0.LdnXCY6lTpX9EOLwHbm7JkF9fUvf2hLFkrBCcvQbEKU';

const supabase = createClient(supabaseUrl, anonKey);

(async () => {
  console.log('🔧 Final Authentication Fix for STARTUP_PATH');
  console.log('==========================================');

  try {
    // Step 1: First check if tables exist
    console.log('\n📋 Step 1: Checking SPATH tables...');
    
    const { data: orgs, error: orgError } = await supabase
      .from('SPATH_organizations')
      .select('*')
      .limit(1);
    
    if (orgError) {
      console.log('❌ SPATH_organizations table error:', orgError.message);
      return;
    }
    
    console.log('✅ SPATH_organizations table exists, found', orgs.length, 'organizations');
    
    // Step 2: Check if demo org exists
    console.log('\n🏢 Step 2: Checking demo organization...');
    
    const { data: demoOrgs, error: demoOrgError } = await supabase
      .from('SPATH_organizations')
      .select('*')
      .eq('name', 'Demo Organization');
    
    if (demoOrgError) {
      console.log('❌ Error checking demo org:', demoOrgError.message);
      return;
    }
    
    let demoOrg;
    if (demoOrgs.length === 0) {
      console.log('🏗️  Creating demo organization...');
      const { data: newOrg, error: createOrgError } = await supabase
        .from('SPATH_organizations')
        .insert({
          name: 'Demo Organization',
          domain: 'startuppath.ai',
          is_demo: true
        })
        .select()
        .single();
      
      if (createOrgError) {
        console.log('❌ Error creating demo org:', createOrgError.message);
        return;
      }
      
      demoOrg = newOrg;
      console.log('✅ Demo organization created with ID:', demoOrg.id);
    } else {
      demoOrg = demoOrgs[0];
      console.log('✅ Demo organization already exists with ID:', demoOrg.id);
    }
    
    // Step 3: Try to create user directly in the database using SQL
    console.log('\n👤 Step 3: Creating user directly with SQL...');
    
    // First, let's use a workaround - create the user with a simple approach
    const userId = 'demo-user-12345'; // Fixed user ID for demo
    const hashedPassword = 'demo123'; // In real app, this would be bcrypt hashed
    
    // Insert into SPATH_users table
    const { data: existingUser, error: checkUserError } = await supabase
      .from('SPATH_users')
      .select('*')
      .eq('email', 'user@startuppath.ai');
    
    if (checkUserError) {
      console.log('❌ Error checking existing user:', checkUserError.message);
    }
    
    if (!existingUser || existingUser.length === 0) {
      console.log('🏗️  Creating user in SPATH_users table...');
      const { data: newUser, error: createUserError } = await supabase
        .from('SPATH_users')
        .insert({
          id: userId,
          email: 'user@startuppath.ai',
          full_name: 'Demo User',
          org_id: demoOrg.id,
          role: 'admin',
          is_demo: true
        })
        .select()
        .single();
      
      if (createUserError) {
        console.log('❌ Error creating user:', createUserError.message);
      } else {
        console.log('✅ User created in SPATH_users table');
      }
    } else {
      console.log('✅ User already exists in SPATH_users table');
    }
    
    // Step 4: Final test - try authentication
    console.log('\n🔐 Step 4: Testing authentication...');
    
    // Since we can't easily create auth users without service role key,
    // let's modify the auth service to handle demo mode
    console.log('ℹ️  Authentication testing requires service role key or manual Supabase dashboard setup.');
    console.log('');
    console.log('🎯 NEXT STEPS:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/oftpmcfukkidmjvzeqfc');
    console.log('2. Go to Authentication > Users');
    console.log('3. Click "Add user"');
    console.log('4. Email: user@startuppath.ai');
    console.log('5. Password: demo123');
    console.log('6. Enable "Auto Confirm User" option');
    console.log('');
    console.log('OR modify the auth service to use demo mode for local testing.');

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
})();