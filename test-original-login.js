const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testOriginalLogin() {
  console.log('🔐 TESTING ORIGINAL LOGIN PAGE AUTHENTICATION...');
  console.log('===============================================');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  console.log('Testing authentication with demo user...');
  console.log('Email: user@startuppath.ai');
  console.log('Password: demo123');
  
  try {
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    });
    
    if (loginError) {
      console.log('❌ Authentication failed:', loginError.message);
      console.log('   The original login page at http://localhost:3000/login will show this error');
      return false;
    }
    
    console.log('✅ AUTHENTICATION SUCCESSFUL!');
    console.log('   User ID:', loginData.user.id);
    console.log('   Email:', loginData.user.email);
    console.log('   Session valid:', !!loginData.session?.access_token);
    
    // Test user profile fetch (what the app will do after login)
    const { data: profile, error: profileError } = await supabase
      .from('spath_users')
      .select('*, spath_orgs(*)')
      .eq('id', loginData.user.id)
      .single();
    
    if (profileError) {
      console.log('⚠️  Profile fetch warning:', profileError.message);
    } else {
      console.log('✅ User profile found:');
      console.log('   Name:', profile.name);
      console.log('   Role:', profile.role);
      console.log('   Organization:', profile.spath_orgs?.name);
    }
    
    console.log('\n🎉 ORIGINAL LOGIN PAGE READY!');
    console.log('🔗 Use the original login page: http://localhost:3000/login');
    console.log('   Email: user@startuppath.ai');
    console.log('   Password: demo123');
    
    return true;
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    return false;
  }
}

testOriginalLogin().catch(console.error);