const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testOriginalAuth() {
  console.log('🔐 TESTING ORIGINAL LOGIN PAGE AUTHENTICATION');
  console.log('============================================');
  console.log('URL: http://localhost:3000/login');
  console.log('Email: user@startuppath.ai');
  console.log('Password: demo123\n');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  try {
    // Test the exact authentication the login page will use
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    });
    
    if (error) {
      console.log('❌ LOGIN FAILED:', error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        console.log('\n🔧 TO FIX THIS:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Authentication → Settings');
        console.log('3. Turn OFF "Enable email confirmations"');
        console.log('4. Save settings');
        console.log('5. Try login again');
      }
      return;
    }
    
    console.log('✅ AUTHENTICATION SUCCESSFUL!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Email confirmed:', !!data.user.email_confirmed_at);
    
    // Test if user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('spath_users')
      .select('*, spath_orgs(*)')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.log('⚠️  No user profile in database yet');
    } else {
      console.log('✅ User profile found:', profile.name || profile.full_name);
    }
    
    await supabase.auth.signOut();
    
    console.log('\n🎉 ORIGINAL LOGIN PAGE IS READY!');
    console.log('🔗 Go to: http://localhost:3000/login');
    console.log('📧 Email: user@startuppath.ai');
    console.log('🔑 Password: demo123');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testOriginalAuth();