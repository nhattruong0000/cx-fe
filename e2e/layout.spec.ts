import { test, expect } from '@playwright/test';
import { navigateAsAdmin, hideNextJsDevOverlay } from './auth-setup';

test.describe('Layout — Sidebar & Navigation', () => {
  test('sidebar shows navigation links for admin', async ({ page }) => {
    await navigateAsAdmin(page, '/');
    // Sidebar should have nav sections
    const sidebar = page.locator('[data-slot="sidebar"]');
    await expect(sidebar).toBeVisible({ timeout: 10_000 });
    // Account section links
    await expect(sidebar.getByText('Hồ sơ')).toBeVisible();
    await expect(sidebar.getByText('Bảo mật')).toBeVisible();
    // Admin section links
    await expect(sidebar.getByText('Người dùng')).toBeVisible();
    await expect(sidebar.getByText('Nhóm quyền')).toBeVisible();
    await expect(sidebar.getByText('Tổ chức')).toBeVisible();
  });

  test('sidebar collapse toggle works', async ({ page }) => {
    await navigateAsAdmin(page, '/');
    const sidebar = page.locator('[data-slot="sidebar"]');
    await expect(sidebar).toBeVisible({ timeout: 10_000 });
    // Click collapse button
    const collapseBtn = page.getByRole('button', { name: 'Thu gọn sidebar' });
    await expect(collapseBtn).toBeVisible();
    await collapseBtn.click();
    // After collapse, sidebar should be narrow (w-16 = 64px)
    await expect(sidebar).toHaveCSS('width', '64px', { timeout: 3_000 });
    // Expand button should appear
    const expandBtn = page.getByRole('button', { name: 'Mở rộng sidebar' });
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();
    // Back to expanded (w-60 = 240px)
    await expect(sidebar).toHaveCSS('width', '240px', { timeout: 3_000 });
  });

  test('breadcrumb shows correct path segments', async ({ page }) => {
    await navigateAsAdmin(page, '/users');
    // Breadcrumb nav
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible({ timeout: 10_000 });
    // Should show "Người dùng" segment
    await expect(breadcrumb.getByText('Người dùng')).toBeVisible();
  });

  test('mobile hamburger menu opens sidebar sheet', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await navigateAsAdmin(page, '/');
    await hideNextJsDevOverlay(page);
    // Desktop sidebar should be hidden on mobile
    const desktopSidebar = page.locator('[data-slot="sidebar"]');
    await expect(desktopSidebar).not.toBeVisible({ timeout: 5_000 });
    // Mobile hamburger button
    const hamburger = page.getByRole('button', { name: 'Mở menu' });
    await expect(hamburger).toBeVisible({ timeout: 5_000 });
    await hamburger.click();
    // Mobile sheet sidebar should appear
    await expect(page.getByText('Hồ sơ')).toBeVisible({ timeout: 5_000 });
  });
});
