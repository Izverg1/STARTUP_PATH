import { createClient } from '@/lib/supabase/client'
import { databaseSeeder } from '@/lib/supabase/seed'
import fs from 'fs'
import path from 'path'

export async function setupDatabase() {
  try {
    console.log('🚀 Setting up STARTUP_PATH database...')
    
    const supabase = createClient()
    
    // First, try to run the migration SQL
    console.log('📝 Running database migration...')
    
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'src/lib/supabase/migrations-spath.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'))
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        if (error && !error.message.includes('already exists')) {
          console.warn('Migration warning:', error.message)
        }
      }
    }
    
    console.log('✅ Database migration completed')
    
    // Create demo data
    console.log('👤 Setting up demo data...')
    
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
    
    return result
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    throw error
  }
}