// Create SPATH tables using correct credentials
const { createClient } = require('@supabase/supabase-js');

// KSON_DB connection with correct keys
const supabaseUrl = 'https://oftpmcfukkidmjvzeqfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHBtY2Z1a2tpZG1qdnplcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4OTYyODEsImV4cCI6MjA1MDQ3MjI4MX0.LdnXCY6lTpX9EOLwHbm7JkF9fUvf2hLFkrBCcvQbEKU';

// For DDL operations, we need service role - let me try a different approach
async function createTables() {
  console.log('🔨 Creating SPATH tables in KSON_DB...');
  
  try {
    // Use raw SQL via fetch to Supabase's PostgREST API
    const sqlStatements = [
      `CREATE TABLE IF NOT EXISTS spath_orgs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      
      `CREATE TABLE IF NOT EXISTS spath_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        org_id UUID REFERENCES spath_orgs(id) ON DELETE CASCADE,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        role VARCHAR(50) DEFAULT 'member',
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      
      `CREATE TABLE IF NOT EXISTS spath_projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        org_id UUID REFERENCES spath_orgs(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        settings JSONB DEFAULT '{}',
        created_by UUID REFERENCES spath_users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      
      `CREATE TABLE IF NOT EXISTS spath_experiments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES spath_projects(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        config JSONB DEFAULT '{}',
        created_by UUID REFERENCES spath_users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      
      `CREATE INDEX IF NOT EXISTS idx_spath_users_org_id ON spath_users(org_id);`,
      `CREATE INDEX IF NOT EXISTS idx_spath_projects_org_id ON spath_projects(org_id);`,
      `CREATE INDEX IF NOT EXISTS idx_spath_experiments_project_id ON spath_experiments(project_id);`,
      
      `ALTER TABLE spath_orgs ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE spath_users ENABLE ROW LEVEL SECURITY;`, 
      `ALTER TABLE spath_projects ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE spath_experiments ENABLE ROW LEVEL SECURITY;`
    ];

    // Try using the SQL editor endpoint  
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i];
      console.log(`Executing statement ${i + 1}/${sqlStatements.length}...`);
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ query: sql })
        });

        if (response.ok) {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } else {
          const error = await response.text();
          console.log(`❌ Statement ${i + 1} failed:`, response.status, error);
        }
      } catch (err) {
        console.log(`❌ Network error on statement ${i + 1}:`, err.message);
      }
    }

    console.log('🎉 SPATH table creation completed!');
    console.log('Check your Supabase dashboard to verify the tables were created.');
    
  } catch (error) {
    console.error('❌ Overall error:', error.message);
  }
}

createTables();