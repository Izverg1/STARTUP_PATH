const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testAuthCorrectTables() {
  console.log('🧪 TESTING AUTH WITH CORRECT TABLE NAMES...');
  console.log('==========================================');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  console.log('1. Testing table access with correct names...');
  
  const testTables = ['spath_orgs', 'spath_users', 'spath_projects', 'spath_experiments'];
  
  for (const table of testTables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: exists and accessible`);
      }
    } catch (e) {
      console.log(`   ❌ ${table}: ${e.message}`);
    }
  }
  
  console.log('\n2. Testing authentication with existing user...');
  
  // Test login
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'user@startuppath.ai',
    password: 'demo123'
  });
  
  if (loginError) {
    console.log('   ❌ Login failed:', loginError.message);
    
    // If login fails, try to create the user
    console.log('\n3. Attempting to create demo user...');
    
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: 'user@startuppath.ai',
      password: 'demo123',
      options: {
        data: {
          name: 'Demo User'
        }
      }
    });
    
    if (signupError) {
      console.log('   ❌ Signup failed:', signupError.message);
      return false;
    } else {
      console.log('   ✅ User created successfully!');
      console.log('   User ID:', signupData.user?.id);
      
      // Try login again
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: loginData2, error: loginError2 } = await supabase.auth.signInWithPassword({
        email: 'user@startuppath.ai',
        password: 'demo123'
      });
      
      if (loginError2) {
        console.log('   ❌ Login after signup failed:', loginError2.message);
        return false;
      } else {
        console.log('   ✅ Login after signup successful!');
      }
    }
  } else {
    console.log('   ✅ Login successful!');
    console.log('   User ID:', loginData.user?.id);
    console.log('   Email:', loginData.user?.email);
  }
  
  console.log('\n🎉 AUTHENTICATION IS WORKING!');
  console.log('Demo credentials:');
  console.log('   Email: user@startuppath.ai');
  console.log('   Password: demo123');
  console.log('\n🔗 Test at: http://localhost:3000/auth/signin');
  
  return true;
}

testAuthCorrectTables().catch(console.error);