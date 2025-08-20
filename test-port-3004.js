const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testPort3004() {
  console.log('🔐 TESTING AUTHENTICATION FOR PORT 3004');
  console.log('======================================');
  console.log('URL: http://localhost:3004/login');
  console.log('Email: user@startuppath.ai');
  console.log('Password: demo123\n');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  try {
    // Test authentication exactly as shown in the screenshot
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    });
    
    if (error) {
      console.log('❌ AUTHENTICATION FAILED:', error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        console.log('\n🔧 TO FIX - DISABLE EMAIL CONFIRMATION:');
        console.log('1. Go to Supabase dashboard: https://oftpmcfukkidmjvzeqfc.supabase.co');
        console.log('2. Authentication → Settings');
        console.log('3. Turn OFF "Enable email confirmations"');
        console.log('4. Save and refresh the page');
      }
      return;
    }
    
    console.log('✅ AUTHENTICATION WORKING!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    
    await supabase.auth.signOut();
    
    console.log('\n🎉 LOGIN PAGE IS READY!');
    console.log('🔗 Go to: http://localhost:3004/login');
    console.log('📧 Email: user@startuppath.ai');
    console.log('🔑 Password: demo123');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testPort3004();