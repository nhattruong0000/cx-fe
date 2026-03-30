import { test, expect } from '@playwright/test';
import { loginViaUI, expectDashboard, hideNextJsDevOverlay } from './auth-setup';

test.describe('Authentication', () => {
  test('login with valid admin credentials redirects to dashboard', async ({ page }) => {
    await loginViaUI(page, 'admin@sonnguyenauto.com', '123123123aA@');
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
    // Expect validation messages
    await expect(
      page.getByText('Email không hợp lệ').or(page.getByText('Mật khẩu tối thiểu 8 ký tự')),
    ).toBeVisible({ timeout: 3_000 });
  });

  test('forgot password link navigates to forgot-password page', async ({ page }) => {
    await page.goto('/login');
    await hideNextJsDevOverlay(page);
    await page.getByRole('link', { name: 'Quên mật khẩu?' }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
    await expect(page.getByText('Quên mật khẩu')).toBeVisible();
  });

  test('logout redirects to login page', async ({ page }) => {
    await loginViaUI(page, 'admin@sonnguyenauto.com', '123123123aA@');
    await expectDashboard(page);

    // Open user menu in sidebar footer and click logout
    const avatarButton = page
      .locator('[data-slot="avatar-fallback"]')
      .or(page.locator('button').filter({ has: page.locator('[data-slot="avatar-fallback"]') }))
      .first();
    await avatarButton.click({ force: true, timeout: 5_000 });
    await page.getByText('Đăng xuất').click({ force: true });
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});
