import { test, expect } from "@playwright/test"

test.describe("Forgot Password Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password")
  })

  test("submit email shows success message", async ({ page }) => {
    await page.getByLabel("Email address").fill("admin@sonnguyenauto.com")
    await page.getByRole("button", { name: "Send Reset Link" }).click()
    await expect(
      page.getByText("Check your email for a password reset link"),
    ).toBeVisible({ timeout: 10_000 })
  })

  test("empty submit shows email required error", async ({ page }) => {
    await page.getByRole("button", { name: "Send Reset Link" }).click()
    await expect(page.locator(".text-destructive").first()).toBeVisible()
  })

  test("back to login link navigates to /login", async ({ page }) => {
    await page.getByText("Back to login").click()
    await expect(page).toHaveURL(/\/login/)
  })

  test("info box is visible and rendered", async ({ page }) => {
    await expect(
      page.getByText("If an account exists with this email"),
    ).toBeVisible()
  })
})
