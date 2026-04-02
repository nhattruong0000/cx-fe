import { test, expect } from "@playwright/test"

test.describe("Forgot Password Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password")
  })

  test("submit email shows success message", async ({ page }) => {
    await page.getByLabel("Địa chỉ email").fill("admin@sonnguyenauto.com")
    await page.getByRole("button", { name: "Gửi liên kết đặt lại" }).click()
    await expect(
      page.getByText("Kiểm tra email của bạn"),
    ).toBeVisible({ timeout: 10_000 })
  })

  test("empty submit shows email required error", async ({ page }) => {
    await page.getByRole("button", { name: "Gửi liên kết đặt lại" }).click()
    await expect(page.locator(".text-destructive").first()).toBeVisible()
  })

  test("back to login link navigates to /login", async ({ page }) => {
    await page.getByText("Quay lại đăng nhập").click()
    await expect(page).toHaveURL(/\/login/)
  })

  test("info box is visible and rendered", async ({ page }) => {
    await expect(
      page.getByText("Không tìm thấy email?"),
    ).toBeVisible()
  })
})
