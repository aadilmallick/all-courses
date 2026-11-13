import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const root = new URL('./dist/', import.meta.url);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
const port = Number(process.env.WEBRTC_LAB_PORT ?? 4173);
const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const name = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  if (!/^[a-zA-Z0-9_-]+\.(html|js|css)$/.test(name) || req.method !== 'GET') {
    res.writeHead(404).end('Not found'); return;
  }
  try {
    const bytes = await readFile(new URL(name, root));
    const extension = name.slice(name.lastIndexOf('.'));
    res.writeHead(200, { 'Content-Type': types[extension], 'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' }).end(bytes);
  } catch { res.writeHead(404).end('Build first: npm run build'); }
});
server.listen(port, '127.0.0.1', () => console.log(`WebRTC lab: http://localhost:${port}`));
