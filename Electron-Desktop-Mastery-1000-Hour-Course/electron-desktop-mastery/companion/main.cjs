const { app, BrowserWindow, protocol, session, ipcMain, dialog } = require('electron');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
protocol.registerSchemesAsPrivileged([{ scheme: 'atlas', privileges: {
  standard: true, secure: true, supportFetchAPI: true
} }]);
let window;
let store;
let service;
let storageFailed = false;
let quitting = false;
const csp = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; base-uri 'none'; object-src 'none'; frame-src 'none'";
const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/renderer.js', ['renderer.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']]
]);
function trusted(event) {
  if (!window || window.isDestroyed() || event.sender !== window.webContents ||
      !event.senderFrame || event.senderFrame !== window.webContents.mainFrame ||
      event.senderFrame.url !== 'atlas://app/') throw new Error('UNTRUSTED_CALLER');
}
function createWindow() {
  window = new BrowserWindow({ width: 1050, height: 740, minWidth: 640, minHeight: 480,
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true }
  });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', event => event.preventDefault());
  window.webContents.on('will-redirect', event => event.preventDefault());
  window.on('closed', () => { window = null; });
  window.loadURL('atlas://app/').catch(() => app.quit());
}
const lock = app.requestSingleInstanceLock();
if (!lock) app.quit();
else {
  app.on('second-instance', () => {
    if (window) { if (window.isMinimized()) window.restore(); window.focus(); }
  });
  app.whenReady().then(async () => {
    const { EventStore } = await import('./core/store.mjs');
    const { DemoService } = await import('./core/service.mjs');
    store = new EventStore(path.join(app.getPath('userData'), 'demo-events.json'));
    await store.open();
    service = new DemoService({ emit: event => {
      store.append(event).catch(() => {
        storageFailed = true;
        if (window && !window.isDestroyed()) window.webContents.send('demo:event', {
          version: 1, runId: event.runId, sequence: event.sequence,
          kind: 'storage-error', status: event.status,
          text: 'Saving failed. The latest activity may not survive restart.'
        });
      });
      if (window && !window.isDestroyed()) window.webContents.send('demo:event', event);
    } });
    const last = store.events.at(-1);
    if (last && !['completed', 'cancelled', 'failed', 'interrupted'].includes(last.status)) {
      await store.append({ version: 1, runId: last.runId, sequence: last.sequence + 1,
        kind: 'interrupted', status: 'interrupted', text: 'Previous demo run was interrupted.' });
    }
    session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);
    protocol.handle('atlas', async request => {
      const url = new URL(request.url);
      const asset = url.host === 'app' && !url.search && !url.hash ? assets.get(url.pathname) : null;
      if (!asset || request.method !== 'GET') return new Response('Not found', { status: 404 });
      const body = await readFile(path.join(__dirname, asset[0]));
      return new Response(body, { headers: { 'Content-Type': asset[1], 'Content-Security-Policy': csp } });
    });
    ipcMain.handle('demo:history', event => { trusted(event); return [...store.events]; });
    ipcMain.handle('demo:start', (event, prompt) => {
      trusted(event); if (storageFailed) throw new Error('STORAGE_UNAVAILABLE');
      return service.start(prompt);
    });
    ipcMain.handle('demo:decide', (event, decision) => { trusted(event); return service.decide(decision); });
    ipcMain.handle('demo:cancel', (event, id) => { trusted(event); return service.cancel(id); });
    createWindow();
    app.on('activate', () => { if (!window) createWindow(); });
  }).catch(error => {
    dialog.showErrorBox('Atlas Desk could not start',
      'Local demo data could not be opened. Preserve the data file and inspect the terminal diagnostic.');
    console.error(error.code || error.message);
    app.quit();
  });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
  app.on('before-quit', event => {
    if (quitting || !store) return;
    event.preventDefault();
    quitting = true;
    const run = service?.snapshot();
    if (run && !['completed','cancelled','failed','interrupted'].includes(run.status)) {
      try { service.cancel(run.id); } catch {}
    }
    store.flush().catch(() => {}).finally(() => app.quit());
  });
}
