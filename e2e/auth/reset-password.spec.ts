import { test, expect } from "@playwright/test"

test.describe("Reset Password Page", () => {
  const FAKE_TOKEN = "test-token-e2e"

  /** Mock token validation API to return valid */
  async function mockValidToken(page: import("@playwright/test").Page) {
    await page.route(
      `**/api/v1/auth/passwords/validate/${FAKE_TOKEN}`,
      (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ valid: true }),
        }),
    )
  }

  test("renders page with token in URL", async ({ page }) => {
    await page.goto(`/reset-password/${FAKE_TOKEN}`)
    await expect(
      page
        .getByText("Tạo mật khẩu mới")
        .or(page.getByText("Liên kết đặt lại không hợp lệ")),
    ).toBeVisible({ timeout: 10_000 })
  })

  test("invalid token shows error state with request-new-link button", async ({ page }) => {
    await page.goto(`/reset-password/${FAKE_TOKEN}`)
    await expect(page.getByText("Liên kết đặt lại không hợp lệ")).toBeVisible({
      timeout: 10_000,
    })
    await expect(page.getByRole("link", { name: "Yêu cầu liên kết mới" })).toBeVisible()
  })

  test("password mismatch shows error", async ({ page }) => {
    await mockValidToken(page)
    await page.goto(`/reset-password/${FAKE_TOKEN}`)
    await expect(page.getByText("Tạo mật khẩu mới")).toBeVisible({
      timeout: 10_000,
    })

    await page.getByPlaceholder("Nhập mật khẩu mới").fill("StrongPass1!")
    await page.getByPlaceholder("Xác nhận mật khẩu mới").fill("DifferentPass2!")
    await page.getByRole("button", { name: "Đặt lại mật khẩu" }).click()

    await expect(page.getByText("Mật khẩu không khớp")).toBeVisible()
  })

  test("weak password shows strength indicator", async ({ page }) => {
    await mockValidToken(page)
    await page.goto(`/reset-password/${FAKE_TOKEN}`)
    await expect(page.getByText("Tạo mật khẩu mới")).toBeVisible({
      timeout: 10_000,
    })

    // Password with 8+ chars but only lowercase → score=1 (weak), shows label
    await page.getByPlaceholder("Nhập mật khẩu mới").fill("abcdefgh")
    await expect(page.getByText("Yếu")).toBeVisible()
  })

  test("back to login link navigates to /login", async ({ page }) => {
    await mockValidToken(page)
    await page.goto(`/reset-password/${FAKE_TOKEN}`)
    await expect(page.getByText("Tạo mật khẩu mới")).toBeVisible({
      timeout: 10_000,
    })

    await page.getByText("Quay lại đăng nhập").click()
    await expect(page).toHaveURL(/\/login/)
  })
})
