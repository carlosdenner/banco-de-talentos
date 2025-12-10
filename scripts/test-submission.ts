import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zppltubgadwwahsnammj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcGx0dWJnYWR3d2Foc25hbW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMzQxMjQsImV4cCI6MjA4MDgxMDEyNH0.LfZqxf9jxGq3n1ZlmaJV5MgwWQHgPP3c-Wwi_rJFZ6A';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSubmission() {
  console.log('=== Testing Application Submission ===\n');

  // Step 0: Check what columns exist in the applications table
  console.log('0. Checking applications table schema...');
  const { data: schemaData, error: schemaError } = await supabase
    .from('applications')
    .select('*')
    .limit(0);
  
  if (schemaError) {
    console.log('   Error checking schema:', schemaError.message);
    console.log('   Code:', schemaError.code);
  } else {
    console.log('   Schema check passed (table exists)');
  }

  // Try to get column info by selecting with a simple query
  console.log('\n   Trying to read existing applications...');
  const { data: existingApps, error: readError } = await supabase
    .from('applications')
    .select('id, created_at, full_name, email')
    .limit(1);
  
  if (readError) {
    console.log('   Error reading:', readError.message);
    console.log('   This might indicate missing columns or RLS issues');
  } else {
    console.log('   Read result:', existingApps);
  }

  // Step 1: Test which columns exist by trying different field combinations
  console.log('\n1. Testing which columns exist...');
  
  // Try with just the basic required fields from the original schema
  const testColumns = [
    'full_name',
    'birth_date', 
    'email',
    'whatsapp',
    'city',
    'institution',
    'course',
    'current_period',
    'study_shift',
    'interest_areas',
    'motivation',
    'contributions',
    'has_experience',
    'how_did_you_hear',
    'lgpd_consent',
    'user_id',
    'opportunity_id',
    'status',
    'cv_url',
  ];

  for (const col of testColumns) {
    const testPayload: Record<string, unknown> = { [col]: col === 'interest_areas' ? ['test'] : col === 'has_experience' || col === 'lgpd_consent' ? true : 'test' };
    const { error } = await supabase.from('applications').insert(testPayload);
    if (error?.code === 'PGRST204') {
      console.log(`   Column '${col}' - MISSING`);
    } else if (error?.code === '23502') {
      console.log(`   Column '${col}' - EXISTS (NOT NULL violation)`);
    } else if (error?.code === '42501') {
      console.log(`   Column '${col}' - EXISTS (RLS violation)`);
    } else if (error) {
      console.log(`   Column '${col}' - EXISTS (${error.code}: ${error.message})`);
    } else {
      console.log(`   Column '${col}' - EXISTS (insert succeeded?)`);
    }
  }

  console.log('\n2. Testing anonymous insert with existing columns only...');
  const anonymousPayload = {
    full_name: 'Test User Anonymous',
    email: 'test-anon@example.com',
    whatsapp: '61999999999',
    city: 'Brasilia - DF',
    institution: 'UnB',
    course: 'Computer Science',
    current_period: '5',
    study_shift: 'Noturno',
    interest_areas: ['Tecnologia da Informacao'],
    motivation: 'Test motivation text here',
    contributions: 'Test contributions text here',
    has_experience: false,
    how_did_you_hear: 'LinkedIn',
  };

  const { data: anonData, error: anonError } = await supabase
    .from('applications')
    .insert(anonymousPayload)
    .select();

  if (anonError) {
    console.log('   Error:', anonError.message);
    console.log('   Code:', anonError.code);
    console.log('   Details:', JSON.stringify(anonError, null, 2));
  } else {
    console.log('   Success! Inserted:', anonData);
  }

  // Step 2: Try to login with test user
  console.log('\n2. Testing authenticated insert...');
  console.log('   Logging in with test user...');
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'carlosdenner@gmail.com',
    password: 'test123',
  });

  if (authError) {
    console.log('   Login failed:', authError.message);
    console.log('   Trying with a different approach...');
    
    // Try to check if we can at least query the policies
    console.log('\n3. Checking if we can read opportunities (public)...');
    const { data: opps, error: oppsError } = await supabase
      .from('opportunities')
      .select('id, title, is_active')
      .limit(5);
    
    if (oppsError) {
      console.log('   Error reading opportunities:', oppsError.message);
    } else {
      console.log('   Opportunities:', opps);
    }
    
    return;
  }

  console.log('   Logged in as:', authData.user?.email);
  console.log('   User ID:', authData.user?.id);

  // Step 3: Try authenticated insert
  const authPayload = {
    ...anonymousPayload,
    full_name: 'Test User Authenticated',
    email: 'test-auth@example.com',
    user_id: authData.user?.id,
  };

  console.log('\n   Attempting insert with user_id:', authPayload.user_id);

  const { data: authInsertData, error: authInsertError } = await supabase
    .from('applications')
    .insert(authPayload)
    .select();

  if (authInsertError) {
    console.log('   Error:', authInsertError.message);
    console.log('   Code:', authInsertError.code);
    console.log('   Details:', JSON.stringify(authInsertError, null, 2));
  } else {
    console.log('   Success! Inserted:', authInsertData);
    
    // Clean up - delete the test record
    if (authInsertData?.[0]?.id) {
      console.log('\n   Cleaning up test record...');
      const { error: deleteError } = await supabase
        .from('applications')
        .delete()
        .eq('id', authInsertData[0].id);
      
      if (deleteError) {
        console.log('   Could not delete test record:', deleteError.message);
      } else {
        console.log('   Test record deleted.');
      }
    }
  }

  // Sign out
  await supabase.auth.signOut();
  console.log('\n=== Test Complete ===');
}

testSubmission().catch(console.error);
