const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testSupabaseConfig() {
  console.log('🔧 TESTING SUPABASE PROJECT CONFIGURATION...')
  console.log('===============================================')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  // Test basic auth functionality
  console.log('1. Testing auth service status...')
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log('✅ Auth service responds')
  } catch (err) {
    console.log('❌ Auth service error:', err.message)
    return
  }
  
  // Try to create a test user with a unique email
  console.log('\n2. Testing user creation with unique email...')
  const testEmail = `test-${Date.now()}@example.com`
  
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'testpass123'
  })
  
  if (signupError) {
    console.log('❌ SIGNUP FAILED:')
    console.log('Error:', signupError.message)
    console.log('Code:', signupError.status)
    
    if (signupError.message.includes('Database error')) {
      console.log('\n🚨 CRITICAL: Database trigger or constraint issue!')
      console.log('   This suggests the Supabase project auth tables are misconfigured')
      console.log('   or there are custom triggers failing during user creation.')
    }
  } else {
    console.log('✅ SIGNUP SUCCESS!')
    console.log('User created:', signupData.user?.id)
    
    // Try to sign in immediately
    console.log('\n3. Testing immediate signin...')
    const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: 'testpass123'
    })
    
    if (signinError) {
      console.log('❌ Signin failed:', signinError.message)
    } else {
      console.log('✅ Signin success!')
    }
    
    // Clean up test user
    try {
      await supabase.auth.signOut()
    } catch (e) {}
  }
  
  console.log('\n🔍 CONFIGURATION TEST COMPLETE')
}

testSupabaseConfig().catch(console.error)