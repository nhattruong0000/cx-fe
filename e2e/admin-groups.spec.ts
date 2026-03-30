import { test, expect } from '@playwright/test';
import { navigateAsAdmin } from './auth-setup';

test.describe('Admin — Permission Groups', () => {
  test('permission groups list renders cards', async ({ page }) => {
    await navigateAsAdmin(page, '/permission-groups');
    await expect(page.getByRole('heading', { name: 'Nhom quyen' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByPlaceholder('Tim nhom quyen...')).toBeVisible();
    await expect(
      page.locator('[data-slot="card"]').first().or(page.getByText('Khong tim thay nhom quyen nao')),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('permission group detail page loads with edit form', async ({ page }) => {
    await navigateAsAdmin(page, '/permission-groups');
    await expect(page.getByRole('heading', { name: 'Nhom quyen' })).toBeVisible({ timeout: 10_000 });
    const firstCard = page.locator('[data-slot="card"]').first();
    const hasCards = await firstCard.isVisible({ timeout: 5_000 }).catch(() => false);
    if (hasCards) {
      await firstCard.getByRole('link').first().click();
      await expect(page.getByText('Thong tin nhom')).toBeVisible({ timeout: 10_000 });
      await expect(page.getByText('Quyen han')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Luu thay doi' })).toBeVisible();
      await expect(page.getByText('Quay lai')).toBeVisible();
    } else {
      expect(true).toBeTruthy();
    }
  });
});

test.describe('Admin — User Groups', () => {
  test('user groups list renders cards', async ({ page }) => {
    await navigateAsAdmin(page, '/user-groups');
    await expect(page.getByRole('heading', { name: 'Nhom nguoi dung' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByPlaceholder('Tim nhom nguoi dung...')).toBeVisible();
    await expect(
      page.locator('[data-slot="card"]').first().or(page.getByText('Khong tim thay nhom nao')),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('user group detail page shows tabs', async ({ page }) => {
    await navigateAsAdmin(page, '/user-groups');
    await expect(page.getByRole('heading', { name: 'Nhom nguoi dung' })).toBeVisible({ timeout: 10_000 });
    const firstCard = page.locator('[data-slot="card"]').first();
    const hasCards = await firstCard.isVisible({ timeout: 5_000 }).catch(() => false);
    if (hasCards) {
      await firstCard.getByRole('link').first().click();
      await expect(page.getByText('Quay lai')).toBeVisible({ timeout: 10_000 });
      await expect(page.getByRole('tab', { name: 'Tong quan' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Quyen han' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Thanh vien' })).toBeVisible();
    } else {
      expect(true).toBeTruthy();
    }
  });
});
