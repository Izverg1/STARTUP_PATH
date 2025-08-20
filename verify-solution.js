const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verifySolution() {
  console.log('🔍 VERIFYING AUTHENTICATION SOLUTION');
  console.log('==================================');
  console.log('Testing: http://localhost:3004/login');
  console.log('Email: user@startuppath.ai');
  console.log('Password: demo123\n');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  try {
    // Test authentication
    console.log('1. Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    });
    
    if (authError) {
      console.log('❌ AUTHENTICATION FAILED:', authError.message);
      console.log('\nTry running one of the solutions:');
      console.log('• node solution-1-service-key.js');
      console.log('• Use solution-2-sql-direct.sql in Supabase SQL Editor');
      console.log('• node solution-3-disable-confirmation.js');
      return false;
    }
    
    console.log('✅ Authentication successful!');
    console.log('   User ID:', authData.user.id);
    console.log('   Email:', authData.user.email);
    console.log('   Confirmed:', !!authData.user.email_confirmed_at);
    
    // Test spath_users table access
    console.log('\n2. Testing spath_users table access...');
    const { data: userProfile, error: profileError } = await supabase
      .from('spath_users')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError) {
      console.log('⚠️ User profile not found in spath_users:', profileError.message);
      console.log('   Authentication works, but profile missing');
    } else {
      console.log('✅ User profile found in spath_users!');
      console.log('   Name:', userProfile.name);
      console.log('   Role:', userProfile.role);
      console.log('   Organization ID:', userProfile.org_id);
    }
    
    // Test spath_orgs table access
    console.log('\n3. Testing spath_orgs table access...');
    const { data: orgData, error: orgError } = await supabase
      .from('spath_orgs')
      .select('*')
      .limit(1);
    
    if (orgError) {
      console.log('⚠️ Cannot access spath_orgs:', orgError.message);
    } else {
      console.log('✅ spath_orgs table accessible');
      if (orgData.length > 0) {
        console.log('   Sample org:', orgData[0].name);
      }
    }
    
    // Test spath_projects table access
    console.log('\n4. Testing spath_projects table access...');
    const { data: projectData, error: projectError } = await supabase
      .from('spath_projects')
      .select('*')
      .limit(1);
    
    if (projectError) {
      console.log('⚠️ Cannot access spath_projects:', projectError.message);
    } else {
      console.log('✅ spath_projects table accessible');
      if (projectData.length > 0) {
        console.log('   Sample project:', projectData[0].name);
      }
    }
    
    await supabase.auth.signOut();
    
    console.log('\n🎉 VERIFICATION COMPLETE!');
    console.log('🔗 Your login page is ready: http://localhost:3004/login');
    console.log('📧 Email: user@startuppath.ai');
    console.log('🔑 Password: demo123');
    
    return true;
    
  } catch (error) {
    console.log('❌ Verification failed:', error.message);
    return false;
  }
}

verifySolution();