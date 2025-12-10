import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zppltubgadwwahsnammj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcGx0dWJnYWR3d2Foc25hbW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMzQxMjQsImV4cCI6MjA4MDgxMDEyNH0.LfZqxf9jxGq3n1ZlmaJV5MgwWQHgPP3c-Wwi_rJFZ6A'
);

const TEST_EMAIL = 'carlosdenner@unb.br';
const TEST_PASSWORD = 'test123';

async function main() {
  console.log('=== Creating Test User ===\n');
  
  // Try to sign up
  console.log(`1. Creating user ${TEST_EMAIL}...`);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    options: {
      data: {
        email_confirmed: true
      }
    }
  });
  
  if (signUpError) {
    if (signUpError.message.includes('already registered')) {
      console.log('   User already exists, trying to sign in...');
    } else {
      console.error('   Sign up error:', signUpError.message);
    }
  } else {
    console.log('   User created:', signUpData.user?.email);
    console.log('   User ID:', signUpData.user?.id);
  }

  // Try to sign in
  console.log(`\n2. Signing in as ${TEST_EMAIL}...`);
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  if (signInError) {
    console.error('   Sign in error:', signInError.message);
    console.log('\n   Note: You may need to confirm the email first.');
    console.log('   Check the Supabase Dashboard > Authentication > Users');
    console.log('   and manually confirm the user if needed.');
    return;
  }

  console.log('   Signed in successfully!');
  console.log('   User ID:', signInData.user?.id);
  console.log('   Email confirmed:', signInData.user?.email_confirmed_at ? 'Yes' : 'No');

  // Test application submission
  console.log('\n3. Testing application submission...');
  
  const testPayload = {
    full_name: 'Test User E2E',
    birth_date: '2000-01-15',
    email: 'testuser@example.com',
    whatsapp: '61999999999',
    city: 'Brasilia - DF',
    institution: 'Universidade de Brasilia',
    course: 'Ciencia da Computacao',
    current_period: '5',
    study_shift: 'Noturno',
    interest_areas: ['Tecnologia da Informacao', 'Desenvolvimento de Software'],
    motivation: 'Quero aprender e contribuir com projetos reais de tecnologia.',
    contributions: 'Tenho experiencia com programacao e trabalho em equipe.',
    has_experience: false,
    how_did_you_hear: 'LinkedIn',
    lgpd_consent: true,
    lgpd_consent_date: new Date().toISOString(),
    user_id: signInData.user?.id,
    opportunity_id: null,
  };

  const { data: insertData, error: insertError } = await supabase
    .from('applications')
    .insert(testPayload)
    .select();

  if (insertError) {
    console.error('   Insert error:', insertError.message);
    console.error('   Code:', insertError.code);
    console.error('   Details:', JSON.stringify(insertError, null, 2));
  } else {
    console.log('   Application submitted successfully!');
    console.log('   Application ID:', insertData?.[0]?.id);

    // Clean up - delete the test application
    console.log('\n4. Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('applications')
      .delete()
      .eq('id', insertData[0].id);

    if (deleteError) {
      console.log('   Could not delete test application:', deleteError.message);
    } else {
      console.log('   Test application deleted.');
    }
  }

  // Sign out
  await supabase.auth.signOut();
  console.log('\n=== Test Complete ===');
  console.log(`\nTest credentials for .env.test:`);
  console.log(`TEST_USER_EMAIL=${TEST_EMAIL}`);
  console.log(`TEST_USER_PASSWORD=${TEST_PASSWORD}`);
}

main();
