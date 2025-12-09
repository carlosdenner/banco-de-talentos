/**
 * Quick test to verify Supabase connection
 * Run with: npx tsx scripts/test-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function testConnection() {
  console.log('Testing Supabase connection...\n');
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing environment variables:');
    console.error('- VITE_SUPABASE_URL:', SUPABASE_URL ? 'set' : 'MISSING');
    console.error('- VITE_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'set' : 'MISSING');
    process.exit(1);
  }

  console.log('Configuration:');
  console.log('- URL:', SUPABASE_URL);
  console.log('- Anon Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...');
  console.log('');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Test 1: Basic connectivity by checking auth health
  console.log('Test 1: Auth health check...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('  FAILED:', error.message);
    } else {
      console.log('  PASSED: Auth service responding');
      console.log('  Session:', data.session ? 'Active' : 'None (expected for anonymous)');
    }
  } catch (e) {
    console.error('  FAILED: Network error -', (e as Error).message);
  }

  // Test 2: Check if we can query a table (applications)
  console.log('\nTest 2: Database query (applications table)...');
  try {
    const { data, error, count } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === 'PGRST301') {
        console.log('  PASSED: Table exists but requires authentication (RLS working)');
      } else if (error.code === '42P01') {
        console.error('  WARNING: Table "applications" does not exist');
      } else {
        console.error('  FAILED:', error.message, `(code: ${error.code})`);
      }
    } else {
      console.log('  PASSED: Query successful, row count:', count ?? 'unknown');
    }
  } catch (e) {
    console.error('  FAILED: Network error -', (e as Error).message);
  }

  // Test 3: Check opportunities table (might be public)
  console.log('\nTest 3: Database query (opportunities table)...');
  try {
    const { data, error, count } = await supabase
      .from('opportunities')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === 'PGRST301') {
        console.log('  PASSED: Table exists but requires authentication (RLS working)');
      } else if (error.code === '42P01') {
        console.error('  WARNING: Table "opportunities" does not exist');
      } else {
        console.error('  FAILED:', error.message, `(code: ${error.code})`);
      }
    } else {
      console.log('  PASSED: Query successful, row count:', count ?? 'unknown');
    }
  } catch (e) {
    console.error('  FAILED: Network error -', (e as Error).message);
  }

  // Test 4: Storage bucket check
  console.log('\nTest 4: Storage service...');
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('  FAILED:', error.message);
    } else {
      console.log('  PASSED: Storage service responding');
      console.log('  Buckets:', data.map(b => b.name).join(', ') || 'none');
    }
  } catch (e) {
    console.error('  FAILED: Network error -', (e as Error).message);
  }

  console.log('\n--- Test complete ---');
}

testConnection();
