// Browser UI integration only: a fake preload bridge, not Electron E2E.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}) });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      const listeners = new Set();
      let sequence = 0, runId, timer;
      function emit(kind, status, extra = {}) {
        const event = { version: 1, runId, sequence: ++sequence, kind, status, ...extra };
        for (const listener of listeners) listener(event);
      }
      window.desktop = {
        history: async () => [],
        onEvent: listener => { listeners.add(listener); return () => listeners.delete(listener); },
        start: async prompt => {
          runId = crypto.randomUUID(); sequence = 0;
          emit('started', 'generating', { prompt });
          timer = setTimeout(() => emit('proposal', 'awaiting-approval',
            { proposalId: 'proposal', text: 'Safe simulated action' }), 60);
          return { runId };
        },
        decide: async value => {
          emit(value.approved ? 'approved' : 'denied', 'executing');
          emit('completed', 'completed', { text: 'Simulation finished' });
          return { ok: true };
        },
        cancel: async () => { clearTimeout(timer); emit('cancelled', 'cancelled'); return { ok: true }; }
      };
    });
    await page.goto(pathToFileURL(path.join(__dirname, '..', 'index.html')).href);
    await page.getByLabel('Message', { exact: true }).fill('<img src=x onerror="window.injected=true">');
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await page.getByRole('button', { name: 'Approve', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Approve', exact: true }).click();
    await page.waitForFunction(() => document.getElementById('status').textContent === 'completed');
    assert.equal(await page.locator('#events img').count(), 0);
    assert.equal(await page.evaluate(() => window.injected), undefined);
    await page.getByLabel('Message', { exact: true }).fill('Cancel this run');
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await page.getByRole('button', { name: 'Stop', exact: true }).click();
    await page.waitForFunction(() => document.getElementById('status').textContent === 'cancelled');
    assert.equal(await page.locator('#approval').isVisible(), false);
    assert.deepEqual(errors, []);
    await page.setViewportSize({ width: 640, height: 480 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    console.log(JSON.stringify({ passed: true, checks: ['approval UI', 'cancel UI', 'text-only untrusted content', 'no page errors', '640px layout'], environment: 'Chromium with fake bridge' }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
