import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zppltubgadwwahsnammj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcGx0dWJnYWR3d2Foc25hbW1qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIzNDEyNCwiZXhwIjoyMDgwODEwMTI0fQ.0cmUxjqt7Hoal2CW2j92ygZNJ9iJjznkenod15GlTw4',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function deleteAllUsers() {
  const { data } = await supabase.auth.admin.listUsers();
  console.log('Users found:', data?.users?.length || 0);
  
  if (!data?.users?.length) {
    console.log('No users to delete');
    return;
  }
  
  for (const user of data.users) {
    console.log('Deleting:', user.email);
    await supabase.auth.admin.deleteUser(user.id);
  }
  console.log('All users deleted!');
}

deleteAllUsers();
