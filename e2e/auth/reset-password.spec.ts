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
        .getByText("Create new password")
        .or(page.getByText("Invalid Reset Link")),
    ).toBeVisible({ timeout: 10_000 })
  })

  test("invalid token shows error state with request-new-link button", async ({ page }) => {
    await page.goto(`/reset-password/${FAKE_TOKEN}`)
    await expect(page.getByText("Invalid Reset Link")).toBeVisible({
      timeout: 10_000,
    })
    await expect(page.getByRole("link", { name: "Request New Link" })).toBeVisible()
  })

  test("password mismatch shows error", async ({ page }) => {
    await mockValidToken(page)
    await page.goto(`/reset-password/${FAKE_TOKEN}`)
    await expect(page.getByText("Create new password")).toBeVisible({
      timeout: 10_000,
    })

    await page.getByPlaceholder("Enter new password").fill("StrongPass1!")
    await page.getByPlaceholder("Confirm new password").fill("DifferentPass2!")
    await page.getByRole("button", { name: "Reset Password" }).click()

    await expect(page.getByText("Passwords do not match")).toBeVisible()
  })

  test("weak password shows strength indicator", async ({ page }) => {
    await mockValidToken(page)
    await page.goto(`/reset-password/${FAKE_TOKEN}`)
    await expect(page.getByText("Create new password")).toBeVisible({
      timeout: 10_000,
    })

    // Password with 8+ chars but only lowercase → score=1 (weak), shows label
    await page.getByPlaceholder("Enter new password").fill("abcdefgh")
    await expect(page.getByText("weak")).toBeVisible()
  })

  test("back to login link navigates to /login", async ({ page }) => {
    await mockValidToken(page)
    await page.goto(`/reset-password/${FAKE_TOKEN}`)
    await expect(page.getByText("Create new password")).toBeVisible({
      timeout: 10_000,
    })

    await page.getByText("Back to login").click()
    await expect(page).toHaveURL(/\/login/)
  })
})
