import { test, expect } from '@playwright/test';

test.describe('Forgot Password Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Open auth modal
    await page.getByRole('banner').getByRole('button', { name: 'Entrar / Cadastrar' }).click();
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });

  test('shows forgot password link on login form', async ({ page }) => {
    await expect(page.getByText('Esqueci minha senha')).toBeVisible();
  });

  test('clicking forgot password opens reset form', async ({ page }) => {
    await page.getByText('Esqueci minha senha').click();
    
    // Should show reset password form
    await expect(page.getByRole('heading', { name: 'Recuperar Senha' })).toBeVisible();
    await expect(page.getByText('Digite seu e-mail e enviaremos um link')).toBeVisible();
  });

  test('forgot password form only shows email field', async ({ page }) => {
    await page.getByText('Esqueci minha senha').click();
    
    // Should have email field but no password field
    await expect(page.getByPlaceholder('seu@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).not.toBeVisible();
  });

  test('can return from forgot password to login', async ({ page }) => {
    await page.getByText('Esqueci minha senha').click();
    await expect(page.getByRole('heading', { name: 'Recuperar Senha' })).toBeVisible();
    
    // Click "Lembrou a senha? Entrar"
    await page.getByText('Lembrou a senha?').locator('..').getByText('Entrar').click();
    
    // Should be back on login
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });

  test('shows send link button', async ({ page }) => {
    await page.getByText('Esqueci minha senha').click();
    
    await expect(page.getByRole('button', { name: 'Enviar Link' })).toBeVisible();
  });

  test('requires email before sending reset link', async ({ page }) => {
    await page.getByText('Esqueci minha senha').click();
    
    // Email field should be required
    const emailInput = page.getByPlaceholder('seu@email.com');
    await expect(emailInput).toHaveAttribute('required', '');
  });
});

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').getByRole('button', { name: 'Entrar / Cadastrar' }).click();
    await page.getByText('Cadastre-se').click();
    await expect(page.getByRole('heading', { name: 'Criar Conta' })).toBeVisible();
  });

  test('register form has all required fields', async ({ page }) => {
    await expect(page.getByPlaceholder('seu@email.com')).toBeVisible();
    // Password fields (there should be 2 for register mode)
    const passwordInputs = page.getByPlaceholder('••••••••');
    await expect(passwordInputs).toHaveCount(2);
  });

  test('validates password confirmation', async ({ page }) => {
    // Fill with mismatched passwords
    await page.getByPlaceholder('seu@email.com').fill('test@example.com');
    const passwordFields = page.getByPlaceholder('••••••••');
    await passwordFields.first().fill('password123');
    await passwordFields.last().fill('differentpassword');
    
    await page.getByRole('button', { name: 'Criar Conta' }).click();
    
    // Should show error
    await expect(page.getByText('senhas não coincidem')).toBeVisible();
  });

  test('validates minimum password length', async ({ page }) => {
    await page.getByPlaceholder('seu@email.com').fill('test@example.com');
    const passwordFields = page.getByPlaceholder('••••••••');
    await passwordFields.first().fill('12345'); // Too short
    await passwordFields.last().fill('12345');
    
    await page.getByRole('button', { name: 'Criar Conta' }).click();
    
    // Should show error about password length
    await expect(page.getByText('pelo menos 6 caracteres')).toBeVisible();
  });
});

test.describe('Auth Modal Behavior', () => {
  test('closes modal on successful login and shows user', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    
    if (!email || !password) {
      test.skip();
      return;
    }

    await page.goto('/');
    await page.getByRole('banner').getByRole('button', { name: 'Entrar / Cadastrar' }).click();
    
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.getByPlaceholder('••••••••').fill(password);
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    
    // Modal should close
    await expect(page.getByRole('heading', { name: 'Entrar' })).not.toBeVisible({ timeout: 10000 });
    // User should see logout button (works on all viewports, unlike email which is hidden on mobile)
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').getByRole('button', { name: 'Entrar / Cadastrar' }).click();
    
    await page.getByPlaceholder('seu@email.com').fill('invalid@example.com');
    await page.getByPlaceholder('••••••••').fill('wrongpassword');
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    
    // Should show error
    await expect(page.getByText(/incorretos|error/i)).toBeVisible({ timeout: 10000 });
  });
});
