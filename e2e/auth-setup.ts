import { type Page, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';

interface LoginResult {
  accessToken: string;
  user: { id: string; email: string; full_name: string; role: string };
}

/** Cache login results to avoid 429 rate limiting */
const loginCache = new Map<string, LoginResult>();

/** Login via API and return tokens (cached to avoid rate limits) */
async function apiLogin(email: string, password: string): Promise<LoginResult> {
  const cached = loginCache.get(email);
  if (cached) return cached;

  const res = await fetch(`${API_URL}/api/v1/auth/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const data = await res.json();
  const result = { accessToken: data.tokens.access_token, user: data.user };
  loginCache.set(email, result);
  return result;
}

/** Hide Next.js dev overlay that intercepts pointer events */
async function hideNextJsDevOverlay(page: Page) {
  await page.evaluate(() => {
    const portal = document.querySelector('nextjs-portal');
    if (portal) {
      (portal as HTMLElement).style.display = 'none';
    }
  });
}

/** Set auth state in the browser so the app treats user as logged in */
async function setAuthState(page: Page, login: LoginResult) {
  // Set cookies via Playwright API so Next.js middleware sees them on first navigation
  await page.context().addCookies([
    { name: 'cx-auth', value: 'true', domain: 'localhost', path: '/', sameSite: 'Lax' },
    { name: 'cx-role', value: login.user.role, domain: 'localhost', path: '/', sameSite: 'Lax' },
  ]);
  // Set localStorage token (needs a page loaded first)
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await hideNextJsDevOverlay(page);
  await page.evaluate(
    (token) => { localStorage.setItem('cx-token', token); },
    login.accessToken,
  );
}

/** Login as admin via API and inject auth state into page */
export async function loginAsAdmin(page: Page) {
  const login = await apiLogin('admin@sonnguyenauto.com', '123123123aA@');
  await setAuthState(page, login);
  return login;
}

/** Login as customer via API and inject auth state into page */
export async function loginAsCustomer(page: Page) {
  const login = await apiLogin('khachhang@sonnguyenauto.com', '123123aA@');
  await setAuthState(page, login);
  return login;
}

/** Login via UI form (for auth flow tests) */
export async function loginViaUI(page: Page, email: string, password: string) {
  await page.goto('/login');
  await hideNextJsDevOverlay(page);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Mật khẩu').fill(password);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await page.waitForLoadState('networkidle');
  await hideNextJsDevOverlay(page);
}

/** Wait for dashboard to be visible after login */
export async function expectDashboard(page: Page) {
  await hideNextJsDevOverlay(page);
  await expect(page.getByText('Tổng quan hệ thống')).toBeVisible({ timeout: 15_000 });
}

/** Navigate to a dashboard page as admin (API auth + goto) */
export async function navigateAsAdmin(page: Page, path: string) {
  await loginAsAdmin(page);
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await hideNextJsDevOverlay(page);
}

export { hideNextJsDevOverlay };
