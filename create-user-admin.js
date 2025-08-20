const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
require('dotenv').config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createUserAdmin() {
  console.log('🔐 CREATING DEMO USER WITH ADMIN API...');
  console.log('====================================');
  
  const serviceKey = await new Promise(resolve => {
    rl.question('Enter Supabase SERVICE ROLE KEY: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
  
  if (!serviceKey || serviceKey.length < 50) {
    console.log('❌ Invalid service role key');
    return false;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  try {
    console.log('1. Deleting existing demo user if exists...');
    
    // Check if user exists and delete
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = users?.users?.find(u => u.email === 'user@startuppath.ai');
    
    if (existingUser) {
      console.log('   Deleting existing user:', existingUser.id);
      await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      
      // Also delete from spath_users
      await supabaseAdmin.from('spath_users').delete().eq('email', 'user@startuppath.ai');
    }
    
    console.log('2. Creating new demo user with admin API...');
    
    // Create user with admin API (proper password hashing)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'user@startuppath.ai',
      password: 'demo123',
      email_confirm: true,
      user_metadata: {
        name: 'Demo User'
      }
    });
    
    if (createError) {
      console.log('❌ User creation failed:', createError.message);
      return false;
    }
    
    console.log('✅ Auth user created:', newUser.user.id);
    
    console.log('3. Creating user profile in spath_users...');
    
    // Get demo org
    const { data: org } = await supabaseAdmin
      .from('spath_orgs')
      .select('id')
      .eq('slug', 'demo-org')
      .single();
    
    if (!org) {
      console.log('❌ Demo organization not found');
      return false;
    }
    
    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('spath_users')
      .insert({
        id: newUser.user.id,
        email: 'user@startuppath.ai',
        name: 'Demo User',
        org_id: org.id,
        role: 'owner',
        settings: { theme: 'dark', notifications: true }
      });
    
    if (profileError) {
      console.log('⚠️  Profile creation warning:', profileError.message);
    } else {
      console.log('✅ User profile created');
    }
    
    console.log('4. Testing login with regular client...');
    
    // Wait a moment for everything to propagate
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test with anon key
    const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const { data: loginData, error: loginError } = await supabaseAnon.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    });
    
    if (loginError) {
      console.log('❌ Login test failed:', loginError.message);
      return false;
    }
    
    console.log('✅ LOGIN TEST SUCCESSFUL!');
    console.log('   User ID:', loginData.user.id);
    console.log('   Email:', loginData.user.email);
    console.log('   Email confirmed:', !!loginData.user.email_confirmed_at);
    
    console.log('\n🎉 AUTHENTICATION IS WORKING!');
    console.log('Demo credentials:');
    console.log('   Email: user@startuppath.ai');
    console.log('   Password: demo123');
    console.log('\n🔗 Test at: http://localhost:3000/auth/signin');
    
    return true;
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

createUserAdmin().catch(console.error);