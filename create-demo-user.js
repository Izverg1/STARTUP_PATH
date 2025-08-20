/**
 * Create Demo User Script
 * This script creates the demo user in Supabase auth system
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oftpmcfukkidmjvzeqfc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHBtY2Z1a2tpZG1qdnplcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4OTYyODEsImV4cCI6MjA1MDQ3MjI4MX0.LdnXCY6lTpX9EOLwHbm7JkF9fUvf2hLFkrBCcvQbEKU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createDemoUser() {
  console.log('🚀 Creating demo user for STARTUP_PATH...\n')

  try {
    // Try to create the demo user
    const { data, error } = await supabase.auth.signUp({
      email: 'user@startuppath.ai',
      password: 'demo123',
      options: {
        data: {
          name: 'Demo User'
        }
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ Demo user already exists!')
        
        // Try to sign in to verify it works
        console.log('🔐 Testing login...')
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: 'user@startuppath.ai',
          password: 'demo123'
        })

        if (loginError) {
          console.log('❌ Login failed:', loginError.message)
        } else {
          console.log('✅ Login successful!')
          console.log('👤 User ID:', loginData.user?.id)
          console.log('📧 Email:', loginData.user?.email)
        }
      } else {
        console.log('❌ Error creating user:', error.message)
      }
    } else {
      console.log('✅ Demo user created successfully!')
      console.log('👤 User ID:', data.user?.id)
      console.log('📧 Email:', data.user?.email)
      console.log('🔑 Session created:', !!data.session)
      
      if (!data.session) {
        console.log('📧 Check email for confirmation link')
      }
    }

  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
  }

  console.log('\n🔍 Demo user creation complete!')
}

createDemoUser().catch(console.error)