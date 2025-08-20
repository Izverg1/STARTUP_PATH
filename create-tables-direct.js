// Create SPATH tables directly using Supabase client
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// KSON_DB connection
const supabaseUrl = 'https://oftpmcfukkidmjvzeqfc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHBtY2Z1a2tpZG1qdnplcWZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTcwNDIwNSwiZXhwIjoyMDMxMjgwMjA1fQ.Lg7qF8CozgPRy5hJVZb8VHSlJ3vJoJfOKpX6lUY6YgE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('🔨 Creating SPATH tables in KSON_DB...');
    
    // Execute each table creation separately
    const tables = [
      {
        name: 'spath_orgs',
        sql: `CREATE TABLE IF NOT EXISTS spath_orgs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          settings JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`
      },
      {
        name: 'spath_users',
        sql: `CREATE TABLE IF NOT EXISTS spath_users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          org_id UUID REFERENCES spath_orgs(id) ON DELETE CASCADE,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          avatar_url TEXT,
          role VARCHAR(50) DEFAULT 'member',
          settings JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`
      },
      {
        name: 'spath_projects',
        sql: `CREATE TABLE IF NOT EXISTS spath_projects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          org_id UUID REFERENCES spath_orgs(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          settings JSONB DEFAULT '{}',
          created_by UUID REFERENCES spath_users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`
      },
      {
        name: 'spath_experiments',
        sql: `CREATE TABLE IF NOT EXISTS spath_experiments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          project_id UUID REFERENCES spath_projects(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'draft',
          config JSONB DEFAULT '{}',
          created_by UUID REFERENCES spath_users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`
      }
    ];

    // Create tables
    for (const table of tables) {
      console.log(`Creating ${table.name}...`);
      const { error } = await supabase.rpc('exec', { sql: table.sql });
      if (error) {
        console.log(`❌ Error creating ${table.name}:`, error);
      } else {
        console.log(`✅ ${table.name} created successfully`);
      }
    }

    // Create indexes
    console.log('Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_spath_users_org_id ON spath_users(org_id);',
      'CREATE INDEX IF NOT EXISTS idx_spath_projects_org_id ON spath_projects(org_id);',
      'CREATE INDEX IF NOT EXISTS idx_spath_experiments_project_id ON spath_experiments(project_id);'
    ];

    for (const indexSql of indexes) {
      const { error } = await supabase.rpc('exec', { sql: indexSql });
      if (error) {
        console.log(`❌ Error creating index:`, error);
      } else {
        console.log(`✅ Index created`);
      }
    }

    // Enable RLS
    console.log('Enabling Row Level Security...');
    const rlsTables = ['spath_orgs', 'spath_users', 'spath_projects', 'spath_experiments'];
    
    for (const tableName of rlsTables) {
      const { error } = await supabase.rpc('exec', { 
        sql: `ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;` 
      });
      if (error) {
        console.log(`❌ Error enabling RLS on ${tableName}:`, error);
      } else {
        console.log(`✅ RLS enabled on ${tableName}`);
      }
    }

    console.log('🎉 All SPATH tables created successfully in KSON_DB!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTables();