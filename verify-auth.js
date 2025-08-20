const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verifyAuth() {
  console.log('🔍 VERIFYING AUTHENTICATION SETUP...');
  console.log('===================================');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('1. Environment check:');
  console.log('   Supabase URL:', supabaseUrl);
  console.log('   Anon key present:', !!anonKey);
  
  const supabase = createClient(supabaseUrl, anonKey);
  
  // Check if we can reach the database
  console.log('\n2. Database connectivity:');
  try {
    const { data, error } = await supabase.from('SPATH_users').select('count').limit(1);
    if (error) {
      console.log('   ❌ Database error:', error.message);
      return;
    }
    console.log('   ✅ Database connection works');
  } catch (err) {
    console.log('   ❌ Database connection failed:', err.message);
    return;
  }
  
  // Try different authentication methods
  console.log('\n3. Testing authentication methods:');
  
  // Method 1: Regular login
  console.log('   a) Regular signInWithPassword:');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    });
    
    if (error) {
      console.log('      ❌ Failed:', error.message);
    } else {
      console.log('      ✅ Success! User ID:', data.user?.id);
      
      // Test session
      const { data: session } = await supabase.auth.getSession();
      console.log('      Session valid:', !!session.session);
      
      return true;
    }
  } catch (err) {
    console.log('      ❌ Exception:', err.message);
  }
  
  // Method 2: Try signing up to see exact error
  console.log('   b) Testing signUp to see trigger status:');
  try {
    const { data, error } = await supabase.auth.signUp({
      email: `test-${Date.now()}@test.com`,
      password: 'TestPass123!'
    });
    
    if (error) {
      console.log('      ❌ SignUp failed:', error.message);
      if (error.message.includes('Database error')) {
        console.log('      🚨 Trigger is still active and failing!');
      }
    } else {
      console.log('      ✅ SignUp works, trigger fixed or disabled');
    }
  } catch (err) {
    console.log('      ❌ SignUp exception:', err.message);
  }
  
  console.log('\n🔍 Authentication diagnosis complete.');
  console.log('\nRecommendation:');
  console.log('- The manually created user may have password encryption issues');
  console.log('- Trigger may still be active and causing interference');
  console.log('- Try accessing the Supabase dashboard to verify user exists');
  
  return false;
}

verifyAuth().catch(console.error);