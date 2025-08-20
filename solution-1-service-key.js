const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
require('dotenv').config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function solution1ServiceKey() {
  console.log('🔑 SOLUTION 1: SERVICE ROLE KEY AUTHENTICATION');
  console.log('============================================');
  console.log('This creates a real user using Supabase admin API\n');
  
  const serviceKey = await new Promise(resolve => {
    rl.question('Enter your Supabase SERVICE ROLE KEY (from dashboard Settings > API): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
  
  if (!serviceKey || serviceKey.length < 50) {
    console.log('❌ Invalid service role key. Get it from Supabase dashboard.');
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
    console.log('1. Deleting any existing demo user...');
    
    // List and delete existing demo user
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = users?.users?.find(u => u.email === 'user@startuppath.ai');
    
    if (existingUser) {
      await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      await supabaseAdmin.from('spath_users').delete().eq('id', existingUser.id);
      console.log('   ✅ Existing user deleted');
    }
    
    console.log('2. Creating auth user with admin API...');
    
    // Create user with confirmed email
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'user@startuppath.ai',
      password: 'demo123',
      email_confirm: true, // This bypasses email confirmation
      user_metadata: {
        name: 'Demo User',
        company: 'STARTUP_PATH Demo'
      }
    });
    
    if (createError) {
      console.log('❌ User creation failed:', createError.message);
      return false;
    }
    
    console.log('   ✅ Auth user created:', newUser.user.id);
    
    console.log('3. Creating organization in spath_orgs...');
    
    // Create organization
    const { data: org, error: orgError } = await supabaseAdmin
      .from('spath_orgs')
      .insert({
        name: 'STARTUP_PATH Demo Organization',
        slug: 'startup-path-demo',
        plan: 'professional'
      })
      .select()
      .single();
    
    if (orgError && !orgError.message.includes('duplicate')) {
      console.log('❌ Organization creation failed:', orgError.message);
      return false;
    }
    
    const orgId = org?.id || (await supabaseAdmin.from('spath_orgs').select('id').eq('slug', 'startup-path-demo').single()).data?.id;
    console.log('   ✅ Organization ready:', orgId);
    
    console.log('4. Creating user profile in spath_users...');
    
    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('spath_users')
      .insert({
        id: newUser.user.id,
        email: 'user@startuppath.ai',
        name: 'Demo User',
        org_id: orgId,
        role: 'owner'
      });
    
    if (profileError) {
      console.log('❌ Profile creation failed:', profileError.message);
      return false;
    }
    
    console.log('   ✅ User profile created in spath_users');
    
    console.log('5. Testing authentication...');
    
    // Test with anon key (what the app uses)
    const supabaseAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data: testAuth, error: testError } = await supabaseAnon.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    });
    
    if (testError) {
      console.log('❌ Authentication test failed:', testError.message);
      return false;
    }
    
    console.log('   ✅ Authentication test SUCCESSFUL!');
    
    // Test profile fetch
    const { data: profile, error: profileFetchError } = await supabaseAnon
      .from('spath_users')
      .select('*, spath_orgs(*)')
      .eq('id', testAuth.user.id)
      .single();
    
    if (profileFetchError) {
      console.log('   ⚠️ Profile fetch issue:', profileFetchError.message);
    } else {
      console.log('   ✅ Profile found:', profile.name);
    }
    
    await supabaseAnon.auth.signOut();
    
    console.log('\n🎉 SOLUTION 1 COMPLETE!');
    console.log('🔗 Login at: http://localhost:3004/login');
    console.log('📧 Email: user@startuppath.ai');
    console.log('🔑 Password: demo123');
    
    return true;
    
  } catch (error) {
    console.log('❌ Solution 1 failed:', error.message);
    return false;
  }
}

solution1ServiceKey();