import { test, expect, type Page } from "@playwright/test"

/**
 * Full e2e suite for /inventory/suppliers/[id] — supplier detail page.
 * Uses real login (sets access_token cookie via middleware) + page.route() mocks
 * for supplier detail and SKUs endpoints, matching Phase 2 response shapes.
 */

const MOCK_SUPPLIER_ID = "02b13a2b-d0b2-44e7-83cb-394fe41a99aa"

// ─── Mock payloads (match Phase 2 response shapes) ───────────────────────────

const MOCK_SUPPLIER_DETAIL = {
  id: MOCK_SUPPLIER_ID,
  code: "NCC-001",
  name: "Công ty TNHH Dầu nhớt Việt",
  contact_email: "contact@daukhot.com",
  contact_phone: "0901234567",
  address: "123 Đường Láng, Đống Đa, Hà Nội",
  lead_time_p50_days: 7,
  lead_time_p90_days: 14,
  cadence_days: 30,
  status: "active",
  last_po_date: "2026-04-01",
  metrics: {
    sku_count_total: 42,
    po_count_90d: 8,
    revenue_90d: 125000000,
    expected_need_30d: 15000000,
  },
  risk_counts: {
    ok: 30,
    warn: 8,
    critical: 4,
  },
  top_5_critical: [
    {
      sku_code: "SKU-001",
      name: "Dầu nhớt Shell Helix 5W-30",
      on_hand: 2,
      dus: 1.3,
    },
  ],
}

// V2 shape: daily_rate/rop/dus/classification instead of forecast_30d/90d
const MOCK_SUPPLIER_SKUS = {
  data: [
    {
      sku_code: "SKU-001",
      name: "Dầu nhớt Shell Helix 5W-30",
      branch_id: "branch-1",
      branch_name: "Chi nhánh Hà Nội",
      on_hand: 2,
      status: "critical",
      daily_rate: 1.5,
      rop: 8,
      safety_stock: 3,
      classification: "regular",
      confidence: 0.82,
      lead_time_p50_days: 7,
      reorder_qty_suggestion: 45,
      dus: 1.3,
      updated_at: "2026-04-20T10:00:00.000Z",
    },
    {
      sku_code: "SKU-002",
      name: "Dầu hộp số Castrol MTF",
      branch_id: "branch-1",
      branch_name: "Chi nhánh Hà Nội",
      on_hand: 15,
      status: "ok",
      daily_rate: 0.5,
      rop: 5,
      safety_stock: 2,
      classification: "regular",
      confidence: 0.75,
      lead_time_p50_days: 7,
      reorder_qty_suggestion: 15,
      dus: 30.0,
      updated_at: "2026-04-20T10:00:00.000Z",
    },
  ],
  next_cursor: null,
}

// ─── Auth helper (real login to set access_token cookie) ─────────────────────

async function loginAsManager(page: Page) {
  await page.goto("/login", { waitUntil: "domcontentloaded" })
  await page.waitForSelector("#email", { timeout: 15000 })
  await page.fill("#email", "manager@sonnguyenauto.com")
  await page.fill("#password", "123123aA@")
  await page.click('button[type="submit"]')
  await page.waitForURL(/inventory|dashboard/, { timeout: 15000 })
}

// ─── Route mock helpers ───────────────────────────────────────────────────────

async function mockSupplierDetailRoutes(page: Page) {
  // V1 supplier detail endpoint (kept live — only top_5_critical body changed to use dus)
  await page.route(
    `**/api/v1/inventory/suppliers/${MOCK_SUPPLIER_ID}`,
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_SUPPLIER_DETAIL),
      }),
  )

  // V2 supplier SKUs endpoint (Phase 02 migration: v1 → v2)
  await page.route(
    `**/api/v2/inventory/suppliers/${MOCK_SUPPLIER_ID}/skus**`,
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_SUPPLIER_SKUS),
      }),
  )
}

// ─── Test suite ──────────────────────────────────────────────────────────────

