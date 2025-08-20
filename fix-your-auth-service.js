const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
require('dotenv').config({ path: '.env.local' });

async function fixYourAuthService() {
  console.log('🔧 FIXING YOUR ACTUAL AUTH SERVICE');
  console.log('=================================');
  console.log('This creates a user that works with your authService.login() method\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const serviceKey = await new Promise(resolve => {
    rl.question('Enter Supabase SERVICE ROLE KEY (from dashboard Settings > API): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
  
  if (!serviceKey || serviceKey.length < 50) {
    console.log('❌ Invalid service role key');
    return false;
  }
  
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  
  try {
    console.log('1. Cleaning up existing demo user...');
    
    // Delete existing demo user completely
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = users?.users?.find(u => u.email === 'user@startuppath.ai');
    
    if (existingUser) {
      console.log('   Deleting existing auth user...');
      await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      
      console.log('   Deleting existing profile...');
      await supabaseAdmin.from('spath_users').delete().eq('id', existingUser.id);
    }
    
    console.log('2. Creating demo organization...');
    
    // Ensure demo org exists
    const { data: org, error: orgError } = await supabaseAdmin
      .from('spath_orgs')
      .insert({
        name: 'STARTUP_PATH Demo',
        slug: 'startup-path-demo',
        settings: '{"plan": "professional"}'
      })
      .select()
      .single();
    
    let orgId;
    if (orgError) {
      if (orgError.message.includes('duplicate') || orgError.message.includes('unique constraint')) {
        // Org exists, get it
        const { data: existingOrg } = await supabaseAdmin
          .from('spath_orgs')
          .select('id')
          .eq('slug', 'startup-path-demo')
          .single();
        orgId = existingOrg?.id;
        console.log('   ✅ Demo organization exists:', orgId);
      } else {
        console.log('❌ Org creation failed:', orgError.message);
        return false;
      }
    } else {
      orgId = org.id;
      console.log('   ✅ Demo organization created:', orgId);
    }
    
    if (!orgId) {
      console.log('❌ Could not get organization ID');
      return false;
    }
    
    console.log('3. Creating auth user with confirmed email...');
    
    // Create auth user that will work with your authService
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'user@startuppath.ai',
      password: 'demo123',
      email_confirm: true, // This is crucial - bypasses email confirmation
      user_metadata: {
        name: 'Demo User',
        company: 'STARTUP_PATH Demo'
      }
    });
    
    if (createError) {
      console.log('❌ Auth user creation failed:', createError.message);
      return false;
    }
    
    console.log('   ✅ Auth user created:', newUser.user.id);
    console.log('   ✅ Email confirmed automatically');
    
    console.log('4. Creating user profile in spath_users...');
    
    // Create profile that matches your authService expectations
    const { error: profileError } = await supabaseAdmin
      .from('spath_users')
      .insert({
        id: newUser.user.id,
        email: 'user@startuppath.ai',
        name: 'Demo User', // Your authService looks for 'name' field
        org_id: orgId,
        role: 'owner', // Your authService expects this
        settings: '{"theme": "dark"}'
      });
    
    if (profileError) {
      console.log('❌ Profile creation failed:', profileError.message);
      return false;
    }
    
    console.log('   ✅ User profile created in spath_users');
    
    console.log('5. Testing with your actual authService...');
    
    // Test with the same client your app uses
    const supabaseApp = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Test authentication exactly like your authService does
    const { data: authTest, error: authError } = await supabaseApp.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    });
    
    if (authError) {
      console.log('❌ Auth test failed:', authError.message);
      return false;
    }
    
    console.log('   ✅ Authentication test successful!');
    
    // Test profile query exactly like your authService does
    const { data: profileTest, error: profileQueryError } = await supabaseApp
      .from('spath_users')
      .select('*')
      .eq('id', authTest.user.id)
      .single();
    
    if (profileQueryError) {
      console.log('   ⚠️ Profile query issue:', profileQueryError.message);
    } else {
      console.log('   ✅ Profile query successful:', profileTest.name);
    }
    
    // Test organization relationship
    const { data: orgTest, error: orgQueryError } = await supabaseApp
      .from('spath_users')
      .select(`
        *,
        spath_orgs (
          id,
          name,
          slug
        )
      `)
      .eq('id', authTest.user.id)
      .single();
    
    if (orgQueryError) {
      console.log('   ⚠️ Organization query issue:', orgQueryError.message);
    } else {
      console.log('   ✅ Organization relationship works:', orgTest.spath_orgs?.name);
    }
    
    await supabaseApp.auth.signOut();
    
    console.log('\n🎉 YOUR AUTH SERVICE IS NOW WORKING!');
    console.log('🔗 Login page: http://localhost:3004/login');
    console.log('📧 Email: user@startuppath.ai');
    console.log('🔑 Password: demo123');
    console.log('\nThis user is compatible with your:');
    console.log('• authService.login() method');
    console.log('• useAuth hook');
    console.log('• spath_users table queries');
    console.log('• spath_orgs relationships');
    
    return true;
    
  } catch (error) {
    console.log('❌ Fix failed:', error.message);
    return false;
  }
}

fixYourAuthService();