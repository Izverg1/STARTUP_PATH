#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up STARTUP_PATH database...')
    
    // Read and execute the migration SQL
    const migrationPath = path.join(__dirname, 'src/lib/supabase/migrations-spath.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('📝 Running database migration...')
    const { error: migrationError } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (migrationError) {
      console.log('⚠️  Migration may have failed, but continuing (tables might already exist):', migrationError.message)
    } else {
      console.log('✅ Database migration completed successfully')
    }
    
    // Create demo user and organization
    console.log('👤 Setting up demo data...')
    
    const { databaseSeeder } = await import('./src/lib/supabase/seed.js')
    
    const demoUserData = {
      userId: '550e8400-e29b-41d4-a716-446655440001',
      email: 'user@startuppath.ai',
      name: 'Demo User'
    }
    
    const result = await databaseSeeder.setupDemoDatabase(demoUserData)
    
    console.log('🎉 Database setup completed successfully!')
    console.log('📊 Demo organization:', result.organization.name)
    console.log('👤 Demo user:', result.user.email)
    console.log('🚀 Demo project:', result.project.name)
    
    console.log('\n✨ You can now start the application with: npm run dev')
    console.log('🌐 Visit: http://localhost:1010')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

setupDatabase()