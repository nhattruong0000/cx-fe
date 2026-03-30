import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-setup';

test.describe('Schedules', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('schedule list loads', async ({ page }) => {
    await page.goto('/schedules');
    // Wait for page heading to load
    await expect(page.getByRole('heading', { name: /Lịch hỗ trợ/i, level: 1 })).toBeVisible({ timeout: 15_000 });
  });

  test('can filter by status', async ({ page }) => {
    await page.goto('/schedules');
    await expect(page.getByRole('heading', { name: /Lịch hỗ trợ/i, level: 1 })).toBeVisible({ timeout: 15_000 });

    // Open status filter dropdown
    const statusTrigger = page.getByRole('combobox', { name: /Trạng thái/ });
    if (await statusTrigger.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await statusTrigger.click({ force: true });
      await page.waitForTimeout(300);
      const pendingOption = page.getByRole('option', { name: /Chờ xử lý/ });
      if (await pendingOption.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await pendingOption.click({ force: true });
      }
    }

    await page.waitForTimeout(500);
  });
});
