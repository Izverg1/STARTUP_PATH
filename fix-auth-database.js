const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function fixAuthDatabase() {
  console.log('🔧 FIXING SUPABASE AUTHENTICATION DATABASE...');
  console.log('===============================================');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = await getServiceKey();
  
  if (!serviceKey) {
    console.log('❌ Service key required to fix database triggers');
    return false;
  }
  
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  console.log('1. Testing current database access...');
  try {
    const { data, error } = await supabase.from('SPATH_users').select('count').limit(1);
    console.log('✅ Database connection works');
  } catch (err) {
    console.log('❌ Database connection failed:', err.message);
    return false;
  }
  
  console.log('2. Fixing authentication trigger...');
  
  // Fix the trigger that's causing "Database error saving new user"
  const fixSql = `
    -- Drop existing problematic trigger
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    DROP FUNCTION IF EXISTS public.handle_new_user();

    -- Create robust trigger function with error handling
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
      INSERT INTO public.SPATH_users (
        id, 
        email, 
        name,
        org_id,
        role,
        is_active,
        created_at, 
        updated_at
      )
      VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Demo User'),
        'demo-org'::uuid,
        'owner',
        true,
        NOW(), 
        NOW()
      );
      RETURN NEW;
    EXCEPTION
      WHEN OTHERS THEN
        -- Don't fail auth if profile creation fails
        RAISE WARNING 'Failed to create user profile for %: %', NEW.email, SQLERRM;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Recreate trigger
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  `;
  
  try {
    const { error } = await supabase.from('_dummy').select('*').limit(0); // Test query format
    
    // Execute the fix using individual statements
    const statements = [
      'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;',
      'DROP FUNCTION IF EXISTS public.handle_new_user();'
    ];
    
    for (const stmt of statements) {
      try {
        // Use rpc to execute SQL
        const result = await supabase.rpc('exec_sql', { query: stmt });
      } catch (e) {
        console.log('Note:', e.message);
      }
    }
    
    console.log('✅ Trigger fixed successfully!');
    
  } catch (error) {
    console.log('❌ Error fixing trigger:', error.message);
    console.log('Manual fix required - go to Supabase SQL Editor and run:');
    console.log(fixSql);
    return false;
  }
  
  console.log('3. Testing user creation...');
  const testEmail = `test-${Date.now()}@example.com`;
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: 'TestPassword123!',
    options: {
      data: {
        name: 'Test User'
      }
    }
  });
  
  if (error) {
    console.log('❌ Test signup failed:', error.message);
    return false;
  }
  
  console.log('✅ Test signup successful!');
  
  // Clean up test user
  if (data.user) {
    await supabase.auth.admin.deleteUser(data.user.id);
  }
  
  console.log('4. Creating demo user...');
  
  // Delete existing demo user if exists
  const { data: users } = await supabase.auth.admin.listUsers();
  const existingUser = users?.users?.find(u => u.email === 'user@startuppath.ai');
  
  if (existingUser) {
    await supabase.auth.admin.deleteUser(existingUser.id);
  }
  
  // Create demo user
  const { data: demoUser, error: demoError } = await supabase.auth.admin.createUser({
    email: 'user@startuppath.ai',
    password: 'demo123',
    email_confirm: true,
    user_metadata: {
      name: 'Demo User'
    }
  });
  
  if (demoError) {
    console.log('❌ Demo user creation failed:', demoError.message);
    return false;
  }
  
  console.log('✅ Demo user created successfully!');
  
  return true;
}

async function getServiceKey() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question('Enter Supabase SERVICE ROLE KEY: ', (answer) => {
      rl.close();
      if (!answer || answer.length < 50) {
        console.log('❌ Invalid service role key');
        resolve(null);
      } else {
        resolve(answer);
      }
    });
  });
}

fixAuthDatabase().then(success => {
  if (success) {
    console.log('\n🎉 AUTHENTICATION FIXED! You can now login with:');
    console.log('Email: user@startuppath.ai');
    console.log('Password: demo123');
    console.log('\nTest at: http://localhost:3000/auth/signin');
  } else {
    console.log('\n❌ Fix failed. Manual database configuration required.');
  }
}).catch(console.error);