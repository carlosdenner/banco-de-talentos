import 'dotenv/config';

const PROJECT_REF = 'zppltubgadwwahsnammj';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const SITE_URL = 'https://carlosdenner.github.io/banco-de-talentos';

async function updateAuthConfig() {
  if (!ACCESS_TOKEN) {
    console.error('Missing SUPABASE_ACCESS_TOKEN');
    process.exit(1);
  }

  console.log('Updating auth configuration...');
  console.log('Site URL:', SITE_URL);

  // Update project auth settings
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        site_url: SITE_URL,
        uri_allow_list: [
          SITE_URL,
          `${SITE_URL}/`,
          `${SITE_URL}/*`,
          'http://localhost:5173',
          'http://localhost:5173/*',
          'http://localhost:3000',
          'http://localhost:3000/*'
        ].join(','),
        mailer_autoconfirm: false,
        external_email_enabled: true,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error('Error:', response.status, text);
    process.exit(1);
  }

  const result = await response.json();
  console.log('Auth config updated successfully!');
  console.log('Site URL:', result.site_url);
  console.log('Redirect URLs:', result.uri_allow_list);
}

updateAuthConfig();
