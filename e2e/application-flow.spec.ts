import { test, expect } from '@playwright/test';

test.describe('Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays welcome screen with login button when not authenticated', async ({ page }) => {
    // Check for login button - works on all viewports
    await expect(page.getByRole('button', { name: 'Entrar / Cadastrar' }).first()).toBeVisible();
  });

  test('clicking login button on welcome opens auth modal', async ({ page }) => {
    // Click the login button on welcome screen
    await page.getByRole('button', { name: 'Entrar / Cadastrar' }).first().click();
    
    // Auth modal should open
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });

  test('shows opportunities section or empty message', async ({ page }) => {
    // Wait for opportunities to load
    await expect(page.getByText(/Oportunidades Disponíveis|Nenhuma oportunidade aberta/)).toBeVisible({ timeout: 10000 });
  });

  // Authenticated tests are in application.auth.spec.ts
});

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows login button in header when not authenticated', async ({ page }) => {
    // Check the header login button specifically
    await expect(page.getByRole('banner').getByRole('button', { name: 'Entrar / Cadastrar' })).toBeVisible();
  });

  test('opens auth modal when clicking header login button', async ({ page }) => {
    await page.getByRole('banner').getByRole('button', { name: 'Entrar / Cadastrar' }).click();
    
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByPlaceholder('seu@email.com')).toBeVisible();
  });

  test('can switch between login and register modes', async ({ page }) => {
    await page.getByRole('banner').getByRole('button', { name: 'Entrar / Cadastrar' }).click();
    
    // Click register
    await page.getByText('Cadastre-se').click();
    await expect(page.getByRole('heading', { name: 'Criar Conta' })).toBeVisible();
    await expect(page.getByText('Confirmar Senha')).toBeVisible();
    
    // Click back to login
    await page.getByText('Entrar', { exact: false }).last().click();
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });

  test('closes auth modal with X button', async ({ page }) => {
    await page.getByRole('banner').getByRole('button', { name: 'Entrar / Cadastrar' }).click();
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
    
    // Check login button is visible on mobile
    await expect(page.getByRole('button', { name: 'Entrar / Cadastrar' }).first()).toBeVisible();
  });

  test('auth modal works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Click login button
    await page.getByRole('button', { name: 'Entrar / Cadastrar' }).first().click();
    
    // Auth modal should open
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });
});
