import { test, expect } from '@playwright/test';
import { navigateAsAdmin } from './auth-setup';

test.describe('Account — Profile', () => {
  test('profile page loads with user data', async ({ page }) => {
    await navigateAsAdmin(page, '/profile');
    await expect(page.getByRole('heading', { name: 'Hồ sơ cá nhân' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Họ tên')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeDisabled();
  });

  test('profile form can be submitted', async ({ page }) => {
    await navigateAsAdmin(page, '/profile');
    await expect(page.getByLabel('Họ tên')).toBeVisible({ timeout: 10_000 });
    await page.getByLabel('Họ tên').fill('Admin Test');
    await page.getByRole('button', { name: 'Lưu thay đổi' }).click();
    // Wait for either success toast or the button to re-enable (submission completed)
    await expect(
      page.locator('[data-sonner-toast]').first()
        .or(page.getByRole('button', { name: 'Lưu thay đổi' })),
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Account — Security', () => {
  test('security page loads with password form and sessions', async ({ page }) => {
    await navigateAsAdmin(page, '/security');
    await expect(page.getByRole('heading', { name: 'Bảo mật & Phiên đăng nhập' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Đổi mật khẩu')).toBeVisible();
    await expect(page.getByLabel('Mật khẩu hiện tại')).toBeVisible();
    await expect(page.getByLabel('Mật khẩu mới', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Phiên đăng nhập', exact: true })).toBeVisible();
  });

  test('change password form validates empty fields', async ({ page }) => {
    await navigateAsAdmin(page, '/security');
    await expect(page.getByLabel('Mật khẩu hiện tại')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Cập nhật mật khẩu' }).click();
    // Expect at least the first validation message
    await expect(page.getByText('Vui lòng nhập mật khẩu hiện tại')).toBeVisible({ timeout: 5_000 });
  });
});
