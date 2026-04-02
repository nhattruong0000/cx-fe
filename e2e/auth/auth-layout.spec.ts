import { test, expect } from "@playwright/test"

test.describe("Auth Layout — Responsive", () => {
  test("desktop (1440px): left panel visible with branding", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/login")
    // AuthLeftPanel is visible at lg+ (1024px+)
    await expect(page.getByText("SonNguyen CX").first()).toBeVisible()
    await expect(page.getByText("Chào mừng trở lại")).toBeVisible()
  })

  test("mobile (375px): left panel hidden, form full-width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/login")
    // Left panel hidden below lg breakpoint
    await expect(page.getByText("SonNguyen CX").first()).toBeHidden()
    // Login form should still be visible
    await expect(page.getByText("Đăng nhập vào tài khoản")).toBeVisible()
  })

  test("tablet (768px): left panel hidden", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto("/login")
    await expect(page.getByText("SonNguyen CX").first()).toBeHidden()
    await expect(page.getByText("Đăng nhập vào tài khoản")).toBeVisible()
  })

  test('logo "SonNguyen CX" renders on left panel at desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/login")
    const logo = page.getByText("SonNguyen CX").first()
    await expect(logo).toBeVisible()
  })
})
