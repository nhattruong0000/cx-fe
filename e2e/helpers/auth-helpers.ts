import type { Page } from "@playwright/test"

/** Fill login form fields */
export async function fillLoginForm(
  page: Page,
  email: string,
  password: string,
) {
  await page.getByLabel("Email address").fill(email)
  await page.getByPlaceholder("Enter your password").fill(password)
}

/** Submit login form */
export async function submitLoginForm(page: Page) {
  await page.getByRole("button", { name: "Sign In" }).click()
}

/** Fill forgot-password form */
export async function fillForgotPasswordForm(page: Page, email: string) {
  await page.getByLabel("Email address").fill(email)
}

/** Test credentials */
export const TEST_USER = {
  email: "admin@sonnguyenauto.com",
  password: "123123aA@",
} as const
