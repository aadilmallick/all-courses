import { createServer } from 'node:http';
import type { IncomingMessage } from 'node:http';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { unknownRecord } from '../src/core.ts';

const port = 8787;
const trustedOrigins = new Set(['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:4173', 'http://localhost:4173', `http://127.0.0.1:${port}`]);
async function readBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let bytes = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > 32 * 1024) throw new RangeError('Input exceeds 32 KiB.');
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
}

const server = createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cache-Control', 'no-store');
  if (!['127.0.0.1:8787', 'localhost:8787', '127.0.0.1:5173', 'localhost:5173'].includes(request.headers.host ?? '')) { response.writeHead(403).end(); return; }
  if (request.headers.origin && !trustedOrigins.has(request.headers.origin)) { response.writeHead(403).end(); return; }
  if (request.url === '/health' && request.method === 'GET') { response.end('ready'); return; }
  if (request.method !== 'POST' || !['/api/fixture', '/api/generate'].includes(request.url ?? '')) { response.writeHead(404).end(); return; }
  if (!request.headers['content-type']?.startsWith('application/json')) { response.writeHead(415).end('Use application/json.'); return; }
  const controller = new AbortController();
  response.on('close', () => { if (!response.writableEnded) controller.abort(); });
  try {
    const body = unknownRecord(await readBody(request));
    if (typeof body.prompt !== 'string' || !body.prompt.trim() || body.prompt.length > 8000) throw new TypeError('Use a prompt of 1 to 8000 characters.');
    if (request.url === '/api/fixture') {
      response.writeHead(200, { 'Content-Type': 'application/x-ndjson' });
      for (const delta of ['Transport ', 'fixture: ', 'caf', 'é. ', 'No model ran.']) {
        if (!response.write(JSON.stringify({ type: 'delta', text: delta }) + '\n')) await once(response, 'drain', { signal: controller.signal });
        await delay(50, undefined, { signal: controller.signal });
      }
      response.end(JSON.stringify({ type: 'done' }) + '\n');
      return;
    }
    if (body.cloudConsent !== true) { response.writeHead(403).end('Cloud opt-in is required.'); return; }
    const key = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL;
    if (!key || !model || !/^[A-Za-z0-9._-]+$/.test(model)) { response.writeHead(503).end('Set GEMINI_API_KEY and GEMINI_MODEL on the server.'); return; }
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(60_000)]);
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST', signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: body.prompt }] }], generationConfig: { maxOutputTokens: 512 } })
    });
    if (!upstream.ok) { response.writeHead(502).end(`Provider returned HTTP ${upstream.status}.`); return; }
    const data = await upstream.json() as { candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[] };
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.filter(part => part.thought !== true).map(part => part.text ?? '').join('');
    if (!text) { response.writeHead(502).end(`No usable answer; finish reason: ${candidate?.finishReason ?? 'no candidate'}`); return; }
    response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ text, finishReason: candidate?.finishReason }));
  } catch (error) {
    if (response.destroyed) return;
    if (response.headersSent) { response.destroy(); return; }
    const status = error instanceof TypeError || error instanceof SyntaxError ? 400 : error instanceof RangeError ? 413 : 500;
    response.writeHead(status).end(status === 500 ? 'Request failed or timed out.' : error instanceof Error ? error.message : 'Invalid input.');
  }
});
server.requestTimeout = 70_000;
server.listen(port, '127.0.0.1', () => console.log(`Course server: http://127.0.0.1:${port}. Fixture works without a key; cloud is opt-in.`));
