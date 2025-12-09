import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zppltubgadwwahsnammj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcGx0dWJnYWR3d2Foc25hbW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMzQxMjQsImV4cCI6MjA4MDgxMDEyNH0.LfZqxf9jxGq3n1ZlmaJV5MgwWQHgPP3c-Wwi_rJFZ6A'
);

async function main() {
  console.log('Creating user carlosdenner@unb.br...');
  const { data, error } = await supabase.auth.signUp({
    email: 'carlosdenner@unb.br',
    password: 'Test123!'
  });
  
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('User created:', data.user?.email);
    console.log('Confirmation email sent. Check your inbox.');
  }
}

main();
