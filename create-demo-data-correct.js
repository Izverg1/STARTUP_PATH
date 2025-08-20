const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oftpmcfukkidmjvzeqfc.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHBtY2Z1a2tpZG1qdnplcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE7MzQ4OTYyODEsImV4cCI6MjA1MDQ3MjI4MX0.LdnXCY6lTpX9EOLwHbm7JkF9fUvf2hLFkrBCcvQbEKU';

const supabase = createClient(supabaseUrl, anonKey);

(async () => {
  console.log('🏗️  Creating Demo Data for STARTUP_PATH');
  console.log('=====================================');

  try {
    // Step 1: Create demo organization
    console.log('\n🏢 Step 1: Creating demo organization...');
    
    const { data: existingOrg, error: orgCheckError } = await supabase
      .from('organizations')
      .select('*')
      .eq('name', 'Demo Organization')
      .single();
    
    let demoOrg;
    if (orgCheckError && orgCheckError.code === 'PGRST116') {
      // Organization doesn't exist, create it
      const { data: newOrg, error: createOrgError } = await supabase
        .from('organizations')
        .insert({
          name: 'Demo Organization',
          domain: 'startuppath.ai'
        })
        .select()
        .single();
      
      if (createOrgError) {
        console.log('❌ Error creating organization:', createOrgError.message);
        return;
      }
      
      demoOrg = newOrg;
      console.log('✅ Created demo organization with ID:', demoOrg.id);
    } else if (orgCheckError) {
      console.log('❌ Error checking organization:', orgCheckError.message);
      return;
    } else {
      demoOrg = existingOrg;
      console.log('✅ Demo organization already exists with ID:', demoOrg.id);
    }

    // Step 2: Create demo user in users table
    console.log('\n👤 Step 2: Creating demo user...');
    
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'user@startuppath.ai')
      .single();
    
    if (userCheckError && userCheckError.code === 'PGRST116') {
      // User doesn't exist, create it
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          email: 'user@startuppath.ai',
          full_name: 'Demo User',
          org_id: demoOrg.id,
          role: 'admin'
        })
        .select()
        .single();
      
      if (createUserError) {
        console.log('❌ Error creating user:', createUserError.message);
        console.log('Full error:', createUserError);
      } else {
        console.log('✅ Created demo user');
        console.log('📧 Email:', newUser.email);
        console.log('🏢 Organization ID:', newUser.org_id);
        console.log('👤 Role:', newUser.role);
      }
    } else if (userCheckError) {
      console.log('❌ Error checking user:', userCheckError.message);
    } else {
      console.log('✅ Demo user already exists');
      console.log('📧 Email:', existingUser.email);
      console.log('🏢 Organization ID:', existingUser.org_id);
    }

    // Step 3: Try to create auth user via sign up
    console.log('\n🔐 Step 3: Creating auth user...');
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'user@startuppath.ai',
      password: 'demo123'
    });
    
    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        console.log('✅ Auth user already exists');
        
        // Try to sign in to verify
        console.log('🔐 Testing sign in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'user@startuppath.ai',
          password: 'demo123'
        });
        
        if (signInError) {
          console.log('❌ Sign in failed:', signInError.message);
          
          if (signInError.message.includes('Email not confirmed')) {
            console.log('⚠️  Email confirmation required. User needs to be confirmed manually.');
          }
        } else {
          console.log('✅ Sign in successful!');
          console.log('🆔 User ID:', signInData.user?.id);
        }
        
      } else {
        console.log('❌ Sign up failed:', signUpError.message);
      }
    } else {
      console.log('✅ Auth user created successfully!');
      console.log('🆔 User ID:', signUpData.user?.id);
      console.log('📧 Email confirmed:', signUpData.user?.email_confirmed_at ? 'YES' : 'PENDING');
      
      if (!signUpData.user?.email_confirmed_at) {
        console.log('⚠️  Email confirmation is pending. Check if you need to disable email confirmation in Supabase settings.');
      }
    }

    console.log('\n🎯 SETUP SUMMARY');
    console.log('================');
    console.log('✅ Demo organization created/verified');
    console.log('✅ Demo user created/verified in users table');
    console.log('📧 Email: user@startuppath.ai');
    console.log('🔑 Password: demo123');
    
    console.log('\n🔧 IF LOGIN STILL FAILS:');
    console.log('Go to: https://supabase.com/dashboard/project/oftpmcfukkidmjvzeqfc/auth/users');
    console.log('1. Find user@startuppath.ai');
    console.log('2. If missing, click "Add user" and create manually');
    console.log('3. If exists but unconfirmed, click user and confirm email');
    console.log('4. Or disable email confirmation in Auth > Settings');

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
})();