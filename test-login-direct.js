const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testDirectLogin() {
  console.log('🔍 TESTING DIRECT LOGIN...')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('Anon Key present:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  
  try {
    // Test the exact same call the auth service makes
    console.log('\nTesting signInWithPassword...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    })
    
    if (error) {
      console.log('❌ SUPABASE AUTH ERROR:', error.message)
      console.log('Error code:', error.status)
      console.log('Full error:', JSON.stringify(error, null, 2))
      return false
    }
    
    if (!data.user) {
      console.log('❌ No user data returned')
      return false
    }
    
    console.log('✅ LOGIN SUCCESS!')
    console.log('User ID:', data.user.id)
    console.log('Email:', data.user.email)
    console.log('Email confirmed:', data.user.email_confirmed_at)
    
    return true
    
  } catch (err) {
    console.log('❌ EXCEPTION:', err.message)
    return false
  }
}

testDirectLogin()