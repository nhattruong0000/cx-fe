import { test, expect } from "@playwright/test"
import { fillLoginForm, submitLoginForm, TEST_USER } from "./helpers/auth-helpers"

/**
 * Smoke test for /dashboard/inventory after V1 → V2 endpoint migration.
 * Verifies the page consumes /api/v2/inventory/dashboard-summary (not v1).
 * Plan: plans/260426-0729-fe-forecast-rebuild — Page 3
 */

const MOCK_SUMMARY = {
  generated_at: "2026-04-26T10:00:00+07:00",
  last_amis_sync_at: "2026-04-26T09:55:00+07:00",
  staleness_sources: ["amis_outwards", "amis_on_hand"],
  hero_kpis: {
    open_alerts_sku_count: 42,
    critical_alerts_count: 7,
    overdue_po_count: 3,
    reorder_needed_pct: 18,
    reorder_needed_skus_count: 160,
  },
  breakdown: {
    alerts_by_type: [
      { type: "low_stock", label_vi: "Tồn thấp", count: 18 },
      { type: "out_of_stock", label_vi: "Hết hàng", count: 7 },
      { type: "forecast_drift", label_vi: "Sai dự báo", count: 12 },
      { type: "po_overdue", label_vi: "PO quá hạn", count: 5 },
    ],
    stock_health: { healthy: 182, low: 34, out: 8, dormant: 12 },
  },
  top_lists: {
    risky_skus: [],
    upcoming_or_overdue_pos: [],
    off_cadence_suppliers: [],
  },
}

test.describe("/dashboard/inventory — V2 endpoint migration", () => {
  test("page consumes /api/v2/inventory/dashboard-summary (not v1)", async ({ page }) => {
    let v1Called = false
    let v2Called = false

    await page.route("**/api/v1/inventory/dashboard-summary**", (route) => {
      v1Called = true
      return route.fulfill({ status: 404, body: '{"error":"v1 deprecated"}' })
    })
    await page.route("**/api/v2/inventory/dashboard-summary**", (route) => {
      v2Called = true
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_SUMMARY),
      })
    })

    await page.goto("/login")
    await fillLoginForm(page, TEST_USER.email, TEST_USER.password)
    await submitLoginForm(page)
    await page.waitForURL(/\/dashboard|\/$/, { timeout: 15_000 })
    await page.goto("/dashboard/inventory")

    // Wait for KPI text to render → indicates fetch completed
    await expect(page.getByText("42").first()).toBeVisible({ timeout: 15_000 })

    expect(v2Called).toBe(true)
    expect(v1Called).toBe(false)
  })
})
