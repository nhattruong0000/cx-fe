import type { Page } from "@playwright/test"

/** Fill login form fields */
export async function fillLoginForm(
  page: Page,
  email: string,
  password: string,
) {
  await page.getByLabel("Địa chỉ email").fill(email)
  await page.getByPlaceholder("Nhập mật khẩu của bạn").fill(password)
}

/** Submit login form */
export async function submitLoginForm(page: Page) {
  await page.getByRole("button", { name: "Đăng nhập" }).click()
}

/** Fill forgot-password form */
export async function fillForgotPasswordForm(page: Page, email: string) {
  await page.getByLabel("Địa chỉ email").fill(email)
}

/** Test credentials */
export const TEST_USER = {
  email: "admin@sonnguyenauto.com",
  password: "123123aA@",
} as const
