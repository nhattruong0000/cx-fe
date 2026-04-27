import { test, expect } from "@playwright/test"
import { fillLoginForm, submitLoginForm, TEST_USER } from "./helpers/auth-helpers"

/**
 * Smoke tests for /inventory/sku/[code] Action Card replacement.
 * Plan: plans/260426-0729-fe-forecast-rebuild/phase-01-design-specs.md (Design 1)
 * Replaces: ForecastCiChart (3-horizon) → ForecastActionCard (v2 schema action card)
 */

const ITEM_CODE = "VT001"

const MOCK_EVIDENCE = {
  item_code: ITEM_CODE,
  generated_at: "2026-04-26T08:30:00+07:00",
  forecast_date: "2026-04-25",
  item_info: {
    item_name: "Cà phê hạt rang 1kg",
    category_code: "CAFE",
    category_name: "Cà phê & Trà",
    vendor_code: "NCC001",
    vendor_name: "Công ty ABC",
  },
  lifecycle: { status: "active", demand_pattern: "regular", active_weeks: 12, zero_ratio: 0.1 },
  stock_status: "warn",
  on_hand: {
    total: 1248,
    by_stock: [{ stock_code: "1551", qty: 1248, stock_name: "Kho chính" }],
    source: "AMIS",
    synced_at: "2026-04-26T08:00:00+07:00",
  },
  weekly_history: [],
  forecasts: [
    {
      horizon_days: 7,
      qty_forecast: 168,
      method: "rolling_avg",
      confidence: 0.85,
      ci_low: 140,
      ci_high: 196,
      stale_days: 0,
    },
    {
      horizon_days: 30,
      qty_forecast: 720,
      method: "rolling_avg",
      confidence: 0.85,
      ci_low: 600,
      ci_high: 840,
      stale_days: 0,
    },
    {
      horizon_days: 90,
      qty_forecast: 2160,
      method: "rolling_avg",
      confidence: 0.85,
      ci_low: 1800,
      ci_high: 2520,
      stale_days: 0,
    },
  ],
  lead_time: { p50: 14, p90: 21, sample: 8, source: "vendor", primary_vendor_code: "NCC001", override: null, per_vendor: [], recent_events: [] },
  alert: {
    severity: "warn",
    dos: 5.2,
    dos_at_detection: 5.5,
    detected_at: "2026-04-25T14:00:00+07:00",
    demand_daily: 240,
    demand_stale_days: 0,
    gate_reasons: [],
  },
  supply_breakdown: { on_hand: 1248, on_order_total: 0, on_order_within_lead_time: 0, effective_supply: 1248 },
  purchase_orders: { open_list: [], overdue_list: [], expediting_priority: [] },
  reliability: {
    score: 0.82,
    display_score: 0.82,
    gate_score: 0.82,
    bottleneck_component: null,
    components: { confidence: 0.85, lt_quality: 0.8 },
    confidence: 0.85,
    gate_decision: "accept",
  },
  suggested_po: { demand_daily: 240, lead_p90: 21, cover_days: 14, qty_raw: 3360, qty_rounded: 3360, batch_size: null, vendor_code: "NCC001" },
}

test.describe("/inventory/sku/[code] — Action Card replacement", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`**/api/v2/inventory/items/${ITEM_CODE}/evidence**`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_EVIDENCE),
      }),
    )
    await page.goto("/login")
    await fillLoginForm(page, TEST_USER.email, TEST_USER.password)
    await submitLoginForm(page)
    await page.waitForURL(/\/dashboard|\/$/, { timeout: 15_000 })
    await page.goto(`/inventory/sku/${ITEM_CODE}`)
  })

  test("renders Forecast Action Card with status, DUS, daily_rate", async ({ page }) => {
    await expect(page.getByText("Trạng thái đặt hàng").first()).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText("Số ngày tồn còn lại (DUS)").first()).toBeVisible()
    // DUS value 5.2 — formatted as "5.2 ngày"
    await expect(page.getByText("5.2 ngày").first()).toBeVisible()
    // daily_rate 240
    await expect(page.getByText(/240/).first()).toBeVisible()
    // Status badge "Cần đặt hàng" because DUS = 5.2 < 7
    await expect(page.getByText("Cần đặt hàng").first()).toBeVisible()
  })

  test("renders 4 stat cells: Daily rate / Reorder qty / Lead time / ROP", async ({ page }) => {
    await expect(page.getByText("Trạng thái đặt hàng").first()).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText("Daily rate").first()).toBeVisible()
    await expect(page.getByText("Reorder qty").first()).toBeVisible()
    await expect(page.getByText("Lead time p50/p90").first()).toBeVisible()
    await expect(page.getByText("ROP (ước tính)").first()).toBeVisible()
  })

  test("renders classification + method + confidence chips", async ({ page }) => {
    await expect(page.getByText("Trạng thái đặt hàng").first()).toBeVisible({ timeout: 15_000 })
    // classification = "regular" (rolling_avg method)
    await expect(page.getByText("regular").first()).toBeVisible()
    // method chip
    await expect(page.getByText(/method:.*rolling_avg/).first()).toBeVisible()
    // confidence chip
    await expect(page.getByText(/confidence:.*0\.85/).first()).toBeVisible()
  })
})
