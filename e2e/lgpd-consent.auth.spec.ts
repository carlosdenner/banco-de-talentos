import { test, expect } from '@playwright/test';

/**
 * Tests for LGPD consent - simplified tests that don't require full form navigation
 * Full form navigation is tested in application.auth.spec.ts
 */
test.describe('LGPD Consent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('privacy policy is accessible from footer', async ({ page }) => {
    // Click privacy policy in footer
    await page.getByRole('button', { name: 'Política de Privacidade' }).click();
    
    // Should show LGPD content
    await expect(page.getByRole('heading', { name: 'Política de Privacidade' })).toBeVisible();
    await expect(page.getByText('Lei Geral de Proteção de Dados')).toBeVisible();
  });

  test('privacy policy mentions consent requirements', async ({ page }) => {
    await page.getByRole('button', { name: 'Política de Privacidade' }).click();
    // Check that privacy policy mentions data rights
    await expect(page.getByRole('heading', { name: '7. Seus Direitos' })).toBeVisible();
  });
});
