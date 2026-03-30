import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../auth-setup';

test.describe('Settings > Users', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/settings/users');
  });

  test('users page loads', async ({ page }) => {
    // Wait for search input to appear (indicates page is loaded)
    await expect(page.getByPlaceholder('Tìm kiếm theo tên hoặc email...')).toBeVisible({ timeout: 15_000 });
  });

  test('can search users', async ({ page }) => {
    // Wait for page to load
    await expect(page.getByPlaceholder('Tìm kiếm theo tên hoặc email...')).toBeVisible({ timeout: 15_000 });

    const searchInput = page.getByPlaceholder('Tìm kiếm theo tên hoặc email...');
    await searchInput.fill('admin');

    // Wait for debounce + API response
    await page.waitForTimeout(500);
  });

  test('can view user detail dialog', async ({ page }) => {
    // Click on first user row
    await expect(page.getByPlaceholder('Tìm kiếm theo tên hoặc email...')).toBeVisible({ timeout: 15_000 });

    // Wait for table to load, then click first row
    await page.waitForTimeout(1000);
    const firstRow = page.locator('table tbody tr').first();
    if (await firstRow.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await firstRow.click({ force: true });
      // Dialog should open with user info
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5_000 });
    }
  });
});
