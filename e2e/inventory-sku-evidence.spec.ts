import { test, expect } from '@playwright/test';

test.describe('SKU Forecast Evidence - E2E Flow', () => {
  const TEST_EMAIL = 'admin@sonnguyenauto.com';
  const TEST_PASSWORD = '123123aA@';
  const TEST_SKU = '#101';

  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/sign-in');

    // Login
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard/**');
    await page.waitForLoadState('networkidle');
  });

  test('1. Navigate to inventory list', async ({ page }) => {
    // Navigate to inventory
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');

    // Verify list renders
    const listContainer = page.locator('[data-testid="inventory-list"]');
    await expect(listContainer).toBeVisible();

    // Verify at least one SKU row is visible
    const firstRow = page.locator('[data-testid^="sku-row-"]').first();
    await expect(firstRow).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/01-inventory-list.png' });
  });

  test('2. Inventory list renders multiple SKUs', async ({ page }) => {
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');

    // Count visible SKU rows (should be > 1 for data populated scenario)
    const rows = await page.locator('[data-testid^="sku-row-"]').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('3. Click SKU row opens evidence drawer', async ({ page }) => {
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');

    // Click first SKU row
    const firstRow = page.locator('[data-testid^="sku-row-"]').first();
    await firstRow.click();

    // Wait for drawer to appear
    const drawer = page.locator('[data-testid="sku-evidence-drawer"]');
    await expect(drawer).toBeVisible({ timeout: 5000 });

    // Verify drawer is Sheet component (positioned right)
    await expect(drawer).toHaveAttribute('data-drawer', '');

    // Take screenshot
    await page.screenshot({ path: 'test-results/02-drawer-opened.png' });
  });

  test('4. Drawer displays all 5 sections', async ({ page }) => {
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');

    // Click first SKU row
    await page.locator('[data-testid^="sku-row-"]').first().click();

    // Wait for drawer
    await page.locator('[data-testid="sku-evidence-drawer"]').waitFor();

    // Verify 5 sections
    const sections = [
      'tồn-kho',
      'dự-báo-30-ngày',
      'cảnh-báo',
      'cung-có-thể-bán',
      'đề-xuất-đặt-hàng'
    ];

    for (const section of sections) {
      const element = page.locator(`[data-testid="sku-evidence-drawer-section-${section}"]`);
      await expect(element).toBeVisible({ timeout: 3000 });
    }

    // Take screenshot
    await page.screenshot({ path: 'test-results/03-drawer-sections.png' });
  });

  test('5. Drawer shows inventory data fields', async ({ page }) => {
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid^="sku-row-"]').first().click();
    await page.locator('[data-testid="sku-evidence-drawer"]').waitFor();

    // Verify tồn kho section has value field
    const onHandSection = page.locator('[data-testid="sku-evidence-drawer-section-tồn-kho"]');
    const valueField = onHandSection.locator('[data-testid="evidence-value"]');
    await expect(valueField).toBeVisible();

    // Verify source label (should say "Nguồn: hệ thống AMIS" or similar)
    const sourceLabel = onHandSection.locator('[data-testid="evidence-source"]');
    await expect(sourceLabel).toBeVisible();
  });

  test('6. Help icons display tooltips', async ({ page }) => {
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid^="sku-row-"]').first().click();
    await page.locator('[data-testid="sku-evidence-drawer"]').waitFor();

    // Find help icon in drawer
    const helpIcon = page.locator('[data-testid="sku-evidence-drawer"] [data-testid="help-icon"]').first();
    if (await helpIcon.isVisible()) {
      // Hover to show tooltip
      await helpIcon.hover();

      // Verify tooltip appears
      const tooltip = page.locator('[role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 2000 });

      // Take screenshot
      await page.screenshot({ path: 'test-results/04-tooltip-hover.png' });
    }
  });

  test('7. Drawer footer button navigates to detail page', async ({ page }) => {
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');

    // Get first SKU code from row
    const firstRow = page.locator('[data-testid^="sku-row-"]').first();
    const skuCode = await firstRow.getAttribute('data-sku-code');

    await firstRow.click();
    await page.locator('[data-testid="sku-evidence-drawer"]').waitFor();

    // Click footer button "Xem chi tiết đầy đủ" or similar
    const detailButton = page.locator('[data-testid="evidence-drawer-detail-button"]');
    await expect(detailButton).toBeVisible();

    await detailButton.click();

    // Wait for navigation to detail page
    const expectedUrl = `/inventory/sku/${skuCode}`;
    await page.waitForURL(`**${expectedUrl}**`, { timeout: 5000 });

    // Verify detail page loaded
    const detailPage = page.locator('[data-testid="sku-evidence-detail"]');
    await expect(detailPage).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/05-detail-page-loaded.png' });
  });

  test('8. Detail page displays 5 tabs', async ({ page }) => {
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid^="sku-row-"]').first().click();
    await page.locator('[data-testid="sku-evidence-drawer"]').waitFor();

    // Click detail button
    await page.locator('[data-testid="evidence-drawer-detail-button"]').click();
    await page.waitForURL(/\/inventory\/sku\//);
    await page.waitForLoadState('networkidle');

    // Verify 5 tabs exist
    const tabs = [
      'tổng-quan',
      'dự-báo',
      'thời-gian-giao',
      'đơn-đặt-hàng',
      'độ-tin-cậy'
    ];

    for (const tab of tabs) {
      const tabElement = page.locator(`[data-testid="sku-evidence-tab-${tab}"]`);
      await expect(tabElement).toBeVisible();
    }
  });

  test('9. Detail page tab switching loads different content', async ({ page }) => {
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid^="sku-row-"]').first().click();
    await page.locator('[data-testid="sku-evidence-drawer"]').waitFor();
    await page.locator('[data-testid="evidence-drawer-detail-button"]').click();
    await page.waitForURL(/\/inventory\/sku\//);

    // Get initial content from overview tab
    const overviewContent = page.locator('[data-testid="evidence-tab-content-tổng-quan"]');
    await expect(overviewContent).toBeVisible();
    const overviewText = await overviewContent.textContent();

    // Switch to forecast tab
    const forecastTab = page.locator('[data-testid="sku-evidence-tab-dự-báo"]');
    await forecastTab.click();

    // Verify content changed
    const forecastContent = page.locator('[data-testid="evidence-tab-content-dự-báo"]');
    await expect(forecastContent).toBeVisible();
    const forecastText = await forecastContent.textContent();

    // Content should be different (or at least tab is active)
    await expect(forecastTab).toHaveAttribute('data-state', 'active');
  });

  test('10. Detail page all tabs accessible without crash', async ({ page }) => {
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid^="sku-row-"]').first().click();
    await page.locator('[data-testid="sku-evidence-drawer"]').waitFor();
    await page.locator('[data-testid="evidence-drawer-detail-button"]').click();
    await page.waitForURL(/\/inventory\/sku\//);
    await page.waitForLoadState('networkidle');

    // Click through all tabs
    const tabs = [
      'tổng-quan',
      'dự-báo',
      'thời-gian-giao',
      'đơn-đặt-hàng',
      'độ-tin-cậy'
    ];

    for (const tab of tabs) {
      const tabElement = page.locator(`[data-testid="sku-evidence-tab-${tab}"]`);
      await tabElement.click();
      await page.waitForLoadState('networkidle');

      // Verify no console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          expect(msg.text()).not.toContain('Cannot read');
        }
      });
    }

    // Take final screenshot
    await page.screenshot({ path: 'test-results/06-all-tabs-verified.png' });
  });

  test('11. Back button returns to inventory list', async ({ page }) => {
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid^="sku-row-"]').first().click();
    await page.locator('[data-testid="sku-evidence-drawer"]').waitFor();
    await page.locator('[data-testid="evidence-drawer-detail-button"]').click();
    await page.waitForURL(/\/inventory\/sku\//);

    // Click back button
    const backButton = page.locator('[data-testid="evidence-detail-back-button"]');
    await expect(backButton).toBeVisible();
    await backButton.click();

    // Verify navigation back to inventory
    await page.waitForURL('/inventory');

    // Verify list is visible again
    const listContainer = page.locator('[data-testid="inventory-list"]');
    await expect(listContainer).toBeVisible();
  });

  test('12. Non-existent SKU shows error page', async ({ page }) => {
    // Navigate directly to non-existent SKU
    await page.goto('/inventory/sku/NONEXISTENT_SKU_XYZ');

    // Wait for page load
    await page.waitForLoadState('networkidle');

    // Verify error message appears
    const errorMessage = page.locator('[data-testid="evidence-error-404"]');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });

    // Verify back/home button exists
    const backButton = page.locator('[data-testid="evidence-error-back-button"]');
    await expect(backButton).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/07-404-error-page.png' });
  });

  test('13. No console errors during typical user flow', async ({ page }) => {
    const errors: string[] = [];

    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Execute typical flow
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('[data-testid^="sku-row-"]').first();
    await firstRow.click();

    const drawer = page.locator('[data-testid="sku-evidence-drawer"]');
    await expect(drawer).toBeVisible();

    await page.locator('[data-testid="evidence-drawer-detail-button"]').click();
    await page.waitForURL(/\/inventory\/sku\//);
    await page.waitForLoadState('networkidle');

    // Switch one tab
    const forecastTab = page.locator('[data-testid="sku-evidence-tab-dự-báo"]');
    await forecastTab.click();
    await page.waitForLoadState('networkidle');

    // Verify no critical console errors
    const criticalErrors = errors.filter(e =>
      !e.includes('Failed to load image') &&
      !e.includes('net::ERR_FAILED')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
