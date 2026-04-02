import { getBrowser, getPage, disconnectBrowser, outputJSON } from '../../skills/chrome-devtools/scripts/lib/browser.js';

const BASE = 'http://localhost:6001';
const SCREENSHOTS_DIR = '.claude/chrome-devtools/screenshots';

async function verify() {
  const browser = await getBrowser();
  const page = await getPage(browser);
  const results = {};

  // 1. Login
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 15000 });
  await page.waitForSelector('#email', { timeout: 10000 });

  // Type into fields character-by-character (React-compatible)
  await page.click('#email', { clickCount: 3 });
  await page.type('#email', 'admin@sonnguyenauto.com', { delay: 20 });
  await page.click('#password', { clickCount: 3 });
  await page.type('#password', '123123123aA@', { delay: 20 });
  await new Promise(r => setTimeout(r, 500));
  await page.click('button[type=submit]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));

  results.login = { url: page.url(), success: page.url().includes('/dashboard') };

  // 2. Profile page
  await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/profile.png`, fullPage: true });
  const profileErrors = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.error, [role=alert]')).map(e => e.textContent)
  );
  results.profile = { url: page.url(), title: await page.title(), consoleErrors: profileErrors };

  // 3. Security page
  await page.goto(`${BASE}/security`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/security.png`, fullPage: true });
  results.security = { url: page.url(), title: await page.title() };

  // 4. Users page
  await page.goto(`${BASE}/users`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/users.png`, fullPage: true });
  results.users = { url: page.url(), title: await page.title() };

  // 5. Invite page
  await page.goto(`${BASE}/invite`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/invite.png`, fullPage: true });
  results.invite = { url: page.url(), title: await page.title() };

  // 6. Console errors check
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  outputJSON({ success: true, results, consoleErrors });
  await disconnectBrowser();
}

verify().catch(err => {
  outputJSON({ success: false, error: err.message });
  process.exit(1);
});
