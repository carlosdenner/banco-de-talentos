import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
// Service role key for admin operations
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcGx0dWJnYWR3d2Foc25hbW1qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIzNDEyNCwiZXhwIjoyMDgwODEwMTI0fQ.0cmUxjqt7Hoal2CW2j92ygZNJ9iJjznkenod15GlTw4';

const EMAIL_TO_CONFIRM = process.argv[2] || 'carlosdenner@unb.br';

async function confirmUser() {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log(`Looking for user: ${EMAIL_TO_CONFIRM}`);

  // List users to find the one we want
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError.message);
    process.exit(1);
  }

  const user = users.users.find(u => u.email === EMAIL_TO_CONFIRM);
  
  if (!user) {
    console.error('User not found:', EMAIL_TO_CONFIRM);
    console.log('Available users:', users.users.map(u => u.email).join(', '));
    process.exit(1);
  }

  console.log('Found user:', user.id);
  console.log('Email confirmed:', user.email_confirmed_at ? 'Yes' : 'No');

  if (user.email_confirmed_at) {
    console.log('User already confirmed!');
    return;
  }

  // Confirm the user's email
  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    email_confirm: true
  });

  if (error) {
    console.error('Error confirming user:', error.message);
    process.exit(1);
  }

  console.log('User email confirmed successfully!');
  console.log('User can now log in at: https://carlosdenner.github.io/banco-de-talentos/');
}

confirmUser();
