const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkTables() {
  console.log('🔍 CHECKING WHAT TABLES EXIST...');
  console.log('===============================');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  try {
    // Check if we can query any public tables at all
    console.log('1. Testing basic database connection...');
    
    // Try to run a simple query to see what happens
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.log('   Database query error:', error.message);
    } else {
      console.log('   ✅ Database connection works');
    }
    
    // Try to access information_schema to see what tables exist
    console.log('\n2. Attempting to check existing tables...');
    
    try {
      const { data: tables, error: tablesError } = await supabase
        .rpc('exec_sql', { 
          sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" 
        });
      
      if (tablesError) {
        console.log('   Tables query error:', tablesError.message);
      } else {
        console.log('   ✅ Public tables found:', tables);
      }
    } catch (e) {
      console.log('   ❌ Cannot query tables directly:', e.message);
    }
    
    // Test specific SPATH table access
    console.log('\n3. Testing specific table access...');
    
    const testTables = ['SPATH_organizations', 'SPATH_users', 'SPATH_projects'];
    
    for (const table of testTables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        if (error) {
          console.log(`   ❌ ${table}: ${error.message}`);
        } else {
          console.log(`   ✅ ${table}: exists`);
        }
      } catch (e) {
        console.log(`   ❌ ${table}: ${e.message}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
  }
}

checkTables().catch(console.error);