import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-setup';

test.describe('Profile', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('profile page loads with user data', async ({ page }) => {
    await page.goto('/profile');
    // Wait for page to load
    await expect(page.getByText('admin@sonnguyenauto.com')).toBeVisible({ timeout: 15_000 });
  });

  test('change password form is visible', async ({ page }) => {
    await page.goto('/profile');
    // Look for the password form - "Mật khẩu hiện tại" is the label for old password field
    await expect(
      page.getByText('Mật khẩu hiện tại'),
    ).toBeVisible({ timeout: 15_000 });
  });
});
