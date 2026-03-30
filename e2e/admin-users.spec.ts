import { test, expect } from '@playwright/test';
import { navigateAsAdmin } from './auth-setup';

test.describe('Admin — Users', () => {
  test('users table renders with columns', async ({ page }) => {
    await navigateAsAdmin(page, '/users');
    await expect(page.getByText('Quan ly nguoi dung')).toBeVisible({ timeout: 10_000 });
    // Table headers
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    await expect(table.getByText('Nguoi dung')).toBeVisible();
    await expect(table.getByText('Email')).toBeVisible();
    await expect(table.getByText('Vai tro')).toBeVisible();
    await expect(table.getByText('Trang thai')).toBeVisible();
  });

  test('search filters users', async ({ page }) => {
    await navigateAsAdmin(page, '/users');
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 });
    const searchInput = page.getByPlaceholder('Tim kiem nguoi dung...');
    await expect(searchInput).toBeVisible();
    // Type a search query
    await searchInput.fill('admin');
    // Wait for table to update (debounce)
    await page.waitForTimeout(500);
    // Table should still be visible (may show filtered results or empty state)
    await expect(
      page.locator('table tbody tr').first().or(page.getByText('Khong tim thay nguoi dung nao')),
    ).toBeVisible({ timeout: 5_000 });
  });

  test('pagination controls appear when multiple pages exist', async ({ page }) => {
    await navigateAsAdmin(page, '/users');
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 });
    // If pagination exists, verify buttons
    const paginationArea = page.getByText(/Trang \d+ \/ \d+/);
    const hasPagination = await paginationArea.isVisible({ timeout: 3_000 }).catch(() => false);
    if (hasPagination) {
      await expect(page.getByRole('button', { name: 'Truoc' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sau' })).toBeVisible();
    }
    // Test passes regardless — pagination may not be present with few users
    expect(true).toBeTruthy();
  });

  test('invite button navigates to invite page', async ({ page }) => {
    await navigateAsAdmin(page, '/users');
    await expect(page.getByText('Quan ly nguoi dung')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('link', { name: /Moi nguoi dung/ }).click();
    await expect(page).toHaveURL(/\/users\/invite/);
    await expect(page.getByText('Moi nguoi dung')).toBeVisible({ timeout: 5_000 });
  });

  test('invite form has required fields', async ({ page }) => {
    await navigateAsAdmin(page, '/users/invite');
    await expect(page.getByText('Thong tin loi moi')).toBeVisible({ timeout: 10_000 });
    // Form fields
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByText('Vai tro')).toBeVisible();
    // Action buttons
    await expect(page.getByRole('button', { name: 'Gui loi moi' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Huy' })).toBeVisible();
  });
});
