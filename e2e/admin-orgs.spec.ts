import { test, expect } from '@playwright/test';
import { navigateAsAdmin } from './auth-setup';

test.describe('Admin — Organizations', () => {
  test('organizations table renders with columns', async ({ page }) => {
    await navigateAsAdmin(page, '/organizations');
    await expect(page.getByRole('heading', { name: 'To chuc' })).toBeVisible({ timeout: 10_000 });
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    await expect(table.locator('th').filter({ hasText: 'Ten' })).toBeVisible();
    await expect(table.locator('th').filter({ hasText: 'Ma' })).toBeVisible();
    await expect(table.locator('th').filter({ hasText: 'Trang thai' })).toBeVisible();
  });

  test('search filters organizations', async ({ page }) => {
    await navigateAsAdmin(page, '/organizations');
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 });
    const searchInput = page.getByPlaceholder('Tim to chuc...');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('test');
    await page.waitForTimeout(500);
    // Table should show filtered results or empty state row
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 5_000 });
  });
});
