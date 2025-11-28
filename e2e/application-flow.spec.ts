import { test, expect } from '@playwright/test';

test.describe('Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays welcome screen', async ({ page }) => {
    await expect(page.getByText('Banco de Talentos – Estágio GigaCandanga')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Começar' })).toBeVisible();
  });

  test('navigates through the wizard steps', async ({ page }) => {
    // Start wizard
    await page.getByRole('button', { name: 'Começar' }).click();
    
    // Step 1: Dados Pessoais
    await expect(page.getByText('Dados Pessoais')).toBeVisible();
    await expect(page.getByText('Passo 1 de 7')).toBeVisible();
    
    // Fill personal data
    await page.getByPlaceholder('Seu nome completo').fill('João da Silva');
    await page.locator('input[type="date"]').fill('2000-01-15');
    await page.getByPlaceholder('seu@email.com').fill('joao@teste.com');
    await page.getByPlaceholder('(61) 99999-9999').fill('61999999999');
    await page.getByPlaceholder('Ex: Brasília - DF').fill('Brasília - DF');
    
    await page.getByRole('button', { name: 'Próximo' }).click();
    
    // Step 2: Formação Acadêmica
    await expect(page.getByText('Formação Acadêmica')).toBeVisible();
    await expect(page.getByText('Passo 2 de 7')).toBeVisible();
  });

  test('validates required fields before proceeding', async ({ page }) => {
    await page.getByRole('button', { name: 'Começar' }).click();
    
    // Wait for form to be visible
    await expect(page.getByPlaceholder('Seu nome completo')).toBeVisible();
    
    // Try to proceed without filling fields
    await page.getByRole('button', { name: 'Próximo' }).click();
    
    // Should still see step 1 form fields (validation prevented navigation)
    await expect(page.getByPlaceholder('Seu nome completo')).toBeVisible();
  });

  test('back button navigates to previous step', async ({ page }) => {
    await page.getByRole('button', { name: 'Começar' }).click();
    
    // Fill step 1
    await page.getByPlaceholder('Seu nome completo').fill('João da Silva');
    await page.locator('input[type="date"]').fill('2000-01-15');
    await page.getByPlaceholder('seu@email.com').fill('joao@teste.com');
    await page.getByPlaceholder('(61) 99999-9999').fill('61999999999');
    await page.getByPlaceholder('Ex: Brasília - DF').fill('Brasília');
    
    await page.getByRole('button', { name: 'Próximo' }).click();
    
    // Should be on step 2
    await expect(page.getByText('Formação Acadêmica')).toBeVisible();
    
    // Go back
    await page.getByRole('button', { name: 'Voltar' }).click();
    
    // Should be on step 1
    await expect(page.getByText('Dados Pessoais')).toBeVisible();
  });

  test('shows progress bar with correct step', async ({ page }) => {
    await page.getByRole('button', { name: 'Começar' }).click();
    
    const progressBar = page.locator('.bg-primary.h-2.rounded-full');
    await expect(progressBar).toBeVisible();
  });
});

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows login button when not authenticated', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Entrar / Cadastrar' })).toBeVisible();
  });

  test('opens auth modal when clicking login button', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar / Cadastrar' }).click();
    
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByPlaceholder('seu@email.com')).toBeVisible();
  });

  test('can switch between login and register modes', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar / Cadastrar' }).click();
    
    // Click register
    await page.getByText('Cadastre-se').click();
    await expect(page.getByRole('heading', { name: 'Criar Conta' })).toBeVisible();
    await expect(page.getByText('Confirmar Senha')).toBeVisible();
    
    // Click back to login
    await page.getByText('Entrar', { exact: false }).last().click();
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });

  test('closes auth modal with X button', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar / Cadastrar' }).click();
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
    
    // Click close button (X) - the button with SVG inside the modal header
    await page.locator('.bg-white.rounded-xl .flex.justify-between button').click();
    
    await expect(page.getByRole('heading', { name: 'Entrar' })).not.toBeVisible();
  });
});

test.describe('Mobile Responsiveness', () => {
  test('displays correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Use specific heading role for header logo
    await expect(page.getByRole('heading', { name: 'GigaCandanga', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Começar' })).toBeVisible();
  });

  test('wizard works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.getByRole('button', { name: 'Começar' }).click();
    
    await expect(page.getByRole('heading', { name: 'Dados Pessoais' })).toBeVisible();
    await expect(page.getByText('Passo 1 de 7')).toBeVisible();
  });
});
