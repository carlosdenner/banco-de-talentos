import { test, expect } from '@playwright/test';

/**
 * Tests that require authentication
 * These tests use the storage state from auth.setup.ts
 */
test.describe('Authenticated Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows Começar button when authenticated', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Começar' })).toBeVisible();
  });

  test('shows user email in header', async ({ page }) => {
    // User should be logged in - email should appear
    await expect(page.getByRole('banner').getByText('@')).toBeVisible();
  });

  test('navigates through the wizard steps', async ({ page }) => {
    // Start wizard
    await page.getByRole('button', { name: 'Começar' }).click();
    
    // Step 1: Dados Pessoais
    await expect(page.getByText('Passo 1 de 7')).toBeVisible();
    
    // Fill personal data
    await page.getByPlaceholder('Seu nome completo').fill('Usuário Teste');
    await page.locator('input[type="date"]').fill('2000-01-15');
    await page.getByPlaceholder('seu@email.com').fill('teste@exemplo.com');
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
    
    // Should stay on step 1 - form fields still visible
    await expect(page.getByPlaceholder('Seu nome completo')).toBeVisible();
    await expect(page.getByText('Passo 1 de 7')).toBeVisible();
  });

  test('back button navigates to previous step', async ({ page }) => {
    await page.getByRole('button', { name: 'Começar' }).click();
    
    // Fill step 1
    await page.getByPlaceholder('Seu nome completo').fill('Usuário Teste');
    await page.locator('input[type="date"]').fill('2000-01-15');
    await page.getByPlaceholder('seu@email.com').fill('teste@exemplo.com');
    await page.getByPlaceholder('(61) 99999-9999').fill('61999999999');
    await page.getByPlaceholder('Ex: Brasília - DF').fill('Brasília');
    
    await page.getByRole('button', { name: 'Próximo' }).click();
    
    // Should be on step 2
    await expect(page.getByText('Formação Acadêmica')).toBeVisible();
    
    // Go back
    await page.getByRole('button', { name: 'Voltar' }).click();
    
    // Should be on step 1
    await expect(page.getByText('Passo 1 de 7')).toBeVisible();
  });

  test('shows progress bar with correct step', async ({ page }) => {
    await page.getByRole('button', { name: 'Começar' }).click();
    
    const progressBar = page.locator('.bg-primary.h-2.rounded-full');
    await expect(progressBar).toBeVisible();
  });

  test('can sign out', async ({ page }) => {
    // Click sign out
    await page.getByRole('button', { name: 'Sair' }).click();
    
    // Should show login button in welcome instead of Começar
    await expect(page.getByRole('main').getByRole('button', { name: 'Entrar / Cadastrar' })).toBeVisible();
  });
});
