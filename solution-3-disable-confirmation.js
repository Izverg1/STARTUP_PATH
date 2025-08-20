const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function solution3DisableConfirmation() {
  console.log('📧 SOLUTION 3: DISABLE EMAIL CONFIRMATION + SIGNUP');
  console.log('================================================');
  console.log('This uses regular signup after disabling email confirmation\n');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  try {
    console.log('📋 STEP 1: Manual Supabase Dashboard Configuration');
    console.log('You need to do this FIRST:');
    console.log('1. Go to: https://oftpmcfukkidmjvzeqfc.supabase.co');
    console.log('2. Authentication → Settings');
    console.log('3. Turn OFF "Enable email confirmations"');
    console.log('4. Save settings');
    console.log('5. Come back and continue this script\n');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const confirmed = await new Promise(resolve => {
      rl.question('Have you disabled email confirmations in Supabase? (y/n): ', (answer) => {
        rl.close();
        resolve(answer.toLowerCase().startsWith('y'));
      });
    });
    
    if (!confirmed) {
      console.log('❌ Please complete the dashboard configuration first.');
      return false;
    }
    
    console.log('📋 STEP 2: Creating demo organization...');
    
    // First ensure we have an organization (this might fail due to RLS, that's ok)
    const { data: existingOrg } = await supabase
      .from('spath_orgs')
      .select('id')
      .eq('slug', 'startup-path-demo')
      .single();
    
    if (!existingOrg) {
      const { data: newOrg, error: orgError } = await supabase
        .from('spath_orgs')
        .insert({
          name: 'STARTUP_PATH Demo Organization',
          slug: 'startup-path-demo',
          plan: 'professional'
        })
        .select()
        .single();
      
      if (orgError) {
        console.log('⚠️ Organization creation failed (RLS issue), continuing...');
        console.log('   Will create in SQL or manually if needed');
      } else {
        console.log('   ✅ Organization created:', newOrg.id);
      }
    } else {
      console.log('   ✅ Organization exists:', existingOrg.id);
    }
    
    console.log('📋 STEP 3: Signing up demo user...');
    
    // Sign up the demo user
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: 'user@startuppath.ai',
      password: 'demo123',
      options: {
        data: {
          name: 'Demo User',
          company: 'STARTUP_PATH Demo'
        }
      }
    });
    
    if (signupError) {
      console.log('❌ Signup failed:', signupError.message);
      
      if (signupError.message.includes('User already registered')) {
        console.log('   User exists, testing login...');
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: 'user@startuppath.ai',
          password: 'demo123'
        });
        
        if (loginError) {
          console.log('❌ Login failed:', loginError.message);
          console.log('   You may need to delete the existing user first');
          return false;
        }
        
        console.log('✅ Existing user can login successfully!');
        await supabase.auth.signOut();
        
      } else {
        return false;
      }
    } else {
      console.log('   ✅ User signup successful:', signupData.user?.id);
      
      // Test immediate login
      console.log('📋 STEP 4: Testing immediate login...');
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'user@startuppath.ai',
        password: 'demo123'
      });
      
      if (loginError) {
        console.log('❌ Login test failed:', loginError.message);
        console.log('   Email confirmation might still be enabled');
        return false;
      }
      
      console.log('   ✅ Login test successful!');
      
      // Create user profile if it doesn't exist
      const { data: profile, error: profileError } = await supabase
        .from('spath_users')
        .select('*')
        .eq('id', loginData.user.id)
        .single();
      
      if (profileError) {
        console.log('📋 STEP 5: Creating user profile...');
        console.log('   Note: This might fail due to RLS, but authentication will work');
        
        const { error: insertError } = await supabase
          .from('spath_users')
          .insert({
            id: loginData.user.id,
            email: 'user@startuppath.ai',
            name: 'Demo User',
            role: 'owner'
          });
        
        if (insertError) {
          console.log('   ⚠️ Profile creation failed (likely RLS), but auth works');
        } else {
          console.log('   ✅ Profile created');
        }
      } else {
        console.log('📋 STEP 5: User profile already exists');
      }
      
      await supabase.auth.signOut();
    }
    
    console.log('\n🎉 SOLUTION 3 COMPLETE!');
    console.log('🔗 Login at: http://localhost:3004/login');
    console.log('📧 Email: user@startuppath.ai');
    console.log('🔑 Password: demo123');
    console.log('\n📋 Note: If profile creation failed due to RLS, the user');
    console.log('can still authenticate, and profile will be created on first login.');
    
    return true;
    
  } catch (error) {
    console.log('❌ Solution 3 failed:', error.message);
    return false;
  }
}

solution3DisableConfirmation();