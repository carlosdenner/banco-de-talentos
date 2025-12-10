import { test as setup, expect } from '@playwright/test';

const authFile = '.auth/user.json';

/**
 * Auth setup - logs in a test user and saves the session state
 * 
 * Requires environment variables:
 * - TEST_USER_EMAIL: Email of the test user
 * - TEST_USER_PASSWORD: Password of the test user
 * 
 * Create a test user in Supabase Dashboard > Authentication > Users
 */
setup('authenticate', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables are required.\n' +
      'Create a test user in Supabase and add credentials to .env.test file.'
    );
  }

  // Go to the app
  await page.goto('/');
  
  // Click login button in header
  await page.getByRole('banner').getByRole('button', { name: 'Entrar / Cadastrar' }).click();
  
  // Wait for auth modal
  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  
  // Fill login form
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  
  // Submit - use exact match for the submit button inside the modal
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  
  // Wait for successful login - user email should appear in header
  await expect(page.getByText(email)).toBeVisible({ timeout: 10000 });
  
  // User is authenticated - either shows start button (new user) or form (existing application)
  // Wait for either the start button or the form to be visible
  await expect(
    page.getByRole('button', { name: /Começar|Candidatar|Próximo/ })
  ).toBeVisible({ timeout: 5000 });
  
  // Save signed-in state
  await page.context().storageState({ path: authFile });
});
