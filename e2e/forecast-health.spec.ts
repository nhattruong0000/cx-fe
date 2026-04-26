import { test, expect } from "@playwright/test"
import { fillLoginForm, submitLoginForm, TEST_USER } from "./helpers/auth-helpers"

/**
 * Smoke tests for /forecast-health (admin-only page).
 * Plan: plans/260426-0729-fe-forecast-rebuild/phase-01-design-specs.md
 *
 * Auth strategy: real UI login với admin credentials (TEST_USER from auth-helpers)
 * — auth bypass via mocked sessionStorage flaky vì AuthProvider re-validates.
 * BE forecast-health endpoint is mocked to control table content for assertions.
 */

const MOCK_RESPONSE = {
  generated_at: "2026-04-26T08:30:00+07:00",
  scope: { branch_ids: ["b64c780a-cc7d-4987-89ad-9421f1b76c07"] },
  counts: {
    total: 889,
    with_confidence: 245,
    insufficient_data: 644,
    flagged_high_wmape: 47,
  },
  data: [
    {
      item_code: "VT001",
      stock_code: "1551",
      branch_id: "b64c780a-cc7d-4987-89ad-9421f1b76c07",
      n: 28,
      wmape: 0.224,
      bias: 0.031,
      confidence: 0.85,
    },
    {
      item_code: "VT004",
      stock_code: "1551",
      branch_id: "b64c780a-cc7d-4987-89ad-9421f1b76c07",
      n: 24,
      wmape: 0.387,
      bias: -0.12,
      confidence: 0.65,
    },
  ],
}

test.describe("/forecast-health — admin smoke tests", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API response BEFORE login navigation
    await page.route("**/api/v2/inventory/forecast-health", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_RESPONSE),
      }),
    )

    // Real login flow as admin
    await page.goto("/login")
    await fillLoginForm(page, TEST_USER.email, TEST_USER.password)
    await submitLoginForm(page)
    await page.waitForURL(/\/dashboard|\/$/, { timeout: 15_000 })

    // Navigate to forecast-health
    await page.goto("/forecast-health")
  })

  test("renders page heading 'Forecast Health'", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Forecast Health" })).toBeVisible({
      timeout: 15_000,
    })
  })

  test("renders 4 KPI cards with counts from response", async ({ page }) => {
    await expect(page.getByText("Tổng SKUs forecasted")).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText("889")).toBeVisible()
    await expect(page.getByText("Có confidence (backtest)")).toBeVisible()
    await expect(page.getByText("245")).toBeVisible()
    await expect(page.getByText("Insufficient data")).toBeVisible()
    await expect(page.getByText("644")).toBeVisible()
    await expect(page.getByText("WMAPE > 50% flagged")).toBeVisible()
    await expect(page.getByText("47")).toBeVisible()
  })

  test("renders data table with rows from mocked response", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible({ timeout: 15_000 })
    await expect(page.locator("table tbody tr")).toHaveCount(2)
    await expect(page.locator("table tbody")).toContainText("VT001")
    await expect(page.locator("table tbody")).toContainText("VT004")
  })

  test("search input filters table rows by item_code", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible({ timeout: 15_000 })
    const search = page.getByPlaceholder("Tìm SKU hoặc item code...")
    await expect(search).toBeVisible()
    await search.fill("VT001")
    await expect(page.locator("table tbody")).toContainText("VT001")
    await expect(page.locator("table tbody")).not.toContainText("VT004")
  })
})
