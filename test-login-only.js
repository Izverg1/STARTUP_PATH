const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testLoginOnly() {
  console.log('🔐 TESTING LOGIN WITH MANUALLY CREATED USER...');
  console.log('==============================================');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  try {
    console.log('Testing signin with manually created demo user...');
    
    // Test signin with the manually created user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    });

    if (signInError) {
      console.log('❌ Sign in failed:', signInError.message);
      console.log('Error code:', signInError.status);
      return false;
    }

    console.log('✅ SIGN IN SUCCESSFUL!');
    console.log('User ID:', signInData.user?.id);
    console.log('Email:', signInData.user?.email);
    console.log('Email confirmed:', signInData.user?.email_confirmed_at);
    console.log('Session token present:', !!signInData.session?.access_token);

    console.log('\n2. Testing user profile fetch...');
    
    // Check if profile exists in SPATH_users
    const { data: profile, error: profileError } = await supabase
      .from('SPATH_users')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (profileError) {
      console.log('⚠️  Profile fetch error:', profileError.message);
    } else {
      console.log('✅ User profile found!');
      console.log('Profile:', {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        is_active: profile.is_active
      });
    }

    console.log('\n🎉 AUTHENTICATION IS WORKING!');
    console.log('✅ Login successful with credentials:');
    console.log('   Email: user@startuppath.ai');
    console.log('   Password: demo123');
    console.log('\n🔗 Test in browser: http://localhost:3000/auth/signin');
    
    return true;

  } catch (error) {
    console.log('❌ Test failed with exception:', error.message);
    return false;
  }
}

testLoginOnly().catch(console.error);