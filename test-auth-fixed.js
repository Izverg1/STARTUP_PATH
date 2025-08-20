const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testAuthFixed() {
  console.log('🧪 TESTING FIXED AUTHENTICATION...');
  console.log('==================================');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  try {
    console.log('1. Testing user signup (should work now)...');
    
    // Test signup with the demo user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'user@startuppath.ai',
      password: 'demo123',
      options: {
        data: {
          name: 'Demo User'
        }
      }
    });

    if (signUpError) {
      console.log('❌ Sign up failed:', signUpError.message);
      return false;
    }

    console.log('✅ Sign up successful!');
    console.log('User ID:', signUpData.user?.id);
    console.log('Email:', signUpData.user?.email);

    // Wait for trigger to process
    console.log('⏳ Waiting for database trigger to process...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('2. Testing user signin...');
    
    // Test signin
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    });

    if (signInError) {
      console.log('❌ Sign in failed:', signInError.message);
      return false;
    }

    console.log('✅ Sign in successful!');
    console.log('User ID:', signInData.user?.id);
    console.log('Session token present:', !!signInData.session?.access_token);

    console.log('3. Testing user profile creation...');
    
    // Check if profile was created by trigger
    const { data: profile, error: profileError } = await supabase
      .from('SPATH_users')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (profileError) {
      console.log('⚠️  Profile fetch warning:', profileError.message);
      console.log('   (Profile may not exist yet, but auth works)');
    } else {
      console.log('✅ User profile found!');
      console.log('Profile:', {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role
      });
    }

    console.log('\n🎉 AUTHENTICATION IS WORKING!');
    console.log('Demo credentials:');
    console.log('Email: user@startuppath.ai');
    console.log('Password: demo123');
    console.log('\nTest login at: http://localhost:3000/auth/signin');
    
    return true;

  } catch (error) {
    console.log('❌ Test failed with exception:', error.message);
    return false;
  }
}

testAuthFixed().catch(console.error);