import { test, expect } from '@playwright/test';
import { navigateAsAdmin } from './auth-setup';

test.describe('Admin — Organizations', () => {
  test('organizations table renders with columns', async ({ page }) => {
    await navigateAsAdmin(page, '/organizations');
    await expect(page.getByText('To chuc')).toBeVisible({ timeout: 10_000 });
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    // Table headers
    await expect(table.getByText('Ten')).toBeVisible();
    await expect(table.getByText('Ma')).toBeVisible();
    await expect(table.getByText('Trang thai')).toBeVisible();
  });

  test('search filters organizations', async ({ page }) => {
    await navigateAsAdmin(page, '/organizations');
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 });
    const searchInput = page.getByPlaceholder('Tim to chuc...');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('test');
    await page.waitForTimeout(500);
    // Either filtered rows or empty state
    await expect(
      page.locator('table tbody tr').first().or(page.getByText('Khong tim thay to chuc nao')),
    ).toBeVisible({ timeout: 5_000 });
  });
});
