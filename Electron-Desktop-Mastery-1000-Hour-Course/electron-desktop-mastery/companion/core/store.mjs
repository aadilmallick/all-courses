import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
export class EventStore {
  constructor(path) { this.path = path; this.events = []; this.queue = Promise.resolve(); }
  async open() {
    try {
      const data = await readFile(this.path, 'utf8');
      if (Buffer.byteLength(data) > 2000000) throw new Error('STORE_TOO_LARGE');
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length > 300 || parsed.some(event =>
        !event || event.version !== 1 || typeof event.kind !== 'string' ||
        typeof event.runId !== 'string' || !Number.isInteger(event.sequence))) {
        throw new Error('INVALID_STORE');
      }
      this.events = parsed;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    return [...this.events];
  }
  append(event) {
    this.events = [...this.events.slice(-299), structuredClone(event)];
    const snapshot = JSON.stringify(this.events, null, 2);
    this.queue = this.queue.then(async () => {
      await mkdir(dirname(this.path), { recursive: true });
      await writeFile(this.path + '.tmp', snapshot, { mode: 0o600 });
      await rename(this.path + '.tmp', this.path);
    });
    return this.queue;
  }
  flush() { return this.queue; }
}
