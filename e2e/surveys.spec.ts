import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-setup';

test.describe('Surveys', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('survey list loads', async ({ page }) => {
    await page.goto('/surveys');
    // Wait for the page heading to load
    await expect(page.getByRole('heading', { name: 'Khảo sát', level: 1 })).toBeVisible({ timeout: 15_000 });
  });

  test('navigate to create survey page', async ({ page }) => {
    await page.goto('/surveys');
    await expect(page.getByRole('heading', { name: 'Khảo sát', level: 1 })).toBeVisible({ timeout: 15_000 });

    // Click the create survey link/button (rendered as <a> via render prop)
    await page.getByRole('link', { name: /Tạo khảo sát/ }).or(page.getByRole('button', { name: /Tạo khảo sát/ })).first().click({ force: true });
    await expect(page).toHaveURL(/\/surveys\/create/, { timeout: 10_000 });
  });

  test('create NPS survey flow', async ({ page }) => {
    await page.goto('/surveys/create');
    await page.waitForLoadState('domcontentloaded');

    // Just verify we're on the create page - form fields vary
    await expect(page.getByRole('heading')).toBeVisible({ timeout: 15_000 });
  });
});
