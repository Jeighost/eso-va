require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log("Checking tables...");
  const { error: eventsError } = await supabase.from('events').select('id').limit(1);
  if (eventsError) {
    console.error("Error accessing events table:", eventsError.message);
  } else {
    console.log("events table exists and is accessible.");
  }

  const { error: profilesError } = await supabase.from('profiles').select('id').limit(1);
  if (profilesError) {
    console.error("Error accessing profiles table:", profilesError.message);
  } else {
    console.log("profiles table exists and is accessible.");
  }
}

test();
