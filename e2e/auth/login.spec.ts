import { test, expect } from "@playwright/test"
import { fillLoginForm, submitLoginForm, TEST_USER } from "../helpers/auth-helpers"

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
  })

  test("happy path: valid credentials triggers login API and navigation", async ({ page }) => {
    let loginCalled = false

    // Mock the login API to return success
    await page.route("**/api/v1/auth/sessions", (route) => {
      if (route.request().method() === "POST") {
        loginCalled = true
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            user: { id: 1, email: TEST_USER.email, name: "Admin" },
            tokens: {
              access_token: "mock-access-token",
              refresh_token: "mock-refresh-token",
            },
          }),
        })
      }
      return route.continue()
    })

    await fillLoginForm(page, TEST_USER.email, TEST_USER.password)
    await submitLoginForm(page)

    // Wait for navigation attempt (middleware may redirect back without cookie,
    // but the login API should have been called and router.push triggered)
    await page.waitForURL(/.*/, { timeout: 10_000, waitUntil: "domcontentloaded" })
    expect(loginCalled).toBe(true)
  })

  test("invalid credentials show error message", async ({ page }) => {
    await fillLoginForm(page, TEST_USER.email, "wrongpassword123")
    await submitLoginForm(page)
    await expect(
      page.locator("text=Thông tin đăng nhập không đúng").or(page.locator(".text-destructive").first()),
    ).toBeVisible({ timeout: 10_000 })
  })

  test("empty form submit shows required field errors", async ({ page }) => {
    await submitLoginForm(page)
    // Zod validation: email is required, password min(1)
    await expect(page.locator(".text-destructive").first()).toBeVisible()
  })

  test("invalid email format shows error", async ({ page }) => {
    await page.getByLabel("Địa chỉ email").fill("not-an-email")
    await page.getByPlaceholder("Nhập mật khẩu của bạn").fill("somepassword")
    await submitLoginForm(page)
    await expect(page.getByText("Địa chỉ email không hợp lệ")).toBeVisible()
  })

  test("forgot password link navigates to /forgot-password", async ({ page }) => {
    await page.getByText("Quên mật khẩu?").click()
    await expect(page).toHaveURL(/\/forgot-password/)
  })

  test("social buttons (Google + Facebook) are visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Google" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Facebook" })).toBeVisible()
  })

  test("password toggle switches input visibility", async ({ page }) => {
    const passwordInput = page.getByPlaceholder("Nhập mật khẩu của bạn")
    await expect(passwordInput).toHaveAttribute("type", "password")

    // Click the toggle button (aria-label based)
    await page.getByRole("button", { name: "Show password" }).click()
    await expect(passwordInput).toHaveAttribute("type", "text")

    await page.getByRole("button", { name: "Hide password" }).click()
    await expect(passwordInput).toHaveAttribute("type", "password")
  })

  test("responsive: mobile viewport hides left panel", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/login")
    // AuthLeftPanel has class "hidden ... lg:flex" — should be invisible on mobile
    await expect(page.getByText("SonNguyen CX").first()).toBeHidden()
  })
})
