import { createHmac } from 'node:crypto';
export function turnCredentials(secret, subject, nowSeconds, ttlSeconds = 600) {
  if (typeof secret !== 'string' || !secret || !/^[a-zA-Z0-9_-]{1,64}$/.test(subject) ||
      !Number.isFinite(nowSeconds) || !Number.isInteger(ttlSeconds) || ttlSeconds < 1 || ttlSeconds > 3600) {
    throw new Error('Invalid credential input');
  }
  const expires = Math.floor(nowSeconds) + ttlSeconds;
  const username = `${expires}:${subject}`;
  const credential = createHmac('sha1', secret).update(username).digest('base64');
  return { username, credential, expires };
}
