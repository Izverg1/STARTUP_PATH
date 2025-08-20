const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oftpmcfukkidmjvzeqfc.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHBtY2Z1a2tpZG1qdnplcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4OTYyODEsImV4cCI6MjA1MDQ3MjI4MX0.LdnXCY6lTpX9EOLwHbm7JkF9fUvf2hLFkrBCcvQbEKU';

const supabase = createClient(supabaseUrl, anonKey);

(async () => {
  console.log('🚀 Creating Demo User for STARTUP_PATH');
  console.log('====================================');

  try {
    // First, create the organization if it doesn't exist
    console.log('\n🏢 Step 1: Creating demo organization...');
    
    let demoOrg;
    try {
      const { data: existingOrgs, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('name', 'Demo Organization');
      
      if (existingOrgs && existingOrgs.length > 0) {
        demoOrg = existingOrgs[0];
        console.log('✅ Demo organization already exists:', demoOrg.id);
      } else {
        const { data: newOrg, error: createOrgError } = await supabase
          .from('organizations')
          .insert([{
            name: 'Demo Organization',
            domain: 'startuppath.ai'
          }])
          .select()
          .single();
        
        if (createOrgError) {
          console.log('❌ Error creating organization:', createOrgError.message);
          // Continue without org for now
          demoOrg = { id: 'demo-org' };
        } else {
          demoOrg = newOrg;
          console.log('✅ Created demo organization:', demoOrg.id);
        }
      }
    } catch (err) {
      console.log('⚠️  Organization setup failed, continuing with demo org ID');
      demoOrg = { id: 'demo-org' };
    }

    // Step 2: Try to create the auth user through sign up
    console.log('\n🔐 Step 2: Creating auth user...');
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'user@startuppath.ai',
      password: 'demo123',
      options: {
        data: {
          full_name: 'Demo User'
        }
      }
    });
    
    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('✅ User already exists, trying sign in...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'user@startuppath.ai',
          password: 'demo123'
        });
        
        if (signInError) {
          console.log('❌ Sign in failed:', signInError.message);
          console.log('\n🎯 MANUAL STEPS REQUIRED:');
          console.log('1. Go to: https://supabase.com/dashboard/project/oftpmcfukkidmjvzeqfc/auth/users');
          console.log('2. Find user@startuppath.ai');
          console.log('3. If unconfirmed, click to confirm email');
          console.log('4. Or go to Auth > Settings and disable email confirmation');
        } else {
          console.log('✅ Sign in successful!');
          console.log('🆔 User ID:', signInData.user.id);
          
          // Try to create user profile
          await createUserProfile(signInData.user.id, demoOrg.id);
        }
        
      } else {
        console.log('❌ Sign up failed:', signUpError.message);
      }
    } else {
      console.log('✅ User created successfully!');
      console.log('🆔 User ID:', signUpData.user?.id);
      console.log('📧 Confirmation needed:', !signUpData.user?.email_confirmed_at);
      
      if (signUpData.user?.id) {
        await createUserProfile(signUpData.user.id, demoOrg.id);
      }
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }

  async function createUserProfile(userId, orgId) {
    console.log('\n👤 Step 3: Creating user profile...');
    
    try {
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId);
      
      if (existingUser && existingUser.length > 0) {
        console.log('✅ User profile already exists');
      } else {
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert([{
            id: userId,
            email: 'user@startuppath.ai',
            full_name: 'Demo User',
            org_id: orgId,
            role: 'owner'
          }])
          .select()
          .single();
        
        if (createUserError) {
          console.log('❌ Error creating user profile:', createUserError.message);
        } else {
          console.log('✅ Created user profile');
        }
      }
    } catch (err) {
      console.log('⚠️  User profile creation failed:', err.message);
    }
  }

  console.log('\n🎯 TESTING LOGIN NOW...');
  console.log('========================');

  // Test login
  const { data: testSignIn, error: testError } = await supabase.auth.signInWithPassword({
    email: 'user@startuppath.ai',
    password: 'demo123'
  });

  if (testError) {
    console.log('❌ Login test failed:', testError.message);
    
    if (testError.message.includes('Email not confirmed')) {
      console.log('\n⚠️  EMAIL CONFIRMATION REQUIRED');
      console.log('Go to: https://supabase.com/dashboard/project/oftpmcfukkidmjvzeqfc/auth/users');
      console.log('Find user@startuppath.ai and confirm the email');
    }
  } else {
    console.log('✅ LOGIN TEST SUCCESSFUL!');
    console.log('🆔 User ID:', testSignIn.user.id);
    console.log('📧 Email:', testSignIn.user.email);
    console.log('✅ Email confirmed:', testSignIn.user.email_confirmed_at ? 'YES' : 'NO');
  }
})();