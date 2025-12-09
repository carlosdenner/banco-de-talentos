import 'dotenv/config';

const PROJECT_REF = 'zppltubgadwwahsnammj';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

async function checkAuthConfig() {
  if (!ACCESS_TOKEN) {
    console.error('Missing SUPABASE_ACCESS_TOKEN');
    process.exit(1);
  }

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
    {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );

  const config = await response.json();
  console.log('Site URL:', config.site_url);
  console.log('Redirect URLs:', config.uri_allow_list);
  console.log('Mailer URL Paths:');
  console.log('  - Confirmation:', config.mailer_urlpaths_confirmation);
  console.log('  - Recovery:', config.mailer_urlpaths_recovery);
  console.log('  - Invite:', config.mailer_urlpaths_invite);
}

checkAuthConfig();
