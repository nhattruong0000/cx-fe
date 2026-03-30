import { test, expect } from '@playwright/test';
import { navigateAsAdmin, hideNextJsDevOverlay } from './auth-setup';

test.describe('Account — Profile', () => {
  test('profile page loads with user data', async ({ page }) => {
    await navigateAsAdmin(page, '/profile');
    // Page heading
    await expect(page.getByText('Hồ sơ cá nhân')).toBeVisible({ timeout: 10_000 });
    // Form fields present
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Họ tên')).toBeVisible();
    // Email field is disabled (read-only)
    await expect(page.getByLabel('Email')).toBeDisabled();
  });

  test('profile form can be submitted', async ({ page }) => {
    await navigateAsAdmin(page, '/profile');
    await expect(page.getByLabel('Họ tên')).toBeVisible({ timeout: 10_000 });
    // Fill name and submit
    await page.getByLabel('Họ tên').fill('Admin Test');
    await page.getByRole('button', { name: 'Lưu thay đổi' }).click();
    // Expect success toast or no error
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast.first()).toBeVisible({ timeout: 5_000 });
  });
});

test.describe('Account — Security', () => {
  test('security page loads with password form and sessions', async ({ page }) => {
    await navigateAsAdmin(page, '/security');
    await expect(page.getByText('Bảo mật & Phiên đăng nhập')).toBeVisible({ timeout: 10_000 });
    // Password section
    await expect(page.getByText('Đổi mật khẩu')).toBeVisible();
    await expect(page.getByLabel('Mật khẩu hiện tại')).toBeVisible();
    await expect(page.getByLabel('Mật khẩu mới')).toBeVisible();
    // Sessions section
    await expect(page.getByText('Phiên đăng nhập')).toBeVisible();
  });

  test('change password form validates empty fields', async ({ page }) => {
    await navigateAsAdmin(page, '/security');
    await expect(page.getByLabel('Mật khẩu hiện tại')).toBeVisible({ timeout: 10_000 });
    // Submit empty form
    await page.getByRole('button', { name: 'Cập nhật mật khẩu' }).click();
    // Expect validation errors
    await expect(
      page
        .getByText('Vui lòng nhập mật khẩu hiện tại')
        .or(page.getByText('Mật khẩu mới tối thiểu 8 ký tự'))
        .or(page.getByText('Vui lòng xác nhận mật khẩu')),
    ).toBeVisible({ timeout: 3_000 });
  });
});
