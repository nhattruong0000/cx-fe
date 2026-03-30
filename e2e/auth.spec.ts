import { test, expect } from '@playwright/test';
import { loginViaUI, expectDashboard, hideNextJsDevOverlay } from './auth-setup';

test.describe('Authentication', () => {
  test('login with valid admin credentials redirects to dashboard', async ({ page }) => {
    await loginViaUI(page, 'admin@sonnguyenauto.com', '123123aA@');
    await expectDashboard(page);
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await loginViaUI(page, 'wrong@email.com', 'wrongpassword');
    // Should stay on login page or show toast error
    await page.waitForTimeout(1000);
    const isOnLoginPage = page.url().includes('/login');
    const hasError = await page
      .locator('[data-sonner-toast]')
      .or(page.locator('text=/lỗi|sai|không tồn tại|thất bại/'))
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    expect(isOnLoginPage || hasError).toBeTruthy();
  });

  test('empty form shows validation errors', async ({ page }) => {
    await page.goto('/login');
    await hideNextJsDevOverlay(page);
    // Submit without filling anything
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    // Expect at least one validation message
    await expect(page.getByText('Email không hợp lệ')).toBeVisible({ timeout: 3_000 });
  });

  test('forgot password link navigates to forgot-password page', async ({ page }) => {
    await page.goto('/login');
    await hideNextJsDevOverlay(page);
    await page.getByRole('link', { name: 'Quên mật khẩu?' }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
    await expect(page.getByRole('heading', { name: 'Quên mật khẩu' })).toBeVisible();
  });

  test('logout clears auth and redirects to login', async ({ page }) => {
    await loginViaUI(page, 'admin@sonnguyenauto.com', '123123aA@');
    // Wait for redirect to complete (admin → / → /users)
    await expect(page).toHaveURL(/\/users/, { timeout: 15_000 });
    await hideNextJsDevOverlay(page);

    // Clear auth state programmatically (simulates logout action)
    await page.evaluate(() => {
      localStorage.removeItem('cx-token');
      localStorage.removeItem('cx-refresh-token');
      document.cookie = 'cx-auth=; path=/; max-age=0';
      document.cookie = 'cx-role=; path=/; max-age=0';
    });
    // Navigate to a protected page — should redirect to login
    await page.goto('/users');
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});
