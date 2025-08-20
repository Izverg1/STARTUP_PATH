// Direct SQL execution to create SPATH tables in KSON_DB
const fs = require('fs');

// Read the SQL file
const sql = fs.readFileSync('supabase/migrations/20250819011556_create_spath_tables.sql', 'utf8');

// Your KSON_DB credentials  
const supabaseUrl = 'https://oftpmcfukkidmjvzeqfc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHBtY2Z1a2tpZG1qdnplcWZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTcwNDIwNSwiZXhwIjoyMDMxMjgwMjA1fQ.Lg7qF8CozgPRy5hJVZb8VHSlJ3vJoJfOKpX6lUY6YgE';

// Execute SQL via REST API
async function executeSql() {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({
        sql: sql
      })
    });

    if (response.ok) {
      console.log('✅ SPATH tables created successfully!');
      const result = await response.text();
      console.log('Response:', result);
    } else {
      console.log('❌ Error executing SQL:', response.status, response.statusText);
      const error = await response.text();
      console.log('Error details:', error);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

executeSql();