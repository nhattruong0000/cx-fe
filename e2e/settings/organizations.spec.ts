import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../auth-setup';

test.describe('Settings > Organizations', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/settings/organizations');
  });

  test('organizations page loads', async ({ page }) => {
    // Wait for search input to appear (indicates page is loaded)
    await expect(page.getByPlaceholder('Tìm kiếm tổ chức...')).toBeVisible({ timeout: 15_000 });
  });

  test('can search organizations', async ({ page }) => {
    // Wait for page to load
    const searchInput = page.getByPlaceholder('Tìm kiếm tổ chức...');
    await expect(searchInput).toBeVisible({ timeout: 15_000 });

    await searchInput.fill('son');

    await page.waitForTimeout(500);
  });
});
