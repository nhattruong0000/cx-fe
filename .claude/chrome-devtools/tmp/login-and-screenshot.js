import { getBrowser, getPage, disconnectBrowser, outputJSON } from '../../skills/chrome-devtools/scripts/lib/browser.js';

const BASE = 'http://localhost:6001';
const SS = '.claude/chrome-devtools/screenshots';

async function run() {
  const browser = await getBrowser();
  const page = await getPage(browser);
  
  // Collect network errors
  const networkErrors = [];
  page.on('response', resp => {
    if (resp.status() >= 400) {
      networkErrors.push({ url: resp.url(), status: resp.status() });
    }
  });
  
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }));

  // Login
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 15000 });
  await page.waitForSelector('#email', { timeout: 10000 });
  await page.click('#email', { clickCount: 3 });
  await page.type('#email', 'admin@sonnguyenauto.com', { delay: 10 });
  await page.click('#password', { clickCount: 3 });
  await page.type('#password', '123123aA@', { delay: 10 });
  
  await page.screenshot({ path: `${SS}/login-filled.png` });
  
  await page.click('button[type=submit]');
  await new Promise(r => setTimeout(r, 5000));
  
  await page.screenshot({ path: `${SS}/login-result.png` });

  const loginUrl = page.url();
  const loginSuccess = !loginUrl.includes('/login');
  
  let pageResults = {};
  
  if (loginSuccess) {
    // Navigate to all 4 pages
    for (const route of ['profile', 'security', 'users', 'invite']) {
      await page.goto(`${BASE}/${route}`, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: `${SS}/${route}.png`, fullPage: true });
      pageResults[route] = { url: page.url(), rendered: true };
    }
  }

  outputJSON({
    success: true,
    loginSuccess,
    loginUrl,
    networkErrors: networkErrors.slice(0, 10),
    consoleMessages: consoleMessages.filter(m => m.type === 'error').slice(0, 5),
    pageResults,
  });
  
  await disconnectBrowser();
}

run().catch(err => { outputJSON({ success: false, error: err.message }); process.exit(1); });
