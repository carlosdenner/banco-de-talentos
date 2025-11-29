import { test, expect } from '@playwright/test';

/**
 * Admin-specific tests
 * These use the authenticated storage state from auth.setup.ts
 * The test user must be an admin (in adminConfig.ts)
 */
test.describe('Admin Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // User is already logged in via storage state
    // Wait for admin tabs to be visible (proves user is admin)
    await expect(page.getByRole('button', { name: 'Candidaturas' })).toBeVisible({ timeout: 10000 });
  });

  test('admin sees admin panel tabs', async ({ page }) => {
    // Admin should see Formulário, Candidaturas, Oportunidades tabs
    await expect(page.getByRole('button', { name: 'Formulário' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Candidaturas' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Oportunidades' })).toBeVisible();
  });

  test('admin can view applications dashboard', async ({ page }) => {
    await page.getByRole('button', { name: 'Candidaturas' }).click();
    
    // Should show admin dashboard
    await expect(page.getByText('Painel de Candidaturas')).toBeVisible();
  });

  test('admin sees invite button in dashboard', async ({ page }) => {
    await page.getByRole('button', { name: 'Candidaturas' }).click();
    
    // Should see invite button
    await expect(page.getByRole('button', { name: 'Convidar Talento' })).toBeVisible();
  });

  test('admin can open invite modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Candidaturas' }).click();
    await page.getByRole('button', { name: 'Convidar Talento' }).click();
    
    // Modal should open
    await expect(page.getByText('Convidar para o Banco de Talentos')).toBeVisible();
    await expect(page.getByPlaceholder('email@exemplo.com')).toBeVisible();
  });

  test('invite modal has send and cancel buttons', async ({ page }) => {
    await page.getByRole('button', { name: 'Candidaturas' }).click();
    await page.getByRole('button', { name: 'Convidar Talento' }).click();
    
    await expect(page.getByRole('button', { name: 'Enviar Convite' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();
  });

  test('can close invite modal with cancel', async ({ page }) => {
    await page.getByRole('button', { name: 'Candidaturas' }).click();
    await page.getByRole('button', { name: 'Convidar Talento' }).click();
    
    await page.getByRole('button', { name: 'Cancelar' }).click();
    
    // Modal should close
    await expect(page.getByText('Convidar para o Banco de Talentos')).not.toBeVisible();
  });

  test('admin sees invite history toggle', async ({ page }) => {
    await page.getByRole('button', { name: 'Candidaturas' }).click();
    
    // Should see invite history toggle
    await expect(page.getByText('Histórico de Convites')).toBeVisible();
  });

  test('can expand invite history', async ({ page }) => {
    await page.getByRole('button', { name: 'Candidaturas' }).click();
    
    // Click to expand
    await page.getByText('Histórico de Convites').click();
    
    // Should show table headers or empty message
    await expect(page.getByText(/E-mail|Nenhum convite enviado/)).toBeVisible();
  });

  test('admin can export CSV', async ({ page }) => {
    await page.getByRole('button', { name: 'Candidaturas' }).click();
    
    // Should see export button
    await expect(page.getByRole('button', { name: 'Exportar CSV' })).toBeVisible();
  });

  test('admin sees status filters', async ({ page }) => {
    await page.getByRole('button', { name: 'Candidaturas' }).click();
    
    // Should see status filter buttons
    await expect(page.getByRole('button', { name: /Todos/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Pendente/ })).toBeVisible();
  });
});
