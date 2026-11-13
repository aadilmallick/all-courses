// This lab transfers a bounded synthetic buffer, one transfer per channel at a time.
export async function waitForDrain(channel: RTCDataChannel, signal: AbortSignal): Promise<void> {
  if (signal.aborted) throw new DOMException('Transfer cancelled', 'AbortError');
  if (channel.readyState !== 'open') throw new Error('Channel is not open');
  channel.bufferedAmountLowThreshold = 64 * 1024;
  if (channel.bufferedAmount <= channel.bufferedAmountLowThreshold) return;
  await new Promise<void>((resolve, reject) => {
    const clean = () => {
      channel.removeEventListener('bufferedamountlow', low);
      channel.removeEventListener('close', closed);
      channel.removeEventListener('error', closed);
      signal.removeEventListener('abort', aborted);
      clearTimeout(timeout);
    };
    const low = () => { clean(); resolve(); };
    const closed = () => { clean(); reject(new Error('Channel closed during transfer')); };
    const aborted = () => { clean(); reject(new DOMException('Transfer cancelled', 'AbortError')); };
    const timeout = setTimeout(() => { clean(); reject(new Error('Drain timed out')); }, 15000);
    channel.addEventListener('bufferedamountlow', low);
    channel.addEventListener('close', closed);
    channel.addEventListener('error', closed);
    signal.addEventListener('abort', aborted, { once: true });
    // Close the gap between the initial check and listener registration.
    if (signal.aborted) aborted();
    else if (channel.readyState !== 'open') closed();
    else if (channel.bufferedAmount <= channel.bufferedAmountLowThreshold) low();
  });
}
export async function sendBuffer(channel: RTCDataChannel, bytes: Uint8Array, maxMessageSize: number, signal: AbortSignal) {
  const chunkSize = Math.min(16 * 1024, maxMessageSize === 0 ? 16 * 1024 : maxMessageSize);
  if (!Number.isInteger(chunkSize) || chunkSize < 1) throw new Error('Invalid message size');
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    if (signal.aborted) throw new DOMException('Transfer cancelled', 'AbortError');
    if (channel.bufferedAmount > 256 * 1024) await waitForDrain(channel, signal);
    if (channel.readyState !== 'open') throw new Error('Channel closed');
    channel.send(bytes.slice(offset, offset + chunkSize));
  }
}
export async function hash(bytes: Uint8Array): Promise<string> {
  const result = await crypto.subtle.digest('SHA-256', new Uint8Array(bytes).buffer);
  return [...new Uint8Array(result)].map(n => n.toString(16).padStart(2, '0')).join('');
}
