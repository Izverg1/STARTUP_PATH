const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve))
}

async function createUser() {
  console.log('🔐 Creating demo user in Supabase Auth...')
  
  const serviceRoleKey = await question('Enter Supabase SERVICE ROLE KEY: ')
  
  if (!serviceRoleKey || serviceRoleKey.length < 50) {
    console.log('❌ Invalid service role key')
    process.exit(1)
  }
  
  const supabase = createClient(
    'https://oftpmcfukkidmjvzeqfc.supabase.co',
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  
  try {
    // Delete existing user if exists
    console.log('🗑️ Checking for existing user...')
    const { data: users } = await supabase.auth.admin.listUsers()
    const existingUser = users?.users?.find(u => u.email === 'user@startuppath.ai')
    
    if (existingUser) {
      console.log('🗑️ Deleting existing user:', existingUser.id)
      await supabase.auth.admin.deleteUser(existingUser.id)
    }
    
    // Create new user
    console.log('👤 Creating auth user...')
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'user@startuppath.ai',
      password: 'demo123',
      email_confirm: true,
      user_metadata: {
        name: 'Demo User'
      }
    })
    
    if (error) {
      console.log('❌ Error creating user:', error.message)
      process.exit(1)
    }
    
    console.log('✅ User created successfully!')
    console.log('User ID:', data.user.id)
    console.log('Email:', data.user.email)
    
    // Test login immediately
    console.log('\n🧪 Testing login...')
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHBtY2Z1a2tpZG1qdnplcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4OTYyODEsImV4cCI6MjA1MDQ3MjI4MX0.LdnXCY6lTpX9EOLwHbm7JkF9fUvf2hLFkrBCcvQbEKU'
    
    const testClient = createClient('https://oftpmcfukkidmjvzeqfc.supabase.co', anonKey)
    
    const { data: loginData, error: loginError } = await testClient.auth.signInWithPassword({
      email: 'user@startuppath.ai',
      password: 'demo123'
    })
    
    if (loginError) {
      console.log('❌ Login test failed:', loginError.message)
    } else {
      console.log('✅ Login test successful!')
    }
    
  } catch (err) {
    console.log('❌ Error:', err.message)
  } finally {
    rl.close()
  }
}

createUser()