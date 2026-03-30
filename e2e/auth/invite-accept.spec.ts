import { test, expect } from "@playwright/test"

test.describe("Invite Accept Page", () => {
  const FAKE_CODE = "test-invite-code"

  const MOCK_INVITE = {
    email: "invited@example.com",
    organization: "SonNguyen Auto",
    role: "member",
    inviter_name: "Admin User",
  }

  /** Route that mocks a valid invitation response */
  async function mockValidInvite(page: import("@playwright/test").Page) {
    await page.route(
      `**/api/v1/auth/invitations/${FAKE_CODE}/validate`,
      (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_INVITE),
        }),
    )
  }

  test("renders page (may show error with invalid code)", async ({ page }) => {
    await page.goto(`/invite/${FAKE_CODE}`)
    // Either shows the form or an invalid-invitation error
    await expect(
      page
        .getByText("Create your account")
        .or(page.getByText("Invalid Invitation")),
    ).toBeVisible({ timeout: 10_000 })
  })

  test("terms checkbox required: submit without terms shows error", async ({ page }) => {
    await mockValidInvite(page)
    await page.goto(`/invite/${FAKE_CODE}`)
    await expect(page.getByText("Create your account")).toBeVisible({
      timeout: 10_000,
    })

    // Fill required fields except terms
    await page.getByPlaceholder("Enter your full name").fill("Test User")
    await page.getByPlaceholder("Create a password").fill("StrongPass1!")
    await page.getByPlaceholder("Confirm your password").fill("StrongPass1!")

    await page.getByRole("button", { name: /Create Account/ }).click()
    await expect(page.getByText("You must accept the terms")).toBeVisible()
  })

  test("password mismatch shows error", async ({ page }) => {
    await mockValidInvite(page)
    await page.goto(`/invite/${FAKE_CODE}`)
    await expect(page.getByText("Create your account")).toBeVisible({
      timeout: 10_000,
    })

    await page.getByPlaceholder("Enter your full name").fill("Test User")
    await page.getByPlaceholder("Create a password").fill("StrongPass1!")
    await page.getByPlaceholder("Confirm your password").fill("Different2!")
    await page.getByRole("checkbox").check()

    await page.getByRole("button", { name: /Create Account/ }).click()
    await expect(page.getByText("Passwords do not match")).toBeVisible()
  })

  test("email field is disabled/locked", async ({ page }) => {
    await mockValidInvite(page)
    await page.goto(`/invite/${FAKE_CODE}`)
    await expect(page.getByText("Create your account")).toBeVisible({
      timeout: 10_000,
    })

    // The email input is disabled and shows invite email
    const emailInput = page.locator("input[disabled]").first()
    await expect(emailInput).toBeVisible()
    await expect(emailInput).toHaveValue(MOCK_INVITE.email)
  })

  test("sign in link navigates to /login", async ({ page }) => {
    await mockValidInvite(page)
    await page.goto(`/invite/${FAKE_CODE}`)
    await expect(page.getByText("Create your account")).toBeVisible({
      timeout: 10_000,
    })

    await page.getByRole("link", { name: "Sign in" }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})
