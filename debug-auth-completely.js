const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function ultrathinkAuth() {
  console.log('🧠 ULTRATHINKING AUTHENTICATION FAILURE...')
  console.log('================================================')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  // 1. Check if we're connecting to the right Supabase instance
  console.log('1. ENVIRONMENT CHECK:')
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('Anon Key starts with:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20) + '...')
  
  // 2. Test basic Supabase connection
  console.log('\n2. BASIC CONNECTION TEST:')
  try {
    const { data, error } = await supabase.from('SPATH_users').select('count').limit(1)
    console.log('✅ Supabase connection works')
  } catch (err) {
    console.log('❌ Supabase connection failed:', err.message)
    return
  }
  
  // 3. Check what's actually in auth.users
  console.log('\n3. CHECKING AUTH.USERS TABLE:')
  try {
    // This won't work with anon key, but let's see the error
    const { data, error } = await supabase.from('auth.users').select('*')
    console.log('Auth users data:', data)
    console.log('Auth users error:', error)
  } catch (err) {
    console.log('Cannot access auth.users with anon key (expected):', err.message)
  }
  
  // 4. Test the exact login call that's failing
  console.log('\n4. TESTING EXACT FAILING LOGIN:')
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'user@startuppath.ai',
    password: 'demo123'
  })
  
  if (loginError) {
    console.log('❌ LOGIN FAILED:')
    console.log('Error message:', loginError.message)
    console.log('Error code:', loginError.status)
    console.log('Error name:', loginError.name)
    console.log('Full error object:', JSON.stringify(loginError, null, 2))
  } else {
    console.log('✅ LOGIN SUCCESS:')
    console.log('User ID:', loginData.user?.id)
    console.log('Email:', loginData.user?.email)
    console.log('Email confirmed:', loginData.user?.email_confirmed_at)
  }
  
  // 5. Check if user exists by trying to sign up
  console.log('\n5. TESTING IF USER EXISTS (via signup):')
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: 'user@startuppath.ai',
    password: 'demo123'
  })
  
  if (signupError) {
    if (signupError.message.includes('already registered')) {
      console.log('✅ User EXISTS but login fails - password issue?')
    } else {
      console.log('❌ Signup error:', signupError.message)
    }
  } else {
    console.log('⚠️  User was created via signup - didn\'t exist before')
  }
  
  // 6. Test with different email format
  console.log('\n6. TESTING EMAIL VARIATIONS:')
  const emailVariations = [
    'user@startuppath.ai',
    'User@startuppath.ai',
    'USER@STARTUPPATH.AI',
    'user@startuppath.ai ',  // with space
    ' user@startuppath.ai'   // with leading space
  ]
  
  for (const email of emailVariations) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: 'demo123'
    })
    console.log(`"${email}": ${error ? 'FAILED' : 'SUCCESS'}`)
  }
  
  console.log('\n🔍 ANALYSIS COMPLETE')
}

ultrathinkAuth().catch(console.error)