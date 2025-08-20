/**
 * Debug Authentication Script
 * This script will systematically check the Supabase auth system
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oftpmcfukkidmjvzeqfc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHBtY2Z1a2tpZG1qdnplcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4OTYyODEsImV4cCI6MjA1MDQ3MjI4MX0.LdnXCY6lTpX9EOLwHbm7JkF9fUvf2hLFkrBCcvQbEKU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugAuthentication() {
  console.log('🔍 Starting authentication debug...\n')

  // Step 1: Check what tables exist
  console.log('1. Checking which SPATH tables exist...')
  const tables = ['SPATH_organizations', 'SPATH_users', 'SPATH_projects']
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1)
      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
      } else {
        console.log(`✅ ${table}: exists (${data?.length || 0} sample records)`)
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`)
    }
  }

  // Step 2: Check if SPATH_users table exists and structure
  console.log('2. Checking SPATH_users table structure...')
  try {
    const { data, error } = await supabase
      .from('SPATH_users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ SPATH_users table error:', error.message)
    } else {
      console.log('✅ SPATH_users table accessible')
      if (data.length > 0) {
        console.log('📋 Sample user structure:', Object.keys(data[0]))
      }
    }
  } catch (err) {
    console.log('❌ SPATH_users table check failed:', err.message)
  }

  // Step 3: Try to authenticate with the problem user
  console.log('\n3. Testing authentication with user@startuppath.ai...')
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    })

    if (authError) {
      console.log('❌ Authentication failed:', authError.message)
      console.log('🔍 Error details:', {
        status: authError.status,
        message: authError.message,
        __isAuthError: authError.__isAuthError
      })
    } else {
      console.log('✅ Authentication successful!')
      console.log('👤 User ID:', authData.user?.id)
      console.log('📧 Email:', authData.user?.email)
      console.log('🔑 Session exists:', !!authData.session)

      // Step 4: Check if user profile exists
      if (authData.user) {
        console.log('\n4. Checking user profile in SPATH_users...')
        const { data: profile, error: profileError } = await supabase
          .from('SPATH_users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (profileError) {
          console.log('❌ Profile lookup failed:', profileError.message)
          console.log('🔍 Profile error details:', {
            code: profileError.code,
            details: profileError.details,
            hint: profileError.hint
          })
        } else {
          console.log('✅ User profile found!')
          console.log('👤 Profile data:', profile)
        }
      }
    }
  } catch (err) {
    console.log('❌ Authentication test failed:', err.message)
  }

  // Step 5: Check auth.users table (if we have access)
  console.log('\n5. Checking auth.users table...')
  try {
    const { data: authUsers, error: authUsersError } = await supabase
      .from('auth.users')
      .select('id, email, created_at, email_confirmed_at')
      .eq('email', 'user@startuppath.ai')

    if (authUsersError) {
      console.log('❌ Cannot access auth.users:', authUsersError.message)
    } else {
      console.log('✅ Found user in auth.users:', authUsers)
    }
  } catch (err) {
    console.log('❌ auth.users check failed:', err.message)
  }

  // Step 6: Check for demo organization
  console.log('\n6. Checking for demo organization...')
  try {
    const { data: orgs, error: orgError } = await supabase
      .from('SPATH_organizations')
      .select('*')
      .eq('slug', 'startup-path-demo')

    if (orgError) {
      console.log('❌ Organization lookup failed:', orgError.message)
    } else {
      console.log('✅ Found demo organization:', orgs)
    }
  } catch (err) {
    console.log('❌ Organization check failed:', err.message)
  }

  console.log('\n🔍 Debug complete!')
}

debugAuthentication().catch(console.error)