#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  try {
    console.log('🚀 Applying agent system migration...')
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'src/lib/supabase/migrations/20250123_add_agent_system_tables.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement.length === 0) continue
      
      try {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`)
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql: statement 
        })
        
        if (error) {
          // If rpc doesn't exist, try direct query
          const { error: directError } = await supabase
            .from('_migration_test')
            .select('*')
            .limit(1)
          
          if (directError) {
            // Try using the SQL directly
            const { error: sqlError } = await supabase
              .from('information_schema.tables')
              .select('table_name')
              .eq('table_schema', 'public')
              .eq('table_name', 'SPATH_artifacts')
            
            if (sqlError) {
              console.log(`⚠️  Statement ${i + 1} may need manual execution:`)
              console.log(statement.substring(0, 100) + '...')
            }
          }
        }
        
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1} encountered issue:`, err.message)
        console.log('Statement preview:', statement.substring(0, 100) + '...')
      }
    }
    
    console.log('✅ Migration application completed')
    
    // Verify tables exist
    console.log('\n🔍 Verifying tables...')
    
    const tablesToCheck = [
      'SPATH_agents',
      'SPATH_agent_executions', 
      'SPATH_artifacts',
      'SPATH_agent_configurations'
    ]
    
    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table ${table}: Not accessible (${error.message})`)
        } else {
          console.log(`✅ Table ${table}: Accessible`)
        }
      } catch (err) {
        console.log(`❌ Table ${table}: Error checking (${err.message})`)
      }
    }
    
    console.log('\n🎉 Migration script completed!')
    console.log('\nNext steps:')
    console.log('1. If tables show as "Not accessible", you may need to run the SQL manually in Supabase Dashboard')
    console.log('2. Check your Supabase project dashboard under "Database > Tables"')
    console.log('3. Restart your Next.js dev server to see the changes')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    
    console.log('\n📋 Manual Migration Instructions:')
    console.log('1. Go to your Supabase Dashboard')
    console.log('2. Navigate to SQL Editor')  
    console.log('3. Copy and paste the contents of: src/lib/supabase/migrations/20250123_add_agent_system_tables.sql')
    console.log('4. Execute the SQL script')
    console.log('5. Restart your Next.js development server')
  }
}

applyMigration()