test.describe("/inventory/suppliers/[id] — supplier detail", () => {
  test.use({ actionTimeout: 15000 })

  /** Single auth shared across all tests to minimise round-trips */
  test.beforeEach(async ({ page }) => {
    await loginAsManager(page)
  })

  // ── 1. Page title visible ─────────────────────────────────────────────────

  test("page title 'Chi tiết nhà cung cấp' visible", async ({ page }) => {
    await mockSupplierDetailRoutes(page)
    await page.goto(`/inventory/suppliers/${MOCK_SUPPLIER_ID}`)
    await expect(
      page.getByRole("heading", { name: "Chi tiết nhà cung cấp" }),
    ).toBeVisible({ timeout: 12000 })
  })

  // ── 2. Breadcrumb back to list ────────────────────────────────────────────

  test("breadcrumb renders with link to suppliers list", async ({ page }) => {
    await mockSupplierDetailRoutes(page)
    await page.goto(`/inventory/suppliers/${MOCK_SUPPLIER_ID}`)
    await expect(
      page.getByRole("heading", { name: "Chi tiết nhà cung cấp" }),
    ).toBeVisible({ timeout: 12000 })

    // Scope to main content area to avoid sidebar nav conflict
    const main = page.locator("main")
    const suppliersLink = main.getByRole("link", { name: "Nhà cung cấp" })
    await expect(suppliersLink).toBeVisible()
    await expect(suppliersLink).toHaveAttribute("href", "/inventory/suppliers")

    // Supplier code appears in breadcrumb
    await expect(main.locator("nav").filter({ hasText: "NCC-001" })).toBeVisible()
  })

  // ── 3. Header card ────────────────────────────────────────────────────────

  test("supplier header card shows supplier name", async ({ page }) => {
    await mockSupplierDetailRoutes(page)
    await page.goto(`/inventory/suppliers/${MOCK_SUPPLIER_ID}`)
    await expect(
      page.getByRole("heading", { name: "Chi tiết nhà cung cấp" }),
    ).toBeVisible({ timeout: 12000 })

    await expect(page.getByText("Công ty TNHH Dầu nhớt Việt")).toBeVisible()
  })

  // ── 4. 4 KPI metric cards ─────────────────────────────────────────────────

  test("4 KPI metric cards present", async ({ page }) => {
    await mockSupplierDetailRoutes(page)
    await page.goto(`/inventory/suppliers/${MOCK_SUPPLIER_ID}`)
    await expect(
      page.getByRole("heading", { name: "Chi tiết nhà cung cấp" }),
    ).toBeVisible({ timeout: 12000 })

    const cards = page.locator("[data-slot=card]")
    await expect(cards.first()).toBeVisible({ timeout: 5000 })
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  // ── 5. Risk breakdown pills ───────────────────────────────────────────────

  test("risk breakdown section 'Tình trạng rủi ro tồn kho' renders with 3 pills", async ({
    page,
  }) => {
    await mockSupplierDetailRoutes(page)
    await page.goto(`/inventory/suppliers/${MOCK_SUPPLIER_ID}`)
    await expect(
      page.getByRole("heading", { name: "Chi tiết nhà cung cấp" }),
    ).toBeVisible({ timeout: 12000 })

    // Section heading is always rendered
    const riskHeading = page.getByText("Tình trạng rủi ro tồn kho")
    await expect(riskHeading).toBeVisible({ timeout: 5000 })

    // Scope pill lookups to the risk card to avoid sidebar conflicts
    const riskCard = page.locator("[data-slot=card]").filter({
      has: page.getByText("Tình trạng rủi ro tồn kho"),
    })
    // Use the pill span element directly (rounded-full class), exact text match
    await expect(riskCard.locator("span.rounded-full", { hasText: /^[0-9]+Ổn định$/ }).first()).toBeVisible({ timeout: 5000 })
    await expect(riskCard.locator("span.rounded-full", { hasText: /^[0-9]+Cảnh báo$/ }).first()).toBeVisible()
    await expect(riskCard.locator("span.rounded-full", { hasText: /^[0-9]+Nguy cấp$/ }).first()).toBeVisible()
  })

  // ── 6. SKU table renders with search input ───────────────────────────────

  test("SKU table renders with search input and at least 1 row", async ({
    page,
  }) => {
    await mockSupplierDetailRoutes(page)
    await page.goto(`/inventory/suppliers/${MOCK_SUPPLIER_ID}`)
    await expect(
      page.getByRole("heading", { name: "Chi tiết nhà cung cấp" }),
    ).toBeVisible({ timeout: 12000 })

    const searchInput = page.getByPlaceholder("Tìm mã hàng hoặc tên...")
    await expect(searchInput).toBeVisible({ timeout: 5000 })

    const tableRow = page.locator("table tbody tr").first()
    await expect(tableRow).toBeVisible({ timeout: 8000 })
  })

  // ── 7. Click SKU code button → dialog opens; close → dialog dismisses ───

  test("click SKU code button opens forecast evidence dialog; close dismisses it", async ({
    page,
  }) => {
    await mockSupplierDetailRoutes(page)
    await page.goto(`/inventory/suppliers/${MOCK_SUPPLIER_ID}`)
    await expect(
      page.getByRole("heading", { name: "Chi tiết nhà cung cấp" }),
    ).toBeVisible({ timeout: 12000 })

    // SKU code cells are <button> elements inside the table (per supplier-skus-columns.tsx)
    const skuCodeBtn = page
      .locator("table tbody tr")
      .first()
      .locator("button")
      .first()
    await expect(skuCodeBtn).toBeVisible({ timeout: 8000 })
    await skuCodeBtn.click()

    // shadcn Dialog: DialogTitle contains the SKU code; scope from there
    // DialogTitle renders as <h2 role="dialog" ...> or inside [role=dialog] wrapper
    const skuTitle = page.getByRole("heading", { name: "SKU-001" })
    await expect(skuTitle).toBeVisible({ timeout: 8000 })

    // Close via Escape key (reliable cross-browser, avoids pointer interception)
    await page.keyboard.press("Escape")

    // After close, SKU title heading should be gone
    await expect(skuTitle).not.toBeVisible({ timeout: 5000 })
  })

  // ── 8. Navigate from list → detail ───────────────────────────────────────

  test("supplier name link on list page navigates to /inventory/suppliers/:id", async ({
    page,
  }) => {
    // Mock suppliers list to include our test supplier
    await page.route("**/api/v1/inventory/suppliers**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: MOCK_SUPPLIER_ID,
              code: "NCC-001",
              name: "Công ty TNHH Dầu nhớt Việt",
              contact_email: "contact@daukhot.com",
              contact_phone: "0901234567",
              lead_time_p50_days: 7,
              lead_time_p90_days: 14,
              po_count_90d: 8,
              last_po_date: "2026-04-01",
            },
          ],
          next_cursor: null,
        }),
      }),
    )
    await mockSupplierDetailRoutes(page)

    await page.goto("/inventory/suppliers")

    const nameLink = page.getByRole("link", {
      name: "Công ty TNHH Dầu nhớt Việt",
    })
    await expect(nameLink).toBeVisible({ timeout: 10000 })
    await nameLink.click()

    await page.waitForURL(`**/inventory/suppliers/${MOCK_SUPPLIER_ID}`, {
      timeout: 10000,
    })
    await expect(
      page.getByRole("heading", { name: "Chi tiết nhà cung cấp" }),
    ).toBeVisible({ timeout: 12000 })
  })

  // ── 9. No console errors ──────────────────────────────────────────────────

  test("no console errors on full page load", async ({ page }) => {
    const errors: string[] = []
    page.on("console", (m) => {
      if (m.type() === "error" && !m.text().includes("Warning:")) {
        errors.push(m.text())
      }
    })

    await mockSupplierDetailRoutes(page)
    await page.goto(`/inventory/suppliers/${MOCK_SUPPLIER_ID}`)
    await expect(
      page.getByRole("heading", { name: "Chi tiết nhà cung cấp" }),
    ).toBeVisible({ timeout: 12000 })

    await expect(page.locator("table tbody tr").first()).toBeVisible({
      timeout: 8000,
    })

    await page.screenshot({
      path: "test-results/supplier-detail-full.png",
      fullPage: true,
    })

    expect(errors, `Console errors: ${errors.join(" | ")}`).toHaveLength(0)
  })
})
