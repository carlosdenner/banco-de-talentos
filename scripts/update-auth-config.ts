/**
 * Script para atualizar as configurações de autenticação do Supabase via Management API
 * 
 * Este script configura:
 * - Site URL
 * - Redirect URLs
 * 
 * Uso: npx tsx scripts/update-auth-config.ts
 */

const PROJECT_REF = 'pywhtppscqzctzjfzbfe';
const SITE_URL = 'https://carlosdenner.github.io/banco-de-talentos/';
const REDIRECT_URLS = [
  'https://carlosdenner.github.io/banco-de-talentos/**',
  'http://localhost:5173/banco-de-talentos/**'
];

async function updateAuthConfig() {
  console.log('🔧 Atualizando configurações de autenticação...\n');
  
  console.log('📋 Configurações a serem aplicadas:');
  console.log(`   Site URL: ${SITE_URL}`);
  console.log(`   Redirect URLs:`);
  REDIRECT_URLS.forEach(url => console.log(`     - ${url}`));
  console.log('');
  
  console.log('⚠️  ATENÇÃO:');
  console.log('   Este script requer um Access Token da Management API do Supabase.');
  console.log('   Para obter o token:');
  console.log('   1. Acesse: https://supabase.com/dashboard/account/tokens');
  console.log('   2. Clique em "Generate new token"');
  console.log('   3. Copie o token e execute:');
  console.log('      $env:SUPABASE_ACCESS_TOKEN="seu-token-aqui"');
  console.log('   4. Execute este script novamente');
  console.log('');
  
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.error('❌ Erro: SUPABASE_ACCESS_TOKEN não encontrado.');
    console.log('   Configure a variável de ambiente e tente novamente.');
    process.exit(1);
  }
  
  try {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SITE_URL: SITE_URL,
          URI_ALLOW_LIST: REDIRECT_URLS.join(','),
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro na API: ${response.status} - ${error}`);
    }
    
    const result = await response.json();
    console.log('✅ Configurações atualizadas com sucesso!');
    console.log('');
    console.log('📝 Próximos passos:');
    console.log('   1. Teste o fluxo de cadastro novamente');
    console.log('   2. Verifique se o link de confirmação funciona');
    console.log('   3. O link deve redirecionar para:', SITE_URL);
    console.log('');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar configurações:', error);
    process.exit(1);
  }
}

updateAuthConfig();
