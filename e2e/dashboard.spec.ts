import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-setup';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('page loads without errors', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Tổng quan hệ thống')).toBeVisible({ timeout: 15_000 });
  });

  test('summary cards are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Tổng quan hệ thống')).toBeVisible({ timeout: 15_000 });

    // Module cards should be visible - use role selector to avoid strict mode violations
    // Look for the card title specifically, not the link text
    await expect(
      page.locator('[data-slot="card-title"]').filter({ hasText: 'Khảo sát' }),
    ).toBeVisible();
  });
});
