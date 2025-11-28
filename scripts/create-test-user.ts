/**
 * Script to create a test user for E2E testing
 * Run with: npx tsx scripts/create-test-user.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Service role key from Supabase Dashboard

const TEST_EMAIL = 'test@gigacandanga.com';
const TEST_PASSWORD = 'TestUser123!';

async function createTestUser() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing environment variables:');
    console.error('- VITE_SUPABASE_URL');
    console.error('- SUPABASE_SERVICE_KEY (Service Role key from Supabase Dashboard > Settings > API)');
    process.exit(1);
  }

  // Use service role key to bypass RLS and create users
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('Creating test user...');

  // Check if user exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(u => u.email === TEST_EMAIL);

  if (existingUser) {
    console.log('Test user already exists:', TEST_EMAIL);
    return;
  }

  // Create user
  const { data, error } = await supabase.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true, // Auto-confirm email
  });

  if (error) {
    console.error('Error creating user:', error.message);
    process.exit(1);
  }

  console.log('✅ Test user created successfully!');
  console.log('   Email:', TEST_EMAIL);
  console.log('   Password:', TEST_PASSWORD);
  console.log('');
  console.log('Now create .env.test file with:');
  console.log(`TEST_USER_EMAIL=${TEST_EMAIL}`);
  console.log(`TEST_USER_PASSWORD=${TEST_PASSWORD}`);
}

createTestUser();
