#!/usr/bin/env node
/**
 * Browser test for phase 03 (Invitations) + phase 04 (Edit User Info)
 * Run: node browser-test-phase-03-04.mjs
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:6001';
const SHOTS_DIR = __dirname;

const ADMIN_EMAIL = 'admin@sonnguyenauto.com';
const ADMIN_PASSWORD = '123123aA@';

const results = [];

function log(msg) {
  console.log(`[TEST] ${msg}`);
  results.push(msg);
}

async function screenshot(page, name) {
  const outputPath = path.join(SHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: outputPath, fullPage: false });
  log(`Screenshot saved: ${name}.png`);
  return outputPath;
}

async function waitAndClick(page, selector, timeout = 5000) {
  await page.waitForSelector(selector, { visible: true, timeout });
  await page.click(selector);
}

async function runTests() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    // ── LOGIN ──────────────────────────────────────────────────
    log('Navigating to login page...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 30000 });
    await screenshot(page, 'phase-03-04-01-login-page');

    log('Filling login credentials...');
    await page.waitForSelector('#email', { visible: true });
    await page.type('#email', ADMIN_EMAIL, { delay: 50 });
    await page.type('#password', ADMIN_PASSWORD, { delay: 50 });
    await screenshot(page, 'phase-03-04-02-login-filled');

    log('Submitting login...');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    log(`Post-login URL: ${page.url()}`);
    await screenshot(page, 'phase-03-04-03-post-login');

    // ── PHASE 03: INVITATIONS ──────────────────────────────────
    log('Navigating to /invitations...');
    await page.goto(`${BASE_URL}/admin/invitations`, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.waitForTimeout(1000);
    await screenshot(page, 'phase-03-04-04-invitations-table');
    log('Invitations page loaded');

    // Test search input
    const searchInput = await page.$('input[placeholder*="Tìm"], input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
    if (searchInput) {
      await searchInput.type('test', { delay: 50 });
      await page.waitForTimeout(800);
      await screenshot(page, 'phase-03-04-05-invitations-search');
      log('Search input tested');
      // Clear search
      await page.evaluate(() => {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(i => { if (i.value === 'test') i.value = ''; });
      });
    } else {
      log('Search input not found — skipping search test');
    }

    // Test status filter
    const filterBtn = await page.$('button[role="combobox"], select, [data-radix-select-trigger]');
    if (filterBtn) {
      await filterBtn.click();
      await page.waitForTimeout(500);
      await screenshot(page, 'phase-03-04-06-invitations-filter-open');
      log('Status filter opened');
      // Close by pressing Escape
      await page.keyboard.press('Escape');
    } else {
      log('Status filter not found — skipping filter test');
    }

    // Test resend button
    const resendBtn = await page.$('button[aria-label*="Gửi lại"], button[title*="Gửi lại"]');
    if (resendBtn) {
      await resendBtn.click();
      await page.waitForTimeout(500);
      await screenshot(page, 'phase-03-04-07-invitations-resend-dialog');
      log('Resend dialog opened');
      // Cancel
      const cancelBtn = await page.$('button:has-text("Hủy"), button[data-dialog-close]');
      if (cancelBtn) await cancelBtn.click();
    } else {
      // Try finding via text content
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent?.trim(), btn);
        if (text && (text.includes('Gửi lại') || text.includes('Resend'))) {
          await btn.click();
          await page.waitForTimeout(500);
          await screenshot(page, 'phase-03-04-07-invitations-resend-dialog');
          log('Resend dialog opened via text search');
          await page.keyboard.press('Escape');
          break;
        }
      }
    }

    // Test delete button
    const allButtons = await page.$$('button');
    for (const btn of allButtons) {
      const text = await page.evaluate(el => el.textContent?.trim(), btn);
      if (text && (text.includes('Xóa') || text.includes('Delete'))) {
        await btn.click();
        await page.waitForTimeout(500);
        await screenshot(page, 'phase-03-04-08-invitations-delete-dialog');
        log('Delete dialog opened');
        await page.keyboard.press('Escape');
        break;
      }
    }

    // ── PHASE 04: EDIT USER INFO ──────────────────────────────
    log('Navigating to /admin/users...');
    await page.goto(`${BASE_URL}/admin/users`, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.waitForTimeout(1000);
    await screenshot(page, 'phase-03-04-09-users-table');
    log('Users page loaded');

    // Click first user row to open detail dialog
    const firstUserRow = await page.$('table tbody tr, [data-row], tr[role="row"]');
    if (firstUserRow) {
      await firstUserRow.click();
      await page.waitForTimeout(800);
      await screenshot(page, 'phase-03-04-10-user-detail-dialog');
      log('User detail dialog opened');

      // Click "Sửa thông tin" button
      const editButtons = await page.$$('button');
      let editBtn = null;
      for (const btn of editButtons) {
        const text = await page.evaluate(el => el.textContent?.trim(), btn);
        if (text && text.includes('Sửa thông tin')) {
          editBtn = btn;
          break;
        }
      }

      if (editBtn) {
        await editBtn.click();
        await page.waitForTimeout(800);
        await screenshot(page, 'phase-03-04-11-edit-user-info-dialog');
        log('Edit User Info dialog opened');

        // Verify fields are pre-filled
        const fullNameInput = await page.$('input[name="full_name"], input[placeholder*="Nhập họ"]');
        const emailInput = await page.$('input[name="email"], input[type="email"]');

        if (fullNameInput) {
          const val = await page.evaluate(el => el.value, fullNameInput);
          log(`full_name pre-filled: "${val}" (${val.length > 0 ? 'OK' : 'EMPTY'})`);

          // Change full_name
          await fullNameInput.click({ clickCount: 3 });
          await fullNameInput.type('Test Admin Updated', { delay: 30 });
          await page.waitForTimeout(300);
          await screenshot(page, 'phase-03-04-12-edit-user-info-changed');
          log('full_name changed');
        }

        if (emailInput) {
          const emailVal = await page.evaluate(el => el.value, emailInput);
          log(`email pre-filled: "${emailVal}" (${emailVal.length > 0 ? 'OK' : 'EMPTY'})`);
        }

        // Try saving - find save button
        const saveButtons = await page.$$('button[type="submit"], button');
        for (const btn of saveButtons) {
          const text = await page.evaluate(el => el.textContent?.trim(), btn);
          if (text && (text === 'Lưu' || text === 'Save')) {
            const disabled = await page.evaluate(el => el.disabled, btn);
            log(`Save button found, disabled: ${disabled}`);
            if (!disabled) {
              await btn.click();
              await page.waitForTimeout(1500);
              await screenshot(page, 'phase-03-04-13-after-save');
              log('Save submitted');
            }
            break;
          }
        }
      } else {
        log('WARNING: "Sửa thông tin" button NOT FOUND in user detail dialog');
        await screenshot(page, 'phase-03-04-11-user-detail-no-edit-btn');
      }
    } else {
      log('WARNING: No user row found in users table');
    }

  } catch (err) {
    log(`ERROR: ${err.message}`);
    await screenshot(page, 'phase-03-04-ERROR');
  } finally {
    await browser.close();
    log('Browser closed');
    log('\n=== TEST RESULTS ===');
    results.forEach(r => console.log(r));
  }
}

runTests().catch(console.error);
