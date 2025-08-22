require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkWaitlistTable() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('Checking SPATH_waitlist table...');
    const { data, error } = await supabase
      .from('SPATH_waitlist')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Table check failed:', error.message);
      if (error.message.includes('does not exist')) {
        console.log('\n❌ SPATH_waitlist table does not exist');
        console.log('Please apply the migration in Supabase dashboard');
      }
      return false;
    }
    
    console.log('✅ SPATH_waitlist table exists and is accessible');
    return true;
  } catch (err) {
    console.error('Verification error:', err.message);
    return false;
  }
}

checkWaitlistTable();