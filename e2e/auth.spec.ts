import { test, expect } from '@playwright/test';
import { loginViaUI, expectDashboard } from './auth-setup';

test.describe('Authentication', () => {
  test('login with valid admin credentials redirects to dashboard', async ({ page }) => {
    await loginViaUI(page, 'admin@sonnguyenauto.com', '123123aA@');
    await expectDashboard(page);
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await loginViaUI(page, 'wrong@email.com', 'wrongpassword');
    // After failed login, should stay on login page or show error
    // Check we're not redirected to dashboard
    await page.waitForTimeout(1000);
    const isOnLoginPage = page.url().includes('/login');
    const hasError = await page.locator('[data-sonner-toast]').or(page.locator('text=/lỗi|sai|không tồn tại/')).isVisible({ timeout: 5_000 }).catch(() => false);

    // Either we stay on login page or see an error message
    expect(isOnLoginPage || hasError).toBeTruthy();
  });

  test('logout redirects to login page', async ({ page }) => {
    // Login first
    await loginViaUI(page, 'admin@sonnguyenauto.com', '123123aA@');
    await expectDashboard(page);

    // Open user menu and click logout
    // Find the avatar button in the header/sidebar
    const avatarButton = page.locator('[data-slot="avatar-fallback"]').or(page.locator('button').filter({ has: page.locator('[data-slot="avatar-fallback"]') })).first();
    await avatarButton.click({ force: true, timeout: 5_000 });

    await page.getByText('Đăng xuất').click({ force: true });
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});
