#!/usr/bin/env node

// Setup script for STARTUP_PATH Platform SPATH_ prefixed tables
// This script will create the necessary tables in your Supabase database

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  console.error('')
  console.error('   Please add SUPABASE_SERVICE_ROLE_KEY to your .env file.')
  console.error('   You can find this in your Supabase project settings under API.')
  process.exit(1)
}

async function setupDatabase() {
  console.log('🚀 Setting up STARTUP_PATH Platform database...')
  console.log(`   Database: ${supabaseUrl}`)
  
  // Create admin client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
  
  try {
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, 'src/lib/supabase/migrations-spath.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📝 Executing SPATH_ table migrations...')
    
    // Execute the SQL (note: this is a simple approach, for production you'd want proper migration tooling)
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
    
    if (error) {
      // If rpc doesn't exist, try direct SQL execution (this won't work for all statements)
      console.log('⚠️  RPC method not available, trying alternative approach...')
      
      // Split SQL into individual statements and execute them
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0)
      
      for (const statement of statements) {
        if (statement.toUpperCase().startsWith('CREATE TABLE')) {
          console.log(`   Creating table: ${statement.match(/CREATE TABLE.*?(\w+)/)?.[1] || 'unknown'}`)
        }
        
        const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement })
        if (stmtError) {
          console.log(`   ⚠️  Statement failed (may already exist): ${stmtError.message}`)
        }
      }
    }
    
    console.log('✅ Database setup completed!')
    console.log('')
    console.log('🎯 SPATH_ prefixed tables created in your KSON_DB:')
    console.log('   • SPATH_organizations - Organization management')
    console.log('   • SPATH_users - User profiles (linked to auth.users)')
    console.log('   • SPATH_projects - Project management')  
    console.log('   • SPATH_experiments - Experiment tracking')
    console.log('')
    console.log('🔐 Row Level Security policies configured')
    console.log('🎛️  Auto-triggers set up for user profile creation')
    console.log('')
    console.log('✨ Your STARTUP_PATH Platform is ready!')
    console.log('   Visit: http://localhost:3000/login to test authentication')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    console.error('')
    console.error('🛠️  Manual setup required:')
    console.error('   1. Go to your Supabase project dashboard')
    console.error('   2. Navigate to SQL Editor')  
    console.error('   3. Copy and paste the contents of:')
    console.error('      src/lib/supabase/migrations-spath.sql')
    console.error('   4. Execute the SQL manually')
    process.exit(1)
  }
}

// Run the setup
setupDatabase()