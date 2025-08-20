const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oftpmcfukkidmjvzeqfc.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHBtY2Z1a2tpZG1qdnplcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4OTYyODEsImV4cCI6MjA1MDQ3MjI4MX0.LdnXCY6lTpX9EOLwHbm7JkF9fUvf2hLFkrBCcvQbEKU';

const supabase = createClient(supabaseUrl, anonKey);

(async () => {
  console.log('🧪 Testing Authentication After Manual User Creation');
  console.log('==================================================');

  console.log('\n🔐 Testing sign in with demo credentials...');
  console.log('Email: user@startuppath.ai');
  console.log('Password: demo123');

  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    });

    if (signInError) {
      console.log('❌ AUTHENTICATION FAILED');
      console.log('Error:', signInError.message);
      console.log('');
      
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('🎯 ACTION NEEDED: User does not exist or password is wrong');
        console.log('');
        console.log('📋 MANUAL STEPS:');
        console.log('1. Go to: https://supabase.com/dashboard/project/oftpmcfukkidmjvzeqfc/auth/users');
        console.log('2. Click "Add user"');
        console.log('3. Email: user@startuppath.ai');
        console.log('4. Password: demo123');
        console.log('5. ✅ Enable "Auto Confirm User"');
        console.log('6. Click "Create user"');
        console.log('7. Run this test again');
        
      } else if (signInError.message.includes('Email not confirmed')) {
        console.log('🎯 ACTION NEEDED: User exists but email not confirmed');
        console.log('');
        console.log('📋 MANUAL STEPS:');
        console.log('1. Go to: https://supabase.com/dashboard/project/oftpmcfukkidmjvzeqfc/auth/users');
        console.log('2. Find user@startuppath.ai');
        console.log('3. Click on the user');
        console.log('4. Click "Confirm user" or similar action');
        console.log('5. Run this test again');
        
      } else {
        console.log('🎯 UNEXPECTED ERROR - investigate further');
      }
      
    } else {
      console.log('✅ AUTHENTICATION SUCCESSFUL!');
      console.log('');
      console.log('🎉 User Details:');
      console.log('🆔 ID:', signInData.user.id);
      console.log('📧 Email:', signInData.user.email);
      console.log('✅ Email Confirmed:', signInData.user.email_confirmed_at ? 'YES' : 'NO');
      console.log('🕐 Created:', signInData.user.created_at);
      console.log('🔑 Has Session:', !!signInData.session);
      
      console.log('');
      console.log('🚀 READY TO TEST IN BROWSER:');
      console.log('1. Go to: http://localhost:3004/login');
      console.log('2. The form should be pre-filled with demo credentials');
      console.log('3. Click "Sign In"');
      console.log('4. Should redirect to dashboard successfully!');
      
      // Test fetching user profile (optional)
      console.log('');
      console.log('👤 Testing user profile fetch...');
      
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', signInData.user.id)
        .single();
      
      if (profileError) {
        console.log('⚠️  User profile not found (this is OK for demo)');
        console.log('Profile error:', profileError.message);
        console.log('The auth service will use default demo user data.');
      } else {
        console.log('✅ User profile found:');
        console.log('Name:', userProfile.full_name);
        console.log('Role:', userProfile.role);
        console.log('Org ID:', userProfile.org_id);
      }
      
      // Sign out to clean up
      await supabase.auth.signOut();
    }

  } catch (error) {
    console.log('❌ UNEXPECTED ERROR:', error.message);
  }

  console.log('');
  console.log('🔚 Test complete.');
})();